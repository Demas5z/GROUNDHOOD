'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getProvince } from '@/lib/regions'
import { quoteShipping } from '@/lib/shipping'

export type CheckoutResult = { error?: string; orderId?: string }

const checkoutSchema = z.object({
  shippingName: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  shippingPhone: z
    .string()
    .min(8, 'Nomor HP minimal 8 digit')
    .regex(/^[+0-9 ()-]+$/, 'Nomor HP hanya boleh berisi angka dan tanda + ( ) -'),
  provinceId: z.string().min(1, 'Provinsi wajib dipilih'),
  city: z.string().min(2, 'Kabupaten/Kota wajib dipilih'),
  district: z.string().min(2, 'Kecamatan wajib diisi'),
  postalCode: z.string().regex(/^\d{5}$/, 'Kode pos harus 5 digit angka'),
  addressDetail: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['transfer', 'qris'], {
    errorMap: () => ({ message: 'Metode pembayaran wajib dipilih' }),
  }),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

function pad(n: number, w: number) {
  return String(n).padStart(w, '0')
}

async function generateOrderNumber(): Promise<string> {
  const today = new Date()
  const yearMonth = `${today.getFullYear()}${pad(today.getMonth() + 1, 2)}`
  const prefix = `GH-${yearMonth}-`
  const count = await prisma.order.count({
    where: { orderNumber: { startsWith: prefix } },
  })
  return `${prefix}${pad(count + 1, 4)}`
}

/** Compose the structured address into a single human-readable line. */
function composeAddress(d: {
  addressDetail: string
  district: string
  city: string
  provinceName: string
  postalCode: string
}): string {
  return `${d.addressDetail}, Kec. ${d.district}, ${d.city}, ${d.provinceName} ${d.postalCode}`
}

export async function createOrderAction(data: CheckoutInput): Promise<CheckoutResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sesi berakhir, silakan login ulang.' }

  const parsed = checkoutSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const userId = session.user.id
  const province = getProvince(parsed.data.provinceId)
  if (!province) return { error: 'Provinsi tidak valid.' }

  // Load cart with products to verify stock
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  })
  if (!cart || cart.items.length === 0) {
    return { error: 'Keranjang kamu kosong.' }
  }

  // Validate stock for every item before mutating anything
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      return {
        error: `Stok "${item.product.name}" tidak cukup (tersedia ${item.product.stock}).`,
      }
    }
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  // Authoritative ongkir — recomputed server-side, never trusted from client.
  const quote = quoteShipping({
    provinceId: parsed.data.provinceId,
    cityName: parsed.data.city,
    subtotal,
  })
  if (!quote) return { error: 'Gagal menghitung ongkir untuk lokasi tersebut.' }

  const shippingCost = quote.cost
  const total = subtotal + shippingCost
  const orderNumber = await generateOrderNumber()
  const fullAddress = composeAddress({
    addressDetail: parsed.data.addressDetail,
    district: parsed.data.district,
    city: parsed.data.city,
    provinceName: province.name,
    postalCode: parsed.data.postalCode,
  })

  // Atomic transaction: order + items + payment + stock decrement + cart cleanup
  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'menunggu_pembayaran',
          subtotal,
          shippingCost,
          total,
          shippingName: parsed.data.shippingName,
          shippingPhone: parsed.data.shippingPhone,
          shippingAddress: fullAddress,
          shippingProvince: province.name,
          shippingCity: parsed.data.city,
          shippingDistrict: parsed.data.district,
          shippingPostalCode: parsed.data.postalCode,
          shippingDistanceKm: quote.distanceKm,
          notes: parsed.data.notes ?? null,
          items: {
            create: cart.items.map((i) => ({
              productId: i.productId,
              productName: i.product.name,
              quantity: i.quantity,
              price: i.product.price,
            })),
          },
          payment: {
            create: {
              method: parsed.data.paymentMethod,
              status: 'pending',
            },
          },
        },
      })

      // Decrement stock per product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Empty cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

      // Persist structured address so it can be reused next time
      await tx.user.update({
        where: { id: userId },
        data: {
          phone: parsed.data.shippingPhone,
          address: fullAddress,
          shipProvinceId: parsed.data.provinceId,
          shipProvince: province.name,
          shipCity: parsed.data.city,
          shipDistrict: parsed.data.district,
          shipPostalCode: parsed.data.postalCode,
          shipAddressDetail: parsed.data.addressDetail,
        },
      })

      return created
    })

    revalidatePath('/cart')
    revalidatePath('/account/orders')
    revalidatePath('/account/profile')
    revalidatePath('/', 'layout')
    return { orderId: order.id }
  } catch (error) {
    console.error('createOrderAction failed:', error)
    return { error: 'Gagal membuat pesanan. Silakan coba lagi.' }
  }
}
