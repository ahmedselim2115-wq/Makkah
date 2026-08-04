const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@makkah.com'
  const plainPassword = 'admin123'
  const hashed = await bcrypt.hash(plainPassword, 10)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('الحساب موجود بالفعل:', email)
    return
  }

  await prisma.user.create({
    data: {
      name: 'المدير الرئيسي',
      email,
      password: hashed,
      isSuperAdmin: true,
      isActive: true,
    },
  })

  // نضيف الفئات الموجودة حاليًا في المنتجات كنقطة بداية
  const products = await prisma.product.findMany({ select: { category: true } })
  const uniqueCategories = [...new Set(products.map((p) => p.category))]

  for (const name of uniqueCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  console.log(`تم إنشاء الحساب: ${email} / ${plainPassword}`)
  console.log(`تم إنشاء ${uniqueCategories.length} فئة:`, uniqueCategories)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())