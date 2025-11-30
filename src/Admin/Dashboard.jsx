import React, { useState } from 'react'
import { FaChartBar, FaUsers, FaFileAlt, FaSignOutAlt, FaBell, FaSearch, FaCog, FaHome, FaUserCog, FaDatabase } from 'react-icons/fa'
import { MdClose, MdMenu, MdArrowDropDown } from 'react-icons/md'
import Main_admin from './Main'

export default function Dashboard_admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState('light')
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const adminMenuItems = [
    { 
      name: 'Dashboard', 
      icon: <FaChartBar size={20} />,
      section: 'analytics'
    },
    { 
      name: 'Users', 
      icon: <FaUsers size={20} />,
      section: 'users'
    },
    { 
      name: 'Reports', 
      icon: <FaFileAlt size={20} />,
      section: 'reports'
    },
    { 
      name: 'System', 
      icon: <FaDatabase size={20} />,
      dropdown: ['Backup', 'Logs', 'Performance'],
      section: 'system'
    },
    { 
      name: 'Settings', 
      icon: <FaCog size={20} />,
      dropdown: ['General', 'Security', 'Notifications'],
      section: 'settings'
    },
  ]

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl flex flex-col border-r border-gray-700`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold">
                🛡️
              </div>
              <div>
                <p className="font-bold text-lg">Admin</p>
                <p className="text-xs text-gray-400">Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {adminMenuItems.map((item, idx) => (
            <div key={idx}>
              <div
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeMenu === item.name
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-lg'
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                {sidebarOpen && (
                  <>
                    <span className="font-semibold flex-1">{item.name}</span>
                    {item.dropdown && (
                      <MdArrowDropDown size={16} className={`transition-transform ${settingsOpen && item.name === 'Settings' ? 'rotate-180' : ''}`} />
                    )}
                  </>
                )}
              </div>

              {/* Dropdown - Sidebar Open */}
              {sidebarOpen && item.dropdown && activeMenu === item.name && settingsOpen && (
                <div className="pl-12 flex flex-col gap-1 mt-1">
                  {item.dropdown.map((sub, i) => (
                    <div
                      key={i}
                      className="py-2 px-4 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors cursor-pointer"
                    >
                      → {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-4 px-4 py-3 hover:bg-red-600 rounded-lg cursor-pointer transition-all">
            <FaSignOutAlt size={20} />
            {sidebarOpen && <span className="font-semibold">Log Out</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between`}>
          
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {activeMenu}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all`}
              />
            </div>

            {/* Notifications */}
            <button className={`relative p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <FaBell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-yellow-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt="Admin"
                className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-md"
              />
              <div className="hidden sm:block">
                <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Administrator
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Your Main Content Goes Here */}
        <div className={`flex-1 overflow-auto p-8 ${
          theme === 'dark'
            ? 'bg-gray-900'
            : 'bg-gray-50'
        }`}>
          <Main_admin />
        </div>
      </div>
    </div>
  )
}