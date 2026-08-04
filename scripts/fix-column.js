require('dotenv').config()
const mysql = require('mysql2/promise')

async function main() {
  console.log('DB URL used:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'))
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  await conn.query('ALTER TABLE Product MODIFY description TEXT')
  console.log('تم تكبير عمود description بنجاح')
  await conn.end()
}

main().catch((err) => {
  console.error('حصل خطأ:', err.message)
  process.exit(1)
})
