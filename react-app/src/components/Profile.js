// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { getUserProfile } from '../services/api';

// const Profile = ({ onLoginClick }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Simplified auth check
//   const isLoggedIn = () => {
//     const token = sessionStorage.getItem('token');
//     return !!token; // Convert to boolean
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!isLoggedIn()) {
//         setLoading(false);
//         onLoginClick();
//         return;
//       }

//       try {
//         const userData = await getUserProfile();
//         setUser(userData);
//       } catch (error) {
//         console.error('Profile fetch error:', error);
//         if (error.response?.status === 401) {
//           sessionStorage.removeItem('token');
//           onLoginClick();
//         } else {
//           toast.error('Failed to load profile');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [onLoginClick]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null; // Or redirect to login
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      
//       <div className="bg-white shadow-md rounded-lg p-4">
//         <h2 className="text-xl font-semibold mb-2">Account Details</h2>
//         <div className="space-y-2">
//         <p><strong>ID:</strong> {user.id.toString()}</p>
//         <p><strong>Username:</strong> {user.username}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getUserProfile, getUserMinutes } from '../services/api';

const Profile = ({ onLoginClick }) => {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minutes, setMinutes] = useState([]);
  const [minutesLoading, setMinutesLoading] = useState(true);

  // Simplified auth check
  const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token; // Convert to boolean
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn()) {
        setLoading(false);
        onLoginClick();
        return;
      }

      try {
        const userData = await getUserProfile();
        setUser (userData);
      } catch (error) {
        console.error('Profile fetch error:', error);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          onLoginClick();
        } else {
          toast.error('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [onLoginClick]);

  useEffect(() => {
    const fetchUserMinutes = async () => {
      if (!isLoggedIn()) return;

      try {
        const userMinutes = await getUserMinutes();
        setMinutes(userMinutes);
      } catch (error) {
        console.error('Minutes fetch error:', error);
        toast.error('Failed to load meeting minutes');
      } finally {
        setMinutesLoading(false);
      }
    };

    fetchUserMinutes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">User  Profile</h1>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Account Details</h2>
        <div className="space-y-2">
          <p><strong>ID:</strong> {user.id.toString()}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Meeting Minutes History</h2>
      {minutesLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          {minutes.length === 0 ? (
            <p>No meeting minutes found.</p>
          ) : (
            <ul className="space-y-4">
              {minutes.map(minute => (
                <li key={minute.id} className="border-b pb-2">
                  <h3 className="font-semibold">{minute.title}</h3>
                  <p>{minute.summary}</p>
                  <p className="text-gray-500 text-sm">Created At: {minute.created_at}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;