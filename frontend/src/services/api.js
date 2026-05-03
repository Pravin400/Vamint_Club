import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})


export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}


export const adminAPI = {

  createLecture: (lectureData) => api.post('/admin/lectures', lectureData),
  getAllLectures: () => api.get('/admin/lectures'),
  updateLecture: (id, lectureData) => api.put(`/admin/lectures/${id}`, lectureData),
  deleteLecture: (id) => api.delete(`/admin/lectures/${id}`),
  getAllStudents: () => api.get('/admin/students'),
  createStudent: (studentData) => api.post('/admin/students', studentData),

  createStudentMultipart: (formData) => api.post('/admin/students/upload', formData),
  updateStudentMultipart: (id, formData) => api.put(`/admin/students/${id}/upload`, formData),
  
  getStudent: (id) => api.get(`/admin/students/${id}`),
  updateStudent: (id, studentData) => api.put(`/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  
  getAdmins: () => api.get('/admin/admins'),
  createAdmin: (adminData) => api.post('/admin/admins', adminData),
  createAdminMultipart: (formData) => api.post('/admin/admins/upload', formData),
  getAdmin: (id) => api.get(`/admin/admins/${id}`),
  updateAdmin: (id, adminData) => api.put(`/admin/admins/${id}`, adminData),
  updateAdminMultipart: (id, formData) => api.put(`/admin/admins/${id}/upload`, formData),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
  
  markAttendance: (attendanceData) => api.post('/admin/attendance', attendanceData),
  getAttendanceForLecture: (lectureId) => api.get(`/admin/lectures/${lectureId}/attendance`),
  getLectureAttendanceStats: (lectureId) => api.get(`/admin/lectures/${lectureId}/attendance-stats`),
}

export const studentAPI = {
  getUpcomingLectures: () => api.get('/student/lectures/upcoming'),
  getAttendanceStats: (studentId) => api.get(`/student/${studentId}/attendance-stats`),
}

export default api
