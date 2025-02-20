const sqlite3 = require("sqlite3").verbose();
const { DATABASE_PATH } = require("../config/config");

const db = new sqlite3.Database(DATABASE_PATH, (err) => {
  if (err) console.error("Erro ao conectar ao banco de dados:", err.message);
  else console.log("Conectado ao SQLite");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pendente',
    data_cadastro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS processos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    FOREIGN KEY(produto_id) REFERENCES produtos(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS historico_produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_cadastro TEXT NOT NULL,
    data_finalizacao TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  )`);
});

module.exports = db;
