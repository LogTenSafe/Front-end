import { backupFromJSON, BackupJSON } from '@/types'
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
export const backupsJSON: BackupJSON[] = require('./backups.json')

const backups = backupsJSON.map(j => backupFromJSON(j))
export default backups
