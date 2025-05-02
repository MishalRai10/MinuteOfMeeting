import React from 'react';
import { Star, User } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = [
    {
      name: "User  A",
      date: "March 15, 2023",
      rating: 5,
      text: "This summarizer tool has saved me so much time!",
    },
    {
      name: "User  B",
      date: "April 10, 2023",
      rating: 4,
      text: "A must-have for anyone doing research.",
    },
    {
      name: "User  C",
      date: "May 5, 2023",
      rating: 5,
      text: "Simplifies complex texts effortlessly.",
    },
  ];

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customer Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-start">
              <User  className="h-10 w-10 text-blue-600 mr-4" /> {/* User icon from lucide-react */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-1">"{review.text}"</p>
                <p className="text-gray-500 text-sm">{review.name} - {review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;