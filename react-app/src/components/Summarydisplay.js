import React from 'react';

const SummaryDisplay = ({ summary }) => {
  if (!summary) return null;

  // Function to clean up text
  const cleanText = (text) => text.replace(/\*\*/g, '');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Meeting Summary</h3>
      <div className="prose max-w-none">
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Overview</h4>
          <p className="text-sm text-gray-700">{cleanText(summary.keyPoints.join(' '))}</p>
        </div>
        
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Key Points</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {Array.isArray(summary.decisionsMade) && summary.decisionsMade.map((point, index) => (
              <li key={index}>{cleanText(point)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Action Items</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {Array.isArray(summary.actionItems) && summary.actionItems.map((item, index) => (
              <li key={index}>{cleanText(item)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
