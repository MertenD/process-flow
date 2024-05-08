create table "public"."end_element" (
                                        "id" bigint generated by default as identity not null,
                                        "created_at" timestamp with time zone not null default now(),
                                        "flow_element_id" bigint not null
);


alter table "public"."end_element" enable row level security;

create table "public"."start_element" (
                                          "id" bigint generated by default as identity not null,
                                          "created_at" timestamp with time zone not null default now(),
                                          "flow_element_id" bigint not null,
                                          "next_flow_element_id" bigint
);


alter table "public"."start_element" enable row level security;

CREATE UNIQUE INDEX end_element_flow_element_id_key ON public.end_element USING btree (flow_element_id);

CREATE UNIQUE INDEX end_element_pkey ON public.end_element USING btree (id);

CREATE UNIQUE INDEX start_element_flow_element_id_key ON public.start_element USING btree (flow_element_id);

CREATE UNIQUE INDEX start_element_pkey ON public.start_element USING btree (id);

alter table "public"."end_element" add constraint "end_element_pkey" PRIMARY KEY using index "end_element_pkey";

alter table "public"."start_element" add constraint "start_element_pkey" PRIMARY KEY using index "start_element_pkey";

alter table "public"."end_element" add constraint "end_element_flow_element_id_key" UNIQUE using index "end_element_flow_element_id_key";

alter table "public"."end_element" add constraint "public_end_element_flow_element_id_fkey" FOREIGN KEY (flow_element_id) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."end_element" validate constraint "public_end_element_flow_element_id_fkey";

alter table "public"."start_element" add constraint "public_start_element_flow_element_id_fkey" FOREIGN KEY (flow_element_id) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."start_element" validate constraint "public_start_element_flow_element_id_fkey";

alter table "public"."start_element" add constraint "public_start_element_next_flow_element_id_fkey" FOREIGN KEY (next_flow_element_id) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."start_element" validate constraint "public_start_element_next_flow_element_id_fkey";

alter table "public"."start_element" add constraint "start_element_flow_element_id_key" UNIQUE using index "start_element_flow_element_id_key";

grant delete on table "public"."end_element" to "anon";

grant insert on table "public"."end_element" to "anon";

grant references on table "public"."end_element" to "anon";

grant select on table "public"."end_element" to "anon";

grant trigger on table "public"."end_element" to "anon";

grant truncate on table "public"."end_element" to "anon";

grant update on table "public"."end_element" to "anon";

grant delete on table "public"."end_element" to "authenticated";

grant insert on table "public"."end_element" to "authenticated";

grant references on table "public"."end_element" to "authenticated";

grant select on table "public"."end_element" to "authenticated";

grant trigger on table "public"."end_element" to "authenticated";

grant truncate on table "public"."end_element" to "authenticated";

grant update on table "public"."end_element" to "authenticated";

grant delete on table "public"."end_element" to "service_role";

grant insert on table "public"."end_element" to "service_role";

grant references on table "public"."end_element" to "service_role";

grant select on table "public"."end_element" to "service_role";

grant trigger on table "public"."end_element" to "service_role";

grant truncate on table "public"."end_element" to "service_role";

grant update on table "public"."end_element" to "service_role";

grant delete on table "public"."start_element" to "anon";

grant insert on table "public"."start_element" to "anon";

grant references on table "public"."start_element" to "anon";

grant select on table "public"."start_element" to "anon";

grant trigger on table "public"."start_element" to "anon";

grant truncate on table "public"."start_element" to "anon";

grant update on table "public"."start_element" to "anon";

grant delete on table "public"."start_element" to "authenticated";

grant insert on table "public"."start_element" to "authenticated";

grant references on table "public"."start_element" to "authenticated";

grant select on table "public"."start_element" to "authenticated";

grant trigger on table "public"."start_element" to "authenticated";

grant truncate on table "public"."start_element" to "authenticated";

grant update on table "public"."start_element" to "authenticated";

grant delete on table "public"."start_element" to "service_role";

grant insert on table "public"."start_element" to "service_role";

grant references on table "public"."start_element" to "service_role";

grant select on table "public"."start_element" to "service_role";

grant trigger on table "public"."start_element" to "service_role";

grant truncate on table "public"."start_element" to "service_role";

grant update on table "public"."start_element" to "service_role";

create policy "Enable all for authenticated users"
    on "public"."end_element"
    as permissive
    for all
    to authenticated
    using (true);


create policy "Enable all for authenticated users"
    on "public"."start_element"
    as permissive
    for all
    to authenticated
    using (true);