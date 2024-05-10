create policy "Enable insert for authenticated users"
    on "public"."profile_role_team"
    as permissive
    for insert
    to authenticated
    with check (true);


create policy "Enable all for for authenticated users"
    on "public"."role"
    as permissive
    for insert
    to authenticated
    with check (true);


create policy "Enable all for for authenticated users"
    on "public"."team"
    as permissive
    for all
    to authenticated
    using (true);
