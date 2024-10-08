create table if not exists "public"."challenge_element" (
                                              "id" bigint generated by default as identity not null,
                                              "created_at" timestamp with time zone not null default now(),
                                              "background_color" text,
                                              "challenge_type" text,
                                              "seconds_to_complete" bigint,
                                              "reward_type" gamification_type,
                                              "flow_element_id" bigint not null,
                                              "gamification_option_id" bigint
);


alter table "public"."challenge_element" enable row level security;

alter table "public"."flow_element" add column "parent_flow_element_id" bigint;

alter table "public"."flow_element" add column "z_index" bigint;

CREATE UNIQUE INDEX challenge_element_flow_element_id_key ON public.challenge_element USING btree (flow_element_id);

CREATE UNIQUE INDEX challenge_element_pkey ON public.challenge_element USING btree (id);

alter table "public"."challenge_element" add constraint "challenge_element_pkey" PRIMARY KEY using index "challenge_element_pkey";

alter table "public"."challenge_element" add constraint "challenge_element_flow_element_id_key" UNIQUE using index "challenge_element_flow_element_id_key";

alter table "public"."challenge_element" add constraint "public_challenge_element_flow_element_id_fkey" FOREIGN KEY (flow_element_id) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."challenge_element" validate constraint "public_challenge_element_flow_element_id_fkey";

alter table "public"."challenge_element" add constraint "public_challenge_element_gamification_option_id_fkey" FOREIGN KEY (gamification_option_id) REFERENCES gamification_option(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."challenge_element" validate constraint "public_challenge_element_gamification_option_id_fkey";

alter table "public"."flow_element" add constraint "public_flow_element_parent_flow_element_id_fkey" FOREIGN KEY (parent_flow_element_id) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."flow_element" validate constraint "public_flow_element_parent_flow_element_id_fkey";

grant delete on table "public"."challenge_element" to "anon";

grant insert on table "public"."challenge_element" to "anon";

grant references on table "public"."challenge_element" to "anon";

grant select on table "public"."challenge_element" to "anon";

grant trigger on table "public"."challenge_element" to "anon";

grant truncate on table "public"."challenge_element" to "anon";

grant update on table "public"."challenge_element" to "anon";

grant delete on table "public"."challenge_element" to "authenticated";

grant insert on table "public"."challenge_element" to "authenticated";

grant references on table "public"."challenge_element" to "authenticated";

grant select on table "public"."challenge_element" to "authenticated";

grant trigger on table "public"."challenge_element" to "authenticated";

grant truncate on table "public"."challenge_element" to "authenticated";

grant update on table "public"."challenge_element" to "authenticated";

grant delete on table "public"."challenge_element" to "service_role";

grant insert on table "public"."challenge_element" to "service_role";

grant references on table "public"."challenge_element" to "service_role";

grant select on table "public"."challenge_element" to "service_role";


grant truncate on table "public"."challenge_element" to "service_role";

grant update on table "public"."challenge_element" to "service_role";

create policy "enable all for authenticated users"
    on "public"."challenge_element"
    as permissive
    for all
    to authenticated
    using (true);


CREATE TRIGGER delete_gamification_options_for_deleting_challenge_element AFTER DELETE ON public.activity_element FOR EACH STATEMENT EXECUTE FUNCTION delete_related_gamification_option_row();

alter table "public"."activity_element" add column "info_text" text;