set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_related_gamification_option_row()
    RETURNS trigger
    LANGUAGE plpgsql
AS $function$BEGIN
    DELETE FROM gamification_option WHERE id = OLD.gamification_option_id;
    RETURN OLD;
END;$function$
;

CREATE TRIGGER delete_gamification_options_for_delete_of_activity_flow_element AFTER DELETE ON public.activity_element FOR EACH ROW EXECUTE FUNCTION delete_related_gamification_option_row();

CREATE TRIGGER delete_gamification_options_for_delete_of_gamification_event_el AFTER DELETE ON public.gamification_event_element FOR EACH ROW EXECUTE FUNCTION delete_related_gamification_option_row();