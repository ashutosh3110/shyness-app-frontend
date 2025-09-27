import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { userAPI, paymentAPI } from '../services/api';
import { 
  Calendar, 
  Video, 
  Trophy, 
  Target, 
  TrendingUp,
  Clock,
  Award,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// Payment Section Component
const PaymentSection = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const fetchUserPayments = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching user payments...');
      
      const response = await paymentAPI.getAllPayments();
      console.log('📊 User Payments API Response:', response.data);
      
      setPayments(response.data.data?.payments || []);
    } catch (error) {
      console.error('❌ User Payments API error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getDashboard();
      setUserStats(response.data);
    } catch (error) {
      console.error('❌ User Stats API error:', error);
    }
  };

  useEffect(() => {
    fetchUserPayments();
    fetchUserStats();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isEligibleForPayment = userStats?.currentStreak >= 10;
  const daysToEligibility = isEligibleForPayment ? 0 : 10 - (userStats?.currentStreak || 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Center</h3>
        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
      </div>
      
      {/* Eligibility Status */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          {isEligibleForPayment ? (
            <>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-green-800 text-sm sm:text-base">🎉 Congratulations!</h4>
                <p className="text-xs sm:text-sm text-green-700">
                  You're eligible for payment! You've maintained a {userStats?.currentStreak || 0}-day streak.
                </p>
              </div>
            </>
          ) : (
            <>
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-blue-800 text-sm sm:text-base">Keep Going!</h4>
                <p className="text-xs sm:text-sm text-blue-700">
                  You need {daysToEligibility} more days to reach 10-day streak and become eligible for payment.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Payment History</h4>
        
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <LoadingSpinner />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-4 sm:py-6 text-gray-500">
            <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm sm:text-base">No payments yet</p>
            <p className="text-xs sm:text-sm">Complete your 10-day streak to become eligible!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(payment => (
              <div key={payment._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        Payment #{payment._id.slice(-8)}
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Streak: {payment.streakDays} days • Amount: ${payment.amount}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)} self-start sm:self-auto`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                  <span>Created: {new Date(payment.createdAt).toLocaleDateString()}</span>
                  {payment.dueDate && (
                    <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                {payment.adminNotes && (
                  <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">
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
  );
};

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    async () => {
      console.log('Dashboard: Making API call to getDashboard');
      const response = await userAPI.getDashboard();
      console.log('Dashboard: API response received:', response);
      return response;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      retry: 3,
      retryDelay: 1000,
      onSuccess: (data) => {
        console.log('Dashboard: Query success - Dashboard data:', data);
      },
      onError: (error) => {
        console.error('Dashboard: Query error:', error);
        console.error('Dashboard: Error response:', error.response);
        console.error('Dashboard: Error status:', error.response?.status);
      }
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">
              {error.response?.status === 401 
                ? 'Your session has expired. Please log in again.' 
                : 'Unable to load dashboard data. Please try again.'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Dashboard - dashboardData:', dashboardData);
  
  if (!dashboardData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Dashboard Data</h2>
            <p className="text-gray-600 mb-4">Unable to load dashboard information.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { 
    user = {}, 
    streak = {}, 
    recentVideos = [], 
    statistics = {} 
  } = dashboardData.data || {};
  
  console.log('Dashboard - user:', user);
  console.log('Dashboard - streak:', streak);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-2 sm:p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-4 h-4 sm:w-6 sm:h-6 text-${color}-600`} />
        </div>
        <div className="ml-2 sm:ml-4 flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const StreakCard = () => (
    <div className="card bg-gradient-to-r from-orange-400 to-red-500 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl sm:text-3xl">🔥</span>
            <h3 className="text-lg sm:text-xl font-bold">Current Streak</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-bold">{streak?.current || 0}</p>
          <p className="text-sm sm:text-base text-orange-100">
            {streak?.isActive ? 'Keep it up!' : 'Start a new streak today!'}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs sm:text-sm opacity-90">Longest Streak</p>
          <p className="text-xl sm:text-2xl font-bold">{streak?.longest || 0}</p>
        </div>
      </div>
    </div>
  );

  const RecentVideos = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Videos</h3>
        <Link to="/app/my-videos" className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium">
          View All
        </Link>
      </div>
      {recentVideos?.length > 0 ? (
        <div className="space-y-3">
          {recentVideos?.map((video) => (
            <div key={video._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{video.title}</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{video.topic.title}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(video.uploadDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {Math.round(video.duration / 60)} min
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <Video className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">No videos uploaded yet</p>
          <Link to="/app/upload" className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium">
            Upload your first video
          </Link>
        </div>
      )}
    </div>
  );

  const RewardsSection = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Rewards</h3>
        <Link to="/app/profile" className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium">
          View All
        </Link>
      </div>
      {user?.rewards?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user?.rewards?.slice(0, 4).map((reward) => (
            <div key={reward._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl sm:text-2xl">{reward.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{reward.name}</p>
                <p className="text-xs text-gray-600">{reward.points} pts</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">No rewards earned yet</p>
          <p className="text-xs sm:text-sm text-gray-500">Start uploading videos to earn rewards!</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-sm sm:text-base text-primary-100">
              Ready to continue building your confidence? Let's practice speaking today!
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm opacity-90">Next Goal</p>
            <p className="text-xl sm:text-2xl font-bold">{streak?.nextGoal || 8} days</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          icon={Video}
          title="Total Videos"
          value={statistics?.totalVideos || 0}
          subtitle="Videos uploaded"
        />
        <StatCard
          icon={Clock}
          title="Total Duration"
          value={`${Math.round((statistics?.totalDuration || 0) / 60)}m`}
          subtitle="Speaking practice"
        />
        <StatCard
          icon={TrendingUp}
          title="Average Duration"
          value={`${Math.round(statistics?.avgDuration || 0)}s`}
          subtitle="Per video"
        />
        <StatCard
          icon={Award}
          title="Rewards Earned"
          value={user?.rewards?.length || 0}
          subtitle="Achievements unlocked"
          color="secondary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Streak Card */}
        <div className="lg:col-span-1">
          <StreakCard />
        </div>

        {/* Recent Videos */}
        <div className="lg:col-span-2">
          <RecentVideos />
        </div>
      </div>

      {/* Rewards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RewardsSection />
        
        {/* Payment Section */}
        <PaymentSection />
      </div>
      
      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/app/topics"
            className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Target className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-primary-900 text-sm sm:text-base">Choose Today's Topic</span>
          </Link>
          <Link
            to="/app/upload"
            className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <Video className="w-5 h-5 text-secondary-600" />
            <span className="font-medium text-secondary-900 text-sm sm:text-base">Upload Video</span>
          </Link>
          <Link
            to="/app/my-videos"
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900 text-sm sm:text-base">View Progress</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
