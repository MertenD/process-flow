set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.complete_flow_element_instance(flow_element_instance_id_param bigint, output_data jsonb, completed_by_param uuid DEFAULT NULL::uuid)
    RETURNS boolean
    LANGUAGE plpgsql
AS $function$
DECLARE
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

    -- Store output data in the data_object_instance table. It has the is_part_of, name and value columns. The name is the key of the json object and the value is the value of the json object. The is_part_of is the id of the flow element instance
    INSERT INTO data_object_instance (is_part_of, name, value)
    SELECT process_instance_id, key, value
    FROM jsonb_each(output_data)
    ON CONFLICT (is_part_of, name)
        DO UPDATE SET value = EXCLUDED.value;

    -- Set flow element instance as COMPLETED
    UPDATE flow_element_instance
    SET status = 'Completed', completed_at = now(), completed_by = COALESCE(completed_by_param, completed_by)
    WHERE id = flow_element_instance_id_param;

    RETURN True;

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
BEGIN

    -- Get the type of the flow element that is referenced
    SELECT type INTO flow_element_type
    FROM flow_element
    WHERE id = NEW.instance_of;

    -- If the type is 'startNode' or the status is not 'Created', then do nothing and return
    IF flow_element_type = 'startNode' OR NEW.status != 'Created' THEN
        RETURN OLD;
    END IF;

    IF flow_element_type = 'endNode' OR flow_element_type = 'gatewayNode' THEN
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

            PERFORM http_post(
                    flow_element_instance_execution_url,
                    '{ "responsePath": "' || app_url
                        || '/api/instance/complete", "flowElementInstanceId": "' || NEW.id
                        || '", "data": ' || flow_element_data::text
                        || '}',
                    'application/json'
                    );
        ELSE
            RAISE EXCEPTION 'Not implemented scenario, where execution mode is "%"', flow_element_instance_execution_mode;
        END CASE;

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
                value_ := replace(value_, E'\\n', E'\n');
                data := jsonb_set(data, array[key], to_jsonb(value_));
            END IF;
        END LOOP;

    RETURN data;
END;$function$
;
