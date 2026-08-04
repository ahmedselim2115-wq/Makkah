require('dotenv').config()
const mysql = require('mysql2/promise')

async function main() {
  console.log('DB URL used:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'))
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  console.log('تم الاتصال بنجاح!')
  const [rows] = await conn.query('SELECT 1 as ok')
  console.log(rows)
  await conn.end()
}

main().catch((err) => {
  console.error('حصل خطأ:', err.message)
  process.exit(1)
})
