import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Bell, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Keep building your confidence with daily practice
            </p>
          </div>
          
          {/* Mobile title */}
          <div className="sm:hidden">
            <h1 className="text-lg font-bold text-gray-900">
              {user?.name}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* User menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            
            {/* Mobile user avatar */}
            <div className="sm:hidden w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

