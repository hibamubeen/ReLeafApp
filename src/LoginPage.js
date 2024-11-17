import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import HomePage from './HomePage.tsx';
import releaf_Logo from './releaf_logo.png';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-900 text-white relative overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 relative">
        {/* 3D Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-500/20 rounded-xl transform rotate-12 animate-float" 
             style={{
               perspective: '1000px',
               transform: 'rotateX(45deg) rotateY(-15deg)',
               animation: 'float 6s ease-in-out infinite'
             }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-emerald-500/20 rounded-lg transform -rotate-12"
             style={{
               perspective: '1000px',
               transform: 'rotateX(45deg) rotateY(15deg)',
               animation: 'float 8s ease-in-out infinite'
             }} />
        
        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <img 
              src={releaf_Logo}
              alt="ReLeaf"
              className="h-44 w-auto mx-auto"
              style={{ filter: 'brightness(0) invert(1)' }} // This makes the logo white
            />
            <span className="block text-2xl mt-4 text-green-400">Properties, simplified.</span>
          </div>
          
          <p className="text-xl mb-12 text-gray-300">
            Providing simple and transparent carbon emission and energy consumption data analytics.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center">
            <button 
              onClick={() => setCurrentPage('login')}
              className="px-8 py-4 bg-green-600 rounded-lg transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50">
              Get Started
            </button>
            <a 
              href="https://www.cbre.com/about-us/corporate-responsibility/corporate-responsibility-planet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border-2 border-white rounded-lg transform hover:-translate-y-1 transition-all duration-300 hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            { title: 'Sustainability', desc: 'Data Analytics for a greener tomorrow' },
            { title: 'Innovation', desc: 'Cutting-edge environmental technology' },
            { title: 'Economy', desc: 'Employing the most efficient cost-saving techniques' }
          ].map((feature, index) => (
            <div key={index} 
                 className="p-6 bg-white/10 backdrop-blur-lg rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                 style={{
                   perspective: '1000px',
                   transform: `rotateX(${index * 5}deg) rotateY(${index * 3}deg)`
                 }}>
              <h3 className="text-xl font-bold mb-4 text-green-400">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl" />
      </div>
    </div>
  );

  // Login Page Component
  const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e) => {
      e.preventDefault();
      setCurrentPage('home'); // Navigate to home page
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Back Button */}
        <button 
          onClick={() => setCurrentPage('landing')}
          className="absolute top-6 left-6 text-white hover:text-green-400 transition-colors duration-300"
        >
          ← Back to Home
        </button>

        {/* Main Card */}
        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md transform hover:scale-[1.01] transition-all duration-300 border border-white/20">
          {/* Logo Section */}
          <div className="text-center mb-8">
          <img 
              src={releaf_Logo}
              alt="ReLeaf"
              className="h-28 w-auto mx-auto"
              style={{ filter: 'brightness(0) invert(1)' }} // This makes the logo white
            />
            <p className="text-green-400">Properties, Simplified.</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-white/5 rounded-lg p-1">
            <button
              className={`flex-1 py-3 rounded-md transition-all duration-300 ${
                isLogin ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 rounded-md transition-all duration-300 ${
                !isLogin ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-green-400 mb-2 text-sm">Email</label>
              <input
                type="email"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-green-400 mb-2 text-sm">Password</label>
              <input
                type="password"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-green-400 mb-2 text-sm">Confirm Password</label>
                <input
                  type="password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {/* Forgot Password Link */}
          {isLogin && (
            <p className="text-center mt-4">
              <a href="#" className="text-green-400 hover:text-green-300 text-sm">
                Forgot your password?
              </a>
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render current page based on state
  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'home':
      return <HomePage />;
    default:
      return <LandingPage />;
  }
};

export default App;