require('dotenv').config()
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const { createId } = require('@paralleldrive/cuid2')

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL)

  const email = 'admin@makkah.com'
  const plainPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(plainPassword, 10)
  const id = createId()

  await conn.query('DELETE FROM User WHERE email = ?', [email])

  await conn.query(
    'INSERT INTO User (id, name, email, password, isActive, isSuperAdmin) VALUES (?, ?, ?, ?, ?, ?)',
    [id, 'Admin', email, hashedPassword, true, true]
  )

  console.log('تم إنشاء المستخدم:')
  console.log('Email:', email)
  console.log('Password:', plainPassword)

  const [rows] = await conn.query('SELECT COUNT(*) as count FROM SiteSettings')
  if (rows[0].count === 0) {
    const settingsId = createId()
    await conn.query('INSERT INTO SiteSettings (id) VALUES (?)', [settingsId])
    console.log('تم إنشاء صف افتراضي في SiteSettings')
  }

  await conn.end()
}

main().catch((err) => {
  console.error('حصل خطأ:', err.message)
  process.exit(1)
})
