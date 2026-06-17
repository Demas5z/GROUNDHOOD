/**
 * Self-hosted ongkir (shipping-cost) calculator — fully free, no external API.
 *
 * Model: distance from the store (lib/store-config STORE_CONFIG.origin) to the
 * buyer's destination via the haversine great-circle formula, priced with a
 * decreasing per-km tariff. A flat per-km rate is unrealistic across an
 * archipelago (it would make long-haul absurd), so we use bracketed marginal
 * rates that taper with distance — mirroring how JNE/J&T REG actually behave:
 *
 *   Bandung  (~120 km)  → ~Rp 20.000
 *   Surabaya (~660 km)  → ~Rp 36.000
 *   Makassar (~1.450 km)→ ~Rp 50.000
 *   Medan    (~1.400 km)→ ~Rp 50.000
 *
 * Orders at or above FREE_SHIPPING_THRESHOLD ship free.
 */
import { STORE_CONFIG } from '@/lib/store-config'
import { resolveCoordinate } from '@/lib/regions'

export const FREE_SHIPPING_THRESHOLD = 300_000

/** Base handling fare; covers the first BASE_DISTANCE_KM. */
export const BASE_FARE = 10_000
const BASE_DISTANCE_KM = 25

/** Marginal Rp/km brackets (cumulative, like tax brackets). */
const RATE_BRACKETS: { upToKm: number; ratePerKm: number }[] = [
  { upToKm: 150, ratePerKm: 100 },
  { upToKm: 700, ratePerKm: 25 },
  { upToKm: 1500, ratePerKm: 18 },
  { upToKm: Infinity, ratePerKm: 12 },
]

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

/** Great-circle distance between two coordinates in kilometres. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371 // Earth radius, km
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Raw distance cost (before free-shipping / rounding) for a given distance. */
export function distanceCost(distanceKm: number): number {
  let remaining = Math.max(0, distanceKm - BASE_DISTANCE_KM)
  let prevCap = BASE_DISTANCE_KM
  let cost = BASE_FARE
  for (const { upToKm, ratePerKm } of RATE_BRACKETS) {
    if (remaining <= 0) break
    const span = Math.min(remaining, upToKm - prevCap)
    cost += span * ratePerKm
    remaining -= span
    prevCap = upToKm
  }
  // Round up to the nearest Rp 500 for tidy invoice amounts.
  return Math.ceil(cost / 500) * 500
}

/** Rough delivery estimate text based on distance. */
function estimateEtd(distanceKm: number): string {
  if (distanceKm <= 60) return '1–2 hari'
  if (distanceKm <= 300) return '2–3 hari'
  if (distanceKm <= 800) return '3–5 hari'
  if (distanceKm <= 1600) return '4–7 hari'
  return '5–10 hari'
}

export type ShippingQuote = {
  /** Final ongkir charged to the customer (Rp). */
  cost: number
  /** True when the order qualifies for free shipping. */
  free: boolean
  /** Distance store → destination, rounded to whole km. */
  distanceKm: number
  /** Human-readable delivery estimate. */
  etd: string
}

/**
 * Quote shipping for a destination province/city and current subtotal.
 * Returns null when the destination cannot be resolved (invalid province).
 */
export function quoteShipping(params: {
  provinceId: string
  cityName?: string
  subtotal: number
}): ShippingQuote | null {
  const dest = resolveCoordinate(params.provinceId, params.cityName)
  if (!dest) return null

  const distanceKm = haversineKm(STORE_CONFIG.origin, dest)
  const roundedKm = Math.round(distanceKm)
  const etd = estimateEtd(distanceKm)

  if (params.subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { cost: 0, free: true, distanceKm: roundedKm, etd }
  }
  return { cost: distanceCost(distanceKm), free: false, distanceKm: roundedKm, etd }
}
