alter table "public"."profiles" add column "avatar" text;

alter table "public"."profiles" add column "is_dark_mode_enabled" boolean not null default false;

alter table "public"."profiles" add column "language" text not null default 'de'::text;

alter table "public"."statistics" add column "badges" jsonb not null default '{"badges": []}'::jsonb;