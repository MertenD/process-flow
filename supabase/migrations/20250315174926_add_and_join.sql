CREATE UNIQUE INDEX unique_instance_of_is_part_of ON public.flow_element_instance USING btree (instance_of, is_part_of);

alter table "public"."flow_element_instance" add constraint "unique_instance_of_is_part_of" UNIQUE using index "unique_instance_of_is_part_of";

set check_function_bodies = off;

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

    -- check if instance is indeed done
    IF NEW.status != 'Completed' THEN
        RAISE EXCEPTION 'Previous flow element instance is not completed yet. Current status: %', NEW.status;
    END IF;

    -- Get the type of the flow element that that the flow element instance that triggered this function is an instance of
    SELECT type INTO current_flow_element_type
    FROM flow_element
    WHERE id = NEW.instance_of;

    -- Get the next flow element id. It is different for each flow element type
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

            -- Get gateway data
            SELECT data INTO current_flow_element_data
            FROM flow_element
            WHERE id = NEW.instance_of;

            -- Get the next flow element id from the gateway flow element
            SELECT next_flow_element_true_id, next_flow_element_false_id INTO gateway_flow_element_next_true_id, gateway_flow_element_next_false_id
            FROM gateway_element
            WHERE flow_element_id = NEW.instance_of;

            -- Replace variables in the data object with the actual values
            current_flow_element_data := replace_with_variable_values(current_flow_element_data, NEW.is_part_of);

            -- Evaluate the gateway expression
            SELECT CASE
                       WHEN current_flow_element_data->>'comparison' = '==' THEN
                           CASE
                               WHEN (
                                        SELECT array_agg(value ORDER BY value)
                                        FROM unnest(string_to_array(current_flow_element_data->>'value1', ',')) AS value
                                    ) = (
                                        SELECT array_agg(value ORDER BY value)
                                        FROM unnest(string_to_array(current_flow_element_data->>'value2', ',')) AS value
                                    ) THEN
                                   gateway_flow_element_next_true_id
                               ELSE
                                   gateway_flow_element_next_false_id
                               END
                       WHEN current_flow_element_data->>'comparison' = '!=' THEN
                           CASE
                               WHEN (
                                        SELECT array_agg(value ORDER BY value)
                                        FROM unnest(string_to_array(current_flow_element_data->>'value1', ',')) AS value
                                    ) != (
                                        SELECT array_agg(value ORDER BY value)
                                        FROM unnest(string_to_array(current_flow_element_data->>'value2', ',')) AS value
                                    ) THEN
                                   gateway_flow_element_next_true_id
                               ELSE
                                   gateway_flow_element_next_false_id
                               END
                       WHEN current_flow_element_data->>'comparison' = '>' THEN
                           CASE
                               WHEN current_flow_element_data->>'value1' > current_flow_element_data->>'value2' THEN
                                   gateway_flow_element_next_true_id
                               ELSE
                                   gateway_flow_element_next_false_id
                               END
                       WHEN current_flow_element_data->>'comparison' = '<' THEN
                           CASE
                               WHEN current_flow_element_data->>'value1' < current_flow_element_data->>'value2' THEN
                                   gateway_flow_element_next_true_id
                               ELSE
                                   gateway_flow_element_next_false_id
                               END
                       WHEN current_flow_element_data->>'comparison' = '>=' THEN
                           CASE
                               WHEN current_flow_element_data->>'value1' >= current_flow_element_data->>'value2' THEN
                                   gateway_flow_element_next_true_id
                               ELSE
                                   gateway_flow_element_next_false_id
                               END
                       WHEN current_flow_element_data->>'comparison' = '<=' THEN
                           CASE
                               WHEN current_flow_element_data->>'value1' <= current_flow_element_data->>'value2' THEN
                                   gateway_flow_element_next_true_id
                               ELSE
                                   gateway_flow_element_next_false_id
                               END
                       End INTO next_flow_element_id_first;

        WHEN current_flow_element_type = 'andSplitNode' THEN

            -- Get the next flow element ids from the and split flow element
            SELECT next_flow_element_id_1, next_flow_element_id_2 INTO next_flow_element_id_first, next_flow_element_id_second
            FROM and_split_element
            WHERE flow_element_id = NEW.instance_of;

        WHEN current_flow_element_type = 'andJoinNode' THEN

            SELECT next_flow_element_id INTO next_flow_element_id_first
            FROM and_join_element
            WHERE flow_element_id = NEW.instance_of;

        WHEN current_flow_element_type = 'endNode' THEN

            -- Don't get the next element id from the end node, instead set the process instance as completed if there is no active element left

            -- Check if there are any active flow element instances left
            IF NOT EXISTS (
                SELECT 1
                FROM flow_element_instance
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

    -- Check if the any next flow element id is not null
    IF next_flow_element_id_first IS NULL AND next_flow_element_id_second IS NULL THEN
        RAISE EXCEPTION 'Next flow element id is null';
    END IF;

    -- Create the next flow element instance
    IF next_flow_element_id_first IS NOT NULL THEN
        DELETE FROM flow_element_instance
        WHERE instance_of = next_flow_element_id_first
          AND is_part_of = NEW.is_part_of;

        INSERT INTO flow_element_instance (instance_of, is_part_of)
        VALUES (next_flow_element_id_first, NEW.is_part_of);
    END IF;

    -- Create the next flow element instance
    IF next_flow_element_id_second IS NOT NULL THEN
        DELETE FROM flow_element_instance
        WHERE instance_of = next_flow_element_id_second
          AND is_part_of = NEW.is_part_of;

        INSERT INTO flow_element_instance (instance_of, is_part_of)
        VALUES (next_flow_element_id_second, NEW.is_part_of);
    END IF;

    RETURN OLD;
END;$function$
;

CREATE OR REPLACE FUNCTION public.execute_created_flow_element_instance()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$DECLARE
    flow_element_instance_execution_mode execution_mode;
    flow_element_instance_execution_url text;
    flow_element_data jsonb;
    flow_element_type text;
    app_url text;
    response text;

    and_join_node_previous_flow_element_id_1 bigint;
    and_join_node_previous_flow_element_id_2 bigint;
BEGIN

    -- Get the type of the flow element that is referenced
    SELECT type INTO flow_element_type
    FROM flow_element
    WHERE id = NEW.instance_of;

    -- If the type is 'startNode' or the status is not 'Created', then do nothing and return
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
            IF (SELECT status
                FROM flow_element_instance
                WHERE instance_of = and_join_node_previous_flow_element_id_1 AND is_part_of = NEW.is_part_of
               ) != 'Completed' THEN
                RETURN OLD;
            END IF;
        END IF;

        IF and_join_node_previous_flow_element_id_2 IS NOT NULL THEN
            IF (SELECT status
                FROM flow_element_instance
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

    -- Get execution mode and execution url from the flow element
    SELECT nd.definition->>'executionMode' AS execution_mode, nd.definition->>'executionUrl' AS execution_url
    INTO flow_element_instance_execution_mode, flow_element_instance_execution_url
    FROM flow_element fe
             JOIN node_definition nd
                  ON (fe.data->>'nodeDefinitionId')::int8 = nd.id
    WHERE fe.id = NEW.instance_of;

    CASE
        -- Set status of instance to TO DO so a user can see it in their worklist
        WHEN flow_element_instance_execution_mode = 'Manual' THEN
            UPDATE flow_element_instance
            SET status = 'Todo'
            WHERE id = NEW.id;
        -- Execute instance and call the provided api url if it is automatic
        WHEN flow_element_instance_execution_mode = 'Automatic' THEN

            UPDATE flow_element_instance
            SET status = 'In Progress'
            WHERE id = NEW.id;

            -- TODO Fehler abfangen

            -- flow_element has a data column, which is a jsonb. This object is sent to the execution url
            SELECT data INTO flow_element_data
            FROM flow_element
            WHERE id = NEW.instance_of;

            flow_element_data := flow_element_data - array[
                'nodeDefinitionId',
                'assignedRole',
                'width',
                'height'
                ];

            -- Go through each value in the data object and replace any string with "{content}" with the content without the brackets
            -- The new values can be located in the data_object_instance table. The name col of the row is the value withoud the brackets
            flow_element_data := replace_with_variable_values(flow_element_data, NEW.is_part_of);

            SELECT value INTO app_url
            FROM config
            WHERE key = 'appUrl';

            PERFORM http_set_curlopt('CURLOPT_TCP_KEEPALIVE', '120');
            PERFORM http_set_curlopt('CURLOPT_CONNECTTIMEOUT', '120');
            PERFORM http_set_curlopt('CURLOPT_TIMEOUT', '120');

            BEGIN

                PERFORM http_post(
                        flow_element_instance_execution_url,
                        '{ "responsePath": "' || app_url || '/api/instance/complete"'
                            || ', "errorResponsePath": "' || app_url || '/api/instance/error"'
                            || ', "flowElementInstanceId": "' || NEW.id
                            || '", "data": ' || flow_element_data::text
                            || '}',
                        'application/json'
                        );
            EXCEPTION
                WHEN OTHERS THEN
                    PERFORM fail_flow_element_instance(NEW.id, 'Failed to execute flow element instance: ' || SQLERRM);
            END;
        ELSE
            RAISE EXCEPTION 'Not implemented scenario, where execution mode is "%"', flow_element_instance_execution_mode;
        END CASE;

    RETURN OLD;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_manual_tasks_with_replaced_data(team_id bigint, user_role_ids bigint[])
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$DECLARE
    tasks jsonb;
BEGIN
    -- Fetch the manual tasks with replaced data
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
             WHERE belongs_to = team_id AND (assigned_role IS NOT NULL AND assigned_role <> '' AND assigned_role::bigint = ANY(user_role_ids))
         ) t;

    RETURN tasks;
END;$function$
;
