import React from 'react';

const NotFoundScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-4xl font-bold mb-4 text-red-600">404</h1>
    <p className="text-lg text-gray-700 mb-6">Page Not Found</p>
    <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
  </div>
);

export default NotFoundScreen;
