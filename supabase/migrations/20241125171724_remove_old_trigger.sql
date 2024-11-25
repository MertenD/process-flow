drop trigger if exists "delete_gamification_options_for_delete_of_activity_flow_element" on "public"."activity_element";

drop trigger if exists "delete_gamification_options_for_deleting_challenge_element" on "public"."activity_element";

drop function if exists "public"."delete_related_gamification_option_row"();