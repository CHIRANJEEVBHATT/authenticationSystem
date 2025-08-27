import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);  
  const [dropdownOpen, setDropdownOpen] = useState(false);   
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);
  const sendVerificationotp = async () => {
    try {
          axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      if (data.success) {
        toast.success("Verification OTP sent to your email!");
        setDropdownOpen(false);   
        navigate('/email-verify'); 
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification OTP");
    }
  }
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success("Logged out successfully");
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
       
          <h1 className="text-2xl font-bold text-indigo-600">Auth App</h1>


          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {userData ? (
              <div className="relative">
          
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {userData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700">
                    {userData.name}
                  </span>
                </button>


                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {userData.email}
                    </div>
                    {!userData.isAccountVerified && (
                      <button
                        onClick={sendVerificationotp}
                        className="block w-full px-4 py-2 text-left text-indigo-600 hover:bg-gray-100 border-b"
                      >
                        Verify Email
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  state={{ isSignUp: true }}
                  className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            {userData ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 border-b">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {userData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{userData.name}</span>
                </div>
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {userData.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  state={{ isSignUp: true }}
                  className="block w-full px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
