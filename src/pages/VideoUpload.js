import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { topicsAPI, videosAPI } from '../services/api';
import { 
  Upload, 
  Video, 
  Play, 
  Pause, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Mic,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const VideoUpload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [fileValidation, setFileValidation] = useState({
    isValid: true,
    errors: []
  });

  const topicId = searchParams.get('topic');
  console.log('VideoUpload: topicId from URL:', topicId);

  // Fetch selected topic
  const { data: topicData, isLoading: topicLoading, error: topicError } = useQuery(
    ['topic', topicId],
    async () => {
      console.log('VideoUpload: Making API call to getTopic for ID:', topicId);
      const response = await topicsAPI.getTopic(topicId);
      console.log('VideoUpload: Topic API response received:', response);
      return response;
    },
    {
      enabled: !!topicId,
      retry: 3,
      retryDelay: 1000,
      onSuccess: (response) => {
        console.log('VideoUpload: Full response received:', response);
        console.log('VideoUpload: Response data:', response?.data);
        console.log('VideoUpload: Response status:', response?.status);
        
        // Extract the actual topic data from Axios response
        const apiResponse = response?.data;
        console.log('VideoUpload: API response:', apiResponse);
        console.log('VideoUpload: API response keys:', apiResponse ? Object.keys(apiResponse) : 'null');
        
        // Handle different response structures
        let topicData = null;
        if (apiResponse?.data) {
          topicData = apiResponse.data;
        } else if (apiResponse) {
          topicData = apiResponse;
        }
        
        console.log('VideoUpload: Extracted topic data:', topicData);
        console.log('VideoUpload: Topic title:', topicData?.title);
        console.log('VideoUpload: Topic ID:', topicData?._id || topicData?.id);
        console.log('VideoUpload: Topic keys:', topicData ? Object.keys(topicData) : 'null');
        
        if (topicData && topicData.title) {
          setSelectedTopic(topicData);
          setFormData(prev => ({
            ...prev,
            title: `Speaking about: ${topicData.title}`
          }));
          console.log('VideoUpload: Topic set successfully');
        } else {
          console.error('VideoUpload: Invalid topic data received:', topicData);
          console.error('VideoUpload: Topic data type:', typeof topicData);
          console.error('VideoUpload: Topic data keys:', topicData ? Object.keys(topicData) : 'null');
          toast.error('Invalid topic data received. Please select a topic again.');
        }
      },
      onError: (error) => {
        console.error('VideoUpload: Error fetching topic:', error);
        console.error('VideoUpload: Error details:', error.response?.data);
      }
    }
  );

  console.log('VideoUpload: topicData:', topicData);
  console.log('VideoUpload: topicLoading:', topicLoading);
  console.log('VideoUpload: topicError:', topicError);
  console.log('VideoUpload: selectedTopic state:', selectedTopic);

  // Upload mutation using direct fetch
  const uploadMutation = useMutation(async (formData) => {
    console.log('VideoUpload: Starting direct fetch upload...');
    const token = localStorage.getItem('token');
    
    const response = await fetch('https://shyness-app-backend.vercel.app/api/videos/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      body: formData
    });

    console.log('VideoUpload: Fetch response status:', response.status);
    console.log('VideoUpload: Fetch response headers:', response.headers);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }, {
    onSuccess: (response) => {
      console.log('VideoUpload: Upload successful:', response);
      toast.success('Video uploaded successfully!');
      queryClient.invalidateQueries('dashboard');
      queryClient.invalidateQueries('myVideos');
      queryClient.refetchQueries('myVideos');
      navigate('/app/my-videos');
    },
    onError: (error) => {
      console.error('VideoUpload: Upload error:', error);
      console.error('VideoUpload: Error message:', error.message);
      console.error('VideoUpload: Error stack:', error.stack);
      
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  // File validation function
  const validateFile = (file) => {
    const errors = [];
    let isValid = true;

    // Check if file exists
    if (!file) {
      errors.push('No file selected');
      isValid = false;
      return { isValid, errors };
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allowedExtensions = ['.mp4', '.webm', '.mov'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type: ${file.type}. Only MP4, WebM, and MOV files are allowed.`);
      isValid = false;
    }
    
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push(`Invalid file extension: ${fileExtension}. Only .mp4, .webm, and .mov files are allowed.`);
      isValid = false;
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      errors.push(`File too large: ${formatFileSize(file.size)}. Maximum size is 100MB.`);
      isValid = false;
    }

    // Check minimum file size (1MB)
    const minSize = 1024 * 1024; // 1MB
    if (file.size < minSize) {
      errors.push(`File too small: ${formatFileSize(file.size)}. Minimum size is 1MB.`);
      isValid = false;
    }

    return { isValid, errors };
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      console.log('VideoUpload: File selected:', file.name, file.type, formatFileSize(file.size));
      
      // Validate file
      const validation = validateFile(file);
      setFileValidation(validation);
      
      if (!validation.isValid) {
        console.error('VideoUpload: File validation failed:', validation.errors);
        validation.errors.forEach(error => toast.error(error));
        setSelectedFile(null);
        setVideoPreview(null);
        return;
      }

      console.log('VideoUpload: File validation passed');
      setSelectedFile(file);
      setFileValidation({ isValid: true, errors: [] });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      
      toast.success('Video file selected successfully!');
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate topic selection
    if (!selectedTopic) {
      errors.topic = 'Please select a topic first';
      isValid = false;
    }

    // Validate file selection
    if (!selectedFile) {
      errors.file = 'Please select a video file';
      isValid = false;
    } else {
      // Re-validate file
      const fileValidation = validateFile(selectedFile);
      if (!fileValidation.isValid) {
        errors.file = fileValidation.errors.join(', ');
        isValid = false;
      }
    }

    // Validate title
    if (!formData.title.trim()) {
      errors.title = 'Video title is required';
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
      isValid = false;
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title cannot be more than 100 characters';
      isValid = false;
    }

    // Validate description (optional but if provided, check length)
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot be more than 500 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleUpload = async () => {
    console.log('VideoUpload: Starting upload process...');
    console.log('VideoUpload: selectedFile:', selectedFile);
    console.log('VideoUpload: selectedTopic:', selectedTopic);
    console.log('VideoUpload: formData:', formData);

    // Clear previous validation errors
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      console.error('VideoUpload: Form validation failed:', validationErrors);
      toast.error('Please fix the errors below before uploading');
      return;
    }

    // Additional checks
    if (!selectedFile || !selectedTopic) {
      console.error('VideoUpload: Missing required data - selectedFile:', !!selectedFile, 'selectedTopic:', !!selectedTopic);
      toast.error('Please select a topic and video file');
      return;
    }

    if (!formData.title.trim()) {
      console.error('VideoUpload: Missing title');
      toast.error('Please enter a title for your video');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('video', selectedFile);
    uploadFormData.append('title', formData.title.trim());
    uploadFormData.append('description', formData.description.trim());
    
    // Handle different topic ID structures
    const topicId = selectedTopic._id || selectedTopic.id;
    console.log('VideoUpload: Using topicId:', topicId);
    
    if (!topicId) {
      console.error('VideoUpload: No topic ID found');
      toast.error('Invalid topic selected. Please select a topic again.');
      return;
    }
    
    uploadFormData.append('topicId', topicId);

    // Log FormData contents
    console.log('VideoUpload: FormData contents:');
    for (let [key, value] of uploadFormData.entries()) {
      console.log(`  ${key}:`, value);
    }

    console.log('VideoUpload: Calling upload mutation...');
    uploadMutation.mutate(uploadFormData);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setIsPlaying(false);
    setFileValidation({ isValid: true, errors: [] });
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
            <p className="text-gray-600">
              Share your speaking practice and build your confidence
            </p>
          </div>
        </div>
      </div>

      {/* Loading Topic */}
      {topicLoading && (
        <div className="card">
          <div className="text-center py-8">
            <LoadingSpinner size="lg" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
              Loading Topic...
            </h3>
            <p className="text-gray-600">
              Please wait while we load your selected topic
            </p>
          </div>
        </div>
      )}

      {/* Topic Selection */}
      {!selectedTopic && !topicLoading && (
        <div className="card">
          <div className="text-center py-8">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a Topic First
            </h3>
            <p className="text-gray-600 mb-4">
              Choose a topic before uploading your video
            </p>
            <Link
              to="/app/topics"
              className="btn btn-primary"
            >
              Choose Topic
            </Link>
          </div>
        </div>
      )}

      {selectedTopic && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Topic Info */}
            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Selected Topic
              </h3>
              <p className="text-primary-800 font-medium">{selectedTopic.title}</p>
              <p className="text-primary-700 text-sm mt-1">
                {selectedTopic.description}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedTopic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  selectedTopic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedTopic.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-primary-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{selectedTopic.estimatedDuration} min</span>
                </div>
              </div>
            </div>

                     {/* File Upload */}
                     <div className="card">
                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
                         Upload Your Video
                       </h3>

                       {/* File Validation Errors */}
                       {validationErrors.file && (
                         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                           <div className="flex items-center space-x-2">
                             <XCircle className="w-5 h-5 text-red-600" />
                             <span className="text-sm text-red-800">{validationErrors.file}</span>
                           </div>
                         </div>
                       )}

                       {/* File Validation Success */}
                       {selectedFile && fileValidation.isValid && (
                         <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                           <div className="flex items-center space-x-2">
                             <CheckCircle className="w-5 h-5 text-green-600" />
                             <span className="text-sm text-green-800">Video file is valid and ready to upload</span>
                           </div>
                         </div>
                       )}
              
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Click to upload video
                  </p>
                  <p className="text-gray-600 mb-4">
                    MP4, WebM, or MOV files up to 100MB
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Camera className="w-4 h-4" />
                      <span>Video required</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mic className="w-4 h-4" />
                      <span>Audio required</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                         <div className={`rounded-lg p-4 ${fileValidation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center space-x-2">
                               <Video className={`w-5 h-5 ${fileValidation.isValid ? 'text-green-600' : 'text-red-600'}`} />
                               <span className="font-medium text-gray-900">{selectedFile.name}</span>
                               {fileValidation.isValid ? (
                                 <CheckCircle className="w-4 h-4 text-green-600" />
                               ) : (
                                 <XCircle className="w-4 h-4 text-red-600" />
                               )}
                             </div>
                             <button
                               onClick={resetUpload}
                               className="text-gray-400 hover:text-red-600"
                             >
                               <XCircle className="w-5 h-5" />
                             </button>
                           </div>
                           <div className="text-sm text-gray-600">
                             <p>Size: {formatFileSize(selectedFile.size)}</p>
                             <p>Type: {selectedFile.type}</p>
                             <p className={`mt-1 font-medium ${fileValidation.isValid ? 'text-green-700' : 'text-red-700'}`}>
                               {fileValidation.isValid ? '✅ File is valid' : '❌ File has issues'}
                             </p>
                           </div>
                           {!fileValidation.isValid && (
                             <div className="mt-2 p-2 bg-red-100 rounded">
                               <p className="text-xs text-red-800 font-medium">Issues:</p>
                               <ul className="text-xs text-red-700 mt-1">
                                 {fileValidation.errors.map((error, index) => (
                                   <li key={index}>• {error}</li>
                                 ))}
                               </ul>
                             </div>
                           )}
                         </div>

                  {/* Video Preview */}
                  {videoPreview && (
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={videoPreview}
                        className="w-full h-64 object-cover"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={handlePlayPause}
                          className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8" />
                          ) : (
                            <Play className="w-8 h-8 ml-1" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Video Requirements */}
            <div className="card bg-yellow-50 border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Video Requirements
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Minimum 30 seconds duration</li>
                    <li>• Must include audio track</li>
                    <li>• Face must be visible in video</li>
                    <li>• Maximum file size: 100MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Video Details */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Video Details
              </h3>
              
              <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Title *
                         </label>
                         <input
                           type="text"
                           value={formData.title}
                           onChange={(e) => {
                             setFormData(prev => ({ ...prev, title: e.target.value }));
                             // Clear validation error when user starts typing
                             if (validationErrors.title) {
                               setValidationErrors(prev => ({ ...prev, title: '' }));
                             }
                           }}
                           className={`input ${validationErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                           placeholder="Enter video title"
                           required
                         />
                         {validationErrors.title && (
                           <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                         )}
                         <p className="mt-1 text-xs text-gray-500">
                           {formData.title.length}/100 characters
                         </p>
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Description
                         </label>
                         <textarea
                           value={formData.description}
                           onChange={(e) => {
                             setFormData(prev => ({ ...prev, description: e.target.value }));
                             // Clear validation error when user starts typing
                             if (validationErrors.description) {
                               setValidationErrors(prev => ({ ...prev, description: '' }));
                             }
                           }}
                           className={`input h-24 resize-none ${validationErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                           placeholder="Optional description of your video"
                         />
                         {validationErrors.description && (
                           <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                         )}
                         <p className="mt-1 text-xs text-gray-500">
                           {formData.description.length}/500 characters
                         </p>
                       </div>
              </div>
            </div>

            {/* Upload Button */}
            <div className="card">
                     <button
                       onClick={handleUpload}
                       disabled={!selectedFile || !formData.title.trim() || uploadMutation.isLoading || !fileValidation.isValid}
                       className={`btn w-full flex items-center justify-center space-x-2 ${
                         !selectedFile || !formData.title.trim() || !fileValidation.isValid
                           ? 'btn-secondary opacity-50 cursor-not-allowed'
                           : 'btn-primary'
                       }`}
                     >
                       {uploadMutation.isLoading ? (
                         <>
                           <LoadingSpinner size="sm" />
                           <span>Uploading...</span>
                         </>
                       ) : (
                         <>
                           <Upload className="w-4 h-4" />
                           <span>Upload Video</span>
                         </>
                       )}
                     </button>

                     {/* Upload Requirements */}
                     <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                       <h4 className="font-medium text-blue-900 mb-2">Upload Requirements:</h4>
                       <ul className="text-sm text-blue-800 space-y-1">
                         <li className={`flex items-center space-x-2 ${selectedTopic ? 'text-green-700' : 'text-red-700'}`}>
                           <span>{selectedTopic ? '✅' : '❌'}</span>
                           <span>Topic selected</span>
                         </li>
                         <li className={`flex items-center space-x-2 ${selectedFile ? 'text-green-700' : 'text-red-700'}`}>
                           <span>{selectedFile ? '✅' : '❌'}</span>
                           <span>Video file selected</span>
                         </li>
                         <li className={`flex items-center space-x-2 ${fileValidation.isValid ? 'text-green-700' : 'text-red-700'}`}>
                           <span>{fileValidation.isValid ? '✅' : '❌'}</span>
                           <span>File format valid (MP4, WebM, MOV)</span>
                         </li>
                         <li className={`flex items-center space-x-2 ${formData.title.trim().length >= 3 ? 'text-green-700' : 'text-red-700'}`}>
                           <span>{formData.title.trim().length >= 3 ? '✅' : '❌'}</span>
                           <span>Title entered (min 3 characters)</span>
                         </li>
                       </ul>
                     </div>
              
              {uploadMutation.isError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800">
                      Upload failed. Please try again.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
