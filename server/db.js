// server/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Untuk demo, gunakan database in-memory

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS vouchers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      amount INTEGER,
      expiration_date TEXT
    )
  `);
});

module.exports = db;
