set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_process_model(belongs_to_param integer, name_param text, description_param text, created_by_param uuid)
    RETURNS bigint
    LANGUAGE plpgsql
AS $function$DECLARE
    process_model_id int8;
BEGIN

    -- Check if the created_by_param is valid
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = created_by_param) THEN
        RAISE EXCEPTION 'The creator is not known.';
    END IF;

    -- Check if the team already created a process with this name
    IF EXISTS (SELECT 1 FROM process_model WHERE name = name_param AND belongs_to = belongs_to_param) THEN
        RAISE EXCEPTION 'Process with name % already exists in this team.', name;
    END IF;

    -- Create new process
    INSERT INTO process_model (name, created_by, description, belongs_to)
    VALUES (name_param, created_by_param, description_param, belongs_to_param)
    RETURNING id INTO process_model_id;

    -- Return success
    RETURN process_model_id;
END;$function$
;

DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'process_model'
    ) THEN
        CREATE POLICY "Enable insert for authenticated users"
            ON "public"."process_model"
            AS PERMISSIVE
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
    END IF;
END
$$;

DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'role'
    ) THEN
        CREATE POLICY "enable insert access for authenticated users"
            ON "public"."role"
            AS PERMISSIVE
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
    END IF;
END
$$;
