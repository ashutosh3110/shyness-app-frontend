import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, authAPI } from '../services/api';
import { 
  User, 
  Trophy, 
  Target, 
  Calendar,
  Award,
  Edit,
  Save,
  X
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '' });
  const queryClient = useQueryClient();

  const { data: rewardsData, isLoading: rewardsLoading } = useQuery(
    'userRewards',
    userAPI.getRewards
  );

  const { data: statsData, isLoading: statsLoading } = useQuery(
    'userStats',
    userAPI.getStats
  );

  const updateProfileMutation = useMutation(
    (data) => authAPI.updateProfile(data.name),
    {
      onSuccess: (response) => {
        updateUser(response.data.user);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const handleSave = () => {
    if (!editForm.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

  const handleCancel = () => {
    setEditForm({ name: user?.name || '' });
    setIsEditing(false);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (rewardsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const rewards = rewardsData?.data || { earned: [], available: [], totalAvailable: 0 };
  const stats = statsData?.data || {};
  
  console.log('Profile - rewardsData:', rewardsData);
  console.log('Profile - rewards:', rewards);
  console.log('Profile - statsData:', statsData);
  console.log('Profile - stats:', stats);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your account and view achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isLoading}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updateProfileMutation.isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-semibold text-orange-600">{user?.currentStreak || 0} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Longest Streak</span>
                <span className="font-semibold text-gray-900">{user?.longestStreak || 0} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Videos</span>
                <span className="font-semibold text-gray-900">{user?.totalVideos || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rewards Earned</span>
                <span className="font-semibold text-gray-900">{rewards.earned?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earned Rewards */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Earned Rewards</h3>
              <span className="text-sm text-gray-600">
                {rewards.earned?.length || 0} of {rewards.totalAvailable || 0} earned
              </span>
            </div>

            {rewards.earned?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.earned?.map((reward) => (
                  <div
                    key={reward._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-2xl">{reward.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{reward.name}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(reward.rarity)}`}>
                          {reward.rarity}
                        </span>
                        <span className="text-xs text-gray-500">{reward.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No rewards earned yet</p>
                <p className="text-sm text-gray-500">Start uploading videos to earn rewards!</p>
              </div>
            )}
          </div>

          {/* Available Rewards */}
          {rewards.available?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.available?.slice(0, 6)?.map((reward) => (
                  <div
                    key={reward._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60"
                  >
                    <span className="text-2xl grayscale">{reward.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{reward.name}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(reward.rarity)}`}>
                          {reward.rarity}
                        </span>
                        <span className="text-xs text-gray-500">{reward.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          {stats.overview && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stats.overview?.totalVideos || 0}</p>
                  <p className="text-sm text-gray-600">Total Videos</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((stats.overview?.totalDuration || 0) / 60)}m
                  </p>
                  <p className="text-sm text-gray-600">Total Duration</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stats.overview?.totalViews || 0}</p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stats.overview?.totalLikes || 0}</p>
                  <p className="text-sm text-gray-600">Total Likes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
