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
          description: string | null
          flow_element_id: number
          gamification_option_id: number | null
          gamification_type: Database["public"]["Enums"]["gamification_type"]
          id: number
          info_text: string | null
          input_regex: string | null
          next_flow_element_id: number | null
          task: string | null
          variable_name: string | null
        }
        Insert: {
          activity_type?: string | null
          choices?: string | null
          created_at?: string
          description?: string | null
          flow_element_id: number
          gamification_option_id?: number | null
          gamification_type?: Database["public"]["Enums"]["gamification_type"]
          id?: number
          info_text?: string | null
          input_regex?: string | null
          next_flow_element_id?: number | null
          task?: string | null
          variable_name?: string | null
        }
        Update: {
          activity_type?: string | null
          choices?: string | null
          created_at?: string
          description?: string | null
          flow_element_id?: number
          gamification_option_id?: number | null
          gamification_type?: Database["public"]["Enums"]["gamification_type"]
          id?: number
          info_text?: string | null
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
      challenge_element: {
        Row: {
          background_color: string | null
          challenge_type: string | null
          created_at: string
          flow_element_id: number
          gamification_option_id: number | null
          id: number
          reward_type: Database["public"]["Enums"]["gamification_type"] | null
          seconds_to_complete: number | null
        }
        Insert: {
          background_color?: string | null
          challenge_type?: string | null
          created_at?: string
          flow_element_id: number
          gamification_option_id?: number | null
          id?: number
          reward_type?: Database["public"]["Enums"]["gamification_type"] | null
          seconds_to_complete?: number | null
        }
        Update: {
          background_color?: string | null
          challenge_type?: string | null
          created_at?: string
          flow_element_id?: number
          gamification_option_id?: number | null
          id?: number
          reward_type?: Database["public"]["Enums"]["gamification_type"] | null
          seconds_to_complete?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_challenge_element_flow_element_id_fkey"
            columns: ["flow_element_id"]
            isOneToOne: true
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_challenge_element_gamification_option_id_fkey"
            columns: ["gamification_option_id"]
            isOneToOne: false
            referencedRelation: "gamification_option"
            referencedColumns: ["id"]
          },
        ]
      }
      data_object_instance: {
        Row: {
          created_at: string
          id: number
          is_part_of: number
          name: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_part_of: number
          name: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          id?: number
          is_part_of?: number
          name?: string
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "public_data_object_instance_is_part_of_fkey"
            columns: ["is_part_of"]
            isOneToOne: false
            referencedRelation: "process_instance"
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
          data: Json
          execution_mode: Database["public"]["Enums"]["execution_mode"]
          execution_url: string | null
          height: number | null
          id: number
          model_id: number
          parent_flow_element_id: number | null
          position_x: number
          position_y: number
          type: Database["public"]["Enums"]["node_type"]
          width: number | null
          z_index: number | null
        }
        Insert: {
          created_at?: string
          data: Json
          execution_mode: Database["public"]["Enums"]["execution_mode"]
          execution_url?: string | null
          height?: number | null
          id?: number
          model_id: number
          parent_flow_element_id?: number | null
          position_x: number
          position_y: number
          type: Database["public"]["Enums"]["node_type"]
          width?: number | null
          z_index?: number | null
        }
        Update: {
          created_at?: string
          data?: Json
          execution_mode?: Database["public"]["Enums"]["execution_mode"]
          execution_url?: string | null
          height?: number | null
          id?: number
          model_id?: number
          parent_flow_element_id?: number | null
          position_x?: number
          position_y?: number
          type?: Database["public"]["Enums"]["node_type"]
          width?: number | null
          z_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_flow_element_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "process_model"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_flow_element_parent_flow_element_id_fkey"
            columns: ["parent_flow_element_id"]
            isOneToOne: false
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_element_instance: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: number
          instance_of: number
          is_part_of: number
          status: Database["public"]["Enums"]["flow_element_instance_status"]
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: number
          instance_of: number
          is_part_of: number
          status?: Database["public"]["Enums"]["flow_element_instance_status"]
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: number
          instance_of?: number
          is_part_of?: number
          status?: Database["public"]["Enums"]["flow_element_instance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "public_flow_element_instance_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_flow_element_instance_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_flow_element_instance_instance_of_fkey"
            columns: ["instance_of"]
            isOneToOne: false
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_flow_element_instance_is_part_of_fkey"
            columns: ["is_part_of"]
            isOneToOne: false
            referencedRelation: "process_instance"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_event_element: {
        Row: {
          created_at: string
          flow_element_id: number
          gamification_option_id: number | null
          gamification_type: Database["public"]["Enums"]["gamification_type"]
          id: number
          next_flow_element_id: number | null
        }
        Insert: {
          created_at?: string
          flow_element_id: number
          gamification_option_id?: number | null
          gamification_type: Database["public"]["Enums"]["gamification_type"]
          id?: number
          next_flow_element_id?: number | null
        }
        Update: {
          created_at?: string
          flow_element_id?: number
          gamification_option_id?: number | null
          gamification_type?: Database["public"]["Enums"]["gamification_type"]
          id?: number
          next_flow_element_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_gamification_event_element_flow_element_id_fkey"
            columns: ["flow_element_id"]
            isOneToOne: true
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_gamification_event_element_gamification_option_id_fkey"
            columns: ["gamification_option_id"]
            isOneToOne: false
            referencedRelation: "gamification_option"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_gamification_event_element_next_flow_element_id_fkey"
            columns: ["next_flow_element_id"]
            isOneToOne: false
            referencedRelation: "flow_element"
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
      gateway_element: {
        Row: {
          comparison: Database["public"]["Enums"]["comparisons"]
          created_at: string
          flow_element_id: number
          id: number
          next_flow_element_false_id: number | null
          next_flow_element_true_id: number | null
          value1: string
          value2: string
        }
        Insert: {
          comparison: Database["public"]["Enums"]["comparisons"]
          created_at?: string
          flow_element_id: number
          id?: number
          next_flow_element_false_id?: number | null
          next_flow_element_true_id?: number | null
          value1: string
          value2: string
        }
        Update: {
          comparison?: Database["public"]["Enums"]["comparisons"]
          created_at?: string
          flow_element_id?: number
          id?: number
          next_flow_element_false_id?: number | null
          next_flow_element_true_id?: number | null
          value1?: string
          value2?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_gateway_element_flow_element_id_fkey"
            columns: ["flow_element_id"]
            isOneToOne: true
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_gateway_element_next_flow_element_false_fkey"
            columns: ["next_flow_element_false_id"]
            isOneToOne: false
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_gateway_element_next_flow_element_true_fkey"
            columns: ["next_flow_element_true_id"]
            isOneToOne: false
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation: {
        Row: {
          created_at: string
          email: string
          id: number
          team_id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          team_id: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "invitation_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      process_instance: {
        Row: {
          completed_at: string | null
          created_at: string
          id: number
          process_model_id: number
          status: Database["public"]["Enums"]["process_instance_status"]
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: number
          process_model_id: number
          status?: Database["public"]["Enums"]["process_instance_status"]
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: number
          process_model_id?: number
          status?: Database["public"]["Enums"]["process_instance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "public_process_instance_process_model_id_fkey"
            columns: ["process_model_id"]
            isOneToOne: false
            referencedRelation: "process_model"
            referencedColumns: ["id"]
          },
        ]
      }
      process_model: {
        Row: {
          belongs_to: number
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          belongs_to: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          belongs_to?: number
          created_at?: string
          created_by?: string | null
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
            foreignKeyName: "public_process_model_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_process_model_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_process_model_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_role_team: {
        Row: {
          created_at: string
          id: number
          profile_id: string
          role_id: number
          team_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id: string
          role_id: number
          team_id: number
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string
          role_id?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_profile_role_team_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profile_role_team_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_profile_role_team_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "public_profile_role_team_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profile_role_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_team: {
        Row: {
          created_at: string
          id: number
          profile_id: string
          team_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id: string
          team_id: number
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_profile_team_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profile_team_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_profile_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_dark_mode_enabled: boolean
          language: string
          updated_at: string | null
          updated_by: string | null
          username: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_dark_mode_enabled?: boolean
          language?: string
          updated_at?: string | null
          updated_by?: string | null
          username: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_dark_mode_enabled?: boolean
          language?: string
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
            foreignKeyName: "public_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
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
          {
            foreignKeyName: "public_profiles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      role: {
        Row: {
          belongs_to: number
          color: string
          created_at: string
          id: number
          name: string
          pages: Json
        }
        Insert: {
          belongs_to: number
          color: string
          created_at?: string
          id?: number
          name: string
          pages?: Json
        }
        Update: {
          belongs_to?: number
          color?: string
          created_at?: string
          id?: number
          name?: string
          pages?: Json
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
      statistics: {
        Row: {
          badges: Json
          belongs_to: number
          coins: number | null
          created_at: string
          experience: number | null
          id: number
          profile_id: string
        }
        Insert: {
          badges?: Json
          belongs_to: number
          coins?: number | null
          created_at?: string
          experience?: number | null
          id?: number
          profile_id: string
        }
        Update: {
          badges?: Json
          belongs_to?: number
          coins?: number | null
          created_at?: string
          experience?: number | null
          id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_statistics_belongs_to_fkey"
            columns: ["belongs_to"]
            isOneToOne: false
            referencedRelation: "profile_team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_statistics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_statistics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      team: {
        Row: {
          color_scheme: Json | null
          created_at: string
          created_by: string
          id: number
          name: string
        }
        Insert: {
          color_scheme?: Json | null
          created_at?: string
          created_by: string
          id?: number
          name: string
        }
        Update: {
          color_scheme?: Json | null
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
          {
            foreignKeyName: "public_team_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles_with_roles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      manual_task: {
        Row: {
          assigned_role: string | null
          belongs_to: number | null
          completed_at: string | null
          created_at: string | null
          data: Json | null
          execution_url: string | null
          id: number | null
          instance_of: number | null
          is_part_of: number | null
          status:
            | Database["public"]["Enums"]["flow_element_instance_status"]
            | null
          type: Database["public"]["Enums"]["node_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "public_flow_element_instance_instance_of_fkey"
            columns: ["instance_of"]
            isOneToOne: false
            referencedRelation: "flow_element"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_flow_element_instance_is_part_of_fkey"
            columns: ["is_part_of"]
            isOneToOne: false
            referencedRelation: "process_instance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_process_model_belongs_to_fkey"
            columns: ["belongs_to"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_with_roles: {
        Row: {
          email: string | null
          profile_id: string | null
          role_color: string | null
          role_id: number | null
          role_name: string | null
          team_id: number | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_profile_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_invite: {
        Args: {
          invitation_id_param: number
          profile_id_param: string
        }
        Returns: undefined
      }
      add_profile_to_team: {
        Args: {
          profile_id_param: number
          team_id_param: number
        }
        Returns: undefined
      }
      add_role: {
        Args: {
          name_param: string
          color_param: string
          belongs_to_param: number
          pages_param: Json
        }
        Returns: number
      }
      apply_gamification: {
        Args: {
          profile_id_param: string
          flow_element_instance_id_param: number
        }
        Returns: undefined
      }
      complete_flow_element_instance: {
        Args: {
          flow_element_instance_id_param: number
          output_data: Json
          completed_by_param: string
        }
        Returns: boolean
      }
      create_invitation: {
        Args: {
          email_param: string
          team_id_param: number
        }
        Returns: number
      }
      create_process_instance: {
        Args: {
          process_model_id_param: number
          inputs_param: Json
        }
        Returns: number
      }
      create_process_model: {
        Args: {
          belongs_to_param: number
          name_param: string
          description_param: string
          created_by_param: string
        }
        Returns: number
      }
      create_team_and_add_creator_as_admin: {
        Args: {
          creator_profile_id: string
          team_name: string
          color_scheme: Json
        }
        Returns: number
      }
      remove_profile_from_team:
        | {
            Args: {
              profile_id_param: number
              team_id_param: number
            }
            Returns: undefined
          }
        | {
            Args: {
              profile_id_param: string
              team_id_param: number
            }
            Returns: undefined
          }
      remove_role: {
        Args: {
          role_id: number
        }
        Returns: undefined
      }
      replace_with_variable_values: {
        Args: {
          data: Json
          process_instance_id: number
        }
        Returns: Json
      }
      update_profiles_roles_in_team: {
        Args: {
          team_id_param: number
          profile_id_param: string
          role_ids_param: number[]
        }
        Returns: undefined
      }
    }
    Enums: {
      comparisons: "==" | "!=" | ">" | ">=" | "<" | "<="
      execution_mode: "Manual" | "Automatic"
      flow_element_instance_status:
        | "Created"
        | "Todo"
        | "In Progress"
        | "Completed"
      flow_element_instance_status__old_version_to_be_dropped:
        | "Created"
        | "In Progress"
        | "Completed"
      gamification_type: "None" | "Points" | "Badges"
      node_type:
        | "challengeNode"
        | "activityNode"
        | "gatewayNode"
        | "startNode"
        | "endNode"
        | "infoNode"
        | "gamificationEventNode"
      page: "Editor" | "Tasks" | "Monitoring" | "Team" | "Stats"
      point_type: "Experience" | "Coins"
      points_application_method: "setTo" | "incrementBy" | "decrementBy"
      process_instance_status: "Running" | "Completed" | "Error"
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

