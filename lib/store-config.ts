/**
 * Central GROUNDHOOD store / company configuration.
 *
 * This is the single source of truth for the official store address and the
 * origin coordinates used by the shipping-cost calculator (lib/shipping.ts).
 * Update the address here and it propagates everywhere (About, Contact, ongkir).
 */
export const STORE_CONFIG = {
  name: 'GROUNDHOOD',
  /** Official company address — used for company info & as ongkir origin. */
  address: 'Jl. Andong 3 No. 1, Jakarta Barat',
  city: 'Jakarta Barat',
  province: 'DKI Jakarta',
  postalCode: '11470',
  /** Origin coordinates (Jakarta Barat) for haversine distance to buyer. */
  origin: { lat: -6.1683, lng: 106.7588 },
  /** Province id (see lib/regions.ts) the store sits in. */
  originProvinceId: 'dki-jakarta',
  email: 'hello@groundhood.com',
  instagram: '@groundhood.id',
  operatingHours: 'Senin – Jumat, 10.00 – 18.00 WIB',
} as const
