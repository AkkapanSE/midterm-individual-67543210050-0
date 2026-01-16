// src/presentation/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err.message);
    
    let statusCode = 500;
    
    // ตรวจสอบข้อความ Error เพื่อกำหนด Status Code
    if (err.message.includes('required') || 
        err.message.includes('Invalid') ||
        err.message.includes('must be') ||
        err.message.includes('Cannot change') || 
        err.message.includes('Cannot delete')) {
        statusCode = 400; // Bad Request (ข้อมูลผิดรูปแบบ หรือผิดกฎ Business)
    } else if (err.message.includes('not found')) {
        statusCode = 404; // Not Found (หาไม่เจอ)
    } else if (err.message.includes('UNIQUE constraint failed')) {
        statusCode = 409; // Conflict (ข้อมูลซ้ำ เช่น รหัสนักศึกษาซ้ำ)
    }
    
    res.status(statusCode).json({
        error: err.message || 'Internal server error'
    });
}

module.exports = errorHandler;