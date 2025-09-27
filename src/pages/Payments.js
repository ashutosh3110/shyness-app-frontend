import React, { useState, useEffect } from 'react';
import { paymentAPI, userAPI } from '../services/api';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);

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

  const fetchPaymentStats = async () => {
    try {
      const response = await paymentAPI.getPaymentStats();
      setPaymentStats(response.data.data);
    } catch (error) {
      console.error('❌ Payment Stats API error:', error);
    }
  };

  useEffect(() => {
    fetchUserPayments();
    fetchUserStats();
    fetchPaymentStats();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Center</h1>
            <p className="text-gray-600">Track your payments and earnings</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Payment Stats */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{paymentStats.totalPayments || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{paymentStats.completedPayments || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{paymentStats.pendingPayments || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">${paymentStats.totalAmount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Eligibility</h2>
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
          <div className="flex items-center space-x-3">
            {isEligibleForPayment ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">🎉 Congratulations!</h4>
                  <p className="text-sm text-green-700">
                    You're eligible for payment! You've maintained a {userStats?.currentStreak || 0}-day streak.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Target className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-800">Keep Going!</h4>
                  <p className="text-sm text-blue-700">
                    You need {daysToEligibility} more days to reach 10-day streak and become eligible for payment.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
        
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
            <p className="text-sm text-gray-600">
              {isEligibleForPayment 
                ? "Admin will create payments for you once you're eligible."
                : "Complete your 10-day streak to become eligible for payments!"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map(payment => (
              <div key={payment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Payment #{payment._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Streak: {payment.streakDays} days • Amount: ${payment.amount}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>Created: {new Date(payment.createdAt).toLocaleDateString()}</span>
                  {payment.dueDate && (
                    <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                {payment.adminNotes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
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
  );
};

export default Payments;
