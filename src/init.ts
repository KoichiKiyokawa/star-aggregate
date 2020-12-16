import * as fs from 'fs'
import { dbFilename } from './constant'
import { StarLogRepository } from './models/StarLogRepository'

fs.closeSync(fs.openSync(dbFilename, 'w'))
StarLogRepository.init()
