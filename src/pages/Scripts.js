import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  Search, 
  Clock, 
  Users,
  Briefcase,
  User,
  Book,
  Heart,
  Palette,
  TrendingUp,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Scripts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const categoryIcons = {
    professional: Briefcase,
    personal: User,
    educational: Book,
    social: Users,
    creative: Palette,
    motivational: TrendingUp
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://shyness-app-backend.vercel.app/api/scripts/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchScripts = async (category, search = '', difficultyFilter = '') => {
    try {
      setLoading(true);
      let url = `https://shyness-app-backend.vercel.app/api/scripts/category/${category}`;
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setScripts(data.data.scripts);
      }
    } catch (error) {
      console.error('Error fetching scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScript = async (scriptId) => {
    try {
      const response = await fetch(`https://shyness-app-backend.vercel.app/api/scripts/${scriptId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedScript(data.data);
      }
    } catch (error) {
      console.error('Error fetching script:', error);
    }
  };

  const downloadScript = async (scriptId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://shyness-app-backend.vercel.app/api/scripts/${scriptId}/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast.success('Download count updated!');
        // Here you would implement actual PDF generation
        generatePDF(selectedScript);
      }
    } catch (error) {
      console.error('Error downloading script:', error);
      toast.error('Failed to download script');
    }
  };

  const generatePDF = (script) => {
    // Simple PDF generation using browser's print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${script.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #007bff; }
            h2 { color: #555; margin-top: 20px; }
            .meta { background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; }
            .content { white-space: pre-wrap; line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${script.title}</h1>
          <div class="meta">
            <strong>Category:</strong> ${script.category}<br>
            <strong>Topic:</strong> ${script.topic}<br>
            <strong>Duration:</strong> ${script.duration} minutes<br>
            <strong>Difficulty:</strong> ${script.difficulty}
          </div>
          <div class="content">${script.content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchScripts(selectedCategory.id, searchQuery, difficulty);
    }
  }, [selectedCategory, searchQuery, difficulty]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedScript(null);
  };

  const handleScriptSelect = (script) => {
    fetchScript(script._id);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDifficultyFilter = (e) => {
    setDifficulty(e.target.value);
  };

  if (loading && !selectedCategory) {
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
            <h1 className="text-2xl font-bold text-gray-900">Script Library</h1>
            <p className="text-gray-600">Choose a category to explore scripts and improve your speaking skills</p>
          </div>
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Categories */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.id] || BookOpen;
            return (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg bg-${category.color}-100`}>
                    <IconComponent className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600">
                  <span className="text-sm font-medium">Explore Scripts</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scripts List */}
      {selectedCategory && !selectedScript && (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronDown className="w-4 h-4 mr-1 rotate-90" />
            Back to Categories
          </button>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search scripts..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={difficulty}
                  onChange={handleDifficultyFilter}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scripts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : scripts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scripts found</h3>
              <p className="text-sm text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scripts.map((script) => (
                <div
                  key={script._id}
                  onClick={() => handleScriptSelect(script)}
                  className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{script.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{script.topic}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{script.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {script.duration}m
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[script.difficulty]}`}>
                        {script.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Download className="w-4 h-4 mr-1" />
                      {script.downloadCount}
                    </div>
                  </div>

                  <div className="flex items-center text-blue-600">
                    <span className="text-sm font-medium">View Script</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Script Detail */}
      {selectedScript && (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedScript(null)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronDown className="w-4 h-4 mr-1 rotate-90" />
            Back to Scripts
          </button>

          {/* Script Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedScript.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{selectedScript.topic}</p>
                <p className="text-gray-500 mb-4">{selectedScript.description}</p>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedScript.duration} minutes
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[selectedScript.difficulty]}`}>
                    {selectedScript.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Download className="w-4 h-4 mr-1" />
                    {selectedScript.downloadCount} downloads
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => downloadScript(selectedScript._id)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Script Content */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Script Content</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Total Duration: {selectedScript.duration} minutes</span>
                </div>
              </div>
              
              {/* Enhanced Script Display */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedScript.title}</h2>
                  <p className="text-gray-600">{selectedScript.topic}</p>
                </div>
                
                <div className="p-6">
                  <div className="prose prose-lg max-w-none">
                    {selectedScript.content ? (
                      <div className="space-y-8">
                        {selectedScript.content.split('\n\n').map((section, index) => {
                          // Check if section starts with ## (markdown heading)
                          if (section.startsWith('##')) {
                            const lines = section.split('\n');
                            const heading = lines[0].replace('##', '').trim();
                            const timeMatch = heading.match(/\((\d+)\s*minute[s]?\)/i);
                            const time = timeMatch ? timeMatch[1] : null;
                            const cleanHeading = heading.replace(/\(\d+\s*minute[s]?\)/i, '').trim();
                            const content = lines.slice(1).join('\n').trim();
                            
                            return (
                              <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50/30 rounded-r-lg">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-xl font-bold text-gray-900">{cleanHeading}</h3>
                                  {time && (
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {time} min
                                    </span>
                                  )}
                                </div>
                                <div className="text-gray-700 leading-relaxed">
                                  {content.split('\n').map((line, lineIndex) => {
                                    if (line.startsWith('*') || line.startsWith('-')) {
                                      return (
                                        <div key={lineIndex} className="flex items-start mb-2">
                                          <span className="text-blue-600 mr-3 mt-1">•</span>
                                          <span className="flex-1">{line.replace(/^[*\-\s]+/, '')}</span>
                                        </div>
                                      );
                                    } else if (line.match(/^\d+\./)) {
                                      return (
                                        <div key={lineIndex} className="flex items-start mb-2">
                                          <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                                            {line.match(/^(\d+)\./)[1]}
                                          </span>
                                          <span className="flex-1">{line.replace(/^\d+\.\s*/, '')}</span>
                                        </div>
                                      );
                                    } else if (line.trim()) {
                                      return (
                                        <p key={lineIndex} className="mb-3 text-gray-700 leading-relaxed">
                                          {line}
                                        </p>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            );
                          } else if (section.trim()) {
                            return (
                              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                                <div className="text-gray-700 leading-relaxed">
                                  {section.split('\n').map((line, lineIndex) => {
                                    if (line.startsWith('*') || line.startsWith('-')) {
                                      return (
                                        <div key={lineIndex} className="flex items-start mb-2">
                                          <span className="text-blue-600 mr-3 mt-1">•</span>
                                          <span className="flex-1">{line.replace(/^[*\-\s]+/, '')}</span>
                                        </div>
                                      );
                                    } else if (line.match(/^\d+\./)) {
                                      return (
                                        <div key={lineIndex} className="flex items-start mb-2">
                                          <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                                            {line.match(/^(\d+)\./)[1]}
                                          </span>
                                          <span className="flex-1">{line.replace(/^\d+\.\s*/, '')}</span>
                                        </div>
                                      );
                                    } else if (line.trim()) {
                                      return (
                                        <p key={lineIndex} className="mb-3 text-gray-700 leading-relaxed">
                                          {line}
                                        </p>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p>No script content available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Practice Tips */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-green-800">Practice Tips</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">💡</span>
                    <span>Practice in front of a mirror first to build confidence</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">🎯</span>
                    <span>Record yourself to identify areas for improvement</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">⏰</span>
                    <span>Start with shorter sections and gradually increase duration</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">🔄</span>
                    <span>Repeat challenging sections until you feel comfortable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scripts;
