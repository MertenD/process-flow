export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_element: {
        Row: {
          activity_type: string | null
          choices: string | null
          created_at: string
          flow_element_id: number
          gamification_option_id: number | null
          gamification_type: Database["public"]["Enums"]["gamification_type"]
          id: number
          input_regex: string | null
          next_flow_element_id: number | null
          task: string | null
          variable_name: string | null
        }
        Insert: {
          activity_type?: string | null
          choices?: string | null
          created_at?: string
          flow_element_id: number
          gamification_option_id?: number | null
          gamification_type?: Database["public"]["Enums"]["gamification_type"]
          id?: number
          input_regex?: string | null
          next_flow_element_id?: number | null
          task?: string | null
          variable_name?: string | null
        }
        Update: {
          activity_type?: string | null
          choices?: string | null
          created_at?: string
          flow_element_id?: number
          gamification_option_id?: number | null
          gamification_type?: Database["public"]["Enums"]["gamification_type"]
          id?: number
          input_regex?: string | null
          next_flow_element_id?: number | null
          task?: string | null
          variable_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_activity_element_flow_element_id_fkey"
            columns: ["flow_element_id"]
            isOneToOne: true
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_activity_element_gamification_option_id_fkey"
            columns: ["gamification_option_id"]
            isOneToOne: false
            referencedRelation: "gamification_option"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_activity_element_next_flow_element_id_fkey"
            columns: ["next_flow_element_id"]
            isOneToOne: false
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
        ]
      }
      end_element: {
        Row: {
          created_at: string
          flow_element_id: number
          id: number
        }
        Insert: {
          created_at?: string
          flow_element_id: number
          id?: number
        }
        Update: {
          created_at?: string
          flow_element_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_end_element_flow_element_id_fkey"
            columns: ["flow_element_id"]
            isOneToOne: true
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_element: {
        Row: {
          created_at: string
          height: number | null
          id: number
          model_id: number
          position_x: number
          position_y: number
          type: Database["public"]["Enums"]["node_type"]
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: number
          model_id: number
          position_x: number
          position_y: number
          type: Database["public"]["Enums"]["node_type"]
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: number
          model_id?: number
          position_x?: number
          position_y?: number
          type?: Database["public"]["Enums"]["node_type"]
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_flow_element_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "process_model"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_option: {
        Row: {
          badge_type: string | null
          comparison: Database["public"]["Enums"]["comparisons"] | null
          created_at: string
          has_condition: boolean | null
          id: number
          point_type: Database["public"]["Enums"]["point_type"] | null
          points_application_method:
            | Database["public"]["Enums"]["points_application_method"]
            | null
          points_for_success: string | null
          value1: string | null
          value2: string | null
        }
        Insert: {
          badge_type?: string | null
          comparison?: Database["public"]["Enums"]["comparisons"] | null
          created_at?: string
          has_condition?: boolean | null
          id?: number
          point_type?: Database["public"]["Enums"]["point_type"] | null
          points_application_method?:
            | Database["public"]["Enums"]["points_application_method"]
            | null
          points_for_success?: string | null
          value1?: string | null
          value2?: string | null
        }
        Update: {
          badge_type?: string | null
          comparison?: Database["public"]["Enums"]["comparisons"] | null
          created_at?: string
          has_condition?: boolean | null
          id?: number
          point_type?: Database["public"]["Enums"]["point_type"] | null
          points_application_method?:
            | Database["public"]["Enums"]["points_application_method"]
            | null
          points_for_success?: string | null
          value1?: string | null
          value2?: string | null
        }
        Relationships: []
      }
      process_model: {
        Row: {
          belongs_to: number
          created_at: string
          created_by: string
          description: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          belongs_to: number
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          belongs_to?: number
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_process_model_belongs_to_fkey"
            columns: ["belongs_to"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_process_model_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_process_model_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_role_team: {
        Row: {
          created_at: string
          id: number
          profile: string
          role: number
          team: number
        }
        Insert: {
          created_at?: string
          id?: number
          profile: string
          role: number
          team: number
        }
        Update: {
          created_at?: string
          id?: number
          profile?: string
          role?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_profile_role_team_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profile_role_team_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profile_role_team_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          updated_at: string | null
          updated_by: string | null
          username: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          username: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role: {
        Row: {
          belongs_to: number
          created_at: string
          id: number
          name: string
        }
        Insert: {
          belongs_to: number
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          belongs_to?: number
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_role_belongs_to_fkey"
            columns: ["belongs_to"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      start_element: {
        Row: {
          created_at: string
          flow_element_id: number
          id: number
          next_flow_element_id: number | null
        }
        Insert: {
          created_at?: string
          flow_element_id: number
          id?: number
          next_flow_element_id?: number | null
        }
        Update: {
          created_at?: string
          flow_element_id?: number
          id?: number
          next_flow_element_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_start_element_flow_element_id_fkey"
            columns: ["flow_element_id"]
            isOneToOne: true
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_start_element_next_flow_element_id_fkey"
            columns: ["next_flow_element_id"]
            isOneToOne: false
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          created_at: string
          created_by: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_team_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      comparisons: "==" | "!=" | ">" | ">=" | "<" | "<="
      gamification_type: "None" | "Points" | "Badges"
      node_type:
        | "challengeNode"
        | "activityNode"
        | "gatewayNode"
        | "startNode"
        | "endNode"
        | "infoNode"
        | "gamificationEventNode"
      point_type: "Experience" | "Coins"
      points_application_method: "setTo" | "incrementBy" | "decrementBy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

