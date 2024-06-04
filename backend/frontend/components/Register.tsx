import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
// @ts-ignore
import { baseUrl } from '../config/api.js';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMarquee, setShowMarquee] = useState(true); // State to control visibility of marquee

  useEffect(() => {
    const userToken = localStorage.getItem("user__token");
    if (userToken) {
      navigate("/home");
    }

    // Hide the marquee after 5 seconds
    const timer = setTimeout(() => {
      setShowMarquee(false);
    },25000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(`${baseUrl}/user/register`, { name, email, password });
      setLoading(false);

      if (result.data.message === 'User already exists') {
        toast.error(result.data.message || "E-mail already registered! Please Login to proceed.");
        navigate("/login");
      } else {
        toast.success(result.data.message || "Registered successfully! Please Login to proceed.");
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      // @ts-ignore
      toast.error(err.response?.data?.message || "An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black font-sans">
      {showMarquee && (
        <div className="text-white text-center w-full py-2 bg-black" style={{ overflow: "hidden" }}>
          <div style={{ display: "inline-block", animation: "marquee 20s linear infinite" }}>
            Backend is deployed on render. Please wait for the request to process :)
          </div>
        </div>
      )}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
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
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Welcome to the Register Page</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="exampleInputName" className="block mb-2 text-black font-bold">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              id="exampleInputName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="exampleInputEmail" className="block mb-2 text-black font-bold">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              id="exampleInputEmail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="exampleInputPassword" className="block mb-2 text-black font-bold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              id="exampleInputPassword"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-black">
          Already have an account? <Link to="/login" className="text-black font-bold hover:text-gray-800 transition duration-300">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
