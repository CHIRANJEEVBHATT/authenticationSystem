import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/appContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify';
const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext)
    const [state, setState] = useState(location.state?.isSignUp ? 'sign Up' : 'login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmiHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            
            if(state === 'sign Up') {
                const {data} = await axios.post(`${backendUrl}/api/auth/register`, {
                    name,
                    email,
                    password
                });
                
                if(data.success) {
                    setIsLoggedIn(true);
                    toast.success('Registration successful!');
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            } else {
                const {data} = await axios.post(
                    `${backendUrl}/api/auth/login`,
                    { email, password },
                    { withCredentials: true }
                  );
                
                if(data.success) {
                    toast.success('Login successful!');
                    setIsLoggedIn(true);
                    await getUserData(); 
                    navigate('/'); 
                } else {
                    toast.error(data.message || 'Login failed');
                }
            }
    } catch(error){
        console.log(error);
        toast.error(error.response?.data?.message || 'An error occurred');
        setLoading(false); 
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {state === 'sign Up' ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {state === 'sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmiHandler}>
            {state === 'sign Up' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span
                  onClick={() => navigate('/reset-password')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
              >
                {loading ? 'Processing...' : state}
              </button>
            </div>
          </form>

          <div className="mt-6">
            {state === 'sign Up' ? (
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <span
                  onClick={() => setState('login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <span
                  onClick={() => setState('sign Up')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  Sign up
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
