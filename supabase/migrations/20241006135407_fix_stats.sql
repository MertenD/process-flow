drop function if exists "public"."add_profile_to_team"(profile_id_param bigint, team_id_param bigint);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_profile_to_team(profile_id_param uuid, team_id_param bigint)
    RETURNS void
    LANGUAGE plpgsql
AS $function$DECLARE
    profile_team_id bigint;
BEGIN
    -- Check if it already exists
    IF EXISTS (SELECT 1 FROM profile_team WHERE profile_id = profile_id_param AND team_id = team_id_param) THEN
        RAISE EXCEPTION 'Profile with id % already exists in team with id %.', profile_id_param, team_id_param;
    END IF;

    INSERT INTO profile_team (profile_id, team_id)
    VALUES (profile_id_param, team_id_param)
    ON CONFLICT DO NOTHING
    RETURNING id INTO profile_team_id;

    INSERT INTO statistics (profile_id, belongs_to)
    VALUES (profile_id_param, profile_team_id);
END;$function$
;

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

    -- Get the team id from the invitation
    SELECT team_id INTO invitation_team_id
    FROM invitation
    WHERE id = invitation_id_param;

    -- Check if the profile is already in the team
    IF EXISTS (SELECT 1 FROM profile_team WHERE profile_id = profile_id_param AND team_id = invitation_team_id) THEN
        RAISE EXCEPTION 'Profile with id % is already in the team.', profile_id_param;
    END IF;

    -- Check if the given profile has the same email as the invitation
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = profile_id_param AND email = (SELECT email FROM invitation WHERE id = invitation_id_param)) THEN
        RAISE EXCEPTION 'Profile with id % does not have the same email as the invitation.', profile_id_param;
    END IF;

    PERFORM add_profile_to_team(profile_id_param, invitation_team_id);

    DELETE FROM invitation
    WHERE id = invitation_id_param;
END;$function$
;
