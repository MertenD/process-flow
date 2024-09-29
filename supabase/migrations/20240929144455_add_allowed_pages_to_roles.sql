create type "public"."page" as enum ('Editor', 'Tasks', 'Monitoring', 'Team', 'Stats');

drop policy "enable delete for authenticated" on "public"."process_model";

alter table "public"."profile_role_team" drop constraint "public_profile_role_team_profile_id_fkey";

alter table "public"."profile_role_team" drop constraint "public_profile_role_team_team_id_fkey";

alter table "public"."profile_team" drop constraint "public_profile_team_profile_id_fkey";

alter table "public"."profile_team" drop constraint "public_profile_team_team_id_fkey";

alter table "public"."flow_element_instance" drop constraint "public_flow_element_instance_instance_of_fkey";

alter table "public"."process_instance" drop constraint "public_process_instance_process_model_id_fkey";

alter table "public"."process_model" drop constraint "public_process_model_belongs_to_fkey";

alter table "public"."process_model" drop constraint "public_process_model_created_by_fkey";

alter table "public"."process_model" drop constraint "public_process_model_updated_by_fkey";

alter table "public"."role" drop constraint "public_role_belongs_to_fkey";

drop function if exists "public"."add_role"(name_param text, color_param text, belongs_to_param bigint);

drop function if exists "public"."remove_profile_from_team"(profile_id_param uuid, team_id_param bigint);

alter table "public"."process_model" alter column "created_by" set not null;

alter table "public"."role" add column "pages" jsonb;

alter table "public"."role" alter column "color" set default '#000000'::text;

alter table "public"."profile_role_team" add constraint "public_profile_role_team_profile_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."profile_role_team" validate constraint "public_profile_role_team_profile_fkey";

alter table "public"."profile_role_team" add constraint "public_profile_role_team_team_fkey" FOREIGN KEY (team_id) REFERENCES team(id) not valid;

alter table "public"."profile_role_team" validate constraint "public_profile_role_team_team_fkey";

alter table "public"."profile_team" add constraint "profile_team_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."profile_team" validate constraint "profile_team_profile_id_fkey";

alter table "public"."profile_team" add constraint "profile_team_team_id_fkey" FOREIGN KEY (team_id) REFERENCES team(id) not valid;

alter table "public"."profile_team" validate constraint "profile_team_team_id_fkey";

alter table "public"."flow_element_instance" add constraint "public_flow_element_instance_instance_of_fkey" FOREIGN KEY (instance_of) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."flow_element_instance" validate constraint "public_flow_element_instance_instance_of_fkey";

alter table "public"."process_instance" add constraint "public_process_instance_process_model_id_fkey" FOREIGN KEY (process_model_id) REFERENCES process_model(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."process_instance" validate constraint "public_process_instance_process_model_id_fkey";

alter table "public"."process_model" add constraint "public_process_model_belongs_to_fkey" FOREIGN KEY (belongs_to) REFERENCES team(id) ON UPDATE CASCADE not valid;

alter table "public"."process_model" validate constraint "public_process_model_belongs_to_fkey";

alter table "public"."process_model" add constraint "public_process_model_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE not valid;

alter table "public"."process_model" validate constraint "public_process_model_created_by_fkey";

alter table "public"."process_model" add constraint "public_process_model_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES profiles(id) ON UPDATE CASCADE not valid;

alter table "public"."process_model" validate constraint "public_process_model_updated_by_fkey";

alter table "public"."role" add constraint "public_role_belongs_to_fkey" FOREIGN KEY (belongs_to) REFERENCES team(id) ON UPDATE CASCADE not valid;

alter table "public"."role" validate constraint "public_role_belongs_to_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_role(name_param text, color_param text, belongs_to_param bigint, pages_param jsonb)
    RETURNS bigint
    LANGUAGE plpgsql
AS $function$DECLARE
    role_id bigint;
BEGIN
    -- Check if it already exists
    IF EXISTS (SELECT 1 FROM role WHERE name = name_param AND belongs_to = belongs_to_param) THEN
        RAISE EXCEPTION 'Role with name % already exists in team.', name_param;
    END IF;

    INSERT INTO role (name, color, belongs_to, pages)
    VALUES (name_param, color_param, belongs_to_param, pages_param)
    RETURNING id INTO role_id;

    RETURN role_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.remove_profile_from_team(profile_id_param bigint, team_id_param bigint)
    RETURNS void
    LANGUAGE plpgsql
AS $function$BEGIN
    DELETE FROM profile_team
    WHERE profile_id = profile_id_param AND team_id = team_id_param;
END;$function$
;
