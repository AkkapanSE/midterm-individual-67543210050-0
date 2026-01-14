// src/data/repositories/studentRepository.js
const db = require('../database/connection');

class StudentRepository {
    
    // 1. ค้นหานักศึกษาทั้งหมด (รองรับการกรองด้วย major และ status)
    async findAll(major = null, status = null) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM students';
            let params = [];
            let conditions = [];
            
            // ถ้ามีการส่งค่า major มา ให้เพิ่มเงื่อนไขการค้นหา
            if (major) {
                conditions.push('major = ?');
                params.push(major);
            }
            
            // ถ้ามีการส่งค่า status มา ให้เพิ่มเงื่อนไขการค้นหา
            if (status) {
                conditions.push('status = ?');
                params.push(status);
            }
            
            // ต่อ SQL กับ WHERE clause
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // 2. ค้นหานักศึกษาตาม ID
    async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM students WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // 3. สร้างนักศึกษาใหม่
    async create(studentData) {
        const { student_code, first_name, last_name, email, major } = studentData;
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO students (student_code, first_name, last_name, email, major) VALUES (?, ?, ?, ?, ?)';
            db.run(sql, [student_code, first_name, last_name, email, major], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // ส่งข้อมูลที่เพิ่งสร้างกลับไป (รวม ID)
                    db.get('SELECT * FROM students WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    // 4. อัปเดตข้อมูลนักศึกษา (ข้อมูลทั่วไป)
    async update(id, studentData) {
        const { student_code, first_name, last_name, email, major } = studentData;
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE students SET student_code = ?, first_name = ?, last_name = ?, email = ?, major = ? WHERE id = ?';
            db.run(sql, [student_code, first_name, last_name, email, major, id], function(err) {
                if (err) reject(err);
                else {
                    // ส่งข้อมูลที่อัปเดตแล้วกลับไป
                    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    // 5. อัปเดตเฉพาะ GPA
    async updateGPA(id, gpa) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE students SET gpa = ? WHERE id = ?';
            db.run(sql, [gpa, id], function(err) {
                if (err) reject(err);
                else {
                    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    // 6. อัปเดตเฉพาะ Status
    async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE students SET status = ? WHERE id = ?';
            db.run(sql, [status, id], function(err) {
                if (err) reject(err);
                else {
                    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    // 7. ลบนักศึกษา
    async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM students WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) reject(err);
                else resolve({ message: 'Student deleted successfully', changes: this.changes });
            });
        });
    }
}

module.exports = new StudentRepository();