
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6 px-8 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
          Tutokenized
        </h1>
        <p className="text-purple-100 text-lg">
          AI-Powered GPU Tutoring Platform for Data Science Excellence
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="bg-purple-500/30 px-3 py-1 rounded-full">🚀 Real-time GPU Simulation</span>
          <span className="bg-purple-500/30 px-3 py-1 rounded-full">📊 Performance Benchmarks</span>
          <span className="bg-purple-500/30 px-3 py-1 rounded-full">🤖 LLM-Assisted Learning</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
