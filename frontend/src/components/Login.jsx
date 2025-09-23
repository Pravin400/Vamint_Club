import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'

const Login = ({ isModal = false, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'admin'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, user } = useAuth()
  const navigate = useNavigate()

  // Navigate after successful login
  useEffect(() => {
    if (user) {
      if (isModal && onClose) onClose()
      if (user.userType === 'admin') navigate('/admin')
      else navigate('/student')
    }
  }, [user, navigate, isModal, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      if (response.data && response.data.success) {
        login(response.data)
      } else {
        setError(response.data?.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className={`${isModal ? '' : 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'} flex items-center justify-center`} style={{ zIndex: isModal ? 9999 : 'auto' }}>
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Vamint Club</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Choose your account type to continue</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select id="userType" name="userType" value={formData.userType} onChange={handleChange} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none sm:text-sm">
                <option value="admin">Admin</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleChange} />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none sm:text-sm" placeholder="Password" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {isModal && (
            <div className="text-center mt-2">
              <button type="button" className="text-sm text-gray-600 hover:underline" onClick={() => onClose && onClose()}>Close</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
