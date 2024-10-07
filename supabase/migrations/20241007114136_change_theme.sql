create type "public"."theme" as enum ('light', 'dark', 'system');

alter table "public"."profiles" drop column "is_dark_mode_enabled";

alter table "public"."profiles" add column "theme" theme not null default 'system'::theme;
