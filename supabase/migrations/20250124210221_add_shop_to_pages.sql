alter type "public"."page" rename to "page__old_version_to_be_dropped";

create type "public"."page" as enum ('Editor', 'Tasks', 'Monitoring', 'Team', 'Stats', 'Shop');

drop type "public"."page__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_team_and_add_creator_as_admin(creator_profile_id uuid, team_name text, color_scheme jsonb)
    RETURNS bigint
    LANGUAGE plpgsql
AS $function$DECLARE
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
    INSERT INTO team (name, created_by, color_scheme)
    VALUES (team_name, creator_profile_id, color_scheme)
    RETURNING id INTO team_id;

    PERFORM add_profile_to_team(creator_profile_id, team_id);

    -- Add a admin role as default to the role table
    INSERT INTO role (name, belongs_to, color, pages)
    VALUES ('owner', team_id, '#000000', '{"allowed_pages": ["Tasks","Monitoring","Editor","Team","Shop"]}')
    RETURNING id INTO admin_role_id;

    -- Link creator, team and admin role together
    INSERT INTO profile_role_team (profile_id, role_id, team_id)
    VALUES (creator_profile_id, admin_role_id, team_id);

    -- Return success
    RETURN team_id;
END;$function$
;
