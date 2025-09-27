import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Video, 
  Upload, 
  User,
  PlayCircle,
  DollarSign,
  BookOpen,
  CreditCard,
  X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  
  const navItems = [
    { path: '/app/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/app/topics', icon: PlayCircle, label: 'Topics' },
    { path: '/app/scripts', icon: BookOpen, label: 'Scripts' },
    { path: '/app/upload', icon: Upload, label: 'Upload Video' },
    { path: '/app/my-videos', icon: Video, label: 'My Videos' },
    { path: '/app/payments', icon: DollarSign, label: 'Payments' },
    { path: '/app/payment-info', icon: CreditCard, label: 'Payment Info' },
    { path: '/app/profile', icon: User, label: 'Profile' },
  ];

  // Admin dashboard link removed as requested

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shyness App</h2>
              <p className="text-xs sm:text-sm text-gray-500">Build Confidence</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <nav className="px-2 sm:px-4 pb-6">
        <ul className="space-y-1 sm:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      

      {/* Streak widget */}
      <div className="px-2 sm:px-4 pb-6">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-3 sm:p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl sm:text-2xl">🔥</span>
            <span className="font-bold text-sm sm:text-base">Daily Streak</span>
          </div>
          <p className="text-xs sm:text-sm opacity-90">
            Keep uploading daily to maintain your streak!
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
