-- ─── Process Engine: Functions & Triggers ────────────────────────────────────
-- NOTE: execute_created_flow_element_instance does NOT contain pg_net HTTP
-- calls. Automatic task dispatching is handled at the application layer.

CREATE OR REPLACE FUNCTION public.replace_with_variable_values(data jsonb, process_instance_id bigint)
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$DECLARE
    key text;
    value_ text;
    new_value text;
    placeholder text;
    placeholder_value text;
BEGIN
    FOR key, value_ IN SELECT * FROM jsonb_each_text(data) LOOP
        IF jsonb_typeof(data -> key) = 'object' THEN
            data := jsonb_set(data, array[key], replace_with_variable_values(data -> key, process_instance_id));
        ELSE
            WHILE value_ LIKE '%{%' LOOP
                placeholder := substring(value_ FROM '\{[^}]+\}');
                SELECT doi.value INTO placeholder_value
                FROM data_object_instance doi
                WHERE doi.is_part_of = process_instance_id AND doi.name = substring(placeholder, 2, length(placeholder) - 2);

                IF placeholder_value IS NOT NULL THEN
                    placeholder_value := trim(both '"' from placeholder_value);
                    value_ := replace(value_, placeholder, placeholder_value);
                ELSE
                    EXIT;
                END IF;
            END LOOP;
            data := jsonb_set(data, array[key], to_jsonb(value_));
        END IF;
    END LOOP;
    RETURN data;
END;$function$;

CREATE OR REPLACE FUNCTION public.create_process_instance(process_model_id_param bigint, inputs_param jsonb)
    RETURNS bigint
    LANGUAGE plpgsql
AS $function$DECLARE
    process_instance_id int8;
    start_element_count INT;
    start_flow_element_id int8;
    end_element_count INT;
BEGIN
    SELECT COUNT(*), id INTO start_element_count, start_flow_element_id
    FROM flow_element
    WHERE type = 'startNode' AND model_id = process_model_id_param
    GROUP BY flow_element.id;

    IF start_element_count != 1 THEN
        RAISE EXCEPTION 'Process model must have exactly one start element';
    END IF;

    SELECT COUNT(*) INTO end_element_count
    FROM flow_element
    WHERE type = 'endNode' AND model_id = process_model_id_param;

    IF end_element_count < 1 THEN
        RAISE EXCEPTION 'Process model must have at least one end element';
    END IF;

    INSERT INTO process_instance (process_model_id)
    VALUES (process_model_id_param)
    RETURNING id INTO process_instance_id;

    INSERT INTO flow_element_instance (instance_of, is_part_of)
    VALUES (start_flow_element_id, process_instance_id);

    INSERT INTO data_object_instance (is_part_of, name, value)
    SELECT process_instance_id, key, value
    FROM jsonb_each(inputs_param);

    UPDATE flow_element_instance
    SET status = 'Completed', completed_at = now()
    WHERE instance_of = start_flow_element_id AND is_part_of = process_instance_id;

    RETURN process_instance_id;
END;$function$;

-- Trigger function: called when a new flow_element_instance is created (status='Created').
-- For automatic activities: sets status to 'In Progress' only.
-- The application layer (dispatchAutomaticActivities) is responsible for the HTTP call.
CREATE OR REPLACE FUNCTION public.execute_created_flow_element_instance()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$DECLARE
    flow_element_instance_execution_mode execution_mode;
    flow_element_type text;
    and_join_node_previous_flow_element_id_1 bigint;
    and_join_node_previous_flow_element_id_2 bigint;
BEGIN
    SELECT type INTO flow_element_type
    FROM flow_element
    WHERE id = NEW.instance_of;

    IF flow_element_type = 'startNode' OR NEW.status != 'Created' THEN
        RETURN OLD;
    END IF;

    IF flow_element_type = 'endNode' OR flow_element_type = 'gatewayNode' OR flow_element_type = 'andSplitNode' THEN
        UPDATE flow_element_instance
        SET status = 'Completed', completed_at = now()
        WHERE id = NEW.id;
        RETURN OLD;
    END IF;

    IF flow_element_type = 'andJoinNode' THEN
        SELECT aje.previous_flow_element_id_1, aje.previous_flow_element_id_2
        INTO and_join_node_previous_flow_element_id_1, and_join_node_previous_flow_element_id_2
        FROM and_join_element aje
                 JOIN flow_element_instance fei ON aje.flow_element_id = fei.instance_of
        WHERE fei.instance_of = NEW.instance_of AND fei.is_part_of = NEW.is_part_of;

        IF and_join_node_previous_flow_element_id_1 IS NOT NULL THEN
            IF (SELECT status FROM flow_element_instance
                WHERE instance_of = and_join_node_previous_flow_element_id_1 AND is_part_of = NEW.is_part_of
               ) != 'Completed' THEN
                RETURN OLD;
            END IF;
        END IF;

        IF and_join_node_previous_flow_element_id_2 IS NOT NULL THEN
            IF (SELECT status FROM flow_element_instance
                WHERE instance_of = and_join_node_previous_flow_element_id_2 AND is_part_of = NEW.is_part_of
               ) != 'Completed' THEN
                RETURN OLD;
            END IF;
        END IF;

        UPDATE flow_element_instance
        SET status = 'Completed', completed_at = now()
        WHERE id = NEW.id;
        RETURN OLD;
    END IF;

    -- Get execution mode from node_definition
    SELECT nd.definition->>'executionMode'
    INTO flow_element_instance_execution_mode
    FROM flow_element fe
             JOIN node_definition nd ON (fe.data->>'nodeDefinitionId')::int8 = nd.id
    WHERE fe.id = NEW.instance_of;

    CASE
        WHEN flow_element_instance_execution_mode = 'Manual' THEN
            UPDATE flow_element_instance
            SET status = 'Todo'
            WHERE id = NEW.id;
        WHEN flow_element_instance_execution_mode = 'Automatic' THEN
            -- Only set status to In Progress; the application layer handles the HTTP call.
            UPDATE flow_element_instance
            SET status = 'In Progress'
            WHERE id = NEW.id;
        ELSE
            RAISE EXCEPTION 'Not implemented scenario, where execution mode is "%"', flow_element_instance_execution_mode;
    END CASE;

    RETURN OLD;
END;$function$;

CREATE TRIGGER execute_flow_element_instance_on_creation
    AFTER INSERT ON public.flow_element_instance
    FOR EACH ROW
    WHEN (NEW.status = 'Created')
EXECUTE FUNCTION execute_created_flow_element_instance();

CREATE OR REPLACE FUNCTION public.create_next_flow_element_instance()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$DECLARE
    current_flow_element_type text;
    current_flow_element_data jsonb;
    next_flow_element_id_first int8;
    next_flow_element_id_second int8;
    gateway_flow_element_next_true_id int8;
    gateway_flow_element_next_false_id int8;
BEGIN
    IF NEW.status != 'Completed' THEN
        RAISE EXCEPTION 'Previous flow element instance is not completed yet. Current status: %', NEW.status;
    END IF;

    SELECT type INTO current_flow_element_type
    FROM flow_element
    WHERE id = NEW.instance_of;

    CASE
        WHEN current_flow_element_type = 'startNode' THEN
            SELECT start_element.next_flow_element_id INTO next_flow_element_id_first
            FROM start_element
            WHERE flow_element_id = NEW.instance_of;

        WHEN current_flow_element_type = 'activityNode' THEN
            SELECT activity_element.next_flow_element_id INTO next_flow_element_id_first
            FROM activity_element
            WHERE flow_element_id = NEW.instance_of;

        WHEN current_flow_element_type = 'gatewayNode' THEN
            SELECT data INTO current_flow_element_data
            FROM flow_element
            WHERE id = NEW.instance_of;

            SELECT next_flow_element_true_id, next_flow_element_false_id
            INTO gateway_flow_element_next_true_id, gateway_flow_element_next_false_id
            FROM gateway_element
            WHERE flow_element_id = NEW.instance_of;

            current_flow_element_data := replace_with_variable_values(current_flow_element_data, NEW.is_part_of);

            SELECT CASE
                WHEN current_flow_element_data->>'comparison' = '==' THEN
                    CASE WHEN (
                            SELECT array_agg(value ORDER BY value)
                            FROM unnest(string_to_array(current_flow_element_data->>'value1', ',')) AS value
                        ) = (
                            SELECT array_agg(value ORDER BY value)
                            FROM unnest(string_to_array(current_flow_element_data->>'value2', ',')) AS value
                        ) THEN gateway_flow_element_next_true_id
                        ELSE gateway_flow_element_next_false_id END
                WHEN current_flow_element_data->>'comparison' = '!=' THEN
                    CASE WHEN (
                            SELECT array_agg(value ORDER BY value)
                            FROM unnest(string_to_array(current_flow_element_data->>'value1', ',')) AS value
                        ) != (
                            SELECT array_agg(value ORDER BY value)
                            FROM unnest(string_to_array(current_flow_element_data->>'value2', ',')) AS value
                        ) THEN gateway_flow_element_next_true_id
                        ELSE gateway_flow_element_next_false_id END
                WHEN current_flow_element_data->>'comparison' = '>' THEN
                    CASE WHEN current_flow_element_data->>'value1' > current_flow_element_data->>'value2'
                        THEN gateway_flow_element_next_true_id ELSE gateway_flow_element_next_false_id END
                WHEN current_flow_element_data->>'comparison' = '<' THEN
                    CASE WHEN current_flow_element_data->>'value1' < current_flow_element_data->>'value2'
                        THEN gateway_flow_element_next_true_id ELSE gateway_flow_element_next_false_id END
                WHEN current_flow_element_data->>'comparison' = '>=' THEN
                    CASE WHEN current_flow_element_data->>'value1' >= current_flow_element_data->>'value2'
                        THEN gateway_flow_element_next_true_id ELSE gateway_flow_element_next_false_id END
                WHEN current_flow_element_data->>'comparison' = '<=' THEN
                    CASE WHEN current_flow_element_data->>'value1' <= current_flow_element_data->>'value2'
                        THEN gateway_flow_element_next_true_id ELSE gateway_flow_element_next_false_id END
            END INTO next_flow_element_id_first;

        WHEN current_flow_element_type = 'andSplitNode' THEN
            SELECT next_flow_element_id_1, next_flow_element_id_2
            INTO next_flow_element_id_first, next_flow_element_id_second
            FROM and_split_element
            WHERE flow_element_id = NEW.instance_of;

        WHEN current_flow_element_type = 'andJoinNode' THEN
            SELECT next_flow_element_id INTO next_flow_element_id_first
            FROM and_join_element
            WHERE flow_element_id = NEW.instance_of;

        WHEN current_flow_element_type = 'endNode' THEN
            IF NOT EXISTS (
                SELECT 1 FROM flow_element_instance
                WHERE is_part_of = NEW.is_part_of
                  AND (status = 'Todo' OR status = 'In Progress' OR status = 'Created')
            ) THEN
                UPDATE process_instance
                SET status = 'Completed', completed_at = now()
                WHERE id = NEW.is_part_of;
            END IF;
            RETURN OLD;

        ELSE
            RAISE EXCEPTION 'Getting the next flow element id for the node type "%" is not implemented', current_flow_element_type;
    END CASE;

    IF next_flow_element_id_first IS NULL AND next_flow_element_id_second IS NULL THEN
        RAISE EXCEPTION 'Next flow element id is null';
    END IF;

    IF next_flow_element_id_first IS NOT NULL THEN
        DELETE FROM flow_element_instance
        WHERE instance_of = next_flow_element_id_first AND is_part_of = NEW.is_part_of;

        INSERT INTO flow_element_instance (instance_of, is_part_of)
        VALUES (next_flow_element_id_first, NEW.is_part_of);
    END IF;

    IF next_flow_element_id_second IS NOT NULL THEN
        DELETE FROM flow_element_instance
        WHERE instance_of = next_flow_element_id_second AND is_part_of = NEW.is_part_of;

        INSERT INTO flow_element_instance (instance_of, is_part_of)
        VALUES (next_flow_element_id_second, NEW.is_part_of);
    END IF;

    RETURN OLD;
END;$function$;

CREATE TRIGGER create_next_flow_element_instance_on_previous_completed
    AFTER UPDATE ON public.flow_element_instance
    FOR EACH ROW
    WHEN (OLD.status IS NOT NULL AND OLD.status != 'Completed' AND NEW.status = 'Completed')
EXECUTE FUNCTION create_next_flow_element_instance();

CREATE OR REPLACE FUNCTION public.complete_flow_element_instance(
    flow_element_instance_id_param bigint,
    output_data jsonb,
    completed_by_param text DEFAULT NULL
)
    RETURNS boolean
    LANGUAGE plpgsql
AS $function$DECLARE
    process_instance_id int8;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM flow_element_instance WHERE id = flow_element_instance_id_param) THEN
        RAISE EXCEPTION 'Flow element instance with id % does not exist', flow_element_instance_id_param;
    END IF;

    SELECT is_part_of INTO process_instance_id
    FROM flow_element_instance
    WHERE id = flow_element_instance_id_param;

    INSERT INTO data_object_instance (is_part_of, name, value)
    SELECT process_instance_id, key, value
    FROM jsonb_each(output_data)
    ON CONFLICT (is_part_of, name)
        DO UPDATE SET value = EXCLUDED.value;

    UPDATE flow_element_instance
    SET status = 'Completed', completed_at = now(), completed_by = COALESCE(completed_by_param::text, completed_by)
    WHERE id = flow_element_instance_id_param;

    RETURN TRUE;
END;$function$;

CREATE OR REPLACE FUNCTION public.fail_flow_element_instance(
    flow_element_instance_id_param bigint,
    error_message text
)
    RETURNS void
    LANGUAGE plpgsql
AS $function$DECLARE
    process_instance_id int8;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM flow_element_instance WHERE id = flow_element_instance_id_param) THEN
        RAISE EXCEPTION 'Flow element instance with id % does not exist', flow_element_instance_id_param;
    END IF;

    SELECT is_part_of INTO process_instance_id
    FROM flow_element_instance
    WHERE id = flow_element_instance_id_param;

    UPDATE flow_element_instance
    SET status = 'Error', status_message = error_message
    WHERE id = flow_element_instance_id_param;

    UPDATE process_instance
    SET status = 'Error'
    WHERE id = process_instance_id;
END;$function$;

CREATE OR REPLACE FUNCTION public.apply_gamification(
    profile_id_param text,
    flow_element_instance_id_param bigint
)
    RETURNS void
    LANGUAGE plpgsql
AS $function$DECLARE
    gamification_type gamification_type;
    gamification_options jsonb;
    process_instance_id bigint;
    team_id_param bigint;
    gamification_options_replaced jsonb;
    is_condition_met boolean;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "user" WHERE id = profile_id_param) THEN
        RAISE EXCEPTION 'User with id % does not exist.', profile_id_param;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM flow_element_instance WHERE id = flow_element_instance_id_param) THEN
        RAISE EXCEPTION 'Flow element instance with id % does not exist.', flow_element_instance_id_param;
    END IF;

    SELECT flow_element.data->>'gamificationType',
           flow_element.data->>'gamificationOptions',
           flow_element_instance.is_part_of,
           process_model.belongs_to
    INTO gamification_type, gamification_options, process_instance_id, team_id_param
    FROM flow_element_instance
    JOIN flow_element ON flow_element_instance.instance_of = flow_element.id
    JOIN process_model ON flow_element.model_id = process_model.id
    WHERE flow_element_instance.id = flow_element_instance_id_param;

    IF gamification_type IS NULL OR gamification_options IS NULL OR process_instance_id IS NULL OR team_id_param IS NULL THEN
        RAISE EXCEPTION 'Some gamification data is missing.';
    END IF;

    IF gamification_type = 'None' THEN
        RETURN;
    END IF;

    gamification_options_replaced := replace_with_variable_values(gamification_options, process_instance_id);

    IF gamification_options_replaced->>'hasCondition' = 'true' THEN
        SELECT CASE
            WHEN gamification_options_replaced->>'comparison' = '==' AND gamification_options_replaced->>'value1' = gamification_options_replaced->>'value2' THEN true
            WHEN gamification_options_replaced->>'comparison' = '!=' AND gamification_options_replaced->>'value1' != gamification_options_replaced->>'value2' THEN true
            WHEN gamification_options_replaced->>'comparison' = '>' AND gamification_options_replaced->>'value1' > gamification_options_replaced->>'value2' THEN true
            WHEN gamification_options_replaced->>'comparison' = '<' AND gamification_options_replaced->>'value1' < gamification_options_replaced->>'value2' THEN true
            WHEN gamification_options_replaced->>'comparison' = '>=' AND gamification_options_replaced->>'value1' >= gamification_options_replaced->>'value2' THEN true
            WHEN gamification_options_replaced->>'comparison' = '<=' AND gamification_options_replaced->>'value1' <= gamification_options_replaced->>'value2' THEN true
            ELSE false
        END INTO is_condition_met;
    ELSE
        is_condition_met := true;
    END IF;

    IF is_condition_met THEN
        CASE WHEN gamification_type = 'Points' THEN
            CASE WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'incrementBy' THEN
                CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                    UPDATE statistics SET experience = experience + (gamification_options_replaced->>'pointsForSuccess')::int
                    WHERE team_id = team_id_param AND profile_id = profile_id_param;
                WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                    UPDATE statistics SET coins = coins + (gamification_options_replaced->>'pointsForSuccess')::int
                    WHERE team_id = team_id_param AND profile_id = profile_id_param;
                ELSE RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                END CASE;
            WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'decrementBy' THEN
                CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                    UPDATE statistics SET experience = experience - (gamification_options_replaced->>'pointsForSuccess')::int
                    WHERE team_id = team_id_param AND profile_id = profile_id_param;
                WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                    UPDATE statistics SET coins = coins - (gamification_options_replaced->>'pointsForSuccess')::int
                    WHERE team_id = team_id_param AND profile_id = profile_id_param;
                ELSE RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                END CASE;
            WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'setTo' THEN
                CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                    UPDATE statistics SET experience = (gamification_options_replaced->>'pointsForSuccess')::int
                    WHERE team_id = team_id_param AND profile_id = profile_id_param;
                WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                    UPDATE statistics SET coins = (gamification_options_replaced->>'pointsForSuccess')::int
                    WHERE team_id = team_id_param AND profile_id = profile_id_param;
                ELSE RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                END CASE;
            ELSE RAISE EXCEPTION 'Points application method % is not implemented.', gamification_options_replaced->>'pointsApplicationMethod';
            END CASE;

        WHEN gamification_type = 'Badges' THEN
            IF gamification_options_replaced->>'badgeType' IS NULL THEN
                RAISE EXCEPTION 'Badge type is missing.';
            END IF;
            UPDATE statistics
            SET badges = jsonb_set(badges, '{badges}', (badges->'badges') || jsonb_build_array(gamification_options_replaced->>'badgeType'), true)
            WHERE team_id = team_id_param AND profile_id = profile_id_param;

        ELSE RAISE EXCEPTION 'Gamification type % is not implemented.', gamification_type;
        END CASE;
    END IF;
END;$function$;

CREATE OR REPLACE VIEW "manual_task" AS
    SELECT
        fei.id,
        fei.created_at,
        fei.instance_of,
        fei.status,
        fei.is_part_of,
        fei.completed_at,
        fei.completed_by,
        pm.belongs_to,
        fe.type,
        (nd.definition ->> 'executionUrl')  AS execution_url,
        fe.data,
        (fe.data ->> 'assignedRole')        AS assigned_role
    FROM flow_element_instance fei
    JOIN flow_element fe ON fei.instance_of = fe.id
    JOIN process_instance pi ON fei.is_part_of = pi.id
    JOIN process_model pm ON pi.process_model_id = pm.id
    JOIN node_definition nd ON (fe.data->>'nodeDefinitionId')::bigint = nd.id
    WHERE (nd.definition ->> 'executionMode') = 'Manual'
      AND fei.status = 'Todo';

CREATE OR REPLACE FUNCTION public.get_manual_tasks_with_replaced_data(team_id bigint, user_role_ids bigint[])
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$DECLARE
    tasks jsonb;
BEGIN
    SELECT jsonb_agg(t)
    INTO tasks
    FROM (
        SELECT
            id,
            replaced_data AS data,
            replaced_data->'task' AS name,
            replaced_data->'description' AS description,
            replaced_data->'outputs' AS outputs,
            type,
            status,
            belongs_to,
            created_at,
            is_part_of,
            instance_of,
            completed_at,
            assigned_role,
            execution_url,
            completed_by
        FROM manual_task,
             LATERAL replace_with_variable_values(data, is_part_of) AS replaced_data
        WHERE belongs_to = team_id
          AND assigned_role IS NOT NULL
          AND assigned_role <> ''
          AND assigned_role::bigint = ANY(user_role_ids)
    ) t;
    RETURN tasks;
END;$function$;

-- Seed the app URL config entry (overrideable at runtime)
INSERT INTO config (key, value)
VALUES ('appUrl', 'https://processflow.merten.tech')
ON CONFLICT (key) DO NOTHING;
