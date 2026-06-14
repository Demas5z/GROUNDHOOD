/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function pad(n, w) {
  return String(n).padStart(w, '0')
}

async function main() {
  console.log('Seeding database...\n')

  // ─── USERS ──────────────────────────────────────────
  const adminPwd = await bcrypt.hash('Admin123!', 12)
  const customerPwd = await bcrypt.hash('Customer123!', 12)
  const demoPwd = await bcrypt.hash('Demo1234!', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@groundhood.com',
      name: 'GROUNDHOOD Admin',
      password: adminPwd,
      role: 'admin',
      phone: '+62 812 0000 0001',
      address: 'Jl. Cikajang No. 1, Jakarta Selatan',
      emailVerified: new Date(),
    },
  })

  const customer = await prisma.user.create({
    data: {
      email: 'customer@groundhood.com',
      name: 'Andi Pratama',
      password: customerPwd,
      role: 'user',
      phone: '+62 812 3456 7890',
      address: 'Jl. Kemang Raya No. 12, Jakarta Selatan',
      emailVerified: new Date(),
    },
  })

  const demo = await prisma.user.create({
    data: {
      email: 'demo@groundhood.com',
      name: 'Sarah Wijaya',
      password: demoPwd,
      role: 'user',
      phone: '+62 821 9876 5432',
      address: 'Jl. Senopati No. 45, Jakarta Selatan',
      emailVerified: new Date(),
    },
  })

  console.log('✓ Users created:', 3)

  // ─── CATEGORIES ─────────────────────────────────────
  const catNames = ['Outerwear', 'Tops', 'Bottoms', 'Footwear', 'Accessories']
  const categories = {}
  for (const name of catNames) {
    const c = await prisma.category.create({
      data: { name, slug: slugify(name) },
    })
    categories[name] = c
  }
  console.log('✓ Categories created:', catNames.length)

  // ─── PRODUCTS ──────────────────────────────────────
  const productData = [
    { name: 'Vintage Denim Jacket',  price: 250000, stock: 3, category: 'Outerwear',   description: 'Classic denim jacket dari era 90an. Kondisi grade A, minimal fade, tidak ada robekan.', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80' },
    { name: 'Striped Sweater',       price: 175000, stock: 5, category: 'Tops',        description: 'Sweater bergaris vintage. Bahan tebal, hangat, cocok untuk musim hujan.',                  image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80' },
    { name: 'Oversized Tee',         price: 135000, stock: 8, category: 'Tops',        description: 'Oversized tee thrift pick. Warna cream, fabric soft.',                                       image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80' },
    { name: 'Plaid Flannel Shirt',   price: 160000, stock: 4, category: 'Tops',        description: 'Kemeja flannel motif kotak-kotak, ukuran M-L oversized.',                                    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80' },
    { name: 'Cargo Pants',           price: 180000, stock: 2, category: 'Bottoms',     description: 'Celana cargo militer-style, banyak kantong, fit relaxed.',                                    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&q=80' },
    { name: 'Vintage Levi 501',      price: 320000, stock: 2, category: 'Bottoms',     description: 'Levi 501 original vintage. Wash medium, fit straight, kondisi sangat baik.',                  image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
    { name: 'Leather Boots',         price: 420000, stock: 1, category: 'Footwear',    description: 'Boots kulit asli, sole intact, ukuran 42 EU.',                                                image: 'https://images.unsplash.com/photo-1542840411-7128c10b6cab?w=600&q=80' },
    { name: 'Bucket Hat',            price: 100000, stock: 6, category: 'Accessories', description: 'Bucket hat thrift, fabric tebal, warna olive green.',                                         image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80' },
    { name: 'Vintage Sunglasses',    price: 145000, stock: 3, category: 'Accessories', description: 'Kacamata hitam vintage, frame metal, lens UV protection.',                                    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80' },
    { name: 'Wool Coat',             price: 480000, stock: 1, category: 'Outerwear',   description: 'Coat wool tebal, warna camel, fit oversized. Premium thrift find.',                            image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80' },
  ]

  const products = {}
  for (const p of productData) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        price: p.price,
        stock: p.stock,
        description: p.description,
        image: p.image,
        categoryId: categories[p.category].id,
      },
    })
    products[p.name] = created
  }
  console.log('✓ Products created:', productData.length)

  // ─── ORDERS + ITEMS + PAYMENTS ──────────────────────
  const today = new Date()
  const yearMonth = `${today.getFullYear()}${pad(today.getMonth() + 1, 2)}`

  // Order 1 — Customer Andi: selesai
  const o1Items = [
    { product: products['Vintage Denim Jacket'], qty: 1 },
    { product: products['Oversized Tee'],        qty: 1 },
  ]
  const o1Total = o1Items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const o1 = await prisma.order.create({
    data: {
      orderNumber: `GH-${yearMonth}-0001`,
      userId: customer.id,
      status: 'selesai',
      total: o1Total,
      shippingName: customer.name,
      shippingPhone: customer.phone,
      shippingAddress: customer.address,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      items: {
        create: o1Items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.qty,
          price: i.product.price,
        })),
      },
      payment: {
        create: {
          method: 'transfer',
          status: 'valid',
          proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
          verifiedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          notes: 'Transfer BCA, dikonfirmasi.',
        },
      },
    },
  })

  // Order 2 — Customer Andi: dikirim
  const o2Items = [{ product: products['Cargo Pants'], qty: 1 }]
  const o2Total = o2Items.reduce((s, i) => s + i.product.price * i.qty, 0)
  await prisma.order.create({
    data: {
      orderNumber: `GH-${yearMonth}-0002`,
      userId: customer.id,
      status: 'dikirim',
      total: o2Total,
      shippingName: customer.name,
      shippingPhone: customer.phone,
      shippingAddress: customer.address,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      items: {
        create: o2Items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.qty,
          price: i.product.price,
        })),
      },
      payment: {
        create: {
          method: 'transfer',
          status: 'valid',
          proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
          verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
      },
    },
  })

  // Order 3 — Customer Andi: menunggu_konfirmasi (admin perlu verify)
  const o3Items = [{ product: products['Leather Boots'], qty: 1 }]
  const o3Total = o3Items.reduce((s, i) => s + i.product.price * i.qty, 0)
  await prisma.order.create({
    data: {
      orderNumber: `GH-${yearMonth}-0003`,
      userId: customer.id,
      status: 'menunggu_konfirmasi',
      total: o3Total,
      shippingName: customer.name,
      shippingPhone: customer.phone,
      shippingAddress: customer.address,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: {
        create: o3Items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.qty,
          price: i.product.price,
        })),
      },
      payment: {
        create: {
          method: 'transfer',
          status: 'pending',
          proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
          notes: 'Bukti transfer baru di-upload customer.',
        },
      },
    },
  })

  // Order 4 — Demo Sarah: selesai
  const o4Items = [
    { product: products['Striped Sweater'], qty: 1 },
    { product: products['Bucket Hat'],      qty: 1 },
  ]
  const o4Total = o4Items.reduce((s, i) => s + i.product.price * i.qty, 0)
  await prisma.order.create({
    data: {
      orderNumber: `GH-${yearMonth}-0004`,
      userId: demo.id,
      status: 'selesai',
      total: o4Total,
      shippingName: demo.name,
      shippingPhone: demo.phone,
      shippingAddress: demo.address,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      items: {
        create: o4Items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.qty,
          price: i.product.price,
        })),
      },
      payment: {
        create: {
          method: 'transfer',
          status: 'valid',
          proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
          verifiedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        },
      },
    },
  })

  // Order 5 — Demo Sarah: diproses
  const o5Items = [{ product: products['Plaid Flannel Shirt'], qty: 2 }]
  const o5Total = o5Items.reduce((s, i) => s + i.product.price * i.qty, 0)
  await prisma.order.create({
    data: {
      orderNumber: `GH-${yearMonth}-0005`,
      userId: demo.id,
      status: 'diproses',
      total: o5Total,
      shippingName: demo.name,
      shippingPhone: demo.phone,
      shippingAddress: demo.address,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      items: {
        create: o5Items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.qty,
          price: i.product.price,
        })),
      },
      payment: {
        create: {
          method: 'transfer',
          status: 'valid',
          proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
          verifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      },
    },
  })

  // Order 6 — Demo Sarah: menunggu_pembayaran (belum upload bukti)
  const o6Items = [{ product: products['Vintage Sunglasses'], qty: 1 }]
  const o6Total = o6Items.reduce((s, i) => s + i.product.price * i.qty, 0)
  await prisma.order.create({
    data: {
      orderNumber: `GH-${yearMonth}-0006`,
      userId: demo.id,
      status: 'menunggu_pembayaran',
      total: o6Total,
      shippingName: demo.name,
      shippingPhone: demo.phone,
      shippingAddress: demo.address,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      items: {
        create: o6Items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.qty,
          price: i.product.price,
        })),
      },
    },
  })

  console.log('✓ Orders created: 6 (with items + payments)\n')

  console.log('─── LOGIN CREDENTIALS ───')
  console.log('Admin   : admin@groundhood.com    / Admin123!')
  console.log('Customer: customer@groundhood.com / Customer123!  (3 orders)')
  console.log('Demo    : demo@groundhood.com     / Demo1234!     (3 orders)')
  console.log('\nDone.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
