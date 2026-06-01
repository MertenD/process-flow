// Domain types derived from Prisma-generated types and manual definitions.
// Replaces the previous Supabase-generated types.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ─── Table row types (mirror final DB schema) ────────────────────────────────

export type Profile = {
    id: string
    name: string
    email: string
    username: string | null
    avatar: string | null
    is_dark_mode_enabled: boolean
    language: string
    theme: string
    created_at: string
    updated_at: string
}

export type Team = {
    id: number
    created_at: string
    name: string
    created_by: string
    color_scheme: { from: string; to: string } | null
}

export type Role = {
    id: number
    created_at: string
    name: string
    belongs_to: number
    color: string
    pages: { allowed_pages: string[] }
}

export type RoleWithAllowedPages = Role & { allowed_pages: Page[] }

export type Invitation = {
    id: number
    created_at: string
    email: string
    team_id: number
}

export type InvitationWithTeam = Invitation & { team: Team }

export type ProcessModel = {
    id: number
    created_at: string
    name: string
    description: string | null
    created_by: string | null
    updated_by: string | null
    updated_at: string | null
    belongs_to: number
}

export type ProcessInstance = {
    id: number
    created_at: string
    process_model_id: number
    status: ProcessModelInstanceState
    completed_at: string | null
}

export type FlowElement = {
    id: number
    created_at: string
    type: string
    model_id: number
    position_x: number
    position_y: number
    width: number | null
    height: number | null
    data: Json | null
    parent_flow_element_id: number | null
    z_index: number | null
    execution_url: string | null
}

export type FlowElementInstance = {
    id: number
    created_at: string
    instance_of: number
    status: FlowElementInstanceState
    is_part_of: number
    completed_at: string | null
    completed_by: string | null
    status_message: string | null
}

export type Statistics = {
    id: number
    created_at: string
    experience: number
    coins: number
    profile_id: string
    team_id: number
    badges: { badges: string[] }
}

// ─── View types ───────────────────────────────────────────────────────────────

export type ProfilesWithRoles = {
    profile_id: string
    email: string
    username: string | null
    team_id: number
    role_id: number | null
    role_name: string | null
    role_color: string | null
}

export type ManualTask = {
    id: number
    created_at: string
    instance_of: number
    status: FlowElementInstanceState
    is_part_of: number
    completed_at: string | null
    completed_by: string | null
    belongs_to: number
    type: string
    execution_url: string | null
    data: Json | null
    assigned_role: string | null
}

export type ManualTaskWithOutputs = ManualTask & {
    name: string
    description: string
    outputs: { [key: string]: string }
}

// ─── Enum types ───────────────────────────────────────────────────────────────

export type ProcessModelInstanceState = "Running" | "Completed" | "Error"

export type FlowElementInstanceState = "Created" | "Todo" | "In Progress" | "Completed" | "Error"

export type Page = "Editor" | "Tasks" | "Monitoring" | "Team" | "Stats" | "Shop"

export type ExecutionMode = "Manual" | "Automatic"

export type NodeDefinitionVisibility = "Public" | "Team"

export type Theme = string  // "light" | "dark" | "system"

export type TeamColorScheme = {
    from: string
    to: string
}
