import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { userAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PaymentInfo = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const selectedMethod = watch('preferredMethod');

  // Fetch current payment info
  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      console.log('Profile response:', response.data);
      
      // Check if user data exists
      if (response.data && response.data.user && response.data.user.paymentInfo) {
        setPaymentInfo(response.data.user.paymentInfo);
        // Pre-fill form with existing data
        const info = response.data.user.paymentInfo;
        setValue('preferredMethod', info.preferredMethod || 'upi');
        
        if (info.bankAccount) {
          setValue('accountHolderName', info.bankAccount.accountHolderName || '');
          setValue('accountNumber', info.bankAccount.accountNumber || '');
          setValue('bankName', info.bankAccount.bankName || '');
          setValue('ifscCode', info.bankAccount.ifscCode || '');
          setValue('branchName', info.bankAccount.branchName || '');
        }
        
        if (info.upi) {
          setValue('upiId', info.upi.upiId || '');
          setValue('upiName', info.upi.upiName || '');
        }
        
        if (info.paypal) {
          setValue('paypalEmail', info.paypal.paypalEmail || '');
          setValue('paypalName', info.paypal.paypalName || '');
        }
        
        if (info.wallet) {
          setValue('walletType', info.wallet.walletType || '');
          setValue('walletNumber', info.wallet.walletNumber || '');
          setValue('walletName', info.wallet.walletName || '');
        }
      } else {
        // No payment info exists yet, set default method
        setValue('preferredMethod', 'upi');
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
      toast.error('Failed to load payment information');
      // Set default method even on error
      setValue('preferredMethod', 'upi');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      
      const paymentData = {
        preferredMethod: data.preferredMethod,
        bankAccount: {
          accountHolderName: data.accountHolderName,
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          ifscCode: data.ifscCode,
          branchName: data.branchName
        },
        upi: {
          upiId: data.upiId,
          upiName: data.upiName
        },
        paypal: {
          paypalEmail: data.paypalEmail,
          paypalName: data.paypalName
        },
        wallet: {
          walletType: data.walletType,
          walletNumber: data.walletNumber,
          walletName: data.walletName
        }
      };

      const response = await userAPI.updatePaymentInfo(paymentData);
      
      if (response.data.success) {
        toast.success('Payment information updated successfully!');
        setPaymentInfo(response.data.user.paymentInfo);
      }
    } catch (error) {
      console.error('Error updating payment info:', error);
      toast.error('Failed to update payment information');
    } finally {
      setSaving(false);
    }
  };

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Quick and easy payments via UPI ID',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'bank_account',
      name: 'Bank Account',
      icon: Building2,
      description: 'Direct bank transfer',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: CreditCard,
      description: 'International payments',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'PhonePe, Google Pay, Paytm, etc.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Payment Information</h1>
            <p className="text-gray-600 mt-1">
              Add your payment details to receive rewards for completing streaks
            </p>
          </div>
          {paymentInfo?.isPaymentInfoComplete && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Payment Info Display */}
      {paymentInfo?.isPaymentInfoComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Payment Information Complete</h3>
                <p className="text-sm text-green-600">
                  You're eligible to receive payments for completing streaks
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
              className="flex items-center text-sm text-green-600 hover:text-green-700"
            >
              {showSensitiveInfo ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Show Details
                </>
              )}
            </button>
          </div>
          
          {showSensitiveInfo && (
            <div className="mt-4 p-3 bg-white rounded border">
              <div className="text-sm">
                <p><strong>Method:</strong> {paymentInfo.preferredMethod}</p>
                {paymentInfo.preferredMethod === 'upi' && (
                  <>
                    <p><strong>UPI ID:</strong> {paymentInfo.upi.upiId}</p>
                    <p><strong>Name:</strong> {paymentInfo.upi.upiName}</p>
                  </>
                )}
                {paymentInfo.preferredMethod === 'bank_account' && (
                  <>
                    <p><strong>Bank:</strong> {paymentInfo.bankAccount.bankName}</p>
                    <p><strong>Account:</strong> ****{paymentInfo.bankAccount.accountNumber.slice(-4)}</p>
                    <p><strong>Holder:</strong> {paymentInfo.bankAccount.accountHolderName}</p>
                  </>
                )}
                {paymentInfo.preferredMethod === 'paypal' && (
                  <>
                    <p><strong>Email:</strong> {paymentInfo.paypal.paypalEmail}</p>
                    <p><strong>Name:</strong> {paymentInfo.paypal.paypalName}</p>
                  </>
                )}
                {paymentInfo.preferredMethod === 'wallet' && (
                  <>
                    <p><strong>Wallet:</strong> {paymentInfo.wallet.walletType}</p>
                    <p><strong>Number:</strong> ****{paymentInfo.wallet.walletNumber.slice(-4)}</p>
                    <p><strong>Name:</strong> {paymentInfo.wallet.walletName}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <label
                key={method.id}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedMethod === method.id
                    ? `${method.borderColor} ${method.bgColor}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={method.id}
                  {...register('preferredMethod', { required: 'Please select a payment method' })}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-6 h-6 ${method.color}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
        {errors.preferredMethod && (
          <p className="mt-2 text-sm text-red-600">{errors.preferredMethod.message}</p>
        )}
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* UPI Details */}
        {selectedMethod === 'upi' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">UPI Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID *
                </label>
                <input
                  type="text"
                  {...register('upiId', { 
                    required: 'UPI ID is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
                      message: 'Please enter a valid UPI ID'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="yourname@paytm"
                />
                {errors.upiId && (
                  <p className="mt-1 text-sm text-red-600">{errors.upiId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('upiName', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.upiName && (
                  <p className="mt-1 text-sm text-red-600">{errors.upiName.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bank Account Details */}
        {selectedMethod === 'bank_account' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  {...register('accountHolderName', { required: 'Account holder name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.accountHolderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountHolderName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  {...register('accountNumber', { 
                    required: 'Account number is required',
                    pattern: {
                      value: /^[0-9]{9,18}$/,
                      message: 'Please enter a valid account number'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  {...register('bankName', { required: 'Bank name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State Bank of India"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  {...register('ifscCode', { 
                    required: 'IFSC code is required',
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message: 'Please enter a valid IFSC code'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SBIN0001234"
                />
                {errors.ifscCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.ifscCode.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  {...register('branchName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Main Branch"
                />
              </div>
            </div>
          </div>
        )}

        {/* PayPal Details */}
        {selectedMethod === 'paypal' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">PayPal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PayPal Email *
                </label>
                <input
                  type="email"
                  {...register('paypalEmail', { 
                    required: 'PayPal email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                {errors.paypalEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.paypalEmail.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('paypalName', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.paypalName && (
                  <p className="mt-1 text-sm text-red-600">{errors.paypalName.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Digital Wallet Details */}
        {selectedMethod === 'wallet' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Digital Wallet Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Type *
                </label>
                <select
                  {...register('walletType', { required: 'Wallet type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select wallet type</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="googlepay">Google Pay</option>
                  <option value="paytm">Paytm</option>
                  <option value="amazonpay">Amazon Pay</option>
                  <option value="other">Other</option>
                </select>
                {errors.walletType && (
                  <p className="mt-1 text-sm text-red-600">{errors.walletType.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Number *
                </label>
                <input
                  type="text"
                  {...register('walletNumber', { 
                    required: 'Wallet number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit mobile number'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="9876543210"
                />
                {errors.walletNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.walletNumber.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('walletName', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.walletName && (
                  <p className="mt-1 text-sm text-red-600">{errors.walletName.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Save Payment Information</h3>
              <p className="text-sm text-gray-600">
                Your payment information is encrypted and stored securely
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Information'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your payment information is encrypted and stored securely. We only use this information 
              to process your streak rewards. Never share your payment details with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
