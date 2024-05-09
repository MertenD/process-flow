set check_function_bodies = off;

alter table "public"."profile_role_team" drop constraint "public_profile_role_team_profile_fkey";

alter table "public"."profile_role_team" drop constraint "public_profile_role_team_role_fkey";

alter table "public"."profile_role_team" drop constraint "public_profile_role_team_team_fkey";

alter table "public"."profile_role_team" drop column "profile";

alter table "public"."profile_role_team" drop column "role";

alter table "public"."profile_role_team" drop column "team";

alter table "public"."profile_role_team" add column "profile_id" uuid not null;

alter table "public"."profile_role_team" add column "role_id" bigint not null;

alter table "public"."profile_role_team" add column "team_id" bigint not null;

alter table "public"."profile_role_team" add constraint "public_profile_role_team_profile_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."profile_role_team" validate constraint "public_profile_role_team_profile_fkey";

alter table "public"."profile_role_team" add constraint "public_profile_role_team_role_fkey" FOREIGN KEY (role_id) REFERENCES role(id) not valid;

alter table "public"."profile_role_team" validate constraint "public_profile_role_team_role_fkey";

alter table "public"."profile_role_team" add constraint "public_profile_role_team_team_fkey" FOREIGN KEY (team_id) REFERENCES team(id) not valid;

alter table "public"."profile_role_team" validate constraint "public_profile_role_team_team_fkey";

CREATE OR REPLACE FUNCTION public.create_team_and_add_creator_as_admin(creator_profile_id uuid, team_name text)
    RETURNS int8
    LANGUAGE plpgsql
AS $function$
DECLARE
    team_id int8;
    admin_role_id int8;
BEGIN

    -- Check if the creator_profile_id is valid
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = creator_profile_id) THEN
        RAISE EXCEPTION 'Invalid creator_profile_id: %', creator_profile_id;
    END IF;

    -- Check if the creator already created a team with this name
    IF EXISTS (SELECT 1 FROM team WHERE name = team_name AND created_by = creator_profile_id) THEN
        RAISE EXCEPTION 'Team with name % already exists', team_name;
    END IF;

    -- Create new team with the given name and profile_creator_id and return the team_id
    INSERT INTO team (name, created_by)
    VALUES (team_name, creator_profile_id)
    RETURNING id INTO team_id;

    -- Add a admin role as default to the role table
    INSERT INTO role (name, belongs_to)
    VALUES ('admin', team_id)
    RETURNING id INTO admin_role_id;

    -- Link creator, team and admin role together
    INSERT INTO profile_role_team (profile_id, role_id, team_id)
    VALUES (creator_profile_id, admin_role_id, team_id);

    -- Return success
    RETURN team_id;
END;
$function$
;