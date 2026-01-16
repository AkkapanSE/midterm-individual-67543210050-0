// src/data/database/connection.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// กำหนดให้ไฟล์ Database อยู่ที่ root folder ของโปรเจกต์
const dbPath = path.resolve(__dirname, '../../../students.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // สร้างตาราง students ตามโจทย์กำหนด
    const sql = `CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_code TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        major TEXT NOT NULL,
        gpa REAL DEFAULT 0.0,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

    db.run(sql, (err) => {
        if (err) {
            console.error('❌ Error creating table:', err.message);
        } else {
            console.log('✅ Students table ready');
        }
    });
}

module.exports = db;