
import React, { useState, useEffect } from 'react';
import { FaUsers, FaChalkboardTeacher, FaChartBar, FaCog, FaDownload, FaTrash, FaEdit, FaPlus, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import API from "../api"; // ✅ Use centralized API
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchFaculty();
  }, []);

  // ✅ Dark Mode Toggle
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newMode));
  };

  // ✅ Fetch All Students
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch All Faculty
  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/faculty');
      setFaculty(response.data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Student
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // ✅ Delete Faculty
  const handleDeleteFaculty = async (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await API.delete(`/admin/faculty/${facultyId}`);
        fetchFaculty();
      } catch (error) {
        console.error('Error deleting faculty:', error);
      }
    }
  };

  // ✅ Modal Open/Close
  const openModal = (type, data = null) => {
    setModalType(type);
    setSelectedUser(data);
    if (type === 'add' || type === 'addFaculty') {
      setFormData({});
    } else if (data) {
      setFormData(data);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // ✅ Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Add / Edit Student & Faculty
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalType === 'add') {
        await API.post('/admin/users', formData);
        fetchUsers();
      } else if (modalType === 'edit') {
        await API.put(`/admin/users/${selectedUser._id}`, formData);
        fetchUsers();
      } else if (modalType === 'addFaculty') {
        await API.post('/admin/faculty', formData);
        fetchFaculty();
      } else if (modalType === 'editFaculty') {
        await API.put(`/admin/faculty/${selectedUser._id}`, formData);
        fetchFaculty();
      }
      closeModal();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Professional Dashboard Cards with Dark Mode
  const renderDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 sm:p-6 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm`}>
        <div className="flex items-center">
          <div className={`${isDarkMode ? 'bg-blue-900/50' : 'bg-gradient-to-br from-blue-100 to-blue-200'} p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-lg`}>
            <FaUsers className={`text-lg sm:text-2xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Total Students</p>
            {loading ? (
              <div className={`animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-6 sm:h-8 w-12 sm:w-16 rounded-lg`}></div>
            ) : (
              <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{users.length || 0}</p>
            )}
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <p className="text-xs font-medium text-green-500">Active</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 sm:p-6 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm`}>
        <div className="flex items-center">
          <div className={`${isDarkMode ? 'bg-green-900/50' : 'bg-gradient-to-br from-green-100 to-green-200'} p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-lg`}>
            <FaChalkboardTeacher className={`text-lg sm:text-2xl ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Total Faculty</p>
            {loading ? (
              <div className={`animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} h-6 sm:h-8 w-12 sm:w-16 rounded-lg`}></div>
            ) : (
              <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{faculty.length || 0}</p>
            )}
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <p className="text-xs font-medium text-green-500">Available</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 sm:p-6 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm`}>
        <div className="flex items-center">
          <div className={`${isDarkMode ? 'bg-yellow-900/50' : 'bg-gradient-to-br from-yellow-100 to-yellow-200'} p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-lg`}>
            <FaChartBar className={`text-lg sm:text-2xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Active Sessions</p>
            <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>12</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <p className="text-xs font-medium text-blue-500">+2 today</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 sm:p-6 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm`}>
        <div className="flex items-center">
          <div className={`${isDarkMode ? 'bg-purple-900/50' : 'bg-gradient-to-br from-purple-100 to-purple-200'} p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-lg`}>
            <FaCog className={`text-lg sm:text-2xl ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>System Status</p>
            <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Online</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <p className="text-xs font-medium text-green-500">99.9% uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border backdrop-blur-sm`}>
      <div className={`p-4 sm:p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Student Management</h2>
          <button
            onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPlus className="mr-2" />
            Add Student
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`mt-4 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading students...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className={`mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <FaUsers className="mx-auto h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No students found</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get started by adding your first student.</p>
          </div>
        ) : (
          <div className="block sm:hidden">
            {/* Mobile Card View */}
            {users.map((user) => (
              <div key={user._id} className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center shadow-lg`}>
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{user.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.rollNo || 'N/A'} • {user.department || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('edit', user)}
                      className={`text-indigo-500 hover:text-indigo-400 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} transition-all duration-200 transform hover:scale-110`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className={`text-red-500 hover:text-red-400 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} transition-all duration-200 transform hover:scale-110`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Desktop Table View */}
        {!loading && users.length > 0 && (
          <div className="hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Roll No</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Department</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {users.map((user) => (
                  <tr key={user._id} className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 lg:h-10 lg:w-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center shadow-lg`}>
                          <span className={`text-xs lg:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{user.name?.charAt(0)}</span>
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{user.email}</td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{user.rollNo || 'N/A'}</td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{user.department || 'N/A'}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal('edit', user)}
                        className={`text-indigo-500 hover:text-indigo-400 mr-3 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} transition-all duration-200 transform hover:scale-110`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className={`text-red-500 hover:text-red-400 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} transition-all duration-200 transform hover:scale-110`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderFacultyTab = () => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border backdrop-blur-sm`}>
      <div className={`p-4 sm:p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Faculty Management</h2>
          <button
            onClick={() => openModal('addFaculty')}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPlus className="mr-2" />
            Add Faculty
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className={`mt-4 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading faculty...</p>
          </div>
        ) : faculty.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className={`mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <FaChalkboardTeacher className="mx-auto h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No faculty found</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get started by adding your first faculty member.</p>
          </div>
        ) : (
          <div className="block sm:hidden">
            {/* Mobile Card View */}
            {faculty.map((fac) => (
              <div key={fac._id} className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center shadow-lg`}>
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{fac.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{fac.name}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{fac.email}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{fac.department || 'N/A'} • {fac.subject || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('editFaculty', fac)}
                      className={`text-indigo-500 hover:text-indigo-400 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} transition-all duration-200 transform hover:scale-110`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteFaculty(fac._id)}
                      className={`text-red-500 hover:text-red-400 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} transition-all duration-200 transform hover:scale-110`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Desktop Table View */}
        {!loading && faculty.length > 0 && (
          <div className="hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Department</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Subject</th>
                  <th className={`px-4 lg:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {faculty.map((fac) => (
                  <tr key={fac._id} className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 lg:h-10 lg:w-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center shadow-lg`}>
                          <span className={`text-xs lg:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{fac.name?.charAt(0)}</span>
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{fac.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{fac.email}</td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{fac.department || 'N/A'}</td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{fac.subject || 'N/A'}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal('editFaculty', fac)}
                        className={`text-indigo-500 hover:text-indigo-400 mr-3 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} transition-all duration-200 transform hover:scale-110`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteFaculty(fac._id)}
                        className={`text-red-500 hover:text-red-400 p-2 rounded-xl hover:${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} transition-all duration-200 transform hover:scale-110`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 sm:p-6 rounded-2xl shadow-xl border backdrop-blur-sm`}>
        <h3 className={`text-base sm:text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>System Settings</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Auto-backup enabled</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className={`w-10 h-5 sm:w-11 sm:h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className={`w-10 h-5 sm:w-11 sm:h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Maintenance mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className={`w-10 h-5 sm:w-11 sm:h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 sm:p-6 rounded-2xl shadow-xl border backdrop-blur-sm`}>
        <h3 className={`text-base sm:text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Database Management</h3>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
            Create Backup
          </button>
          <button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
            Restore Backup
          </button>
          <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
            Optimize Database
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Header with Dark Mode Toggle */}
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white shadow-2xl backdrop-blur-sm border ${isDarkMode ? 'border-gray-700' : 'border-white/20'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className={`text-sm sm:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-blue-100'}`}>
                Manage your smart attendance system
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/20 hover:bg-white/30'} px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-300 text-sm font-medium backdrop-blur-sm`}
              >
                {isDarkMode ? (
                  <FaSun className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                ) : (
                  <FaMoon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-200" />
                )}
                <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              
              <button
                onClick={() => {
                  setLoading(true);
                  fetchUsers();
                  fetchFaculty();
                }}
                className={`w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/20 hover:bg-white/30'} px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-300 text-sm font-medium backdrop-blur-sm`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh Data</span>
                <span className="sm:hidden">Refresh</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
              
              <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'} p-3 sm:p-4 rounded-2xl backdrop-blur-sm shadow-lg`}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Navigation Tabs with Dark Mode */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl mb-6 sm:mb-8 border backdrop-blur-sm`}>
          <nav className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 p-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: FaChartBar },
              { id: 'users', name: 'Students', icon: FaUsers },
              { id: 'faculty', name: 'Faculty', icon: FaChalkboardTeacher },
              { id: 'settings', name: 'Settings', icon: FaCog }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-2 border-blue-400'
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-2 border-blue-200 shadow-lg'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`mr-1 sm:mr-2 text-sm sm:text-lg ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                <span className="hidden xs:inline sm:inline">{tab.name}</span>
                <span className="xs:hidden sm:hidden">{tab.name.charAt(0)}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'faculty' && renderFacultyTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>

        {/* Professional Modal with Dark Mode */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
            <div className={`relative top-4 sm:top-10 lg:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-96 max-w-md shadow-2xl rounded-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
              <div className="mt-3">
                <h3 className={`text-base sm:text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {modalType === 'add'
                    ? 'Add New Student'
                    : modalType === 'edit'
                    ? 'Edit Student'
                    : modalType === 'addFaculty'
                    ? 'Add New Faculty'
                    : 'Edit Faculty'}
                </h3>
                <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`mt-1 block w-full border rounded-xl px-3 py-2 text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`mt-1 block w-full border rounded-xl px-3 py-2 text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                  {(modalType === 'add' || modalType === 'addFaculty') && (
                    <div>
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password (optional)</label>
                      <input
                        type="password"
                        name="password"
                        className={`mt-1 block w-full border rounded-xl px-3 py-2 text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
                        value={formData.password || ''}
                        onChange={handleChange}
                        placeholder="Leave blank to auto-generate"
                      />
                    </div>
                  )}
                  {(modalType === 'add' || modalType === 'edit') && (
                    <>
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Roll No</label>
                        <input
                          type="text"
                          name="rollNo"
                          className={`mt-1 block w-full border rounded-xl px-3 py-2 text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
                          value={formData.rollNo || ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</label>
                        <select
                          name="department"
                          className={`mt-1 block w-full border rounded-xl px-3 py-2 text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
                          value={formData.department || ''}
                          onChange={handleChange}
                        >
                          <option value="">Select Department</option>
                          <option>Computer Science</option>
                          <option>Electrical Engineering</option>
                          <option>Mechanical Engineering</option>
                          <option>Civil Engineering</option>
                        </select>
                      </div>
                    </>
                  )}
                  {(modalType === 'addFaculty' || modalType === 'editFaculty') && (
                    <>
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</label>
                        <select
                          name="department"
                          className={`mt-1 block w-full border rounded-xl px-3 py-2 text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
                          value={formData.department || ''}
                          onChange={handleChange}
                        >
                          <option value="">Select Department</option>
                          <option>Computer Science</option>
                          <option>Electrical Engineering</option>
                          <option>Mechanical Engineering</option>
                          <option>Civil Engineering</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                        <input
                          type="text"
                          name="subject"
                          className={`mt-1 block w-full border rounded-xl px-3 py-2 text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
                          value={formData.subject || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {modalType.includes('add') ? 'Add' : 'Update'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
 
