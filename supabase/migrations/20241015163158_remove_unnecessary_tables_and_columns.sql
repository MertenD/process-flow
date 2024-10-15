drop policy "enable all for authenticated users" on "public"."challenge_element";

drop policy "Enable all for authenticated users" on "public"."gamification_event_element";

drop policy "Enable all for authenticated users" on "public"."gamification_option";

revoke delete on table "public"."challenge_element" from "anon";

revoke insert on table "public"."challenge_element" from "anon";

revoke references on table "public"."challenge_element" from "anon";

revoke select on table "public"."challenge_element" from "anon";

revoke trigger on table "public"."challenge_element" from "anon";

revoke truncate on table "public"."challenge_element" from "anon";

revoke update on table "public"."challenge_element" from "anon";

revoke delete on table "public"."challenge_element" from "authenticated";

revoke insert on table "public"."challenge_element" from "authenticated";

revoke references on table "public"."challenge_element" from "authenticated";

revoke select on table "public"."challenge_element" from "authenticated";

revoke trigger on table "public"."challenge_element" from "authenticated";

revoke truncate on table "public"."challenge_element" from "authenticated";

revoke update on table "public"."challenge_element" from "authenticated";

revoke delete on table "public"."challenge_element" from "service_role";

revoke insert on table "public"."challenge_element" from "service_role";

revoke references on table "public"."challenge_element" from "service_role";

revoke select on table "public"."challenge_element" from "service_role";

revoke trigger on table "public"."challenge_element" from "service_role";

revoke truncate on table "public"."challenge_element" from "service_role";

revoke update on table "public"."challenge_element" from "service_role";

revoke delete on table "public"."gamification_event_element" from "anon";

revoke insert on table "public"."gamification_event_element" from "anon";

revoke references on table "public"."gamification_event_element" from "anon";

revoke select on table "public"."gamification_event_element" from "anon";

revoke trigger on table "public"."gamification_event_element" from "anon";

revoke truncate on table "public"."gamification_event_element" from "anon";

revoke update on table "public"."gamification_event_element" from "anon";

revoke delete on table "public"."gamification_event_element" from "authenticated";

revoke insert on table "public"."gamification_event_element" from "authenticated";

revoke references on table "public"."gamification_event_element" from "authenticated";

revoke select on table "public"."gamification_event_element" from "authenticated";

revoke trigger on table "public"."gamification_event_element" from "authenticated";

revoke truncate on table "public"."gamification_event_element" from "authenticated";

revoke update on table "public"."gamification_event_element" from "authenticated";

revoke delete on table "public"."gamification_event_element" from "service_role";

revoke insert on table "public"."gamification_event_element" from "service_role";

revoke references on table "public"."gamification_event_element" from "service_role";

revoke select on table "public"."gamification_event_element" from "service_role";

revoke trigger on table "public"."gamification_event_element" from "service_role";

revoke truncate on table "public"."gamification_event_element" from "service_role";

revoke update on table "public"."gamification_event_element" from "service_role";

revoke delete on table "public"."gamification_option" from "anon";

revoke insert on table "public"."gamification_option" from "anon";

revoke references on table "public"."gamification_option" from "anon";

revoke select on table "public"."gamification_option" from "anon";

revoke trigger on table "public"."gamification_option" from "anon";

revoke truncate on table "public"."gamification_option" from "anon";

revoke update on table "public"."gamification_option" from "anon";

revoke delete on table "public"."gamification_option" from "authenticated";

revoke insert on table "public"."gamification_option" from "authenticated";

revoke references on table "public"."gamification_option" from "authenticated";

revoke select on table "public"."gamification_option" from "authenticated";

revoke trigger on table "public"."gamification_option" from "authenticated";

revoke truncate on table "public"."gamification_option" from "authenticated";

revoke update on table "public"."gamification_option" from "authenticated";

revoke delete on table "public"."gamification_option" from "service_role";

revoke insert on table "public"."gamification_option" from "service_role";

revoke references on table "public"."gamification_option" from "service_role";

revoke select on table "public"."gamification_option" from "service_role";

revoke trigger on table "public"."gamification_option" from "service_role";

revoke truncate on table "public"."gamification_option" from "service_role";

revoke update on table "public"."gamification_option" from "service_role";

alter table "public"."activity_element" drop constraint "public_activity_element_gamification_option_id_fkey";

alter table "public"."challenge_element" drop constraint "challenge_element_flow_element_id_key";

alter table "public"."challenge_element" drop constraint "public_challenge_element_flow_element_id_fkey";

alter table "public"."challenge_element" drop constraint "public_challenge_element_gamification_option_id_fkey";

alter table "public"."gamification_event_element" drop constraint "gamification_event_element_flow_element_id_key";

alter table "public"."gamification_event_element" drop constraint "public_gamification_event_element_flow_element_id_fkey";

alter table "public"."gamification_event_element" drop constraint "public_gamification_event_element_gamification_option_id_fkey";

alter table "public"."gamification_event_element" drop constraint "public_gamification_event_element_next_flow_element_id_fkey";

alter table "public"."challenge_element" drop constraint "challenge_element_pkey";

alter table "public"."gamification_event_element" drop constraint "gamification_event_element_pkey";

alter table "public"."gamification_option" drop constraint "gamification_option_pkey";

drop index if exists "public"."challenge_element_flow_element_id_key";

drop index if exists "public"."challenge_element_pkey";

drop index if exists "public"."gamification_event_element_flow_element_id_key";

drop index if exists "public"."gamification_event_element_pkey";

drop index if exists "public"."gamification_option_pkey";

drop table "public"."challenge_element";

drop table "public"."gamification_event_element";

drop table "public"."gamification_option";

alter table "public"."activity_element" drop column "activity_type";

alter table "public"."activity_element" drop column "choices";

alter table "public"."activity_element" drop column "description";

alter table "public"."activity_element" drop column "gamification_option_id";

alter table "public"."activity_element" drop column "gamification_type";

alter table "public"."activity_element" drop column "info_text";

alter table "public"."activity_element" drop column "input_regex";

alter table "public"."activity_element" drop column "task";

alter table "public"."activity_element" drop column "variable_name";

alter table "public"."gateway_element" drop column "comparison";

alter table "public"."gateway_element" drop column "value1";

alter table "public"."gateway_element" drop column "value2";

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
                               WHEN current_flow_element_data->>'value1' = current_flow_element_data->>'value2' THEN
                                   gateway_flow_element_next_true_id
                               ELSE
                                   gateway_flow_element_next_false_id
                               END
                       WHEN current_flow_element_data->>'comparison' = '!=' THEN
                           CASE
                               WHEN current_flow_element_data->>'value1' != current_flow_element_data->>'value2' THEN
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

