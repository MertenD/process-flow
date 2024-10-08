create type "public"."comparisons" as enum ('==', '!=', '>', '>=', '<', '<=');

create type "public"."gamification_type" as enum ('None', 'Points', 'Badges');

create type "public"."node_type" as enum ('challengeNode', 'activityNode', 'gatewayNode', 'startNode', 'endNode', 'infoNode', 'gamificationEventNode');

create type "public"."point_type" as enum ('Experience', 'Coins');

create type "public"."points_application_method" as enum ('setTo', 'incrementBy', 'decrementBy');

create table "public"."gamification_option" (
                                                "id" bigint generated by default as identity not null,
                                                "created_at" timestamp with time zone not null default now(),
                                                "point_type" point_type,
                                                "points_application_method" points_application_method,
                                                "points_for_success" character varying,
                                                "has_condition" boolean,
                                                "value1" text,
                                                "comparison" comparisons,
                                                "value2" text,
                                                "badge_type" character varying
);


alter table "public"."gamification_option" enable row level security;

alter table "public"."activity_element" add column "gamification_option_id" bigint;

alter table "public"."activity_element" add column "gamification_type" gamification_type not null default 'None'::gamification_type;

alter table "public"."flow_element" alter column "type" set data type node_type using "type"::node_type;

CREATE UNIQUE INDEX gamification_option_pkey ON public.gamification_option USING btree (id);

alter table "public"."gamification_option" add constraint "gamification_option_pkey" PRIMARY KEY using index "gamification_option_pkey";

alter table "public"."activity_element" add constraint "public_activity_element_gamification_option_id_fkey" FOREIGN KEY (gamification_option_id) REFERENCES gamification_option(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."activity_element" validate constraint "public_activity_element_gamification_option_id_fkey";

grant delete on table "public"."gamification_option" to "anon";

grant insert on table "public"."gamification_option" to "anon";

grant references on table "public"."gamification_option" to "anon";

grant select on table "public"."gamification_option" to "anon";

grant trigger on table "public"."gamification_option" to "anon";

grant truncate on table "public"."gamification_option" to "anon";

grant update on table "public"."gamification_option" to "anon";

grant delete on table "public"."gamification_option" to "authenticated";

grant insert on table "public"."gamification_option" to "authenticated";

grant references on table "public"."gamification_option" to "authenticated";

grant select on table "public"."gamification_option" to "authenticated";

grant trigger on table "public"."gamification_option" to "authenticated";

grant truncate on table "public"."gamification_option" to "authenticated";

grant update on table "public"."gamification_option" to "authenticated";

grant delete on table "public"."gamification_option" to "service_role";

grant insert on table "public"."gamification_option" to "service_role";

grant references on table "public"."gamification_option" to "service_role";

grant select on table "public"."gamification_option" to "service_role";

grant trigger on table "public"."gamification_option" to "service_role";


grant update on table "public"."gamification_option" to "service_role";

create policy "Enable all for authenticated users"
    on "public"."gamification_option"
    as permissive
    for all
    to authenticated
    using (true);