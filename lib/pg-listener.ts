import { Client } from 'pg'

export type NotifyPayload = {
    operation: 'INSERT' | 'UPDATE' | 'DELETE'
    team_id?: string
    profile_id?: string
    id?: string
    status?: string
    is_part_of?: string
    email?: string
}

type Listener = (payload: NotifyPayload) => void

const CHANNELS = [
    'role_changes',
    'profile_team_changes',
    'profile_role_team_changes',
    'flow_element_instance_changes',
    'invitation_changes',
] as const

export type NotifyChannel = (typeof CHANNELS)[number]

class PgListenerSingleton {
    private client: Client | null = null
    private listeners = new Map<NotifyChannel, Set<Listener>>()
    private connecting = false

    async getClient(): Promise<Client> {
        if (this.client) return this.client
        if (this.connecting) {
            await new Promise<void>(resolve => setTimeout(resolve, 100))
            return this.getClient()
        }
        this.connecting = true
        const client = new Client({ connectionString: process.env.DATABASE_URL })
        client.on('error', () => this.reconnect())
        await client.connect()
        for (const channel of CHANNELS) {
            await client.query(`LISTEN ${channel}`)
        }
        client.on('notification', msg => {
            const channel = msg.channel as NotifyChannel
            const payload: NotifyPayload = JSON.parse(msg.payload ?? '{}')
            this.listeners.get(channel)?.forEach(fn => fn(payload))
        })
        this.client = client
        this.connecting = false
        return client
    }

    private async reconnect() {
        this.client = null
        this.connecting = false
        await new Promise<void>(resolve => setTimeout(resolve, 2000))
        await this.getClient()
    }

    async subscribe(channel: NotifyChannel, listener: Listener): Promise<() => void> {
        await this.getClient()
        if (!this.listeners.has(channel)) {
            this.listeners.set(channel, new Set())
        }
        this.listeners.get(channel)!.add(listener)
        return () => this.listeners.get(channel)?.delete(listener)
    }
}

// Module-level singleton persists across requests in Node.js
const globalForPg = global as unknown as { pgListener?: PgListenerSingleton }
if (!globalForPg.pgListener) {
    globalForPg.pgListener = new PgListenerSingleton()
}
export const pgListener = globalForPg.pgListener
