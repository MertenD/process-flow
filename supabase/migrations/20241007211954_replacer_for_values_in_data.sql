CREATE OR REPLACE FUNCTION public.replace_with_variable_values(data jsonb, process_instance_id bigint)
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$DECLARE
    key text;
    value_ text;
    new_value text;
    placeholder text;
    placeholder_value text;
BEGIN
    FOR key, value_ IN SELECT * FROM jsonb_each_text(data) LOOP
            WHILE value_ LIKE '%{%' LOOP
                    placeholder := substring(value_ FROM '\{[^}]+\}');
                    SELECT doi.value INTO placeholder_value
                    FROM data_object_instance doi
                    WHERE doi.is_part_of = process_instance_id AND doi.name = substring(placeholder, 2, length(placeholder) - 2);

                    IF placeholder_value IS NOT NULL THEN
                        placeholder_value := trim(both '"' from placeholder_value);
                        value_ := replace(value_, placeholder, placeholder_value);
                    ELSE
                        EXIT;
                    END IF;
                END LOOP;
            data := jsonb_set(data, array[key], to_jsonb(value_));
        END LOOP;

    RETURN data;
END;$function$
;

create or replace function get_manual_tasks_with_replaced_data(team_id bigint, user_role_ids bigint[]) returns jsonb
    language plpgsql
as
$$
DECLARE
    tasks jsonb;
BEGIN
    -- Fetch the manual tasks with replaced data
    SELECT jsonb_agg(t)
    INTO tasks
    FROM (
             SELECT
                 *,
                 replaced_data->'task' AS name,
                 replaced_data->'description' AS description,
                 replaced_data AS data,
                 data->'outputs' AS outputs
             FROM manual_task,
                  LATERAL replace_with_variable_values(data, is_part_of) AS replaced_data
             WHERE belongs_to = team_id AND assigned_role::bigint = ANY(user_role_ids)
         ) t;

    RETURN tasks;
END;
$$;

alter function get_manual_tasks_with_replaced_data(bigint, bigint[]) owner to postgres;

grant execute on function get_manual_tasks_with_replaced_data(bigint, bigint[]) to anon;

grant execute on function get_manual_tasks_with_replaced_data(bigint, bigint[]) to authenticated;

grant execute on function get_manual_tasks_with_replaced_data(bigint, bigint[]) to service_role;


