import { auth } from '@/auth'
import { subscribe, userTopic, ADMIN_TOPIC } from '@/lib/realtime'

// Long-lived streaming connection — must run on the Node runtime and never be
// statically cached.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Server-Sent Events stream. The browser opens this once (via EventSource) and
 * keeps it open; whenever a relevant change is published to the in-memory bus,
 * we push a `refresh` event and the client calls router.refresh().
 *
 * Each connection only listens to the topics that concern the logged-in user:
 *   - their own `user:<id>` topic
 *   - plus the global `admin` topic if they are an admin
 */
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const myTopics = new Set<string>([userTopic(session.user.id)])
  if (session.user.role === 'admin') myTopics.add(ADMIN_TOPIC)

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false
      const safeEnqueue = (chunk: string) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(chunk))
        } catch {
          closed = true
        }
      }

      const send = (data: unknown) => safeEnqueue(`data: ${JSON.stringify(data)}\n\n`)

      // Initial handshake so the client knows the stream is live.
      send({ type: 'connected' })

      const unsubscribe = subscribe((msg) => {
        if (myTopics.has(msg.topic)) {
          send({ type: 'refresh', topic: msg.topic, at: msg.at })
        }
      })

      // Connection-level keepalive (a comment line, not a data event). Prevents
      // intermediary proxies from dropping an otherwise-idle connection. This is
      // NOT data polling — no DB or page work happens here.
      const keepAlive = setInterval(() => safeEnqueue(`: ping\n\n`), 25_000)

      const cleanup = () => {
        if (closed) return
        closed = true
        clearInterval(keepAlive)
        unsubscribe()
        try {
          controller.close()
        } catch {
          // already closed
        }
      }

      // Clean up when the client disconnects.
      req.signal.addEventListener('abort', cleanup)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Disable response buffering on proxies like nginx.
      'X-Accel-Buffering': 'no',
    },
  })
}
