import React, { useState } from 'react'
import { FaEdit, FaSave, FaTimes, FaLock, FaTrash, FaCheck, FaCopy } from 'react-icons/fa'

// Password Change Modal
function PasswordModal({ isOpen, onClose, onSubmit, passwordData, onPasswordChange }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 animate-in fade-in scale-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <FaLock size={20} />
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={onPasswordChange}
              placeholder="Enter your current password"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={onPasswordChange}
              placeholder="Enter your new password"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 dark:bg-gray-700 dark:text-white transition-all"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">At least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={onPasswordChange}
              placeholder="Confirm your new password"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

// Delete Account Warning Modal
function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border-2 border-red-500 dark:border-red-600 animate-in fade-in scale-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <FaTrash size={24} />
            Delete Account
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-600 p-4 rounded">
            <p className="text-red-800 dark:text-red-200 font-semibold">⚠️ Warning</p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-2">
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>By deleting your account:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1 ml-4">
              <li>✗ All your courses will be removed</li>
              <li>✗ All your results and progress will be deleted</li>
              <li>✗ You won't be able to recover your data</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Profile Component
export default function Profile() {
  const [editMode, setEditMode] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    username: 'johndoe123',
    email: 'john@example.com',
    id: 'USER-2024-15847'
  })
  const [tempData, setTempData] = useState(profileData)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleEditClick = () => {
    setTempData(profileData)
    setEditMode(true)
  }

  const handleSaveClick = () => {
    setProfileData(tempData)
    setEditMode(false)
  }

  const handleCancelClick = () => {
    setTempData(profileData)
    setEditMode(false)
  }

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters!')
      return
    }
    alert('✅ Password changed successfully!')
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordModal(false)
  }

  const handleDeleteAccount = () => {
    alert('✅ Account deleted successfully!')
    setShowDeleteModal(false)
  }

  return (
    <div className='w-full h-max dark:bg-slate-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 flex flex-col gap-8 overflow-y-auto'>
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">👤 Profile Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
      </div>

      {/* Profile Information Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">📋 Profile Information</h3>
            <p className="text-blue-100 text-sm mt-1">Update your personal details</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <img src="https://i.pravatar.cc/150?img=1" alt="Profile" className="w-14 h-14 rounded-full border-2 border-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* ID Display - Top Right Corner */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(profileData.id)
                alert('✅ ID copied to clipboard!')
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-bold rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
              title="Click to copy"
            >
              🆔 ID: {profileData.id}
              <FaCheck size={14} />
            </button>
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Full Name
            </label>
            {editMode ? (
              <input
                type="text"
                value={tempData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 dark:bg-gray-700 dark:text-white transition-all"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
                {profileData.fullName}
              </div>
            )}
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Username
            </label>
            {editMode ? (
              <input
                type="text"
                value={tempData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 dark:bg-gray-700 dark:text-white transition-all"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
                @{profileData.username}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Email Address
            </label>
            {editMode ? (
              <input
                type="email"
                value={tempData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 dark:bg-gray-700 dark:text-white transition-all"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
                {profileData.email}
              </div>
            )}
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Member Since
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold">
              January 15, 2024
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {editMode ? (
              <>
                <button
                  onClick={handleSaveClick}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <FaCheck size={18} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelClick}
                  className="flex-1 py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaTimes size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <FaEdit size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <FaLock size={24} />
            🔐 Change Password
          </h3>
          <p className="text-orange-100 text-sm mt-1">Update your password to keep your account secure</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl shadow-lg overflow-hidden border-2 border-red-300 dark:border-red-900">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <FaTrash size={24} />
            ⚠️ Danger Zone
          </h3>
          <p className="text-red-100 text-sm mt-1">Irreversible actions - proceed with caution</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Delete Account:</strong> Once you delete your account, there is no going back. Please be certain. All your data will be permanently removed.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Modals */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        passwordData={passwordData}
        onPasswordChange={handlePasswordChange}
      />
      
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}