// src/presentation/controllers/studentController.js
const studentService = require('../../business/services/studentService');

class StudentController {

    // GET /api/students
    async getAllStudents(req, res, next) {
        try {
            const { major, status } = req.query;
            const result = await studentService.getAllStudents(major, status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/students/:id
    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.getStudentById(id);
            res.json(student);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/students
    async createStudent(req, res, next) {
        try {
            const studentData = req.body;
            const newStudent = await studentService.createStudent(studentData);
            res.status(201).json(newStudent);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/students/:id
    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const studentData = req.body;
            const updatedStudent = await studentService.updateStudent(id, studentData);
            res.json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/students/:id/gpa
    async updateGPA(req, res, next) {
        try {
            const { id } = req.params;
            const { gpa } = req.body;
            const updatedStudent = await studentService.updateGPA(id, gpa);
            res.json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/students/:id/status
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedStudent = await studentService.updateStatus(id, status);
            res.json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/students/:id
    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            const result = await studentService.deleteStudent(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();