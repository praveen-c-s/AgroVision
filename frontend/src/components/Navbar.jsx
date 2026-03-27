import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  // Farmer navigation
  const farmerLinks = [
    { path: '/farmer/dashboard', label: 'Dashboard' },
    { path: '/farmer/submit-prediction', label: 'Image Prediction' },
    { path: '/farmer/submit-crop', label: 'Crop Recommendation' },
    { path: '/farmer/soil-test', label: 'Soil Test Booking' },
    { path: '/farmer/my-requests', label: 'My Requests' },
  ];

  // Officer navigation
  const officerLinks = [
    { path: '/officer/dashboard', label: 'Dashboard' },
    { path: '/officer/pending', label: 'Pending Requests' },
    { path: '/officer/assigned', label: 'Assigned Requests' },
    { path: '/officer/completed', label: 'Completed Results' },
  ];
 // Admin navigation
const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/approve-officers', label: 'Approve Officers' }
];
  let links = [];

if (user?.role === "farmer") {
  links = farmerLinks;
} 
else if (user?.role === "officer") {
  links = officerLinks;
} 
else if (user?.role === "admin") {
  links = adminLinks;
}

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              🌱 AgroVision
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-green-700 text-white'
                    : 'text-white hover:bg-green-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-green-400">
              <span className="text-sm">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
