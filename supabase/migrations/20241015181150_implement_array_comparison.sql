CREATE OR REPLACE FUNCTION public.apply_gamification(profile_id_param uuid, flow_element_instance_id_param bigint)
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

    -- Check if the profile exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = profile_id_param) THEN
        RAISE EXCEPTION 'Profile with id % does not exist.', profile_id_param;
    END IF;

    -- Check if the flow element instance exists
    IF NOT EXISTS (SELECT 1 FROM flow_element_instance WHERE id = flow_element_instance_id_param) THEN
        RAISE EXCEPTION 'Flow element instance with id % does not exist.', flow_element_instance_id_param;
    END IF;

    -- Get the gamification type and options from the flow element via the flow element instance id
    SELECT flow_element.data->>'gamificationType', flow_element.data->>'gamificationOptions', flow_element_instance.is_part_of, process_model.belongs_to
    INTO gamification_type, gamification_options, process_instance_id, team_id_param
    FROM flow_element_instance
             JOIN flow_element ON flow_element_instance.instance_of = flow_element.id
             JOIN process_model ON flow_element.model_id = process_model.id
    WHERE flow_element_instance.id = flow_element_instance_id_param;

    -- Check if all data is present
    IF gamification_type IS NULL OR gamification_options IS NULL OR process_instance_id IS NULL OR team_id_param IS NULL THEN
        RAISE EXCEPTION 'Gamification data is missing.';
    END IF;

    -- Check if gamification type is none
    IF gamification_type = 'None' THEN
        RETURN;
    END IF;

    -- Replace variables in the options with the actual values
    gamification_options_replaced := replace_with_variable_values(gamification_options, process_instance_id);

    -- Check if the condition is met when it exists
    IF gamification_options_replaced->>'hasCondition' = 'true' THEN
        SELECT CASE
                   WHEN gamification_options_replaced->>'comparison' = '==' THEN
                       CASE
                           WHEN (
                                    SELECT array_agg(value ORDER BY value)
                                    FROM unnest(string_to_array(gamification_options_replaced->>'value1', ',')) AS value
                                ) = (
                                    SELECT array_agg(value ORDER BY value)
                                    FROM unnest(string_to_array(gamification_options_replaced->>'value2', ',')) AS value
                                ) THEN
                               true
                           ELSE
                               false
                           END
                   WHEN gamification_options_replaced->>'comparison' = '!=' THEN
                       CASE
                           WHEN (
                                    SELECT array_agg(value ORDER BY value)
                                    FROM unnest(string_to_array(gamification_options_replaced->>'value1', ',')) AS value
                                ) != (
                                    SELECT array_agg(value ORDER BY value)
                                    FROM unnest(string_to_array(gamification_options_replaced->>'value2', ',')) AS value
                                ) THEN
                               true
                           ELSE
                               false
                           END
                   WHEN gamification_options_replaced->>'comparison' = '>' AND gamification_options_replaced->>'value1' > gamification_options_replaced->>'value2' THEN
                       true
                   WHEN gamification_options_replaced->>'comparison' = '<' AND gamification_options_replaced->>'value1' < gamification_options_replaced->>'value2' THEN
                       true
                   WHEN gamification_options_replaced->>'comparison' = '>=' AND gamification_options_replaced->>'value1' >= gamification_options_replaced->>'value2' THEN
                       true
                   WHEN gamification_options_replaced->>'comparison' = '<=' AND gamification_options_replaced->>'value1' <= gamification_options_replaced->>'value2' THEN
                       true
                   ELSE
                       false
                   END INTO is_condition_met;
    ELSE
        is_condition_met := true;
    END IF;

    -- Apply the gamification if the condition is met
    IF is_condition_met THEN

        CASE WHEN gamification_type = 'Points' THEN

            CASE WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'incrementBy' THEN

                CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                    -- Increment experience
                    UPDATE statistics
                    SET experience = experience + (gamification_options_replaced->>'pointsForSuccess')::int
                    FROM profile_team
                    WHERE statistics.belongs_to = profile_team.id
                      AND profile_team.team_id = team_id_param
                      AND statistics.profile_id = profile_id_param;
                     WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                         -- Increment coins
                         UPDATE statistics
                         SET coins = coins + (gamification_options_replaced->>'pointsForSuccess')::int
                         FROM profile_team
                         WHERE statistics.belongs_to = profile_team.id
                           AND profile_team.team_id = team_id_param
                           AND statistics.profile_id = profile_id_param;
                     ELSE
                         RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                    END CASE;

                 WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'decrementBy' THEN

                     CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                         -- Decrement experience
                         UPDATE statistics
                         SET experience = experience - (gamification_options_replaced->>'pointsForSuccess')::int
                         FROM profile_team
                         WHERE statistics.belongs_to = profile_team.id
                           AND profile_team.team_id = team_id_param
                           AND statistics.profile_id = profile_id_param;
                          WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                              -- Decrement coins
                              UPDATE statistics
                              SET coins = coins - (gamification_options_replaced->>'pointsForSuccess')::int
                              FROM profile_team
                              WHERE statistics.belongs_to = profile_team.id
                                AND profile_team.team_id = team_id_param
                                AND statistics.profile_id = profile_id_param;
                          ELSE
                              RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                         END CASE;

                 WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'setTo' THEN

                     CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                         -- Set experience
                         UPDATE statistics
                         SET experience = (gamification_options_replaced->>'pointsForSuccess')::int
                         FROM profile_team
                         WHERE statistics.belongs_to = profile_team.id
                           AND profile_team.team_id = team_id_param
                           AND statistics.profile_id = profile_id_param;
                          WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                              -- Set coins
                              UPDATE statistics
                              SET coins = (gamification_options_replaced->>'pointsForSuccess')::int
                              FROM profile_team
                              WHERE statistics.belongs_to = profile_team.id
                                AND profile_team.team_id = team_id_param
                                AND statistics.profile_id = profile_id_param;
                          ELSE
                              RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                         END CASE;

                 ELSE
                     RAISE EXCEPTION 'Points application method % is not implemented.', gamification_options_replaced->>'pointsApplicationMethod';
                END CASE;

             WHEN gamification_type = 'Badges' THEN

                 -- Check if badge name is given
                 IF gamification_options_replaced->>'badgeType' IS NULL THEN
                     RAISE EXCEPTION 'Badge type is missing.';
                 END IF;

                 -- Add badge to users statistics if it does not exists yet
                 -- badges column is a jsonb ({ "badges": ["type1", "type2"] }). This array should be appended with the badge type if it does not already exists in there
                 UPDATE statistics
                 SET badges = jsonb_set(badges, '{badges}', (badges->'badges') || jsonb_build_array(gamification_options_replaced->>'badgeType'), true)
                 FROM profile_team
                 WHERE statistics.belongs_to = profile_team.id
                   AND profile_team.team_id = team_id_param
                   AND statistics.profile_id = profile_id_param;

             ELSE
                 RAISE EXCEPTION 'Gamification type % is not implemented.', gamification_type;
            END CASE;

    END IF;

END;$function$
;

CREATE OR REPLACE FUNCTION public.create_next_flow_element_instance()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$DECLARE
    current_flow_element_type text;
    current_flow_element_data jsonb;
    next_flow_element_id int8;
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
            SELECT start_element.next_flow_element_id INTO next_flow_element_id
            FROM start_element
            WHERE flow_element_id = NEW.instance_of;
        WHEN current_flow_element_type = 'activityNode' THEN
            SELECT activity_element.next_flow_element_id INTO next_flow_element_id
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
                       End INTO next_flow_element_id;

        WHEN current_flow_element_type = 'endNode' THEN

            -- Don't get the next element id from the end node, instead set the process instance as completed
            UPDATE process_instance
            SET status = 'Completed', completed_at = now()
            WHERE id = NEW.is_part_of;

            RETURN OLD;
        ELSE
            RAISE EXCEPTION 'Getting the next flow element id for the node type "%" is not implemented', current_flow_element_type;
        END CASE;

    -- Check if the next flow element id is not null
    IF next_flow_element_id IS NULL THEN
        RAISE EXCEPTION 'Next flow element id is null';
    END IF;

    -- Create a new instance of the next flow element
    INSERT INTO flow_element_instance (instance_of, is_part_of)
    VALUES (next_flow_element_id, NEW.is_part_of);

    RETURN OLD;
END;$function$
;

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

                        IF placeholder_value IS NOT NULL AND jsonb_typeof(placeholder_value::jsonb) = 'array' THEN
                            SELECT string_agg(elem, ',') INTO placeholder_value
                            FROM jsonb_array_elements_text(placeholder_value::jsonb) AS elem;
                        END IF;

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
END;$function$
;

