import React, { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const handleLogout = () => {
    logout()
    // After logout, navigate to landing page
    window.location.href = '/'
  }
  const [lectures, setLectures] = useState([])
  const [students, setStudents] = useState([])
  const [admins, setAdmins] = useState([])
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [lectureStats, setLectureStats] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateStudentForm, setShowCreateStudentForm] = useState(false)
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false)
  const [activeTab, setActiveTab] = useState('lectures')
  const [loading, setLoading] = useState(false)

  const [newLecture, setNewLecture] = useState({
    title: '',
    description: '',
    dateTime: ''
  })

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    password: ''
  })

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [editingStudent, setEditingStudent] = useState(null)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [editingLecture, setEditingLecture] = useState(null)
  const [selectedLectureForAttendance, setSelectedLectureForAttendance] = useState('')
  const [pendingAttendance, setPendingAttendance] = useState({})

  useEffect(() => {
    fetchLectures()
    fetchStudents()
    fetchAdmins()
  }, [])

  const fetchLectures = async () => {
    try {
      const response = await adminAPI.getAllLectures()
      setLectures(response.data)
    } catch (error) {
      console.error('Error fetching lectures:', error)
    }
  }

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllStudents(); // ✅ matches api.js
      console.log('fetchStudents response:', res)
      setStudents(res.data);

    } catch (err) {
      console.error("Error fetching students", err, err.response ? err.response.data : null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await adminAPI.getAdmins()
      setAdmins(response.data)
    } catch (error) {
      console.error('Error fetching admins:', error)
    }
  }

  const fetchAttendance = async (lectureId) => {
    try {
      const response = await adminAPI.getAttendanceForLecture(lectureId)
      setAttendance(response.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const fetchLectureStats = async (lectureId) => {
    try {
      const response = await adminAPI.getLectureAttendanceStats(lectureId)
      setLectureStats(response.data)
    } catch (error) {
      console.error('Error fetching lecture stats:', error)
    }
  }

  const handleCreateLecture = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminAPI.createLecture(newLecture)
      setNewLecture({ title: '', description: '', dateTime: '' })
      setShowCreateForm(false)
      fetchLectures()
    } catch (error) {
      console.error('Error creating lecture:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditLecture = (lecture) => {
    setEditingLecture(lecture)
    setNewLecture({
      title: lecture.title || '',
      description: lecture.description || '',
      dateTime: lecture.dateTime ? new Date(lecture.dateTime).toISOString().slice(0,16) : ''
    })
    setShowCreateForm(true)
  }

  const handleUpdateLecture = async (e) => {
    e.preventDefault()
    if (!editingLecture) return
    setLoading(true)
    try {
      await adminAPI.updateLecture(editingLecture.id, newLecture)
      setEditingLecture(null)
      setNewLecture({ title: '', description: '', dateTime: '' })
      setShowCreateForm(false)
      fetchLectures()
    } catch (error) {
      console.error('Error updating lecture:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLecture = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return
    setLoading(true)
    try {
      await adminAPI.deleteLecture(id)
      
      if (selectedLecture?.id === id) {
        setSelectedLecture(null)
        setLectureStats(null)
        setAttendance([])
      }
      fetchLectures()
    } catch (error) {
      console.error('Error deleting lecture:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.createStudent(newStudent);
      fetchStudents(); // refresh
      setNewStudent({ name: "", email: "", rollNo: "", password: "" });
      setShowCreateStudentForm(false);
    } catch (err) {
      console.error("Error creating student", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminAPI.createAdmin(newAdmin)
      setNewAdmin({ name: '', email: '', password: '' })
      setShowCreateAdminForm(false)
      fetchAdmins()
    } catch (error) {
      console.error('Error creating admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (studentId, present) => {
    try {
      const res = await adminAPI.markAttendance({
        studentId,
        lectureId: selectedLecture.id,
        present
      })
      console.log('markAttendance response:', res)
      fetchAttendance(selectedLecture.id)
      fetchLectureStats(selectedLecture.id)
    } catch (error) {
      console.error('Error marking attendance:', error, error.response ? error.response.data : null)
      // surface a user-friendly message when possible
      if (error.response && error.response.data) {
        alert('Failed to mark attendance: ' + (error.response.data.error || JSON.stringify(error.response.data)))
      }
    }
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      password: "",
    });
    setShowCreateStudentForm(true);
  };

// Update student
const handleUpdateStudent = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await adminAPI.updateStudent(editingStudent.id, newStudent);
    fetchStudents();
    setEditingStudent(null);
    setNewStudent({ name: "", email: "", rollNo: "", password: "" });
    setShowCreateStudentForm(false);
  } catch (err) {
    console.error("Error updating student", err);
  } finally {
    setLoading(false);
  }
};

// Delete student
const handleDeleteStudent = async (id) => {
  setLoading(true);
  try {
    await adminAPI.deleteStudent(id);
    fetchStudents();
  } catch (err) {
    console.error("Error deleting student", err);
  } finally {
    setLoading(false);
  }
};

  // Admin CRUD handlers
  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin)
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      password: '' // Don't pre-fill password for security
    })
    setShowCreateAdminForm(true)
  }

  const handleUpdateAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminAPI.updateAdmin(editingAdmin.id, newAdmin)
      setNewAdmin({ name: '', email: '', password: '' })
      setEditingAdmin(null)
      setShowCreateAdminForm(false)
      fetchAdmins()
    } catch (error) {
      console.error('Error updating admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async (id) => {
    // Prevent self-deletion
    if (id === user?.userId) {
      alert('You cannot delete your own admin account!')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await adminAPI.deleteAdmin(id)
        fetchAdmins()
      } catch (error) {
        console.error('Error deleting admin:', error)
      }
    }
  }

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture)
    fetchAttendance(lecture.id)
    fetchLectureStats(lecture.id)
  }

  const exportToPDF = () => {
    // Simple PDF export functionality
    const printWindow = window.open('', '_blank')
    const content = `
      <html>
        <head>
          <title>Attendance Report - ${selectedLecture?.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .present { color: green; }
            .absent { color: red; }
          </style>
        </head>
        <body>
          <h1>Attendance Report</h1>
          <h2>${selectedLecture?.title}</h2>
          <p><strong>Date:</strong> ${selectedLecture ? format(new Date(selectedLecture.dateTime), 'PPP p') : ''}</p>
          <p><strong>Total Students:</strong> ${lectureStats?.totalStudents || 0}</p>
          <p><strong>Present:</strong> ${lectureStats?.presentCount || 0}</p>
          <p><strong>Absent:</strong> ${lectureStats?.absentCount || 0}</p>
          <p><strong>Attendance Percentage:</strong> ${lectureStats?.attendancePercentage?.toFixed(1) || 0}%</p>
          
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${attendance.map(a => `
                <tr>
                  <td>${a.studentName}</td>
                  <td>${a.studentRollNo}</td>
                  <td class="${a.present ? 'present' : 'absent'}">${a.present ? 'Present' : 'Absent'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  const pieData = lectureStats ? [
    { name: 'Present', value: lectureStats.presentCount, color: '#10B981' },
    { name: 'Absent', value: lectureStats.absentCount, color: '#EF4444' }
  ] : []

  const COLORS = ['#10B981', '#EF4444']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Upcoming Lectures Schedule */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Lectures Schedule</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lectures
                .filter(lecture => new Date(lecture.dateTime) > new Date())
                .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
                .slice(0, 6)
                .map((lecture) => (
                  <div key={lecture.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2">{lecture.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      📅 {format(new Date(lecture.dateTime), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      🕐 {format(new Date(lecture.dateTime), 'h:mm a')}
                    </p>
                    {lecture.description && (
                      <p className="text-sm text-gray-500">{lecture.description}</p>
                    )}
                  </div>
                ))}
            </div>
            {lectures.filter(lecture => new Date(lecture.dateTime) > new Date()).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No upcoming lectures scheduled
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'lectures', name: 'Lectures' },
                { id: 'students', name: 'Students' },
                { id: 'admins', name: 'Admins' },
                { id: 'attendance', name: 'Attendance' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Lecture Management</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {showCreateForm ? 'Cancel' : 'Create Lecture'}
                </button>
              </div>

              {showCreateForm && (
                <form onSubmit={editingLecture ? handleUpdateLecture : handleCreateLecture} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Create New Lecture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newLecture.title}
                        onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={newLecture.dateTime}
                        onChange={(e) => setNewLecture({ ...newLecture, dateTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newLecture.description}
                      onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (editingLecture ? 'Updating...' : 'Creating...') : (editingLecture ? 'Update Lecture' : 'Create Lecture')}
                  </button>
                  {editingLecture && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLecture(null)
                        setNewLecture({ title: '', description: '', dateTime: '' })
                        setShowCreateForm(false)
                      }}
                      className="ml-3 mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedLecture?.id === lecture.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start" onClick={() => handleLectureSelect(lecture)} style={{cursor: 'pointer'}}>
                      <div>
                        <h4 className="font-medium text-gray-900">{lecture.title}</h4>
                        <p className="text-sm text-gray-600">{format(new Date(lecture.dateTime), 'PPP p')}</p>
                        {lecture.description && (
                          <p className="text-sm text-gray-500 mt-1">{lecture.description}</p>
                        )}
                      </div>
                      <div className="flex items-start space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditLecture(lecture) }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteLecture(lecture.id) }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
                <button
                  onClick={() => setShowCreateStudentForm(!showCreateStudentForm)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {showCreateStudentForm ? 'Cancel' : 'Add Student'}
                </button>
              </div>

              {showCreateStudentForm && (
                <form onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={newStudent.rollNo}
                        onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={newStudent.password}
                        onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (editingStudent ? 'Updating...' : 'Adding...') : (editingStudent ? 'Update Student' : 'Add Student')}
                    </button>
                    {editingStudent && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStudent(null)
                          setNewStudent({ name: '', email: '', rollNo: '', password: '' })
                          setShowCreateStudentForm(false)
                        }}
                        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditStudent(student)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                  <p className="text-gray-600">Add some students to get started!</p>
                </div>
              )}
            </div>

            {/* Student Attendance Quick View */}
            {students.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Student List with Attendance Actions</h3>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">Roll: {student.rollNo} | Email: {student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
                <button
                  onClick={() => setShowCreateAdminForm(!showCreateAdminForm)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {showCreateAdminForm ? 'Cancel' : 'Add Admin'}
                </button>
              </div>

              {showCreateAdminForm && (
                <form onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (editingAdmin ? 'Updating...' : 'Adding...') : (editingAdmin ? 'Update Admin' : 'Add Admin')}
                    </button>
                    {editingAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAdmin(null)
                          setNewAdmin({ name: '', email: '', password: '' })
                          setShowCreateAdminForm(false)
                        }}
                        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAdmin(admin)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
                              disabled={admin.id === user?.userId}
                              className={`${admin.id === user?.userId 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-900'
                              }`}
                              title={admin.id === user?.userId ? 'Cannot delete your own account' : 'Delete admin'}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Attendance Management</h2>
              
              {/* Lecture Selection Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Lecture</label>
                <select
                  value={selectedLectureForAttendance}
                  onChange={(e) => {
                    const lectureId = e.target.value
                    setSelectedLectureForAttendance(lectureId)
                    if (lectureId) {
                      const lecture = lectures.find(l => l.id === parseInt(lectureId))
                      setSelectedLecture(lecture)
                      fetchAttendance(lecture.id)        // <-- corrected function
                      fetchLectureStats(lecture.id)      // <-- also fetch stats
                    } else {
                      setSelectedLecture(null)
                      setLectureStats(null)
                      setAttendance([])
                    }
                    
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a lecture...</option>
                  {lectures.map((lecture) => (
                    <option key={lecture.id} value={lecture.id}>
                      {lecture.title} - {format(new Date(lecture.dateTime), 'MMM dd, yyyy h:mm a')}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedLecture ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Lecture: {selectedLecture.title}</h3>
                    <button
                      onClick={exportToPDF}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Export PDF
                    </button>
                  </div>

                  {lectureStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-blue-700">{lectureStats.totalStudents}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">Present</p>
                        <p className="text-2xl font-bold text-green-700">{lectureStats.presentCount}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-600 font-medium">Absent</p>
                        <p className="text-2xl font-bold text-red-700">{lectureStats.absentCount}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 font-medium">Attendance %</p>
                        <p className="text-2xl font-bold text-purple-700">{lectureStats.attendancePercentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  )}

                  {lectureStats && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="h-64">
                        <h4 className="text-md font-medium text-gray-700 mb-2 text-center">Attendance Distribution</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="h-64">
                        <h4 className="text-md font-medium text-gray-700 mb-2 text-center">Attendance Overview</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Present', count: lectureStats.presentCount },
                            { name: 'Absent', count: lectureStats.absentCount }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Mark Attendance</h4>
                    
                    {/* Quick Mark All Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-700 mb-3">Quick Actions</h5>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            const map = {}
                            students.forEach(student => { map[student.id] = true })
                            setPendingAttendance(map)
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark All Present (local)
                        </button>
                        <button
                          onClick={() => {
                            const map = {}
                            students.forEach(student => { map[student.id] = false })
                            setPendingAttendance(map)
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Mark All Absent (local)
                        </button>
                        <button
                          onClick={async () => {
                            if (!selectedLecture) { alert('Select a lecture first'); return }
                            setLoading(true)
                            try {
                              const entries = Object.entries(pendingAttendance)
                              for (const [studentId, present] of entries) {
                                await adminAPI.markAttendance({ studentId: Number(studentId), lectureId: selectedLecture.id, present })
                              }
                              alert('Attendance saved')
                              fetchAttendance(selectedLecture.id)
                              fetchLectureStats(selectedLecture.id)
                              setPendingAttendance({})
                            } catch (err) {
                              console.error('Error saving attendance', err)
                              alert('Failed to save attendance')
                            } finally {
                              setLoading(false)
                            }
                          }}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Save Attendance
                        </button>
                      </div>
                    </div>

                    {/* Individual Student Attendance */}
                    <div className="space-y-2">
                      {students.map((student) => {
                        const studentAttendance = attendance.find(a => a.studentRollNo === student.rollNo)
                        const pending = pendingAttendance[student.id]
                        return (
                          <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-600">Roll: {student.rollNo} | Email: {student.email}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setPendingAttendance({ ...pendingAttendance, [student.id]: true })}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  (pending === true || (pending === undefined && studentAttendance?.present === true))
                                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-green-50 hover:border-green-300'
                                }`}
                              >
                                ✓ Present
                              </button>
                              <button
                                onClick={() => setPendingAttendance({ ...pendingAttendance, [student.id]: false })}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  (pending === false || (pending === undefined && studentAttendance?.present === false))
                                    ? 'bg-red-100 text-red-800 border-2 border-red-300'
                                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-red-50 hover:border-red-300'
                                }`}
                              >
                                ✗ Absent
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Select a lecture to manage attendance</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard