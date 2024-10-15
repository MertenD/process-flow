CREATE OR REPLACE FUNCTION public.get_manual_tasks_with_replaced_data(team_id bigint, user_role_ids bigint[])
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$
DECLARE
    tasks jsonb;
BEGIN
    -- Fetch the manual tasks with replaced data
    SELECT jsonb_agg(t)
    INTO tasks
    FROM (
             SELECT
                 id,
                 replaced_data AS data,
                 replaced_data->'task' AS name,
                 replaced_data->'description' AS description,
                 replaced_data->'outputs' AS outputs,
                 type,
                 status,
                 belongs_to,
                 created_at,
                 is_part_of,
                 instance_of,
                 completed_at,
                 assigned_role,
                 execution_url
             FROM manual_task,
                  LATERAL replace_with_variable_values(data, is_part_of) AS replaced_data
             WHERE belongs_to = team_id AND assigned_role::bigint = ANY(user_role_ids)
         ) t;

    RETURN tasks;
END;
$function$
;

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
            IF jsonb_typeof(data -> key) = 'object' THEN
                data := jsonb_set(data, array[key], replace_with_variable_values(data -> key, process_instance_id));
            ELSE
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
            END IF;
        END LOOP;

    RETURN data;
END;$function$
;
