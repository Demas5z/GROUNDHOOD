/**
 * Bundled Indonesian region dataset for structured shipping addresses.
 *
 * Free, offline, no external API. Provinces carry a centroid coordinate and a
 * curated list of major kota/kabupaten — each with an approximate lat/lng used
 * by the haversine distance ongkir calculator (lib/shipping.ts).
 *
 * Coordinates are approximate (city centre) and intended for shipping-cost
 * estimation, not navigation. Extend CITIES freely — the calculator falls back
 * to the province centroid when a city has no coordinate.
 */
export type City = { name: string; lat: number; lng: number }
export type Province = {
  id: string
  name: string
  /** Coarse island group, used for inter-island awareness. */
  island: string
  /** Province centroid — fallback origin/destination coordinate. */
  lat: number
  lng: number
}

export const PROVINCES: Province[] = [
  { id: 'aceh', name: 'Aceh', island: 'sumatra', lat: 4.695135, lng: 96.749397 },
  { id: 'sumatera-utara', name: 'Sumatera Utara', island: 'sumatra', lat: 2.115354, lng: 99.545097 },
  { id: 'sumatera-barat', name: 'Sumatera Barat', island: 'sumatra', lat: -0.739939, lng: 100.800005 },
  { id: 'riau', name: 'Riau', island: 'sumatra', lat: 0.293346, lng: 101.706829 },
  { id: 'kepulauan-riau', name: 'Kepulauan Riau', island: 'sumatra', lat: 3.945651, lng: 108.142866 },
  { id: 'jambi', name: 'Jambi', island: 'sumatra', lat: -1.610122, lng: 103.613120 },
  { id: 'sumatera-selatan', name: 'Sumatera Selatan', island: 'sumatra', lat: -3.319437, lng: 103.914399 },
  { id: 'bangka-belitung', name: 'Kepulauan Bangka Belitung', island: 'sumatra', lat: -2.741051, lng: 106.440587 },
  { id: 'bengkulu', name: 'Bengkulu', island: 'sumatra', lat: -3.577847, lng: 102.346387 },
  { id: 'lampung', name: 'Lampung', island: 'sumatra', lat: -4.558584, lng: 105.406807 },
  { id: 'dki-jakarta', name: 'DKI Jakarta', island: 'jawa', lat: -6.211544, lng: 106.845172 },
  { id: 'jawa-barat', name: 'Jawa Barat', island: 'jawa', lat: -6.914744, lng: 107.609810 },
  { id: 'banten', name: 'Banten', island: 'jawa', lat: -6.405817, lng: 106.064017 },
  { id: 'jawa-tengah', name: 'Jawa Tengah', island: 'jawa', lat: -7.150975, lng: 110.140259 },
  { id: 'di-yogyakarta', name: 'DI Yogyakarta', island: 'jawa', lat: -7.875384, lng: 110.426208 },
  { id: 'jawa-timur', name: 'Jawa Timur', island: 'jawa', lat: -7.536063, lng: 112.238401 },
  { id: 'bali', name: 'Bali', island: 'bali-nusra', lat: -8.409517, lng: 115.188916 },
  { id: 'ntb', name: 'Nusa Tenggara Barat', island: 'bali-nusra', lat: -8.652933, lng: 117.361647 },
  { id: 'ntt', name: 'Nusa Tenggara Timur', island: 'bali-nusra', lat: -8.657381, lng: 121.079370 },
  { id: 'kalimantan-barat', name: 'Kalimantan Barat', island: 'kalimantan', lat: -0.278780, lng: 111.475285 },
  { id: 'kalimantan-tengah', name: 'Kalimantan Tengah', island: 'kalimantan', lat: -1.681487, lng: 113.382354 },
  { id: 'kalimantan-selatan', name: 'Kalimantan Selatan', island: 'kalimantan', lat: -3.092641, lng: 115.283758 },
  { id: 'kalimantan-timur', name: 'Kalimantan Timur', island: 'kalimantan', lat: 0.538658, lng: 116.419389 },
  { id: 'kalimantan-utara', name: 'Kalimantan Utara', island: 'kalimantan', lat: 3.073092, lng: 116.041388 },
  { id: 'sulawesi-utara', name: 'Sulawesi Utara', island: 'sulawesi', lat: 0.624693, lng: 123.975001 },
  { id: 'gorontalo', name: 'Gorontalo', island: 'sulawesi', lat: 0.699937, lng: 122.446723 },
  { id: 'sulawesi-tengah', name: 'Sulawesi Tengah', island: 'sulawesi', lat: -1.430025, lng: 121.445617 },
  { id: 'sulawesi-barat', name: 'Sulawesi Barat', island: 'sulawesi', lat: -2.844137, lng: 119.232078 },
  { id: 'sulawesi-selatan', name: 'Sulawesi Selatan', island: 'sulawesi', lat: -3.668799, lng: 119.974053 },
  { id: 'sulawesi-tenggara', name: 'Sulawesi Tenggara', island: 'sulawesi', lat: -4.144910, lng: 122.174605 },
  { id: 'maluku', name: 'Maluku', island: 'maluku-papua', lat: -3.238461, lng: 130.145273 },
  { id: 'maluku-utara', name: 'Maluku Utara', island: 'maluku-papua', lat: 1.570999, lng: 127.808769 },
  { id: 'papua', name: 'Papua', island: 'maluku-papua', lat: -4.269928, lng: 138.080352 },
  { id: 'papua-barat', name: 'Papua Barat', island: 'maluku-papua', lat: -1.336115, lng: 133.174716 },
  { id: 'papua-tengah', name: 'Papua Tengah', island: 'maluku-papua', lat: -3.987083, lng: 136.000000 },
  { id: 'papua-selatan', name: 'Papua Selatan', island: 'maluku-papua', lat: -7.000000, lng: 139.500000 },
  { id: 'papua-pegunungan', name: 'Papua Pegunungan', island: 'maluku-papua', lat: -4.000000, lng: 139.000000 },
  { id: 'papua-barat-daya', name: 'Papua Barat Daya', island: 'maluku-papua', lat: -1.000000, lng: 131.500000 },
]

export const CITIES: Record<string, City[]> = {
  aceh: [
    { name: 'Kota Banda Aceh', lat: 5.548290, lng: 95.323753 },
    { name: 'Kota Lhokseumawe', lat: 5.181519, lng: 97.141663 },
    { name: 'Kota Langsa', lat: 4.468316, lng: 97.968285 },
    { name: 'Kabupaten Aceh Besar', lat: 5.450000, lng: 95.500000 },
    { name: 'Kabupaten Bireuen', lat: 5.203000, lng: 96.700000 },
  ],
  'sumatera-utara': [
    { name: 'Kota Medan', lat: 3.595196, lng: 98.672226 },
    { name: 'Kota Binjai', lat: 3.600000, lng: 98.485000 },
    { name: 'Kota Pematangsiantar', lat: 2.960000, lng: 99.062000 },
    { name: 'Kota Tebing Tinggi', lat: 3.328000, lng: 99.162000 },
    { name: 'Kabupaten Deli Serdang', lat: 3.420000, lng: 98.800000 },
    { name: 'Kota Sibolga', lat: 1.742000, lng: 98.778000 },
  ],
  'sumatera-barat': [
    { name: 'Kota Padang', lat: -0.947083, lng: 100.417181 },
    { name: 'Kota Bukittinggi', lat: -0.305700, lng: 100.369100 },
    { name: 'Kota Payakumbuh', lat: -0.224000, lng: 100.633000 },
    { name: 'Kota Padang Panjang', lat: -0.466000, lng: 100.400000 },
    { name: 'Kabupaten Agam', lat: -0.230000, lng: 100.160000 },
  ],
  riau: [
    { name: 'Kota Pekanbaru', lat: 0.507068, lng: 101.447777 },
    { name: 'Kota Dumai', lat: 1.668000, lng: 101.451000 },
    { name: 'Kabupaten Kampar', lat: 0.320000, lng: 101.020000 },
    { name: 'Kabupaten Bengkalis', lat: 1.480000, lng: 102.080000 },
  ],
  'kepulauan-riau': [
    { name: 'Kota Batam', lat: 1.045630, lng: 104.030457 },
    { name: 'Kota Tanjungpinang', lat: 0.918000, lng: 104.458000 },
    { name: 'Kabupaten Bintan', lat: 1.060000, lng: 104.500000 },
  ],
  jambi: [
    { name: 'Kota Jambi', lat: -1.609972, lng: 103.607254 },
    { name: 'Kota Sungai Penuh', lat: -2.060000, lng: 101.390000 },
    { name: 'Kabupaten Muaro Jambi', lat: -1.550000, lng: 103.800000 },
  ],
  'sumatera-selatan': [
    { name: 'Kota Palembang', lat: -2.990934, lng: 104.756554 },
    { name: 'Kota Prabumulih', lat: -3.432000, lng: 104.235000 },
    { name: 'Kota Lubuklinggau', lat: -3.296000, lng: 102.862000 },
    { name: 'Kabupaten Ogan Ilir', lat: -3.220000, lng: 104.650000 },
  ],
  'bangka-belitung': [
    { name: 'Kota Pangkalpinang', lat: -2.128000, lng: 106.113000 },
    { name: 'Kabupaten Belitung', lat: -2.870000, lng: 107.620000 },
    { name: 'Kabupaten Bangka', lat: -1.900000, lng: 105.980000 },
  ],
  bengkulu: [
    { name: 'Kota Bengkulu', lat: -3.800440, lng: 102.265720 },
    { name: 'Kabupaten Rejang Lebong', lat: -3.450000, lng: 102.620000 },
  ],
  lampung: [
    { name: 'Kota Bandar Lampung', lat: -5.397140, lng: 105.266723 },
    { name: 'Kota Metro', lat: -5.113000, lng: 105.307000 },
    { name: 'Kabupaten Lampung Selatan', lat: -5.600000, lng: 105.580000 },
  ],
  'dki-jakarta': [
    { name: 'Jakarta Pusat', lat: -6.186486, lng: 106.834091 },
    { name: 'Jakarta Utara', lat: -6.138414, lng: 106.863956 },
    { name: 'Jakarta Barat', lat: -6.168300, lng: 106.758800 },
    { name: 'Jakarta Selatan', lat: -6.261493, lng: 106.810600 },
    { name: 'Jakarta Timur', lat: -6.225014, lng: 106.900447 },
    { name: 'Kepulauan Seribu', lat: -5.600000, lng: 106.600000 },
  ],
  'jawa-barat': [
    { name: 'Kota Bandung', lat: -6.917464, lng: 107.619123 },
    { name: 'Kota Bekasi', lat: -6.238270, lng: 106.975570 },
    { name: 'Kota Depok', lat: -6.402484, lng: 106.794243 },
    { name: 'Kota Bogor', lat: -6.595038, lng: 106.816635 },
    { name: 'Kota Cimahi', lat: -6.872000, lng: 107.542000 },
    { name: 'Kota Cirebon', lat: -6.732000, lng: 108.552000 },
    { name: 'Kota Sukabumi', lat: -6.927000, lng: 106.930000 },
    { name: 'Kota Tasikmalaya', lat: -7.327000, lng: 108.220000 },
    { name: 'Kabupaten Bandung', lat: -7.025000, lng: 107.520000 },
    { name: 'Kabupaten Bogor', lat: -6.550000, lng: 106.780000 },
    { name: 'Kabupaten Bekasi', lat: -6.250000, lng: 107.150000 },
    { name: 'Kabupaten Karawang', lat: -6.302000, lng: 107.305000 },
  ],
  banten: [
    { name: 'Kota Tangerang', lat: -6.178306, lng: 106.631889 },
    { name: 'Kota Tangerang Selatan', lat: -6.288700, lng: 106.717900 },
    { name: 'Kota Serang', lat: -6.120000, lng: 106.150000 },
    { name: 'Kota Cilegon', lat: -6.017000, lng: 106.054000 },
    { name: 'Kabupaten Tangerang', lat: -6.200000, lng: 106.500000 },
    { name: 'Kabupaten Lebak', lat: -6.560000, lng: 106.250000 },
  ],
  'jawa-tengah': [
    { name: 'Kota Semarang', lat: -6.966667, lng: 110.416664 },
    { name: 'Kota Surakarta', lat: -7.575489, lng: 110.824326 },
    { name: 'Kota Magelang', lat: -7.470000, lng: 110.217000 },
    { name: 'Kota Salatiga', lat: -7.330000, lng: 110.508000 },
    { name: 'Kota Pekalongan', lat: -6.888000, lng: 109.668000 },
    { name: 'Kota Tegal', lat: -6.869000, lng: 109.140000 },
    { name: 'Kabupaten Banyumas', lat: -7.510000, lng: 109.294000 },
    { name: 'Kabupaten Kudus', lat: -6.804000, lng: 110.840000 },
  ],
  'di-yogyakarta': [
    { name: 'Kota Yogyakarta', lat: -7.797068, lng: 110.370529 },
    { name: 'Kabupaten Sleman', lat: -7.716000, lng: 110.355000 },
    { name: 'Kabupaten Bantul', lat: -7.888000, lng: 110.330000 },
    { name: 'Kabupaten Kulon Progo', lat: -7.827000, lng: 110.164000 },
    { name: 'Kabupaten Gunungkidul', lat: -7.965000, lng: 110.616000 },
  ],
  'jawa-timur': [
    { name: 'Kota Surabaya', lat: -7.257472, lng: 112.752090 },
    { name: 'Kota Malang', lat: -7.966620, lng: 112.632629 },
    { name: 'Kota Kediri', lat: -7.848000, lng: 112.011000 },
    { name: 'Kota Madiun', lat: -7.629000, lng: 111.523000 },
    { name: 'Kota Blitar', lat: -8.095000, lng: 112.161000 },
    { name: 'Kota Probolinggo', lat: -7.756000, lng: 113.215000 },
    { name: 'Kabupaten Sidoarjo', lat: -7.447000, lng: 112.718000 },
    { name: 'Kabupaten Gresik', lat: -7.156000, lng: 112.654000 },
    { name: 'Kabupaten Jember', lat: -8.170000, lng: 113.700000 },
    { name: 'Kabupaten Banyuwangi', lat: -8.219000, lng: 114.369000 },
  ],
  bali: [
    { name: 'Kota Denpasar', lat: -8.670458, lng: 115.212629 },
    { name: 'Kabupaten Badung', lat: -8.580000, lng: 115.180000 },
    { name: 'Kabupaten Gianyar', lat: -8.540000, lng: 115.330000 },
    { name: 'Kabupaten Buleleng', lat: -8.115000, lng: 115.088000 },
    { name: 'Kabupaten Tabanan', lat: -8.540000, lng: 115.130000 },
  ],
  ntb: [
    { name: 'Kota Mataram', lat: -8.583330, lng: 116.116669 },
    { name: 'Kota Bima', lat: -8.460000, lng: 118.727000 },
    { name: 'Kabupaten Lombok Barat', lat: -8.680000, lng: 116.120000 },
    { name: 'Kabupaten Sumbawa', lat: -8.490000, lng: 117.420000 },
  ],
  ntt: [
    { name: 'Kota Kupang', lat: -10.178100, lng: 123.597000 },
    { name: 'Kabupaten Sikka (Maumere)', lat: -8.620000, lng: 122.210000 },
    { name: 'Kabupaten Ende', lat: -8.840000, lng: 121.660000 },
    { name: 'Kabupaten Manggarai (Ruteng)', lat: -8.610000, lng: 120.470000 },
  ],
  'kalimantan-barat': [
    { name: 'Kota Pontianak', lat: -0.026330, lng: 109.342502 },
    { name: 'Kota Singkawang', lat: 0.906000, lng: 108.985000 },
    { name: 'Kabupaten Kubu Raya', lat: -0.200000, lng: 109.400000 },
    { name: 'Kabupaten Sanggau', lat: 0.120000, lng: 110.600000 },
  ],
  'kalimantan-tengah': [
    { name: 'Kota Palangka Raya', lat: -2.207100, lng: 113.916700 },
    { name: 'Kabupaten Kotawaringin Timur', lat: -2.530000, lng: 112.950000 },
    { name: 'Kabupaten Kapuas', lat: -2.700000, lng: 114.380000 },
  ],
  'kalimantan-selatan': [
    { name: 'Kota Banjarmasin', lat: -3.319437, lng: 114.590110 },
    { name: 'Kota Banjarbaru', lat: -3.444000, lng: 114.840000 },
    { name: 'Kabupaten Banjar', lat: -3.310000, lng: 114.840000 },
    { name: 'Kabupaten Tanah Laut', lat: -3.770000, lng: 114.770000 },
  ],
  'kalimantan-timur': [
    { name: 'Kota Samarinda', lat: -0.502183, lng: 117.153709 },
    { name: 'Kota Balikpapan', lat: -1.265386, lng: 116.831200 },
    { name: 'Kota Bontang', lat: 0.133000, lng: 117.500000 },
    { name: 'Kabupaten Kutai Kartanegara', lat: -0.430000, lng: 116.980000 },
  ],
  'kalimantan-utara': [
    { name: 'Kota Tarakan', lat: 3.300000, lng: 117.633000 },
    { name: 'Kabupaten Bulungan', lat: 2.840000, lng: 117.370000 },
    { name: 'Kabupaten Nunukan', lat: 4.130000, lng: 117.660000 },
  ],
  'sulawesi-utara': [
    { name: 'Kota Manado', lat: 1.474830, lng: 124.842079 },
    { name: 'Kota Bitung', lat: 1.446000, lng: 125.182000 },
    { name: 'Kota Tomohon', lat: 1.327000, lng: 124.838000 },
    { name: 'Kabupaten Minahasa', lat: 1.250000, lng: 124.840000 },
  ],
  gorontalo: [
    { name: 'Kota Gorontalo', lat: 0.543500, lng: 123.059600 },
    { name: 'Kabupaten Gorontalo', lat: 0.700000, lng: 122.840000 },
  ],
  'sulawesi-tengah': [
    { name: 'Kota Palu', lat: -0.900000, lng: 119.870000 },
    { name: 'Kabupaten Poso', lat: -1.396000, lng: 120.752000 },
    { name: 'Kabupaten Banggai (Luwuk)', lat: -0.950000, lng: 122.790000 },
  ],
  'sulawesi-barat': [
    { name: 'Kabupaten Mamuju', lat: -2.674000, lng: 118.888000 },
    { name: 'Kabupaten Polewali Mandar', lat: -3.430000, lng: 119.340000 },
  ],
  'sulawesi-selatan': [
    { name: 'Kota Makassar', lat: -5.147665, lng: 119.432731 },
    { name: 'Kota Parepare', lat: -4.013000, lng: 119.625000 },
    { name: 'Kota Palopo', lat: -2.992000, lng: 120.196000 },
    { name: 'Kabupaten Gowa', lat: -5.310000, lng: 119.740000 },
    { name: 'Kabupaten Bone', lat: -4.540000, lng: 120.330000 },
  ],
  'sulawesi-tenggara': [
    { name: 'Kota Kendari', lat: -3.972000, lng: 122.515000 },
    { name: 'Kota Baubau', lat: -5.470000, lng: 122.617000 },
    { name: 'Kabupaten Konawe', lat: -3.960000, lng: 122.000000 },
  ],
  maluku: [
    { name: 'Kota Ambon', lat: -3.654600, lng: 128.190600 },
    { name: 'Kota Tual', lat: -5.640000, lng: 132.750000 },
    { name: 'Kabupaten Maluku Tengah', lat: -3.250000, lng: 129.500000 },
  ],
  'maluku-utara': [
    { name: 'Kota Ternate', lat: 0.790000, lng: 127.380000 },
    { name: 'Kota Tidore Kepulauan', lat: 0.690000, lng: 127.430000 },
    { name: 'Kabupaten Halmahera Utara', lat: 1.400000, lng: 128.000000 },
  ],
  papua: [
    { name: 'Kota Jayapura', lat: -2.533370, lng: 140.717700 },
    { name: 'Kabupaten Jayapura', lat: -2.560000, lng: 140.480000 },
    { name: 'Kabupaten Keerom', lat: -3.300000, lng: 140.700000 },
  ],
  'papua-barat': [
    { name: 'Kota Sorong', lat: -0.861200, lng: 131.254400 },
    { name: 'Kabupaten Manokwari', lat: -0.861500, lng: 134.062000 },
    { name: 'Kabupaten Fakfak', lat: -2.920000, lng: 132.300000 },
  ],
  'papua-tengah': [
    { name: 'Kabupaten Nabire', lat: -3.366000, lng: 135.496000 },
    { name: 'Kabupaten Mimika (Timika)', lat: -4.547000, lng: 136.890000 },
    { name: 'Kabupaten Paniai', lat: -3.900000, lng: 136.330000 },
  ],
  'papua-selatan': [
    { name: 'Kabupaten Merauke', lat: -8.493800, lng: 140.401700 },
    { name: 'Kabupaten Mappi', lat: -6.700000, lng: 139.380000 },
  ],
  'papua-pegunungan': [
    { name: 'Kabupaten Jayawijaya (Wamena)', lat: -4.097000, lng: 138.946000 },
    { name: 'Kabupaten Yahukimo', lat: -4.500000, lng: 139.480000 },
  ],
  'papua-barat-daya': [
    { name: 'Kota Sorong', lat: -0.861200, lng: 131.254400 },
    { name: 'Kabupaten Raja Ampat', lat: -0.500000, lng: 130.500000 },
  ],
}

export function getProvince(id: string): Province | undefined {
  return PROVINCES.find((p) => p.id === id)
}

/**
 * Resolve the best destination coordinate for a province + city pair.
 * Falls back to the province centroid when the city is unknown.
 */
export function resolveCoordinate(
  provinceId: string,
  cityName?: string,
): { lat: number; lng: number } | null {
  const province = getProvince(provinceId)
  if (!province) return null
  if (cityName) {
    const city = (CITIES[provinceId] ?? []).find((c) => c.name === cityName)
    if (city) return { lat: city.lat, lng: city.lng }
  }
  return { lat: province.lat, lng: province.lng }
}
