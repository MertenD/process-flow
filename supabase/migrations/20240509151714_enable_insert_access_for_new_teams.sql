DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'profile_role_team'
    ) THEN
        CREATE POLICY "Enable insert for authenticated users"
            ON "public"."profile_role_team"
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
        CREATE POLICY "Enable all for for authenticated users"
            ON "public"."role"
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
        AND tablename = 'team'
    ) THEN
        CREATE POLICY "Enable all for for authenticated users"
            ON "public"."team"
            AS PERMISSIVE
            FOR ALL
            TO authenticated
            USING (true);
    END IF;
END
$$;
