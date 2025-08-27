import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const { userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const sendVerificationOTP = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      if (data.success) {
        toast.success("Verification OTP sent to your email!");
        navigate('/email-verify');
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
          {userData ? `Hi ${userData.name.split(" ")[0]}!` : "Hi User!"}
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          {userData
            ? "Welcome back to your secure dashboard. Explore your account and enjoy our features!"
            : "Welcome to our authentication demo. Please login to get started!"}
        </p>
        {!userData && (
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        )}
        {userData && (
          <div className="mt-6 text-left">
            <div className="mb-2">
              <span className="font-semibold text-gray-800">Email:</span> {userData.email}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-800">Verification Status:</span>{" "}
              <span className={userData.isAccountVerified ? 'text-green-600' : 'text-red-600'}>
                {userData.isAccountVerified ? 'Verified ✓' : 'Not Verified'}
              </span>
            </div>
            {!userData.isAccountVerified && (
              <div className="mt-4">
                <button
                  onClick={sendVerificationOTP}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Verify Email Now
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Click the button above to get a verification code sent to your email.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
