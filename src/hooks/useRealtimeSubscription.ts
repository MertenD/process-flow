'use client'

import { useEffect } from 'react'
import { NotifyChannel, NotifyPayload } from '@/lib/pg-listener'

export type RealtimeEvent = NotifyPayload & { channel: NotifyChannel }

interface SubscriptionOptions {
    channels: NotifyChannel[]
    teamId?: string | number
    email?: string
    profileId?: string
    onEvent: (event: RealtimeEvent) => void
}

export function useRealtimeSubscription({ channels, teamId, email, profileId, onEvent }: SubscriptionOptions) {
    useEffect(() => {
        if (!channels.length) return

        const params = new URLSearchParams({ channels: channels.join(',') })
        if (teamId != null) params.set('teamId', String(teamId))
        if (email) params.set('email', email)
        if (profileId) params.set('profileId', profileId)

        const source = new EventSource(`/api/realtime?${params}`)
        source.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if (data.type === 'connected') return
            onEvent(data as RealtimeEvent)
        }
        source.onerror = () => source.close()

        return () => source.close()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels.join(','), String(teamId), email, profileId])
}
