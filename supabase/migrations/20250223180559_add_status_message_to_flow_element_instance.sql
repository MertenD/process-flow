alter table "public"."flow_element_instance" add column "status_message" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fail_flow_element_instance(flow_element_instance_id_param bigint, error_message text)
    RETURNS void
    LANGUAGE plpgsql
AS $function$DECLARE
    process_instance_id int8;
BEGIN

    -- Check if flow element instance exists
    IF NOT EXISTS (SELECT 1 FROM flow_element_instance WHERE id = flow_element_instance_id_param) THEN
        RAISE EXCEPTION 'Flow element instance with id % does not exist', flow_element_instance_id_param;
    END IF;

    -- Get process instance id
    SELECT is_part_of INTO process_instance_id
    FROM flow_element_instance
    WHERE id = flow_element_instance_id_param;

    -- Set flow element instance as ERROR
    UPDATE flow_element_instance
    SET status = 'Error', status_message = error_message
    WHERE id = flow_element_instance_id_param;

    -- Set state of process instance to ERROR
    UPDATE process_instance
    SET status = 'Error'
    WHERE id = process_instance_id;
END;$function$
;
