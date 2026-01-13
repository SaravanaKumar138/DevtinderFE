// import React, { useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { addUser } from "../utils/userSlice";
// import { useNavigate } from "react-router-dom";
// import { url } from "../utils/constants";

// const Login = () => {
//   const [emailId, setEmailId] = useState("gosling.java@gmail.com");
//   const [password, setPassword] = useState("Java@1995");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [error, setError] = useState("");
//   const [isLogin, setIsLogin] = useState(true);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post(
//         url + "/auth/login",
//         { emailId, password },
//         { withCredentials: true }
//       );
//       dispatch(addUser(response.data));
//       navigate("/feed");
//     } catch (err) {
//       setError(err?.response?.data || "Login failed. Try again.");
//     }
//   };

//   const handleSignUp = async () => {
//     try {
//       const response = await axios.post(
//         url + "/auth/signUp",
//         { firstName, lastName, emailId, password },
//         { withCredentials: true }
//       );
//       dispatch(addUser(response.data));
//       navigate("/profile");
//     } catch (err) {
//       setError(err?.response?.data || "Sign up failed. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-200">
//       <div className="card bg-base-100 w-full max-w-md shadow-xl border border-base-300 p-6 transition-all duration-300">
//         <div className="card-body">
//           <h2 className="card-title justify-center text-2xl font-semibold mb-4 text-primary">
//             {isLogin ? "Welcome Back 👋" : "Create an Account ✨"}
//           </h2>

//           {!isLogin && (
//             <div className="grid grid-cols-2 gap-4">
//               <fieldset className="fieldset">
//                 <legend className="fieldset-legend text-sm text-gray-500">
//                   First Name
//                 </legend>
//                 <input
//                   type="text"
//                   className="input input-bordered w-full"
//                   placeholder="John"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />
//               </fieldset>
//               <fieldset className="fieldset">
//                 <legend className="fieldset-legend text-sm text-gray-500">
//                   Last Name
//                 </legend>
//                 <input
//                   type="text"
//                   className="input input-bordered w-full"
//                   placeholder="Doe"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                 />
//               </fieldset>
//             </div>
//           )}

//           <fieldset className="fieldset mt-2">
//             <legend className="fieldset-legend text-sm text-gray-500">
//               Email Address
//             </legend>
//             <input
//               type="email"
//               className="input input-bordered w-full"
//               placeholder="you@example.com"
//               value={emailId}
//               onChange={(e) => setEmailId(e.target.value)}
//             />
//           </fieldset>

//           <fieldset className="fieldset mt-2">
//             <legend className="fieldset-legend text-sm text-gray-500">
//               Password
//             </legend>
//             <input
//               type="password"
//               className="input input-bordered w-full"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </fieldset>

//           {error && (
//             <p className="text-red-600 text-center mt-3 text-sm font-medium">
//               ⚠ {error}
//             </p>
//           )}

//           <div className="card-actions mt-5 flex flex-col items-center">
//             <button
//               className="btn btn-primary w-full py-2 text-lg"
//               onClick={isLogin ? handleLogin : handleSignUp}
//             >
//               {isLogin ? "Login" : "Sign Up"}
//             </button>

//             <p
//               className="mt-3 text-sm text-gray-600 cursor-pointer hover:text-primary"
//               onClick={() => setIsLogin(!isLogin)}
//             >
//               {isLogin
//                 ? "New user? Create an account"
//                 : "Already have an account? Login here"}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { url } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("gosling.java@gmail.com");
  const [password, setPassword] = useState("Java@1995");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        url + "/auth/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Login failed. Try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        url + "/auth/signUp",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Sign up failed. Try again.");
    }
  };

  return (
    // Background matches the deep navy/purple of your screenshots
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6">
      {/* Card styled like your 'Your Connections' list items */}
      <div className="bg-[#2a274a] w-full max-w-md rounded-[2rem] shadow-2xl border border-[#3f3b6c] p-10 transition-all duration-300">
        {/* Heading matches the 'Your Connections' text style */}
        <h2 className="text-center text-4xl font-bold mb-8 text-[#d8b4fe] tracking-tight">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <div className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 ml-2 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="bg-[#1d1b31] border border-[#3f3b6c] text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 ml-2 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="bg-[#1d1b31] border border-[#3f3b6c] text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 ml-2 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="bg-[#1d1b31] border border-[#3f3b6c] text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              placeholder="you@example.com"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 ml-2 mb-1">Password</label>
            <input
              type="password"
              className="bg-[#1d1b31] border border-[#3f3b6c] text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-center mt-4 text-sm font-medium animate-pulse">
            ⚠️ {error}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center">
          {/* Button with the Purple-to-Pink gradient from your screenshots */}
          <button
            className="w-full py-3 rounded-xl font-bold text-white text-lg transition-transform active:scale-95 shadow-lg bg-gradient-to-r from-[#6366f1] to-[#ec4899] hover:opacity-90"
            onClick={isLogin ? handleLogin : handleSignUp}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p
            className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-[#d8b4fe] transition-colors"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin
              ? "New user? Create an account"
              : "Already have an account? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;