import React, { useEffect, useState } from 'react'
import { Search, MoreVertical, Shield, Crown } from 'lucide-react'
import api from '../api'

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)

  // Sample users data
  const [users, setUsers] = useState()

  // Filter users based on search query
  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function fetchUsers() {
    api.get("/user/users").then(res => {
      setUsers(res.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const toggleAdmin = (userId) => {
    const user = users.filter(u => u.id == userId)[0];
    if (user.role === "user") {
      api.post("/user/promote", { id: userId }).then(res => {
        console.log(res);
      }).catch(err => {
        alert("Error in promoting. (See console)")
        console.log(err);
      })
    } else {
      api.post("/user/demote", { id: userId }).then(res => {
        console.log(res);
      }).catch(err => {
        alert("Error in demoting. (See console)")
        console.log(err);
      })
    }
    fetchUsers();
    setOpenDropdown(null)
  }

  const togglePremium = (userId) => {
    api.post("/user/premium",{id:userId}).then(res=>{
      alert("Success")
    }).catch(err=>{
      alert("Error in preimum function")
      console.log(err);
    })
    setOpenDropdown(null)
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  if (!users){
    return (
      <div>
      Loading...
      </div>
    )
  }

  return (
    <div className='w-full h-full flex flex-col gap-5 p-6'>
      <h2 className="text-slate-700 text-4xl font-semibold">Users</h2>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users by username or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Premium
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    #{user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {user.username}
                      </span>
                      {user.is_admin && (
                        <Shield className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.premium_duration && new Date(user.premium_duration) > new Date() ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                        <span className="text-xs text-slate-500">
                          Until {new Date(user.premium_duration).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        Free
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === user.id && (
                      <div className='z-[999]'>
                        <div
                          className="fixed inset-0"
                          onClick={() => setOpenDropdown(null)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                          <div className="py-1">
                            <button
                              onClick={() => toggleAdmin(user.id)}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              {user.role==="admin" ? 'Demote from Admin' : 'Promote to Admin'}
                            </button>
                            <button
                              onClick={() => togglePremium(user.id)}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <Crown className="w-4 h-4" />
                              {user.is_premium ? 'Remove Premium' : 'Give Premium'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  )
}