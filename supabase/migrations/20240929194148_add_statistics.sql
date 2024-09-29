create table "public"."statistics" (
                                       "id" bigint generated by default as identity not null,
                                       "created_at" timestamp with time zone not null default now(),
                                       "experience" bigint,
                                       "coins" bigint,
                                       "belongs_to" bigint not null
);


alter table "public"."statistics" enable row level security;

CREATE UNIQUE INDEX "statistics_pkey" ON public."statistics" USING btree (id);

alter table "public"."statistics" add constraint "statistics_pkey" PRIMARY KEY using index "statistics_pkey";

alter table "public"."statistics" add constraint "public_statistics_belongs_to_fkey" FOREIGN KEY (belongs_to) REFERENCES profile_team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."statistics" validate constraint "public_statistics_belongs_to_fkey";

grant delete on table "public"."statistics" to "anon";

grant insert on table "public"."statistics" to "anon";

grant references on table "public"."statistics" to "anon";

grant select on table "public"."statistics" to "anon";

grant trigger on table "public"."statistics" to "anon";

grant truncate on table "public"."statistics" to "anon";

grant update on table "public"."statistics" to "anon";

grant delete on table "public"."statistics" to "authenticated";

grant insert on table "public"."statistics" to "authenticated";

grant references on table "public"."statistics" to "authenticated";

grant select on table "public"."statistics" to "authenticated";

grant trigger on table "public"."statistics" to "authenticated";

grant truncate on table "public"."statistics" to "authenticated";

grant update on table "public"."statistics" to "authenticated";

grant delete on table "public"."statistics" to "service_role";

grant insert on table "public"."statistics" to "service_role";

grant references on table "public"."statistics" to "service_role";

grant select on table "public"."statistics" to "service_role";

grant trigger on table "public"."statistics" to "service_role";

grant truncate on table "public"."statistics" to "service_role";

grant update on table "public"."statistics" to "service_role";
