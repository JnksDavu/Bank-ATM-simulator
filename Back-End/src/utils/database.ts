import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Função para abrir a conexão com o banco
export async function openDb() {
  const db = await open({
    filename: path.join(__dirname, "database.db"), // Caminho relativo correto
    driver: sqlite3.Database,
  });

  console.log("✅ Conectado ao banco SQLite com sucesso!");
  return db;
}

export async function setupDatabase() {
    const db = await openDb();
  
    // Criando tabelas caso não existam
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        key_map TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
  
    console.log("✅ Banco de dados SQLite configurado!");
  }