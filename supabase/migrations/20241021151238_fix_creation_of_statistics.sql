alter table "public"."statistics" drop constraint "public_statistics_belongs_to_fkey";

alter table "public"."statistics" drop column "belongs_to";

alter table "public"."statistics" add column "team_id" bigint not null;

alter table "public"."statistics" alter column "coins" drop default;

alter table "public"."statistics" alter column "coins" drop not null;

alter table "public"."statistics" alter column "experience" drop default;

alter table "public"."statistics" alter column "experience" drop not null;

alter table "public"."statistics" add constraint "public_statistics_team_id_fkey" FOREIGN KEY (team_id) REFERENCES team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."statistics" validate constraint "public_statistics_team_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.accept_invite(invitation_id_param bigint, profile_id_param uuid)
    RETURNS void
    LANGUAGE plpgsql
AS $function$DECLARE
    invitation_team_id bigint;
BEGIN
    -- Check if the invitation exists
    IF NOT EXISTS (SELECT 1 FROM invitation WHERE id = invitation_id_param) THEN
        RAISE EXCEPTION 'Invitation with id % does not exist.', invitation_id_param;
    END IF;

    -- Check if the profile is already in the team
    IF EXISTS (SELECT 1 FROM profile_team WHERE profile_id = profile_id_param AND team_id = (SELECT team_id FROM invitation WHERE id = invitation_id_param)) THEN
        RAISE EXCEPTION 'Profile with id % is already in the team.', profile_id_param;
    END IF;

    -- Check if the given profile has the same email as the invitation
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = profile_id_param AND email = (SELECT email FROM invitation WHERE id = invitation_id_param)) THEN
        RAISE EXCEPTION 'Profile with id % does not have the same email as the invitation.', profile_id_param;
    END IF;

    SELECT team_id INTO invitation_team_id
    FROM invitation
    WHERE id = invitation_id_param;

    PERFORM add_profile_to_team(profile_id_param, invitation_team_id);

    DELETE FROM invitation
    WHERE id = invitation_id_param;
END;$function$
;

CREATE OR REPLACE FUNCTION public.add_profile_to_team(profile_id_param uuid, team_id_param bigint)
    RETURNS void
    LANGUAGE plpgsql
AS $function$BEGIN
    -- Check if it already exists
    IF EXISTS (SELECT 1 FROM profile_team WHERE profile_id = profile_id_param AND team_id = team_id_param) THEN
        RAISE EXCEPTION 'Profile with id % already exists in team with id %.', profile_id_param, team_id_param;
    END IF;

    -- Add profile to team
    INSERT INTO profile_team (profile_id, team_id)
    VALUES (profile_id_param, team_id_param)
    ON CONFLICT DO NOTHING;

    -- Create new statistics for profile
    INSERT INTO statistics (profile_id, team_id)
    VALUES (profile_id_param, team_id_param);
END;$function$
;

DROP FUNCTION IF EXISTS public.create_team_and_add_creator_as_admin(creator_profile_id bigint, team_name text, color_scheme jsonb);

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
    INSERT INTO role (name, belongs_to, color)
    VALUES ('owner', team_id, '#000000')
    RETURNING id INTO admin_role_id;

    -- Link creator, team and admin role together
    INSERT INTO profile_role_team (profile_id, role_id, team_id)
    VALUES (creator_profile_id, admin_role_id, team_id);

    -- Return success
    RETURN team_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_manual_tasks_with_replaced_data(team_id bigint, user_role_ids bigint[])
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$
DECLARE
    tasks jsonb;
BEGIN
    -- Fetch the manual tasks with replaced data
    SELECT jsonb_agg(t)
    INTO tasks
    FROM (
             SELECT
                 id,
                 replaced_data AS data,
                 replaced_data->'task' AS name,
                 replaced_data->'description' AS description,
                 replaced_data->'outputs' AS outputs,
                 type,
                 status,
                 belongs_to,
                 created_at,
                 is_part_of,
                 instance_of,
                 completed_at,
                 assigned_role,
                 execution_url
             FROM manual_task,
                  LATERAL replace_with_variable_values(data, is_part_of) AS replaced_data
             WHERE belongs_to = team_id AND assigned_role::bigint = ANY(user_role_ids)
         ) t;

    RETURN tasks;
END;
$function$
;
