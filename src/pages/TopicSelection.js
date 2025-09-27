import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { topicsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  PlayCircle, 
  Clock, 
  Target, 
  Filter,
  Shuffle,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const TopicSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const { data: topicsData, isLoading: topicsLoading, error: topicsError, refetch } = useQuery(
    ['topics', selectedCategory, selectedDifficulty],
    async () => {
      console.log('TopicSelection: Making API call to getTopics');
      const response = await topicsAPI.getTopics({
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        limit: 20
      });
      console.log('TopicSelection: API response received:', response);
      return response;
    },
    {
      retry: 3,
      retryDelay: 1000,
      onSuccess: (data) => {
        console.log('TopicSelection: Query success - Topics data:', data);
      },
      onError: (error) => {
        console.error('TopicSelection: Query error:', error);
        console.error('TopicSelection: Error response:', error.response);
        console.error('TopicSelection: Error status:', error.response?.status);
      }
    }
  );

  const { data: randomTopic, refetch: refetchRandom } = useQuery(
    'randomTopic',
    async () => {
      console.log('TopicSelection: Making API call to getRandomTopic');
      const response = await topicsAPI.getRandomTopic(selectedDifficulty || undefined);
      console.log('TopicSelection: Random topic API response:', response);
      return response;
    },
    {
      enabled: false,
      retry: 3,
      retryDelay: 1000,
      onSuccess: (data) => {
        console.log('TopicSelection: Random topic query success:', data);
      },
      onError: (error) => {
        console.error('TopicSelection: Random topic query error:', error);
        console.error('TopicSelection: Random topic error response:', error.response);
        console.error('TopicSelection: Random topic error status:', error.response?.status);
      }
    }
  );

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'personal', label: 'Personal' },
    { value: 'professional', label: 'Professional' },
    { value: 'creative', label: 'Creative' },
    { value: 'educational', label: 'Educational' },
    { value: 'social', label: 'Social' }
  ];

  const difficulties = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const handleRandomTopic = async () => {
    try {
      console.log('TopicSelection: Getting random topic...');
      const result = await refetchRandom();
      console.log('TopicSelection: Random topic result:', result);
      console.log('TopicSelection: Result data structure:', result?.data);
      
      // Handle different response structures
      let topicData = null;
      if (result?.data?.data) {
        topicData = result.data.data;
      } else if (result?.data) {
        topicData = result.data;
      }
      
      if (topicData) {
        console.log('TopicSelection: Setting selectedTopic to:', topicData);
        console.log('TopicSelection: Topic ID:', topicData._id || topicData.id);
        setSelectedTopic(topicData);
        toast.success('Random topic selected!');
      } else {
        console.error('TopicSelection: No random topic data received');
        toast.error('No random topic available');
      }
    } catch (error) {
      console.error('TopicSelection: Random topic error:', error);
      toast.error('Failed to get random topic');
    }
  };

  const handleTopicSelect = (topic) => {
    console.log('TopicSelection: Topic selected:', topic);
    setSelectedTopic(topic);
    toast.success('Topic selected! Ready to upload your video.');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'creative': return 'bg-pink-100 text-pink-800';
      case 'educational': return 'bg-indigo-100 text-indigo-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (topicsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const topics = Array.isArray(topicsData?.data) ? topicsData.data : [];
  
  console.log('TopicSelection - topicsData:', topicsData);
  console.log('TopicSelection - topics:', topics);
  console.log('TopicSelection - selectedTopic:', selectedTopic);
  console.log('TopicSelection - selectedTopic type:', typeof selectedTopic);
  console.log('TopicSelection - selectedTopic keys:', selectedTopic ? Object.keys(selectedTopic) : 'null');
  console.log('TopicSelection - topicsLoading:', topicsLoading);
  console.log('TopicSelection - topicsError:', topicsError);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choose Your Topic</h1>
            <p className="text-gray-600 mt-1">
              Select a topic for today's speaking practice
            </p>
          </div>
          <button
            onClick={handleRandomTopic}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Random Topic</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-auto"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input w-auto"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Topic */}
      {selectedTopic && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-900">
                  Selected: {selectedTopic?.data?.title || selectedTopic?.title}
                </h3>
                <p className="text-primary-700">{selectedTopic?.data?.description || selectedTopic?.description}</p>
              </div>
            </div>
            {(() => {
              // Handle different selectedTopic structures
              let actualTopic = selectedTopic;
              if (selectedTopic?.data) {
                actualTopic = selectedTopic.data;
              }
              
              const topicId = actualTopic?._id || actualTopic?.id;
              console.log('TopicSelection: Checking topic ID - _id:', actualTopic?._id, 'id:', actualTopic?.id, 'final topicId:', topicId);
              console.log('TopicSelection: actualTopic:', actualTopic);
              
              return topicId ? (
                <Link
                  to={`/app/upload?topic=${topicId}`}
                  className="btn btn-primary flex items-center space-x-2"
                  onClick={() => {
                    console.log('TopicSelection: Start Recording clicked');
                    console.log('TopicSelection: selectedTopic object:', selectedTopic);
                    console.log('TopicSelection: topic ID:', topicId);
                    console.log('TopicSelection: Navigation URL:', `/app/upload?topic=${topicId}`);
                  }}
                >
                  <span>Start Recording</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  className="btn btn-primary flex items-center space-x-2 opacity-50 cursor-not-allowed"
                  disabled
                  onClick={() => {
                    console.error('TopicSelection: No topic ID found!');
                    console.error('TopicSelection: selectedTopic object:', selectedTopic);
                    toast.error('Topic ID is missing. Please select a topic again.');
                  }}
                >
                  <span>Start Recording</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              );
            })()}
          </div>
        </div>
      )}

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics && topics.length > 0 && topics.map((topic) => (
          <div
            key={topic._id}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTopic?._id === topic._id
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:border-primary-300'
            }`}
            onClick={() => handleTopicSelect(topic)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                  {topic.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{topic.estimatedDuration}m</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {topic.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {topic.description}
            </p>

            {topic.tips && topic.tips.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {topic.tips.slice(0, 2).map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Target className="w-3 h-3 text-primary-500 mt-1 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Used {topic.usageCount} times
              </span>
              <button
                className={`btn ${
                  selectedTopic?._id === topic._id
                    ? 'btn-primary'
                    : 'btn-secondary'
                } text-sm`}
              >
                {selectedTopic?._id === topic._id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!topics || topics.length === 0) && (
        <div className="text-center py-12">
          <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default TopicSelection;
