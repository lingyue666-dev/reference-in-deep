import { query } from '@/lib/db'

export async function createUsersTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  try {
    await query(createTableSQL)
    console.log('Users table created successfully')
  } catch (error) {
    console.error('Error creating users table:', error)
    throw error
  }
}

export async function initDatabase() {
  try {
    await createUsersTable()
  } catch (error) {
    console.error('Database initialization failed:', error)
  }
}
