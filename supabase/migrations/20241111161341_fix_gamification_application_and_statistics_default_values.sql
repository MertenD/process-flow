alter table "public"."statistics" alter column "coins" set default '0'::bigint;

alter table "public"."statistics" alter column "coins" set not null;

alter table "public"."statistics" alter column "experience" set default '0'::bigint;

alter table "public"."statistics" alter column "experience" set not null;

set check_function_bodies = off;

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
        RAISE EXCEPTION 'Some gamification data is missing.';
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
                   WHEN gamification_options_replaced->>'comparison' = '==' AND gamification_options_replaced->>'value1' = gamification_options_replaced->>'value2' THEN
                       true
                   WHEN gamification_options_replaced->>'comparison' = '!=' AND gamification_options_replaced->>'value1' != gamification_options_replaced->>'value2' THEN
                       true
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
                    WHERE team_id = team_id_param
                      AND profile_id = profile_id_param;
                     WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                         -- Increment coins
                         UPDATE statistics
                         SET coins = coins + (gamification_options_replaced->>'pointsForSuccess')::int
                         WHERE team_id = team_id_param
                           AND profile_id = profile_id_param;
                     ELSE
                         RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                    END CASE;

                 WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'decrementBy' THEN

                     CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                         -- Decrement experience
                         UPDATE statistics
                         SET experience = experience - (gamification_options_replaced->>'pointsForSuccess')::int
                         WHERE team_id = team_id_param
                           AND profile_id = profile_id_param;
                          WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                              -- Decrement coins
                              UPDATE statistics
                              SET coins = coins - (gamification_options_replaced->>'pointsForSuccess')::int
                              WHERE team_id = team_id_param
                                AND profile_id = profile_id_param;
                          ELSE
                              RAISE EXCEPTION 'Point type % is not implemented.', gamification_options_replaced->>'pointType';
                         END CASE;

                 WHEN gamification_options_replaced->>'pointsApplicationMethod' = 'setTo' THEN

                     CASE WHEN gamification_options_replaced->>'pointType' = 'Experience' THEN
                         -- Set experience
                         UPDATE statistics
                         SET experience = (gamification_options_replaced->>'pointsForSuccess')::int
                         WHERE team_id = team_id_param
                           AND profile_id = profile_id_param;
                          WHEN gamification_options_replaced->>'pointType' = 'Coins' THEN
                              -- Set coins
                              UPDATE statistics
                              SET coins = (gamification_options_replaced->>'pointsForSuccess')::int
                              WHERE team_id = team_id_param
                                AND profile_id = profile_id_param;
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
                 FROM profiles, team
                 WHERE statistics.profile_id = profiles.id
                   AND statistics.team_id = team.id
                   AND team.id = team_id_param
                   AND profiles.id = profile_id_param;

             ELSE
                 RAISE EXCEPTION 'Gamification type % is not implemented.', gamification_type;
            END CASE;

    END IF;

END;$function$
;
