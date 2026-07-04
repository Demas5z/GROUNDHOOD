import { EventEmitter } from 'events'

/**
 * In-memory realtime event bus.
 *
 * Used to push "something you care about changed" signals to connected SSE
 * clients (see app/api/realtime/route.ts). This is intentionally lightweight:
 * it only works within a SINGLE server process (local dev / single VPS). It is
 * NOT suitable for serverless / multi-instance deployments — there you'd need
 * an external broker (Pusher, Ably, Redis pub/sub).
 *
 * Topics:
 *   - `user:<userId>` — events relevant to one customer (their own orders)
 *   - `admin`         — events relevant to any admin screen (any order changes)
 */

export type RealtimeMessage = {
  topic: string
  at: number
}

// Reuse a single emitter across Next.js hot-reloads (dev) and module instances.
const globalForBus = globalThis as unknown as { __realtimeBus?: EventEmitter }

const bus = globalForBus.__realtimeBus ?? new EventEmitter()
// Many concurrent SSE connections each add a listener — lift the default cap.
bus.setMaxListeners(0)
if (!globalForBus.__realtimeBus) globalForBus.__realtimeBus = bus

const EVENT = 'msg'

/** Publish a change to one or more topics. */
export function publish(topics: string | string[]): void {
  const list = Array.isArray(topics) ? topics : [topics]
  const at = Date.now()
  for (const topic of list) {
    bus.emit(EVENT, { topic, at } satisfies RealtimeMessage)
  }
}

/** Subscribe to every published message. Returns an unsubscribe function. */
export function subscribe(listener: (msg: RealtimeMessage) => void): () => void {
  bus.on(EVENT, listener)
  return () => {
    bus.off(EVENT, listener)
  }
}

/** Build the topic name for a given customer. */
export function userTopic(userId: string): string {
  return `user:${userId}`
}

export const ADMIN_TOPIC = 'admin'
