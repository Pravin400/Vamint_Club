import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}

// Admin API calls
export const adminAPI = {
  // Lecture management
  createLecture: (lectureData) => api.post('/admin/lectures', lectureData),
  getAllLectures: () => api.get('/admin/lectures'),
  updateLecture: (id, lectureData) => api.put(`/admin/lectures/${id}`, lectureData),
  deleteLecture: (id) => api.delete(`/admin/lectures/${id}`),
  getAllStudents: () => api.get('/admin/students'),
  createStudent: (studentData) => api.post('/admin/students', studentData),
  
  // Student management
  getStudent: (id) => api.get(`/admin/students/${id}`),
  updateStudent: (id, studentData) => api.put(`/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  
  // Admin management
  getAdmins: () => api.get('/admin/admins'),
  createAdmin: (adminData) => api.post('/admin/admins', adminData),
  getAdmin: (id) => api.get(`/admin/admins/${id}`),
  updateAdmin: (id, adminData) => api.put(`/admin/admins/${id}`, adminData),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
  
  // Attendance management
  markAttendance: (attendanceData) => api.post('/admin/attendance', attendanceData),
  getAttendanceForLecture: (lectureId) => api.get(`/admin/lectures/${lectureId}/attendance`),
  getLectureAttendanceStats: (lectureId) => api.get(`/admin/lectures/${lectureId}/attendance-stats`),
}

// Student API calls
export const studentAPI = {
  getUpcomingLectures: () => api.get('/student/lectures/upcoming'),
  getAttendanceStats: (studentId) => api.get(`/student/${studentId}/attendance-stats`),
}

export default api
