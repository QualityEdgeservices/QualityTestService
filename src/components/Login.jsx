import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, { email, password });
  //     localStorage.setItem("token", response.data.token);
  //     toast.success("Login successful!");
  //     navigate("/");
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    
    // Dispatch event to notify Navbar about login
    window.dispatchEvent(new CustomEvent('userLoggedIn', {
      detail: {
        user: response.data.user,
        token: response.data.token
      }
    }));
    
    toast.success("Login successful!");
    navigate("/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  // Google Login with custom button
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // fetch profile using Google API
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const { email, name, sub: googleId } = res.data;

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/google`, {
          email,
          name,
          googleId,
        });

        localStorage.setItem("token", response.data.token);
        toast.success("Google login successful!");
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Google login failed");
      }
    },
    onError: () => toast.error("Google login failed. Please try again."),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign in"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Custom Google button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition"
              >
              <FaGoogle />
                <span>Sign in with Google</span>

              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
