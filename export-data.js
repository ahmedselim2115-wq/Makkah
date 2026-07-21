const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany()
  const settings = await prisma.siteSettings.findMany()

  fs.writeFileSync(
    'data-backup.json',
    JSON.stringify({ products, settings }, null, 2)
  )

  console.log(`تم تصدير ${products.length} منتج و ${settings.length} إعدادات`)
  console.log('الملف: data-backup.json')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
