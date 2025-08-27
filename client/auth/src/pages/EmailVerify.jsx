import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/appContext";

const EmailVerify = () => {
  const { backendUrl, userData, getUserData, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Redirect if not logged in or already verified
  useEffect(() => {
    if (!isLoggedIn || !userData) {
      navigate("/login");
    } else if (userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  // Handle OTP input
  const handleInput = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      inputRefs.current[5].focus();
    }
  };

  // Submit OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp: code },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Email verified successfully!");
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  // Resend OTP
  const resendOTP = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("OTP resent to your email!");
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the verification code sent to{" "}
          <span className="font-semibold">{userData?.email}</span>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={verifyOTP}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <div className="flex justify-between space-x-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={resendOTP}
                disabled={loading}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend verification code
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
