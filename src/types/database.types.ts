import { MergeDeep } from 'type-fest'
import { Database as DatabaseGenerated } from './database-generated.types'

export type { Json } from './database-generated.types'

// Example
// Override the type for a specific column in a view:
export type Database = MergeDeep<
    DatabaseGenerated,
    {
        public: {
            Views: {
                manual_task: {
                    Row: {
                        // id is a primary key in public.movies, so it must be `not null`
                        id: number
                    }
                }
            }
        }
    }
>
// End of example

export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row']

export type Views<T extends keyof Database['public']['Views']> =
    Database['public']['Views'][T]['Row']

export type Profile = Tables<'profiles'>

export type ManualTask = Views<'manual_task'>
export type ManualTaskWithTitleAndDescription = MergeDeep<ManualTask, { name: string, description: string }>

export type ProcessModel = Tables<'process_model'>

export type ProcessInstance = Tables<"process_instance">

export type FlowElement = Tables<"flow_element">

export type FlowElementInstance = Tables<"flow_element_instance">

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type ProcessModelInstanceState = Enums<"process_instance_status">