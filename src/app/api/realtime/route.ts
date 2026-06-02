import { NextRequest } from 'next/server'
import { pgListener, NotifyChannel, NotifyPayload } from '@/lib/pg-listener'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const channels = (searchParams.get('channels') ?? '').split(',').filter(Boolean) as NotifyChannel[]
    const teamId = searchParams.get('teamId') ?? undefined
    const email = searchParams.get('email') ?? undefined
    const profileId = searchParams.get('profileId') ?? undefined

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: object) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
            }

            // Send initial heartbeat so the browser knows the connection is alive
            send({ type: 'connected' })

            const unsubscribers: (() => void)[] = []

            for (const channel of channels) {
                const unsub = await pgListener.subscribe(channel, (payload: NotifyPayload) => {
                    if (teamId && payload.team_id && payload.team_id !== teamId) return
                    if (email && payload.email && payload.email !== email) return
                    if (profileId && payload.profile_id && payload.profile_id !== profileId) return
                    send({ channel, ...payload })
                })
                unsubscribers.push(unsub)
            }

            req.signal.addEventListener('abort', () => {
                unsubscribers.forEach(fn => fn())
                controller.close()
            })
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    })
}
