import React from 'react';
import { BookOpen, Clock, Briefcase, FileText } from 'lucide-react';

const Features = () => {
  return (
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Streamline Your Meetings with Our AI-Powered Minutes Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Automated Meeting Minutes</h3>
            <p className="text-gray-700 text-center">Generate accurate meeting minutes automatically during your Microsoft Teams meetings.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <Clock className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Real-Time Summarization</h3>
            <p className="text-gray-700 text-center">Capture key points and decisions in real-time, ensuring nothing is missed.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <Briefcase className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Email Distribution</h3>
            <p className="text-gray-700 text-center">Automatically send the generated minutes to all meeting participants via email.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <FileText className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Easy Access to Meeting Records</h3>
            <p className="text-gray-700 text-center">Store and access past meeting minutes effortlessly for future reference.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;