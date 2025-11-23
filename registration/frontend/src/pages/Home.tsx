import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to User Registration System
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            A complete user registration and authentication system built with React and NestJS
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Get Started - Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Secure Registration</h3>
              <p className="text-gray-600">Password hashing and validation for secure user registration</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Modern UI</h3>
              <p className="text-gray-600">Clean and responsive interface built with Tailwind CSS</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Full Stack</h3>
              <p className="text-gray-600">Complete solution with React frontend and NestJS backend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;