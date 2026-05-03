import React, { useState, useEffect } from 'react'
import { studentAPI } from '../services/api'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }
  const [upcomingLectures, setUpcomingLectures] = useState([])
  const [attendanceStats, setAttendanceStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUpcomingLectures()
    fetchAttendanceStats()
  }, [user])

  const fetchUpcomingLectures = async () => {
    try {
      const response = await studentAPI.getUpcomingLectures()
      setUpcomingLectures(response.data)
    } catch (error) {
      console.error('Error fetching upcoming lectures:', error)
    }
  }

  const fetchAttendanceStats = async () => {
    if (!user?.userId) return
    
    setLoading(true)
    try {
      const response = await studentAPI.getAttendanceStats(user.userId)
      setAttendanceStats(response.data)
    } catch (error) {
      console.error('Error fetching attendance stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Data for pie chart
  const pieData = attendanceStats ? [
    { name: 'Present', value: attendanceStats.presentCount, color: '#10B981' },
    { name: 'Absent', value: attendanceStats.absentCount, color: '#EF4444' }
  ] : []

  // Data for bar chart
  const barData = attendanceStats ? [
    { name: 'Present', count: attendanceStats.presentCount, color: '#10B981' },
    { name: 'Absent', count: attendanceStats.absentCount, color: '#EF4444' },
    { name: 'Total', count: attendanceStats.totalLectures, color: '#6B7280' }
  ] : []

  const COLORS = ['#10B981', '#EF4444']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Lectures */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Lectures</h3>
              <div className="space-y-3">
                {upcomingLectures.length > 0 ? (
                  upcomingLectures.map((lecture) => (
                    <div key={lecture.id} className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">{lecture.title}</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(lecture.dateTime), 'PPP p')}
                      </p>
                      {lecture.description && (
                        <p className="text-sm text-gray-500 mt-1">{lecture.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Lectures</h3>
                    <p className="text-gray-600">Check back later for new lecture schedules!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance Statistics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Attendance Statistics</h3>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : attendanceStats ? (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Present</p>
                      <p className="text-2xl font-bold text-green-700">{attendanceStats.presentCount}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Absent</p>
                      <p className="text-2xl font-bold text-red-700">{attendanceStats.absentCount}</p>
                    </div>
                  </div>

                  {/* Attendance Percentage */}
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-primary-600 font-medium">Attendance Percentage</p>
                    <p className="text-3xl font-bold text-primary-700">
                      {attendanceStats.attendancePercentage.toFixed(1)}%
                    </p>
                  </div>

                  {/* Pie Chart */}
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

                  {/* Bar Chart */}
                  <div className="h-64">
                    <h4 className="text-md font-medium text-gray-700 mb-2 text-center">Attendance Overview</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
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
              ) : (
                <p className="text-gray-500 text-center py-4">No attendance data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
