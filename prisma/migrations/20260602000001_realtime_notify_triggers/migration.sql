-- ─── REALTIME NOTIFY TRIGGERS ───────────────────────────────────────────────
-- These triggers call pg_notify when rows change, enabling SSE-based realtime.
-- Channel names match the table names; payloads include relevant filter keys.

-- ─── role ────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_role_changes()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify('role_changes', json_build_object(
        'operation', TG_OP,
        'team_id',   COALESCE(NEW.belongs_to, OLD.belongs_to)::text,
        'id',        COALESCE(NEW.id, OLD.id)::text
    )::text);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS role_changes_trigger ON role;
CREATE TRIGGER role_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON role
FOR EACH ROW EXECUTE FUNCTION notify_role_changes();

-- ─── profile_team ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_profile_team_changes()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify('profile_team_changes', json_build_object(
        'operation',  TG_OP,
        'team_id',    COALESCE(NEW.team_id, OLD.team_id)::text,
        'profile_id', COALESCE(NEW.profile_id, OLD.profile_id)
    )::text);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profile_team_changes_trigger ON profile_team;
CREATE TRIGGER profile_team_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON profile_team
FOR EACH ROW EXECUTE FUNCTION notify_profile_team_changes();

-- ─── profile_role_team ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_profile_role_team_changes()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify('profile_role_team_changes', json_build_object(
        'operation',  TG_OP,
        'team_id',    COALESCE(NEW.team_id, OLD.team_id)::text,
        'profile_id', COALESCE(NEW.profile_id, OLD.profile_id)
    )::text);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profile_role_team_changes_trigger ON profile_role_team;
CREATE TRIGGER profile_role_team_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON profile_role_team
FOR EACH ROW EXECUTE FUNCTION notify_profile_role_team_changes();

-- ─── flow_element_instance ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_flow_element_instance_changes()
RETURNS trigger AS $$
DECLARE
    v_team_id bigint;
BEGIN
    SELECT pm.belongs_to INTO v_team_id
    FROM process_instance pi
    JOIN process_model pm ON pi.process_model_id = pm.id
    WHERE pi.id = COALESCE(NEW.is_part_of, OLD.is_part_of);

    PERFORM pg_notify('flow_element_instance_changes', json_build_object(
        'operation', TG_OP,
        'team_id',   v_team_id::text,
        'id',        COALESCE(NEW.id, OLD.id)::text,
        'status',    COALESCE(NEW.status, OLD.status)::text,
        'is_part_of',COALESCE(NEW.is_part_of, OLD.is_part_of)::text
    )::text);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS flow_element_instance_changes_trigger ON flow_element_instance;
CREATE TRIGGER flow_element_instance_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON flow_element_instance
FOR EACH ROW EXECUTE FUNCTION notify_flow_element_instance_changes();

-- ─── invitation ───────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_invitation_changes()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify('invitation_changes', json_build_object(
        'operation', TG_OP,
        'team_id',   COALESCE(NEW.team_id, OLD.team_id)::text,
        'email',     COALESCE(NEW.email, OLD.email)
    )::text);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS invitation_changes_trigger ON invitation;
CREATE TRIGGER invitation_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON invitation
FOR EACH ROW EXECUTE FUNCTION notify_invitation_changes();
