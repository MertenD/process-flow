drop view if exists "public"."manual_task";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_manual_tasks_with_replaced_data(team_id bigint, user_role_ids bigint[])
    RETURNS jsonb
    LANGUAGE plpgsql
AS $function$DECLARE
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
                 execution_url,
                 completed_by
             FROM manual_task,
                  LATERAL replace_with_variable_values(data, is_part_of) AS replaced_data
             WHERE belongs_to = team_id AND assigned_role::bigint = ANY(user_role_ids)
         ) t;

    RETURN tasks;
END;$function$
;

create or replace view "public"."manual_task" as  SELECT flow_element_instance.id,
                                                         flow_element_instance.created_at,
                                                         flow_element_instance.instance_of,
                                                         flow_element_instance.status,
                                                         flow_element_instance.is_part_of,
                                                         flow_element_instance.completed_at,
                                                         flow_element_instance.completed_by,
                                                         process_model.belongs_to,
                                                         flow_element.type,
                                                         flow_element.execution_url,
                                                         flow_element.data,
                                                         (flow_element.data ->> 'assignedRole'::text) AS assigned_role
                                                  FROM (((flow_element_instance
                                                      JOIN flow_element ON ((flow_element_instance.instance_of = flow_element.id)))
                                                      JOIN process_instance ON ((flow_element_instance.is_part_of = process_instance.id)))
                                                      JOIN process_model ON ((process_instance.process_model_id = process_model.id)))
                                                  WHERE (flow_element.execution_mode = 'Manual'::execution_mode);
