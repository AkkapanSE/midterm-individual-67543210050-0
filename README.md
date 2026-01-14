# 🎓 Student Management System – Layered Architecture

## 📋 Project Information
- **Student Name:** [Your Full Name]
- **Student ID:** [Your Student ID]
- **Section:** [Your Section]
- **Course:** ENGSE207 Software Architecture

---

## 🏗️ Architecture Style
**Layered Architecture (3-Tier)**  
Refactored from **Monolithic Architecture** to improve:
- Maintainability  
- Separation of Concerns  
- Testability  

---

## 📂 Project Structure
midterm-individual-xxxxxxxx/
├── src/
│ ├── presentation/ # Layer 1: Presentation (Routes, Controllers)
│ ├── business/ # Layer 2: Business Logic (Services, Validators)
│ └── data/ # Layer 3: Data Access (Repositories, Database)
├── server.js # Entry Point
└── students.db # SQLite Database

---

## 🎯 Refactoring Summary

### 🔴 Problems with Monolithic Architecture (Before)
- **Code complexity:** All logic was inside `server.js`, making it hard to read and understand  
- **Hard to maintain:** Small changes could unintentionally affect other parts (side effects)  
- **No Separation of Concerns:**  
  - Database queries  
  - Business logic  
  - HTTP request handling  
  were mixed together  
- **Difficult to test:** Cannot test each component independently  

---

### 🟢 Improvements with Layered Architecture (After)
- **Clear separation of layers:**
  - Presentation Layer
  - Business Layer
  - Data Access Layer
- **Single Responsibility Principle:**  
  Each file has one responsibility  
  - Controller handles HTTP requests  
  - Service handles business rules  
  - Repository handles database operations  
- **Maintainable & scalable:**  
  Easier to modify, extend, and work as a team  

---

## 🚀 How to Run the Project

### 1️⃣ Clone Repository
```bash
git clone https://github.com/RMUTL-ENGSE207/midterm-individual-67543210050-0.git
cd midterm-individual-67543210050-0


2️⃣ Install Dependencies
npm install

3️⃣ Start Server
node server.js


Server will start at:
👉 http://localhost:3000

📝 API Endpoints
Method	Endpoint	Description
GET	/api/students	Get all students (supports filter ?major=SE&status=active)
GET	/api/students/:id	Get student by ID
POST	/api/students	Create new student
PUT	/api/students/:id	Update student (all fields)
PATCH	/api/students/:id/gpa	Update GPA only
PATCH	/api/students/:id/status	Update student status
DELETE	/api/students/:id	Delete student (status must NOT be active)