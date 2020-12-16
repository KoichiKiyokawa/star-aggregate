import { runSql } from './util'

export type TStarLog = {
  userID: number
  ownerWithRepository: string
  starredAt: string // SQLiteにはDateに関する型はないので、stringで保持しておく
  page: number
}

const COLUMNS: Record<keyof TStarLog, string> = {
  userID: 'INTEGER',
  ownerWithRepository: 'TEXT',
  starredAt: 'TEXT',
  page: 'INTEGER',
}

export class StarLogRepository {
  static tableName = 'starLogs'

  static init() {
    runSql(`
      CREATE TABLE IF NOT EXISTS ${this.tableName}(${Object.entries(COLUMNS)
      .map(([col, typ]) => `${col} ${typ}`)
      .join(',')});
    `)
  }

  static add(data: TStarLog) {
    runSql(
      `INSERT INTO ${this.tableName}(${Object.keys(COLUMNS).join(',')}) VALUES (${data.userID}, '${
        data.ownerWithRepository
      }', '${data.starredAt}', ${data.page});`
    )
  }
}
