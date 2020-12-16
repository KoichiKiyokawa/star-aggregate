import * as sqlite3 from 'sqlite3'
import { dbFilename } from '../constant'

// singleton class
export class DBConnection {
  static database: sqlite3.Database | undefined = undefined

  static init() {
    this.database = new sqlite3.Database(dbFilename)
  }

  static getInstance() {
    if (this.database == null) this.init()
    return this.database
  }
}
