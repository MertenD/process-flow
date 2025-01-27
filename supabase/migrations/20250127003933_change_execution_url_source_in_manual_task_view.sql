drop view if exists "public"."manual_task";

alter table "public"."flow_element" drop column "execution_url";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.execute_created_flow_element_instance()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$DECLARE
    flow_element_instance_execution_mode execution_mode;
    flow_element_instance_execution_url text;
    flow_element_data jsonb;
    flow_element_type text;
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
    SELECT fe.execution_mode, nd.definition->>'executionUrl' AS execution_url
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

            -- Go through each value in the data object and replace any string with "{content}" with the content without the brackets
            -- The new values can be located in the data_object_instance table. The name col of the row is the value withoud the brackets
            flow_element_data := replace_with_variable_values(flow_element_data, NEW.is_part_of);

            PERFORM http_post(
                    flow_element_instance_execution_url,
                    '{ "responsePath": "http://10.105.11.42:3000/api/instance/complete", "flowElementInstanceId": "' || NEW.id || '", "data": {
                    "testdata1": "value1",
                    "testdata2": "value2"
                } }',
                    'application/json'
                    );
        ELSE
            RAISE EXCEPTION 'Not implemented scenario, where execution mode is "%"', flow_element_instance_execution_mode;
        END CASE;

    RETURN OLD;
END;$function$
;

create or replace view "public"."manual_task" as  SELECT flow_element_instance.id,
                                                         flow_element_instance.created_at,
                                                         flow_element_instance.instance_of,
                                                         flow_element_instance.status,
                                                         flow_element_instance.is_part_of,
                                                         flow_element_instance.completed_at,
                                                         flow_element_instance.completed_by,
                                                         process_model.belongs_to,
                                                         flow_element.type,
                                                         (node_definition.definition ->> 'executionUrl'::text) AS execution_url,
                                                         flow_element.data,
                                                         (flow_element.data ->> 'assignedRole'::text) AS assigned_role
                                                  FROM ((((flow_element_instance
                                                      JOIN flow_element ON ((flow_element_instance.instance_of = flow_element.id)))
                                                      JOIN process_instance ON ((flow_element_instance.is_part_of = process_instance.id)))
                                                      JOIN process_model ON ((process_instance.process_model_id = process_model.id)))
                                                      JOIN node_definition ON ((((flow_element.data ->> 'nodeDefinitionId'::text))::bigint = node_definition.id)))
                                                  WHERE (flow_element.execution_mode = 'Manual'::execution_mode);
