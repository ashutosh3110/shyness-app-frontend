import React from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '../components/LandingNav';
import { 
  Video, 
  Target, 
  Upload, 
  Trophy, 
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Award,
  Star
} from 'lucide-react';

const Landing = () => {
  const steps = [
    {
      icon: Target,
      title: "Choose Your Topic",
      description: "Select from our curated list of speaking topics designed to build your confidence gradually.",
      color: "bg-blue-500"
    },
    {
      icon: Video,
      title: "Record Your Video",
      description: "Record yourself speaking about the topic. Our system will guide you through the process.",
      color: "bg-green-500"
    },
    {
      icon: Upload,
      title: "Upload & Validate",
      description: "Upload your video and let our AI validate it for quality, audio, and face detection.",
      color: "bg-purple-500"
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Watch your confidence grow as you maintain streaks and earn rewards for consistency.",
      color: "bg-orange-500"
    }
  ];

  const features = [
    {
      icon: PlayCircle,
      title: "Curated Topics",
      description: "Carefully selected speaking topics for all skill levels",
      color: "text-blue-600"
    },
    {
      icon: Clock,
      title: "Daily Streaks",
      description: "Build consistency with our streak tracking system",
      color: "text-green-600"
    },
    {
      icon: Award,
      title: "Rewards & Badges",
      description: "Earn achievements for your speaking milestones",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics",
      color: "text-orange-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Professional",
      content: "I was terrified of public speaking. This app helped me build confidence one video at a time. Now I present to large audiences with ease!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      content: "The streak system kept me motivated. I went from avoiding meetings to leading presentations. The progress tracking is incredible.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      content: "As a shy student, this app transformed my confidence. The topics are perfect for practice, and the rewards make it fun!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Overcome Shyness,
              <span className="text-primary-600"> Build Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your public speaking skills through daily video practice. 
              Join thousands who have conquered their fear of speaking with our proven method.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our simple 4-step process makes building confidence easy and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform translate-x-4">
                      <ArrowRight className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 transform -translate-y-1/2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Shyness App?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build confidence and improve your speaking skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed How-to Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Getting Started Guide
            </h2>
            <p className="text-xl text-gray-600">
              Follow this detailed guide to make the most of your confidence-building journey
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Create Your Account
                </h3>
                <p className="text-gray-600 mb-4">
                  Sign up with your email and create a secure password. Your account will track your progress and store your videos safely.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Secure authentication with JWT tokens</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Your data is encrypted and protected</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Choose Your Daily Topic
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse our curated collection of speaking topics. Each topic is designed to help you practice specific skills and build confidence gradually.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Topics for all skill levels (Beginner to Advanced)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Categories: Personal, Professional, Creative, Educational</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Helpful tips and estimated duration for each topic</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Record & Upload Your Video
                </h3>
                <p className="text-gray-600 mb-4">
                  Record yourself speaking about the chosen topic. Our system will automatically validate your video to ensure it meets quality standards.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Minimum 30 seconds duration required</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Audio track must be present</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Face detection ensures you're visible</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Supports MP4, WebM, and MOV formats</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Track Progress & Earn Rewards
                </h3>
                <p className="text-gray-600 mb-4">
                  Watch your confidence grow as you maintain daily streaks and unlock achievements. Our reward system keeps you motivated throughout your journey.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Daily streak tracking with automatic calculation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlock rewards at 3, 7, 14, 30, and 60-day streaks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Detailed analytics and progress visualization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Points system with rarity levels (Common to Legendary)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how others have transformed their confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Confidence?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who have overcome their fear of public speaking. 
            Start your journey today with just 2 minutes of daily practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 flex items-center justify-center space-x-2"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Shyness App</span>
              </div>
              <p className="text-gray-400">
                Building confidence through daily practice
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Shyness App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
