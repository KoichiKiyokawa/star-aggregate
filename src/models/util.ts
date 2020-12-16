import { DBConnection } from './DBConnection'

export function runSql(sql: string) {
  console.log(`Run SQL: ${sql}`)
  const db = DBConnection.getInstance()
  db.serialize(() => {
    db.run(sql)
  })
}
