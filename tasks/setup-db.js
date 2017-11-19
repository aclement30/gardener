const DB_CONFIG = require('../config/database');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(DB_CONFIG.file);

db.serialize(function() {
  db.run("CREATE TABLE accessories (id INTEGER PRIMARY KEY AUTOINCREMENT, alias TEXT UNIQUE NOT NULL)");
  db.run("CREATE TABLE logs (id INTEGER PRIMARY KEY AUTOINCREMENT, accessory_id INTEGER, type TEXT NOT NULL, value INTEGER, timestamp INTEGER NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (accessory_id) REFERENCES accessories(id))");
});

db.close();
