// src/business/validators/studentValidator.js
class StudentValidator {
    
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    validateStudentData(data) {
        const { student_code, first_name, last_name, email, major } = data;
        if (!student_code || !first_name || !last_name || !email || !major) {
            throw new Error('All fields (student_code, first_name, last_name, email, major) are required');
        }
    }
    
    // ตรวจสอบรูปแบบรหัสนักศึกษา (ต้องเป็นตัวเลข 10 หลัก)
    validateStudentCode(code) {
        const codePattern = /^\d{10}$/;
        if (!codePattern.test(code)) {
            throw new Error('Invalid student code format (must be 10 digits)');
        }
    }
    
    // ตรวจสอบรูปแบบอีเมล
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            throw new Error('Invalid email format');
        }
    }
    
    // ตรวจสอบสาขาวิชา (ต้องเป็น CS, SE, IT, CE, หรือ DS)
    validateMajor(major) {
        const validMajors = ['CS', 'SE', 'IT', 'CE', 'DS'];
        if (!validMajors.includes(major)) {
            throw new Error('Invalid major. Must be one of: CS, SE, IT, CE, DS');
        }
    }
    
    // ตรวจสอบ GPA (ต้องอยู่ระหว่าง 0.0 - 4.0)
    validateGPA(gpa) {
        if (gpa === undefined || gpa < 0 || gpa > 4.0) {
            throw new Error('GPA must be between 0.0 and 4.0');
        }
    }
    
    // ตรวจสอบสถานะ (active, graduated, suspended, withdrawn)
    validateStatus(status) {
        const validStatuses = ['active', 'graduated', 'suspended', 'withdrawn'];
        if (!status || !validStatuses.includes(status)) {
            throw new Error('Invalid status. Must be one of: active, graduated, suspended, withdrawn');
        }
    }
    
    // ตรวจสอบ ID
    validateId(id) {
        const numId = parseInt(id);
        if (isNaN(numId) || numId <= 0) {
            throw new Error('Invalid student ID');
        }
        return numId;
    }
}

module.exports = new StudentValidator();