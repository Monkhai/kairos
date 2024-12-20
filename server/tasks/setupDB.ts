import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('kairos_db.db')

export function initializeDatabase(): Error | null {
  try {
    db.withTransactionSync(() => {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS tasks ( 
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        duration INT,
        done BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
    })
    return null
  } catch (error) {
    console.log(error)
    return Error('Failed to initialize database')
  }
}
