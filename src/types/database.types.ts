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
                movies_view: {
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