import axios from 'axios'

const API_BASE_URL = 'https://bonniest-refulgent-johanne.ngrok-free.dev'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}

// Admin API calls
export const adminAPI = {
  // Lecture management
  createLecture: (lectureData) => api.post('api/admin/lectures', lectureData),
  getAllLectures: () => api.get('api/admin/lectures'),
  updateLecture: (id, lectureData) => api.put(`api/admin/lectures/${id}`, lectureData),
  deleteLecture: (id) => api.delete(`api/admin/lectures/${id}`),
  getAllStudents: () => api.get('api/admin/students'),
  createStudent: (studentData) => api.post('api/admin/students', studentData),
  // Multipart endpoints (send FormData with 'data' JSON blob and optional 'image' file)
  createStudentMultipart: (formData) => api.post('api/admin/students/upload', formData),
  updateStudentMultipart: (id, formData) => api.put(`api/admin/students/${id}/upload`, formData),
  
  // Student management
  getStudent: (id) => api.get(`api/admin/students/${id}`),
  updateStudent: (id, studentData) => api.put(`api/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`api/admin/students/${id}`),
  
  // Admin management
  getAdmins: () => api.get('api/admin/admins'),
  createAdmin: (adminData) => api.post('api/admin/admins', adminData),
  createAdminMultipart: (formData) => api.post('api/admin/admins/upload', formData),
  getAdmin: (id) => api.get(`api/admin/admins/${id}`),
  updateAdmin: (id, adminData) => api.put(`api/admin/admins/${id}`, adminData),
  updateAdminMultipart: (id, formData) => api.put(`api/admin/admins/${id}/upload`, formData),
  deleteAdmin: (id) => api.delete(`api/admin/admins/${id}`),
  
  // Attendance management
  markAttendance: (attendanceData) => api.post('api/admin/attendance', attendanceData),
  getAttendanceForLecture: (lectureId) => api.get(`api/admin/lectures/${lectureId}/attendance`),
  getLectureAttendanceStats: (lectureId) => api.get(`api/admin/lectures/${lectureId}/attendance-stats`),
}

// Student API calls
export const studentAPI = {
  getUpcomingLectures: () => api.get('api/student/lectures/upcoming'),
  getAttendanceStats: (studentId) => api.get(`api/student/${studentId}/attendance-stats`),
}

export default api
