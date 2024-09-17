CREATE OR REPLACE FUNCTION public.create_process_instance(process_model_id_param bigint, inputs_param jsonb)
    RETURNS bigint
    LANGUAGE plpgsql
AS $function$DECLARE
    process_instance_id int8;
    start_element_count INT;
    start_flow_element_id int8;
    end_element_count INT;
BEGIN

    -- Check if the process model has exactly one start element
    SELECT COUNT(*), id INTO start_element_count, start_flow_element_id
    FROM flow_element
    WHERE type = 'startNode' AND model_id = process_model_id_param
    GROUP BY flow_element.id;

    IF start_element_count != 1 THEN
        RAISE EXCEPTION 'Process model must have exactly one start element';
    END IF;

    -- Check if the process model has at least one end element
    SELECT COUNT(*) INTO end_element_count
    FROM flow_element
    WHERE type = 'endNode' AND model_id = process_model_id_param;

    IF end_element_count < 1 THEN
        RAISE EXCEPTION 'Process model must have at least one end element';
    END IF;

    -- Create new process
    INSERT INTO process_instance (process_model_id)
    VALUES (process_model_id_param)
    RETURNING id INTO process_instance_id;

    -- Create start element instance
    INSERT INTO flow_element_instance (instance_of, is_part_of)
    VALUES (start_flow_element_id, process_instance_id);

    -- Set data objects from start flow element data
    -- Insert a new row for each key/value pair in the inputs jsonb
    INSERT INTO data_object_instance (is_part_of, name, value)
    SELECT process_instance_id, key, value
    FROM jsonb_each(inputs_param);

    -- Set start element instance to DONE
    UPDATE flow_element_instance
    SET status = 'Completed', completed_at = now()
    WHERE instance_of = start_flow_element_id AND is_part_of = process_instance_id;

    -- Return success
    RETURN process_instance_id;
END;$function$
;

drop function if exists "public"."create_process_instance"(process_model_id_param bigint);