create or replace view "public"."manual_task" as
SELECT flow_element_instance.id,
       flow_element_instance.created_at,
       flow_element_instance.instance_of,
       flow_element_instance.status,
       flow_element_instance.is_part_of,
       flow_element_instance.completed_at,
       process_model.belongs_to,
       flow_element.type,
       flow_element.execution_url,
       flow_element.data,
       (flow_element.data->>'assignedRole') as assigned_role
FROM (((flow_element_instance
    JOIN flow_element ON ((flow_element_instance.instance_of = flow_element.id)))
    JOIN process_instance ON ((flow_element_instance.is_part_of = process_instance.id)))
    JOIN process_model ON ((process_instance.process_model_id = process_model.id)))
WHERE (flow_element.execution_mode = 'Manual'::execution_mode);


drop policy "enable delete for everybody" on "public"."role";

create policy "enable delete for everybody"
    on "public"."role"
    as permissive
    for delete
    to authenticated
    using (true);

