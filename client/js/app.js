// client/js/app.js
let currentStatusFilter = 'all';
let currentMajorFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupEventListeners();
});

function setupEventListeners() {
    // Add Button
    document.getElementById('add-btn').addEventListener('click', showAddModal);

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Filter logic
            currentStatusFilter = e.target.dataset.filter;
            loadStudents(
                currentStatusFilter === 'all' ? null : currentStatusFilter,
                currentMajorFilter === 'all' ? null : currentMajorFilter
            );
        });
    });

    // Close Modals
    document.querySelectorAll('.close, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        });
    });

    // Forms
    document.getElementById('student-form').addEventListener('submit', handleStudentSubmit);
    document.getElementById('gpa-form').addEventListener('submit', handleGPASubmit);
    document.getElementById('status-form').addEventListener('submit', handleStatusSubmit);
}

async function loadStudents(status = null, major = null) {
    try {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('student-list').innerHTML = '';

        const data = await api.getAllStudents(major, status);

        displayStudents(data.students);
        updateStatistics(data.statistics);

        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').textContent = 'Error loading data';
    }
}

function displayStudents(students) {
    const container = document.getElementById('student-list');

    if (students.length === 0) {
        container.innerHTML = '<div class="no-students">🎓 No students found</div>';
        return;
    }

    container.innerHTML = students.map(student => {
        const gpaClass = getGPAClass(student.gpa);
        return `
            <div class="student-card">
                <div class="student-header">
                    <div>
                        <h3>${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</h3>
                        <span class="student-code">🆔 ${escapeHtml(student.student_code)}</span>
                    </div>
                    <span class="status-badge status-${student.status}">
                        ${student.status.toUpperCase()}
                    </span>
                </div>

                <div class="student-details">
                    <div class="detail-row">
                        <span class="detail-label">📧 Email:</span>
                        <span class="detail-value">${escapeHtml(student.email)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📚 Major:</span>
                        <span class="detail-value">${escapeHtml(student.major)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📊 GPA:</span>
                        <span class="gpa-badge ${gpaClass}">${student.gpa.toFixed(2)}</span>
                    </div>
                </div>

                <div class="actions">
                    <button class="btn btn-info" onclick="showGPAModal(${student.id}, ${student.gpa})">Update GPA</button>
                    <button class="btn btn-warning" onclick="showStatusModal(${student.id}, '${student.status}')">Change Status</button>
                    <button class="btn btn-secondary" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.id}, '${student.status}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStatistics(stats) {
    document.getElementById('stat-active').textContent = stats.active;
    document.getElementById('stat-graduated').textContent = stats.graduated;
    document.getElementById('stat-suspended').textContent = stats.suspended;
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-gpa').textContent = stats.averageGPA.toFixed(2);
}

function getGPAClass(gpa) {
    if (gpa >= 3.5) return 'gpa-excellent';
    if (gpa >= 3.0) return 'gpa-good';
    if (gpa >= 2.0) return 'gpa-fair';
    return 'gpa-poor';
}

// Modal Functions
function showAddModal() {
    document.getElementById('modal-title').textContent = 'Add New Student';
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-modal').style.display = 'flex';
}

window.editStudent = async function(id) {
    try {
        const student = await api.getStudentById(id);
        document.getElementById('modal-title').textContent = 'Edit Student';
        document.getElementById('student-id').value = student.id;
        document.getElementById('student_code').value = student.student_code;
        document.getElementById('first_name').value = student.first_name;
        document.getElementById('last_name').value = student.last_name;
        document.getElementById('email').value = student.email;
        document.getElementById('major').value = student.major;
        document.getElementById('student-modal').style.display = 'flex';
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

window.showGPAModal = function(id, currentGPA) {
    document.getElementById('gpa-student-id').value = id;
    document.getElementById('gpa').value = currentGPA.toFixed(2);
    document.getElementById('gpa-modal').style.display = 'flex';
};

window.showStatusModal = function(id, currentStatus) {
    document.getElementById('status-student-id').value = id;
    document.getElementById('status').value = currentStatus;
    document.getElementById('status-modal').style.display = 'flex';
};

// Submit Handlers
async function handleStudentSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const studentData = {
        student_code: document.getElementById('student_code').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        major: document.getElementById('major').value
    };

    try {
        if (id) {
            await api.updateStudent(id, studentData);
        } else {
            await api.createStudent(studentData);
        }
        document.getElementById('student-modal').style.display = 'none';
        alert('Success!');
        loadStudents(currentStatusFilter === 'all' ? null : currentStatusFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function handleGPASubmit(e) {
    e.preventDefault();
    const id = document.getElementById('gpa-student-id').value;
    const gpa = parseFloat(document.getElementById('gpa').value);
    try {
        await api.updateGPA(id, gpa);
        document.getElementById('gpa-modal').style.display = 'none';
        alert('GPA Updated!');
        loadStudents(currentStatusFilter === 'all' ? null : currentStatusFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function handleStatusSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('status-student-id').value;
    const status = document.getElementById('status').value;
    try {
        await api.updateStatus(id, status);
        document.getElementById('status-modal').style.display = 'none';
        alert('Status Updated!');
        loadStudents(currentStatusFilter === 'all' ? null : currentStatusFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

window.deleteStudent = async function(id, status) {
    if (status === 'active') {
        alert('Cannot delete active student!');
        return;
    }
    if (!confirm('Are you sure?')) return;
    try {
        await api.deleteStudent(id);
        alert('Deleted!');
        loadStudents(currentStatusFilter === 'all' ? null : currentStatusFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}