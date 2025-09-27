import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  console.log('AuthReducer - Action:', action.type, 'Payload:', action.payload);
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      console.log('AuthReducer - AUTH_SUCCESS, setting user:', action.payload.user);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('AuthContext: Checking auth with token:', token ? 'exists' : 'missing');
      
      if (token) {
        try {
          console.log('AuthContext: Making getMe API call');
          const response = await authAPI.getMe();
          console.log('AuthContext: getMe response:', response.data);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.data.user,
              token
            }
          });
        } catch (error) {
          console.error('AuthContext: getMe failed:', error);
          // Only clear token if it's a 401 error (unauthorized)
          if (error.response?.status === 401) {
            console.log('AuthContext: Token is invalid, clearing it');
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
          } else {
            // For other errors (network, server), keep the token but set user to null
            console.log('AuthContext: Network error, keeping token but setting user to null');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Network error' });
          }
        }
      } else {
        console.log('AuthContext: No token found, setting loading to false');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []); // Empty dependency array - only run once on mount

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      console.log('AuthContext: Attempting login API call');
      const response = await authAPI.login(email, password);
      console.log('AuthContext: Login API response:', response.data);
      console.log('AuthContext: Full response structure:', response);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      console.log('AuthContext: Login successful, user state updated');
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authAPI.signup(name, email, password);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!(token && state.user && !state.loading);
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated
  };

  console.log('AuthProvider - Current state:', state);
  console.log('AuthProvider - Value being passed:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
