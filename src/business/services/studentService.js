// src/business/services/studentService.js
const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    
    // ดึงข้อมูลนักศึกษาทั้งหมด + คำนวณสถิติ
    async getAllStudents(major = null, status = null) {
        // 1. เรียก Repository ดึงข้อมูล
        const students = await studentRepository.findAll(major, status);
        
        // 2. Business Logic: คำนวณสถิติ (Statistics)
        const active = students.filter(s => s.status === 'active').length;
        const graduated = students.filter(s => s.status === 'graduated').length;
        const suspended = students.filter(s => s.status === 'suspended').length;
        const total = students.length;
        
        const avgGPA = total > 0 
            ? (students.reduce((sum, s) => sum + s.gpa, 0) / total).toFixed(2) 
            : 0;

        // 3. ส่งข้อมูลกลับ
        return {
            students,
            statistics: {
                active,
                graduated,
                suspended,
                total,
                averageGPA: parseFloat(avgGPA)
            }
        };
    }
    
    async getStudentById(id) {
        const validId = studentValidator.validateId(id);
        const student = await studentRepository.findById(validId);
        
        if (!student) {
            throw new Error('Student not found');
        }
        return student;
    }
    
    async createStudent(studentData) {
        // 1. Validate ข้อมูลทั้งหมด
        studentValidator.validateStudentData(studentData);
        studentValidator.validateStudentCode(studentData.student_code);
        studentValidator.validateEmail(studentData.email);
        studentValidator.validateMajor(studentData.major);
        
        // 2. บันทึกลง Database
        return await studentRepository.create(studentData);
    }
    
    async updateStudent(id, studentData) {
        const validId = studentValidator.validateId(id);
        
        // Check exist
        const exists = await studentRepository.findById(validId);
        if (!exists) throw new Error('Student not found');
        
        // Validate inputs
        studentValidator.validateStudentData(studentData);
        studentValidator.validateStudentCode(studentData.student_code);
        studentValidator.validateEmail(studentData.email);
        studentValidator.validateMajor(studentData.major);
        
        return await studentRepository.update(validId, studentData);
    }
    
    async updateGPA(id, gpa) {
        const validId = studentValidator.validateId(id);
        studentValidator.validateGPA(gpa);
        
        const exists = await studentRepository.findById(validId);
        if (!exists) throw new Error('Student not found');
        
        return await studentRepository.updateGPA(validId, gpa);
    }
    
    async updateStatus(id, status) {
        const validId = studentValidator.validateId(id);
        studentValidator.validateStatus(status);
        
        const student = await studentRepository.findById(validId);
        if (!student) throw new Error('Student not found');
        
        // Business Rule: ห้ามแก้ไขสถานะของคนที่ลาออกไปแล้ว (withdrawn)
        if (student.status === 'withdrawn') {
            throw new Error('Cannot change status of withdrawn student');
        }
        
        return await studentRepository.updateStatus(validId, status);
    }
    
    async deleteStudent(id) {
        const validId = studentValidator.validateId(id);
        
        const student = await studentRepository.findById(validId);
        if (!student) throw new Error('Student not found');
        
        // Business Rule: ห้ามลบนักศึกษาที่ยัง Active อยู่
        if (student.status === 'active') {
            throw new Error('Cannot delete active student. Change status first.');
        }
        
        return await studentRepository.delete(validId);
    }
}

module.exports = new StudentService();