import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Video, Eye, EyeOff, X, Twitter, Facebook, Mail } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Attempting login with:', data.email);
    const result = await login(data.email, data.password);
    console.log('Login result:', result);
    setIsLoading(false);
    
    if (result.success) {
      console.log('Login successful, navigating to dashboard');
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 100);
    } else {
      console.log('Login failed:', result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - Blue Background */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative p-6 lg:p-8 flex flex-col justify-between min-h-[300px] lg:min-h-[600px]">
            {/* Close Button */}
            <button 
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 text-white hover:text-blue-200 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center justify-center flex-1 pt-8 lg:pt-0">
              <div className="flex items-center space-x-3 mb-6 lg:mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
                  <Video className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                </div>
                <span className="text-xl lg:text-2xl font-bold text-white">Shyness App</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-4 lg:space-x-6 mb-6 lg:mb-8">
              <button className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                <Twitter className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </button>
              <button className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                <Facebook className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </button>
              <button className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pb-4 lg:pb-0">
              <p className="text-white text-sm mb-2">Don't have an account?</p>
              <Link 
                to="/register" 
                className="text-blue-200 hover:text-white font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Right Panel - White Background */}
          <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              {/* Header */}
              <div className="mb-6 lg:mb-8">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  <span className="text-blue-600">Log In</span> to your account
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">to continue building confidence</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Username or Email
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="joan.sterjo@outlook.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-base"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember Me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Logging in...</span>
                    </div>
                  ) : (
                    'LOG IN'
                  )}
                </button>

                {/* Forgot Password */}
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
