import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { adminDashboardAPI } from '../services/adminAPI';
import { 
  Users, 
  Video, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Play,
  Trash2,
  Edit,
  LogOut
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [videoFilters, setVideoFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });

  // Check admin authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      
      console.log('AdminDashboard - Token:', adminToken);
      console.log('AdminDashboard - User:', adminUser);
      
      if (!adminToken || !adminUser) {
        console.log('No admin token or user found, redirecting to admin login');
        navigate('/admin/login');
        return;
      }
      
      // Validate token with server
      const isValid = await validateToken();
      if (!isValid) {
        console.log('Token validation failed, redirecting to admin login');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }
      
      console.log('Admin dashboard loaded successfully');
    };
    
    checkAuth();
    
    // Check auth every 60 seconds (increased from 30)
    const authInterval = setInterval(checkAuth, 60000);
    
    return () => clearInterval(authInterval);
  }, [navigate]);

  // Manual overview data fetch
  const [overviewDataManual, setOverviewDataManual] = useState(null);

  const fetchOverview = async () => {
    try {
      console.log('🔍 Manually fetching admin overview...');
      
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔑 Using admin token for overview:', adminToken);
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard/overview', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📊 Manual Overview API Response Status:', response.status);
      const data = await response.json();
      console.log('📊 Manual Overview API Response Data:', data);
      
      if (response.ok) {
        console.log('✅ Manual Overview API successful!');
        setOverviewDataManual(data);
      } else {
        console.log('❌ Manual Overview API failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Manual Overview API error:', error);
    } finally {
      // Loading completed
    }
  };

  // Test manual fetch on mount
  useEffect(() => {
    console.log('🔍 Testing manual fetch on mount...');
    // Test overview fetch
    fetchOverview();
    // Test users fetch
    fetchUsers();
    // Test videos fetch  
    fetchVideos();
  }, []);

  // Add token validation function
  const validateToken = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) return false;
      
      const response = await fetch('http://localhost:5000/api/admin/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // Fetch overview data
  const { data: overviewData } = useQuery(
    'adminOverview',
    adminDashboardAPI.getOverview,
    {
      refetchInterval: 30000,
      onSuccess: (data) => {
        console.log('Admin Overview: Data received:', data);
      },
      onError: (error) => {
        console.error('Admin Overview: Error:', error);
      }
    }
  );

  // Manual videos data fetch
  const [videosData, setVideosData] = useState(null);
  const [videosLoading, setVideosLoading] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      setVideosLoading(true);
      console.log('🔍 Manually fetching admin videos with filters:', videoFilters);
      
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔑 Using admin token:', adminToken);
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard/videos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📊 Manual Videos API Response Status:', response.status);
      const data = await response.json();
      console.log('📊 Manual Videos API Response Data:', data);
      
      if (response.ok) {
        console.log('✅ Manual Videos API successful!');
        setVideosData(data);
      } else {
        console.log('❌ Manual Videos API failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Manual Videos API error:', error);
    } finally {
      setVideosLoading(false);
    }
  }, [videoFilters]);

  // Refetch videos function
  const refetchVideos = () => {
    console.log('🔄 Refetching videos...');
    fetchVideos();
  };

  // Fetch videos when video section is active
  useEffect(() => {
    console.log('🔍 useEffect - activeSection changed to:', activeSection, 'videoFilters:', videoFilters);
    if (activeSection === 'videos') {
      console.log('🔍 useEffect - Calling fetchVideos()');
      fetchVideos();
    }
  }, [activeSection, videoFilters, fetchVideos]);

  // Fetch users when users section is active
  useEffect(() => {
    console.log('🔍 useEffect - activeSection changed to:', activeSection);
    if (activeSection === 'users') {
      console.log('🔍 useEffect - Calling fetchUsers()');
      fetchUsers();
    }
  }, [activeSection]);

  // Fetch payments when payments section is active
  useEffect(() => {
    console.log('🔍 useEffect - activeSection changed to:', activeSection);
    if (activeSection === 'payments') {
      console.log('🔍 useEffect - Calling fetchPayments() and fetchEligibleUsers()');
      fetchPayments();
      fetchEligibleUsers();
    }
  }, [activeSection]);

  // Manual users data fetch
  const [usersData, setUsersData] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      console.log('🔍 Manually fetching admin users...');
      
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔑 Using admin token for users:', adminToken);
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📊 Manual Users API Response Status:', response.status);
      const data = await response.json();
      console.log('📊 Manual Users API Response Data:', data);
      
      if (response.ok) {
        console.log('✅ Manual Users API successful!');
        setUsersData(data);
      } else {
        console.log('❌ Manual Users API failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Manual Users API error:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Refetch users function
  const refetchUsers = () => {
    console.log('🔄 Refetching users...');
    fetchUsers();
  };

  // Manual payments data fetch
  const [paymentsData, setPaymentsData] = useState(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  
  // Eligible users data fetch
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [eligibleUsersLoading, setEligibleUsersLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);
      console.log('🔍 Manually fetching admin payments...');
      
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔑 Using admin token for payments:', adminToken);
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard/payments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📊 Manual Payments API Response Status:', response.status);
      const data = await response.json();
      console.log('📊 Manual Payments API Response Data:', data);
      
      if (response.ok) {
        console.log('✅ Manual Payments API successful!');
        setPaymentsData(data);
      } else {
        console.log('❌ Manual Payments API failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Manual Payments API error:', error);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Refetch payments function
  const refetchPayments = () => {
    console.log('🔄 Refetching payments...');
    fetchPayments();
  };

  // Fetch eligible users
  const fetchEligibleUsers = async () => {
    try {
      setEligibleUsersLoading(true);
      console.log('🔍 Manually fetching eligible users...');
      
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔑 Using admin token for eligible users:', adminToken);
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard/eligible-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📊 Manual Eligible Users API Response Status:', response.status);
      const data = await response.json();
      console.log('📊 Manual Eligible Users API Response Data:', data);
      
      if (response.ok) {
        console.log('✅ Manual Eligible Users API successful!');
        setEligibleUsers(data.data || []);
      } else {
        console.log('❌ Manual Eligible Users API failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Manual Eligible Users API error:', error);
    } finally {
      setEligibleUsersLoading(false);
    }
  };

  // Create payment for user
  const createPaymentForUser = async (userId) => {
    try {
      console.log('🔍 Creating payment for user:', userId);
      
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/admin/dashboard/create-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: 100,
          paymentMethod: 'manual',
          adminNotes: 'Payment created by admin for 10+ day streak'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Payment created successfully!');
        toast.success('Payment created successfully!');
        fetchPayments(); // Refresh payments
        fetchEligibleUsers(); // Refresh eligible users
      } else {
        console.log('❌ Payment creation failed:', data.message);
        toast.error(data.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('❌ Payment creation error:', error);
      toast.error('Failed to create payment');
    }
  };

  // Update payment status
  const updatePaymentStatus = async (paymentId, status) => {
    try {
      console.log('🔍 Updating payment status:', paymentId, status);
      
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(`http://localhost:5000/api/admin/dashboard/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Payment status updated successfully!');
        toast.success('Payment status updated successfully!');
        fetchPayments(); // Refresh payments
      } else {
        console.log('❌ Payment status update failed:', data.message);
        toast.error(data.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('❌ Payment status update error:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const handleUpdateVideoStatus = async (videoId, newStatus) => {
    try {
      await adminDashboardAPI.updateVideoStatus(videoId, newStatus);
      toast.success('Video status updated successfully!');
      refetchVideos();
    } catch (error) {
      toast.error('Failed to update video status');
      console.error('Error updating video status:', error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await adminDashboardAPI.deleteVideo(videoId);
        toast.success('Video deleted successfully!');
        refetchVideos();
      } catch (error) {
        toast.error('Failed to delete video');
        console.error('Error deleting video:', error);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'flagged': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Use manual data if available, otherwise use useQuery data
  const finalOverviewData = overviewDataManual || overviewData;
  const stats = finalOverviewData?.data?.stats || {};
  const recentVideos = finalOverviewData?.data?.recentVideos || [];
  const recentUsers = finalOverviewData?.data?.recentUsers || [];
  
  // Debug logs for overview
  console.log('🔍 AdminDashboard - overviewData:', overviewData);
  console.log('🔍 AdminDashboard - overviewDataManual:', overviewDataManual);
  console.log('🔍 AdminDashboard - finalOverviewData:', finalOverviewData);
  console.log('🔍 AdminDashboard - stats:', stats);
  console.log('🔍 AdminDashboard - recentVideos:', recentVideos);
  console.log('🔍 AdminDashboard - recentUsers:', recentUsers);
  const videos = videosData?.data?.videos || [];
  
  // Debug logs for videos
  console.log('🔍 AdminDashboard - videosData:', videosData);
  console.log('🔍 AdminDashboard - videos:', videos);
  console.log('🔍 AdminDashboard - videosLoading:', videosLoading);
  const users = usersData?.data?.users || [];
  
  // Debug logs
  console.log('🔍 AdminDashboard - activeSection:', activeSection);
  console.log('🔍 AdminDashboard - usersData:', usersData);
  console.log('🔍 AdminDashboard - users:', users);
  console.log('🔍 AdminDashboard - usersLoading:', usersLoading);
  const payments = paymentsData?.data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  fetchOverview();
                  refetchVideos();
                  refetchUsers();
                  refetchPayments();
                  fetchEligibleUsers();
                }}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-error flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 mr-6">
            <nav className="p-4">
              <ul className="space-y-2">
                {[
                  { id: 'overview', name: 'Overview', icon: TrendingUp },
                  { id: 'videos', name: 'Videos', icon: Video },
                  { id: 'users', name: 'Users', icon: Users },
                  { id: 'payments', name: 'Payments', icon: DollarSign }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Video className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Videos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalVideos || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingVideos || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Valid Videos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.validVideos || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Videos</h3>
                    <div className="space-y-3">
                      {recentVideos.slice(0, 5).map((video) => (
                        <div key={video._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(video.validationStatus)}
                            <div>
                              <p className="font-medium text-gray-900">{video.title}</p>
                              <p className="text-sm text-gray-600">by {video.user?.name}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.validationStatus)}`}>
                            {video.validationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                    <div className="space-y-3">
                      {recentUsers.slice(0, 5).map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'videos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Video Management</h3>
                    <div className="flex items-center space-x-4">
                      <select
                        value={videoFilters.status}
                        onChange={(e) => setVideoFilters({...videoFilters, status: e.target.value})}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="valid">Valid</option>
                        <option value="invalid">Invalid</option>
                        <option value="flagged">Flagged</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {videosLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : videos.length === 0 ? (
                      <div className="text-center py-8">
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No videos found</p>
                      </div>
                    ) : (
                      videos.map((video) => (
                        <div key={video._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                {getStatusIcon(video.validationStatus)}
                                <h4 className="font-medium text-gray-900">{video.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.validationStatus)}`}>
                                  {video.validationStatus}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{video.description || 'No description'}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>by {video.user?.name}</span>
                                <span>•</span>
                                <span>{video.topic?.title}</span>
                                <span>•</span>
                                <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => window.open(video.videoUrl, '_blank')}
                                title="Watch Video"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                              <select
                                value={video.validationStatus}
                                onChange={(e) => handleUpdateVideoStatus(video._id, e.target.value)}
                                className="select select-bordered select-sm"
                              >
                                <option value="pending">Pending</option>
                                <option value="valid">Valid</option>
                                <option value="invalid">Invalid</option>
                                <option value="flagged">Flagged</option>
                              </select>
                              <button 
                                className="btn btn-sm btn-error"
                                onClick={() => handleDeleteVideo(video._id)}
                                title="Delete Video"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'users' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                    <span className="text-gray-600 text-sm">Total Users: {users.length}</span>
                  </div>
                  
                  {usersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No users found.</div>
                  ) : (
                    <div className="space-y-6">
                      {users.map(user => (
                        <div key={user._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          {/* User Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">{user.name || 'Unknown User'}</h3>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-sm text-gray-500">
                                  Joined: {new Date(user.createdAt).toLocaleDateString()} • 
                                  Last Active: {new Date(user.streakInfo?.lastActiveDate || user.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user.role}
                              </span>
                              <button className="btn btn-sm btn-outline flex items-center space-x-1" title="Edit User">
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>

                          {/* User Stats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            {/* Video Stats */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Video className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-gray-900">Videos</h4>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-medium">{user.videoStats?.totalVideos || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Valid:</span>
                                  <span className="font-medium text-green-600">{user.videoStats?.validVideos || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Pending:</span>
                                  <span className="font-medium text-yellow-600">{user.videoStats?.pendingVideos || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Invalid:</span>
                                  <span className="font-medium text-red-600">{user.videoStats?.invalidVideos || 0}</span>
                                </div>
                              </div>
                            </div>

                            {/* Streak Stats */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <h4 className="font-medium text-gray-900">Streak</h4>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Current:</span>
                                  <span className="font-medium text-green-600">{user.streakInfo?.currentStreak || 0} days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Longest:</span>
                                  <span className="font-medium">{user.streakInfo?.longestStreak || 0} days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Total Active:</span>
                                  <span className="font-medium">{user.streakInfo?.totalDaysActive || 0} days</span>
                                </div>
                              </div>
                            </div>

                            {/* Activity Stats */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <h4 className="font-medium text-gray-900">Activity</h4>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Recent Videos:</span>
                                  <span className="font-medium">{user.recentVideos?.length || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Last Video:</span>
                                  <span className="font-medium text-xs">
                                    {user.videoStats?.lastVideoDate ? 
                                      new Date(user.videoStats.lastVideoDate).toLocaleDateString() : 
                                      'Never'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                <h4 className="font-medium text-gray-900">Actions</h4>
                              </div>
                              <div className="space-y-2">
                                <button className="btn btn-sm btn-primary w-full">
                                  View Profile
                                </button>
                                <button className="btn btn-sm btn-outline w-full">
                                  View Videos
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Recent Videos */}
                          {user.recentVideos && user.recentVideos.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-3">Recent Videos</h4>
                              <div className="space-y-2">
                                {user.recentVideos.map(video => (
                                  <div key={video._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      {getStatusIcon(video.validationStatus)}
                                      <div>
                                        <p className="font-medium text-gray-900">{video.title}</p>
                                        <p className="text-sm text-gray-600">{video.topic?.title || 'No Topic'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.validationStatus)}`}>
                                        {video.validationStatus}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(video.uploadDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'payments' && (
              <div className="space-y-6">
                {/* Payment Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Payments</p>
                        <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'pending').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'completed').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Failed</p>
                        <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'failed').length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligible Users Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Eligible Users (10+ Day Streak)</h3>
                    <button 
                      onClick={() => fetchEligibleUsers()}
                      className="btn btn-sm btn-primary"
                    >
                      Refresh
                    </button>
                  </div>
                  
                  {eligibleUsersLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : eligibleUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No eligible users found.</div>
                  ) : (
                    <div className="space-y-3">
                      {eligibleUsers.map(user => (
                        <div key={user._id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-green-600">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{user.name}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">Streak: {user.currentStreak} days</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => createPaymentForUser(user._id)}
                            className="btn btn-sm btn-success"
                          >
                            Create Payment
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payments List */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">All Payments</h3>
                    <span className="text-gray-600 text-sm">Total: {payments.length}</span>
                  </div>

                  {paymentsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No payments found.</div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map(payment => (
                        <div key={payment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                                <DollarSign className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">Payment #{payment._id.slice(-8)}</h3>
                                <p className="text-sm text-gray-600">User: {payment.user?.name || 'N/A'}</p>
                                <p className="text-xs text-gray-500">
                                  Amount: ${payment.amount?.toFixed(2)} • 
                                  Streak: {payment.streakDays} days • 
                                  Created: {new Date(payment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                              <select
                                value={payment.status}
                                onChange={(e) => updatePaymentStatus(payment._id, e.target.value)}
                                className="select select-bordered select-sm"
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                          
                          {payment.adminNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <strong>Admin Notes:</strong> {payment.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
