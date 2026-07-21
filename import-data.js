const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  const raw = fs.readFileSync('data-backup.json', 'utf-8')
  const { products, settings } = JSON.parse(raw)

  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        capacity: p.capacity,
        temperature: p.temperature,
        power: p.power,
        featured: p.featured,
        inStock: p.inStock,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
    })
  }

  for (const s of settings) {
    await prisma.siteSettings.create({
      data: {
        id: s.id,
        heroTitle: s.heroTitle,
        heroSubtitle: s.heroSubtitle,
        heroImage: s.heroImage,
        aboutTitle: s.aboutTitle,
        aboutText: s.aboutText,
        aboutImage: s.aboutImage,
        phone: s.phone,
        email: s.email,
        address: s.address,
        workingHours: s.workingHours,
        facebook: s.facebook,
        instagram: s.instagram,
        whatsapp: s.whatsapp,
        adminPassword: s.adminPassword,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      },
    })
  }

  console.log(`تم استيراد ${products.length} منتج و ${settings.length} إعدادات بنجاح`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
