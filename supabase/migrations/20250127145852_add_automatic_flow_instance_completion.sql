drop view if exists "public"."manual_task";

create table "public"."config" (
                                   "key" text not null,
                                   "value" text not null
);


alter table "public"."config" enable row level security;

alter table "public"."flow_element" drop column "execution_mode";

CREATE UNIQUE INDEX config_pkey ON public.config USING btree (key);

alter table "public"."config" add constraint "config_pkey" PRIMARY KEY using index "config_pkey";

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

    -- Store output data in the data_object_instance table. It has the is_part_of, name and value columns. The name is the key of the json object and the value is the value of the json object. The is_part_of is the id of the flow element instan
    ce
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
                                                  WHERE ((node_definition.definition ->> 'executionMode'::text) = 'Manual'::text);


grant delete on table "public"."config" to "anon";

grant insert on table "public"."config" to "anon";

grant references on table "public"."config" to "anon";

grant select on table "public"."config" to "anon";

grant trigger on table "public"."config" to "anon";

grant truncate on table "public"."config" to "anon";

grant update on table "public"."config" to "anon";

grant delete on table "public"."config" to "authenticated";

grant insert on table "public"."config" to "authenticated";

grant references on table "public"."config" to "authenticated";

grant select on table "public"."config" to "authenticated";

grant trigger on table "public"."config" to "authenticated";

grant truncate on table "public"."config" to "authenticated";

grant update on table "public"."config" to "authenticated";

grant delete on table "public"."config" to "service_role";

grant insert on table "public"."config" to "service_role";

grant references on table "public"."config" to "service_role";

grant select on table "public"."config" to "service_role";

grant trigger on table "public"."config" to "service_role";

grant truncate on table "public"."config" to "service_role";

grant update on table "public"."config" to "service_role";

create policy "ENable read from service role"
    on "public"."config"
    as permissive
    for select
    to public
    using (true);
