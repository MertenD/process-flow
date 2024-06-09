create type "public"."flow_element_instance_status" as enum ('Created', 'In Progress', 'Completed');

create table "public"."flow_element_instance" (
                                                  "id" bigint generated by default as identity not null,
                                                  "created_at" timestamp with time zone not null default now(),
                                                  "instance_of" bigint not null,
                                                  "status" flow_element_instance_status not null default 'Created'::flow_element_instance_status,
                                                  "is_part_of" bigint not null
);


alter table "public"."flow_element_instance" enable row level security;

create table "public"."process_instance" (
                                             "id" bigint generated by default as identity not null,
                                             "created_at" timestamp with time zone not null default now(),
                                             "process_model_id" bigint not null
);

create type "public"."execution_mode" as enum ('Manual', 'Automatic');

alter table "public"."flow_element_instance" alter column "status" drop default;

alter type "public"."flow_element_instance_status" rename to "flow_element_instance_status__old_version_to_be_dropped";

create type "public"."flow_element_instance_status" as enum ('Created', 'Todo', 'In Progress', 'Completed');

create type "public"."process_instance_status" as enum ('Running', 'Completed', 'Error');

alter table "public"."flow_element_instance" alter column status type "public"."flow_element_instance_status" using status::text::"public"."flow_element_instance_status";

alter table "public"."flow_element_instance" alter column "status" set default 'Created'::flow_element_instance_status;

alter table "public"."flow_element" add column "execution_mode" execution_mode not null;

alter table "public"."process_instance" enable row level security;

CREATE UNIQUE INDEX flow_element_instance_pkey ON public.flow_element_instance USING btree (id);

CREATE UNIQUE INDEX process_instance_pkey ON public.process_instance USING btree (id);

alter table "public"."flow_element_instance" add constraint "flow_element_instance_pkey" PRIMARY KEY using index "flow_element_instance_pkey";

alter table "public"."process_instance" add constraint "process_instance_pkey" PRIMARY KEY using index "process_instance_pkey";

alter table "public"."flow_element_instance" add constraint "public_flow_element_instance_instance_of_fkey" FOREIGN KEY (instance_of) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."flow_element_instance" validate constraint "public_flow_element_instance_instance_of_fkey";

alter table "public"."flow_element_instance" add constraint "public_flow_element_instance_is_part_of_fkey" FOREIGN KEY (is_part_of) REFERENCES process_instance(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flow_element_instance" validate constraint "public_flow_element_instance_is_part_of_fkey";

alter table "public"."process_instance" add constraint "public_process_instance_process_model_id_fkey" FOREIGN KEY (process_model_id) REFERENCES process_model(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."process_instance" validate constraint "public_process_instance_process_model_id_fkey";

alter table "public"."flow_element_instance" add column "completed_at" timestamp with time zone;

alter table "public"."process_instance" add column "completed_at" timestamp with time zone;

alter table "public"."process_instance" add column "status" process_instance_status not null default 'Running'::process_instance_status;

create extension if not exists "http" with schema "extensions";

alter table "public"."flow_element" drop constraint "public_flow_element_model_id_fkey";

alter table "public"."flow_element" add column "execution_url" text;

alter table "public"."flow_element" add constraint "public_flow_element_model_id_fkey" FOREIGN KEY (model_id) REFERENCES process_model(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flow_element" validate constraint "public_flow_element_model_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_process_instance(process_model_id_param bigint)
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

    -- Set data objects
    -- TODO

    -- Set start element instance to DONE
    UPDATE flow_element_instance
    SET status = 'Completed', completed_at = now()
    WHERE instance_of = start_flow_element_id AND is_part_of = process_instance_id;

    -- Return success
    RETURN process_instance_id;
END;$function$
;

grant delete on table "public"."flow_element_instance" to "anon";

grant insert on table "public"."flow_element_instance" to "anon";

grant references on table "public"."flow_element_instance" to "anon";

grant select on table "public"."flow_element_instance" to "anon";

grant trigger on table "public"."flow_element_instance" to "anon";

grant truncate on table "public"."flow_element_instance" to "anon";

grant update on table "public"."flow_element_instance" to "anon";

grant delete on table "public"."flow_element_instance" to "authenticated";

grant insert on table "public"."flow_element_instance" to "authenticated";

grant references on table "public"."flow_element_instance" to "authenticated";

grant select on table "public"."flow_element_instance" to "authenticated";

grant trigger on table "public"."flow_element_instance" to "authenticated";

grant truncate on table "public"."flow_element_instance" to "authenticated";

grant update on table "public"."flow_element_instance" to "authenticated";

grant delete on table "public"."flow_element_instance" to "service_role";

grant insert on table "public"."flow_element_instance" to "service_role";

grant references on table "public"."flow_element_instance" to "service_role";

grant select on table "public"."flow_element_instance" to "service_role";

grant trigger on table "public"."flow_element_instance" to "service_role";

grant truncate on table "public"."flow_element_instance" to "service_role";

grant update on table "public"."flow_element_instance" to "service_role";

grant delete on table "public"."process_instance" to "anon";

grant insert on table "public"."process_instance" to "anon";

grant references on table "public"."process_instance" to "anon";

grant select on table "public"."process_instance" to "anon";

grant trigger on table "public"."process_instance" to "anon";

grant truncate on table "public"."process_instance" to "anon";

grant update on table "public"."process_instance" to "anon";

grant delete on table "public"."process_instance" to "authenticated";

grant insert on table "public"."process_instance" to "authenticated";

grant references on table "public"."process_instance" to "authenticated";

grant select on table "public"."process_instance" to "authenticated";

grant trigger on table "public"."process_instance" to "authenticated";

grant truncate on table "public"."process_instance" to "authenticated";

grant update on table "public"."process_instance" to "authenticated";

grant delete on table "public"."process_instance" to "service_role";

grant insert on table "public"."process_instance" to "service_role";

grant references on table "public"."process_instance" to "service_role";

grant select on table "public"."process_instance" to "service_role";

grant trigger on table "public"."process_instance" to "service_role";

grant truncate on table "public"."process_instance" to "service_role";

grant update on table "public"."process_instance" to "service_role";

create policy "enable all for authenticated users"
    on "public"."process_instance"
    as permissive
    for all
    to authenticated
    using (true);

CREATE OR REPLACE FUNCTION public.create_next_flow_element_instance()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$DECLARE
    current_flow_element_type text;
    next_flow_element_id int8;
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
        WHEN current_flow_element_type = 'gamificationEventNode' THEN
            SELECT gamification_event_element.next_flow_element_id INTO next_flow_element_id
            FROM gamification_event_element
            WHERE flow_element_id = NEW.instance_of;
        WHEN current_flow_element_type = 'endNode' THEN

            -- Don't get the next element id from the end node, instead set the process instance as completed
            UPDATE process_instance
            SET status = 'Completed', completed_at = now()
            WHERE id = NEW.is_part_of;

            RETURN OLD;
        ELSE
            RAISE EXCEPTION 'Getting the next flow element id for the node type "%" is not implemented', current_flow_element_type;
    END CASE;

    -- Create a new instance of the next flow element
    INSERT INTO flow_element_instance (instance_of, is_part_of)
    VALUES (next_flow_element_id, NEW.is_part_of);

    RETURN OLD;
END;$function$
;

CREATE TRIGGER create_next_flow_element_instance_on_previous_completed
AFTER UPDATE ON public.flow_element_instance
FOR EACH ROW
WHEN (OLD.status IS NOT NULL AND OLD.status != 'Completed' AND NEW.status = 'Completed')
EXECUTE FUNCTION create_next_flow_element_instance();

CREATE OR REPLACE FUNCTION public.execute_created_flow_element_instance()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$
DECLARE
    flow_element_instance_execution_mode execution_mode;
    flow_element_instance_execution_url text;
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

    IF flow_element_type = 'endNode' THEN
        UPDATE flow_element_instance
        SET status = 'Completed', completed_at = now()
        WHERE id = NEW.id;

        RETURN OLD;
    END IF;

    -- Get execution mode and execution url from the flow element
    SELECT execution_mode, execution_url INTO flow_element_instance_execution_mode, flow_element_instance_execution_url
    FROM flow_element
    WHERE id = NEW.instance_of;

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
END;
$function$;


CREATE TRIGGER execute_flow_element_instance_on_creation
AFTER INSERT ON public.flow_element_instance
FOR EACH ROW
WHEN (NEW.status = 'Created')
EXECUTE FUNCTION execute_created_flow_element_instance();

create table "public"."data_object_instance" (
                                                 "id" bigint generated by default as identity not null,
                                                 "created_at" timestamp with time zone not null default now(),
                                                 "is_part_of" bigint not null,
                                                 "name" text not null,
                                                 "value" jsonb
);

alter table "public"."data_object_instance" enable row level security;

CREATE UNIQUE INDEX data_object_instance_pkey ON public.data_object_instance USING btree (id);

CREATE UNIQUE INDEX data_object_instance_unique_constraint ON public.data_object_instance USING btree (is_part_of, name);

alter table "public"."data_object_instance" add constraint "data_object_instance_pkey" PRIMARY KEY using index "data_object_instance_pkey";

alter table "public"."data_object_instance" add constraint "data_object_instance_unique_constraint" UNIQUE using index "data_object_instance_unique_constraint";

alter table "public"."data_object_instance" add constraint "public_data_object_instance_is_part_of_fkey" FOREIGN KEY (is_part_of) REFERENCES process_instance(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."data_object_instance" validate constraint "public_data_object_instance_is_part_of_fkey";


CREATE OR REPLACE FUNCTION public.complete_flow_element_instance(flow_element_instance_id_param bigint, output_data jsonb)
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
    SET status = 'Completed', completed_at = now()
    WHERE id = flow_element_instance_id_param;

    RETURN True;

END;$function$
;

create policy "enable all for authenticated users who are part of the related "
    on "public"."flow_element_instance"
    as permissive
    for all
    to authenticated
    using ((EXISTS ( SELECT 1
                     FROM ((process_instance pi
                         JOIN process_model pm ON ((pi.process_model_id = pm.id)))
                         JOIN profile_role_team prt ON ((prt.team_id = pm.belongs_to)))
                     WHERE ((pi.id = flow_element_instance.is_part_of) AND (prt.profile_id = auth.uid())))));

grant delete on table "public"."data_object_instance" to "anon";

grant insert on table "public"."data_object_instance" to "anon";

grant references on table "public"."data_object_instance" to "anon";

grant select on table "public"."data_object_instance" to "anon";

grant trigger on table "public"."data_object_instance" to "anon";

grant truncate on table "public"."data_object_instance" to "anon";

grant update on table "public"."data_object_instance" to "anon";

grant delete on table "public"."data_object_instance" to "authenticated";

grant insert on table "public"."data_object_instance" to "authenticated";

grant references on table "public"."data_object_instance" to "authenticated";

grant select on table "public"."data_object_instance" to "authenticated";

grant trigger on table "public"."data_object_instance" to "authenticated";

grant truncate on table "public"."data_object_instance" to "authenticated";

grant update on table "public"."data_object_instance" to "authenticated";

grant delete on table "public"."data_object_instance" to "service_role";

grant insert on table "public"."data_object_instance" to "service_role";

grant references on table "public"."data_object_instance" to "service_role";

grant select on table "public"."data_object_instance" to "service_role";

grant trigger on table "public"."data_object_instance" to "service_role";

grant truncate on table "public"."data_object_instance" to "service_role";

grant update on table "public"."data_object_instance" to "service_role";