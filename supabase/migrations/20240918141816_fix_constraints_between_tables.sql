alter table "public"."profile_role_team" drop constraint "public_profile_role_team_profile_fkey";

alter table "public"."profile_role_team" drop constraint "public_profile_role_team_team_fkey";

alter table "public"."profile_team" drop constraint "profile_team_profile_id_fkey";

alter table "public"."profile_team" drop constraint "profile_team_team_id_fkey";

alter table "public"."flow_element_instance" drop constraint "public_flow_element_instance_instance_of_fkey";

alter table "public"."process_instance" drop constraint "public_process_instance_process_model_id_fkey";

alter table "public"."process_model" drop constraint "public_process_model_belongs_to_fkey";

alter table "public"."process_model" drop constraint "public_process_model_created_by_fkey";

alter table "public"."process_model" drop constraint "public_process_model_updated_by_fkey";

alter table "public"."role" drop constraint "public_role_belongs_to_fkey";

alter table "public"."process_model" alter column "created_by" drop not null;

alter table "public"."role" alter column "color" drop default;

alter table "public"."profile_role_team" add constraint "public_profile_role_team_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile_role_team" validate constraint "public_profile_role_team_profile_id_fkey";

alter table "public"."profile_role_team" add constraint "public_profile_role_team_team_id_fkey" FOREIGN KEY (team_id) REFERENCES team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile_role_team" validate constraint "public_profile_role_team_team_id_fkey";

alter table "public"."profile_team" add constraint "public_profile_team_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile_team" validate constraint "public_profile_team_profile_id_fkey";

alter table "public"."profile_team" add constraint "public_profile_team_team_id_fkey" FOREIGN KEY (team_id) REFERENCES team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile_team" validate constraint "public_profile_team_team_id_fkey";

alter table "public"."flow_element_instance" add constraint "public_flow_element_instance_instance_of_fkey" FOREIGN KEY (instance_of) REFERENCES flow_element(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flow_element_instance" validate constraint "public_flow_element_instance_instance_of_fkey";

alter table "public"."process_instance" add constraint "public_process_instance_process_model_id_fkey" FOREIGN KEY (process_model_id) REFERENCES process_model(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."process_instance" validate constraint "public_process_instance_process_model_id_fkey";

alter table "public"."process_model" add constraint "public_process_model_belongs_to_fkey" FOREIGN KEY (belongs_to) REFERENCES team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."process_model" validate constraint "public_process_model_belongs_to_fkey";

alter table "public"."process_model" add constraint "public_process_model_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."process_model" validate constraint "public_process_model_created_by_fkey";

alter table "public"."process_model" add constraint "public_process_model_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."process_model" validate constraint "public_process_model_updated_by_fkey";

alter table "public"."role" add constraint "public_role_belongs_to_fkey" FOREIGN KEY (belongs_to) REFERENCES team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."role" validate constraint "public_role_belongs_to_fkey";

create policy "enable delete for authenticated"
    on "public"."process_model"
    as permissive
    for delete
    to authenticated
    using (true);