create type "public"."page" as enum ('Editor', 'Tasks', 'Monitoring', 'Team', 'Stats');

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
