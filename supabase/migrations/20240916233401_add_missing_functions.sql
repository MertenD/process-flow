CREATE OR REPLACE FUNCTION public.replace_with_variable_values(data jsonb, process_instance_id bigint)
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$DECLARE
    key text;
    value_ text;
    new_value text;
BEGIN
    FOR key, value_ IN SELECT * FROM jsonb_each_text(data) LOOP
            IF value_ LIKE '{%}' THEN
                SELECT doi.value INTO new_value
                FROM data_object_instance doi
                WHERE doi.is_part_of = process_instance_id AND doi.name = substring(value_, 2, length(value_) - 2);

                IF new_value IS NOT NULL THEN
                    new_value := trim(both '"' from new_value);
                    data := jsonb_set(data, array[key], to_jsonb(new_value));
                END IF;
            END IF;
        END LOOP;

    RETURN data;
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

-- Add a admin role as default to the role table
    INSERT INTO role (name, belongs_to, color)
    VALUES ('owner', team_id, '#000000')
    RETURNING id INTO admin_role_id;

-- Link creator, team and admin role together
    INSERT INTO profile_role_team (profile_id, role_id, team_id)
    VALUES (creator_profile_id, admin_role_id, team_id);

-- Link creator and team together
    INSERT INTO profile_team (profile_id, team_id)
    VALUES (creator_profile_id, team_id);

-- Return success
    RETURN team_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.accept_invite(invitation_id_param bigint, profile_id_param uuid)
    RETURNS void
    LANGUAGE plpgsql
AS $function$BEGIN
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

    INSERT INTO profile_team (profile_id, team_id)
    SELECT profile_id_param, team_id
    FROM invitation
    WHERE id = invitation_id_param;

    DELETE FROM invitation
    WHERE id = invitation_id_param;
END;$function$
;
