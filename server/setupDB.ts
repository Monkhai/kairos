import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('kairos_db.db')

export function initializeDatabase(): Error | null {
  try {
    db.withTransactionSync(() => {
      db.execSync(`CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        duration INT,
        done BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      db.execSync(`CREATE TABLE IF NOT EXISTS defaults (
          id INT PRIMARY KEY NOT NULL,
          color TEXT NOT NULL,
          duration INT NOT NULL
        )
      `)

      const defaults: null | { count: number } = db.getFirstSync(`SELECT COUNT(*) as count FROM defaults`)
      if (defaults === null) {
        return Error('Failed to get defaults')
      } else if (defaults.count === 0) {
        db.execSync(`INSERT INTO defaults (id, color, duration) VALUES (1, 'blue', 15);
          INSERT INTO defaults (id, color, duration) VALUES (2, 'orange', 30);
          INSERT INTO defaults (id, color, duration) VALUES (3, 'green', 45);
          INSERT INTO defaults (id, color, duration) VALUES (4, 'red', 60);
          INSERT INTO defaults (id, color, duration) VALUES (5, 'purple', ${Number.MAX_SAFE_INTEGER});
        `)
      }
    })
    return null
  } catch (error) {
    return Error('Failed to initialize database')
  }
}

export function clearDB() {
  db.execSync('DROP TABLE tasks')
  db.execSync('DROP TABLE defaults')
}
