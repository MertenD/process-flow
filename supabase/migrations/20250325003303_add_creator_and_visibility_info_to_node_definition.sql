create type "public"."node_definition_visibility" as enum ('Public', 'Team');

alter table "public"."node_definition" add column "created_by" uuid;

alter table "public"."node_definition" add column "team_id" bigint;

alter table "public"."node_definition" add column "visibility" node_definition_visibility not null default 'Team'::node_definition_visibility;

alter table "public"."node_definition" add constraint "public_node_definition_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."node_definition" validate constraint "public_node_definition_created_by_fkey";

alter table "public"."node_definition" add constraint "public_node_definition_team_id_fkey" FOREIGN KEY (team_id) REFERENCES team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."node_definition" validate constraint "public_node_definition_team_id_fkey";
