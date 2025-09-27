import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { videosAPI } from '../services/api';
import { 
  Video, 
  Play, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyVideos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', isPublic: false });
  const queryClient = useQueryClient();

  const { data: videosData, isLoading, error, refetch } = useQuery(
    'myVideos',
    async () => {
      console.log('MyVideos: Making API call to getMyVideos');
      const response = await videosAPI.getMyVideos();
      console.log('MyVideos: API response received:', response);
      return response;
    },
    {
      refetchInterval: 30000,
      retry: 3,
      retryDelay: 1000,
      onSuccess: (data) => {
        console.log('MyVideos: Query success - Videos data:', data);
        console.log('MyVideos: Videos array:', data?.data);
        console.log('MyVideos: Videos count:', data?.data?.length || 0);
        console.log('MyVideos: Total videos:', data?.total || 0);
      },
      onError: (error) => {
        console.error('MyVideos: Query error:', error);
        console.error('MyVideos: Error response:', error.response);
        console.error('MyVideos: Error status:', error.response?.status);
        console.error('MyVideos: Error data:', error.response?.data);
      }
    }
  );

  // Force refresh on component mount
  useEffect(() => {
    console.log('MyVideos: Component mounted, forcing refresh...');
    refetch();
  }, [refetch]);

  const deleteMutation = useMutation(videosAPI.deleteVideo, {
    onSuccess: () => {
      toast.success('Video deleted successfully');
      queryClient.invalidateQueries('myVideos');
      queryClient.invalidateQueries('dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete video');
    }
  });

  const updateMutation = useMutation(
    ({ id, data }) => videosAPI.updateVideo(id, data),
    {
      onSuccess: () => {
        toast.success('Video updated successfully');
        queryClient.invalidateQueries('myVideos');
        setIsEditing(false);
        setSelectedVideo(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update video');
      }
    }
  );

  const handleDelete = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteMutation.mutate(videoId);
    }
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setEditForm({
      title: video.title,
      description: video.description || '',
      isPublic: video.isPublic
    });
    setIsEditing(true);
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      id: selectedVideo._id,
      data: editForm
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Extract videos from API response - handle nested data structure
  let videos = [];
  if (videosData?.data?.data && Array.isArray(videosData.data.data)) {
    videos = videosData.data.data;
    console.log('MyVideos - Using videosData.data.data:', videos.length, 'videos');
  } else if (videosData?.data && Array.isArray(videosData.data)) {
    videos = videosData.data;
    console.log('MyVideos - Using videosData.data:', videos.length, 'videos');
  } else if (Array.isArray(videosData)) {
    videos = videosData;
    console.log('MyVideos - Using videosData directly:', videos.length, 'videos');
  } else {
    console.log('MyVideos - No videos found in response structure');
    console.log('MyVideos - videosData structure:', videosData);
  }
  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.topic?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  console.log('MyVideos - videosData:', videosData);
  console.log('MyVideos - videos:', videos);
  console.log('MyVideos - filteredVideos:', filteredVideos);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Manual refresh function
  const handleRefresh = () => {
    console.log('MyVideos: Manual refresh triggered');
    refetch();
  };

  // Debug: Check if we have any videos at all
  console.log('MyVideos: Full component render');
  console.log('MyVideos: videosData:', videosData);
  console.log('MyVideos: isLoading:', isLoading);
  console.log('MyVideos: error:', error);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Videos</h1>
            <p className="text-gray-600 mt-1">
              Track your speaking practice progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <Link
              to="/app/upload"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Upload New Video</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredVideos?.length || 0} of {videos?.length || 0} videos
            </span>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos?.map((video) => (
            <div key={video._id} className="card">
              {/* Video Thumbnail */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all">
                    <Play className="w-6 h-6 ml-1" />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {video.duration ? formatDuration(video.duration) : '0:00'}
                  </span>
                </div>
              </div>

              {/* Video Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {video.title || 'Untitled Video'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Topic: {video.topic?.title || 'Unknown Topic'}
                  </p>
                </div>

                {video.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
                )}

                {/* Video Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.uploadDate ? formatDate(video.uploadDate) : 'Unknown Date'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views || 0}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    video.validationStatus === 'valid' ? 'bg-green-100 text-green-800' :
                    video.validationStatus === 'invalid' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {video.validationStatus || 'unknown'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit video"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {video.hasAudio && (
                      <span className="text-green-600" title="Has audio">
                        🔊
                      </span>
                    )}
                    {video.hasFace && (
                      <span className="text-blue-600" title="Face detected">
                        👤
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No videos found' : 'No videos uploaded yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Start your confidence journey by uploading your first video'
            }
          </p>
          {!searchTerm && (
            <Link to="/app/upload" className="btn btn-primary">
              Upload Your First Video
            </Link>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Video
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input h-24 resize-none"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={editForm.isPublic}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make video public
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isLoading}
                className="btn btn-primary"
              >
                {updateMutation.isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVideos;
