import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Oval } from 'react-loader-spinner';
// @ts-ignore
import { baseUrl } from '../config/api.js';

const Login = ({ setUserToken }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const userToken = localStorage.getItem("user__token");
    if (userToken) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const result = await axios.post(`${baseUrl}/user/login`, { email, password });
      setLoading(false);

      if (result.data.token) {
        localStorage.setItem("user__token", result.data.token);
        setUserToken(result.data.token);
        toast.success(result.data.message || "Login success");
        navigate("/home");
      } else {
        toast.error(result.data.message || "Login failed");
        if (result.data.message === "User not found") {
          navigate("/register");
        }
      }
    } catch (err) {
      setLoading(false);
      // @ts-ignore
      toast.error(err.response?.data?.message || "An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black font-sans text-white">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
          <Oval
            height={80}
            width={80}
            color="#ffffff"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#ffffff"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Welcome to the Login Page</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-black font-bold">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-black font-bold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-black">
          Don't have an account? <Link to="/register" className="text-black font-bold hover:text-gray-800 transition duration-300">Register</Link>
        </p>
        <p className="mt-4 text-center text-black">
          Continue without login? <Link to="/home" className="text-black font-bold hover:text-gray-800 transition duration-300">Let's Go!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
