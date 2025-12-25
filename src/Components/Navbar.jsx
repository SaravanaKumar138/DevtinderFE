import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { url } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await axios.post(url + "/auth/logout", {}, { withCredentials: true });
    dispatch(removeUser());
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to={user ? "/feed" : "/"}
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 hover:scale-105 transition"
        >
          🖥️ DevTinder
        </Link>

        {/* USER MENU */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-gray-300">
              Welcome, <span className="font-semibold">{user.lastName}</span>
            </span>

            {/* DROPDOWN */}
            <div className="relative group">
              <img
                src={user.photoUrl}
                alt="user"
                className="w-10 h-10 rounded-full border-2 border-indigo-400 cursor-pointer hover:scale-110 transition"
              />

              {/* MENU */}
              <div className="absolute right-0 mt-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <ul className="bg-[#0f0c29]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl p-2 text-sm text-gray-300">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 rounded-lg hover:bg-indigo-500/20"
                    >
                      👤 Profile
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/connections"
                      className="block px-4 py-2 rounded-lg hover:bg-indigo-500/20"
                    >
                      🤝 Connections
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/requests"
                      className="block px-4 py-2 rounded-lg hover:bg-indigo-500/20"
                    >
                      📩 Requests
                    </Link>
                  </li>
                  <li>
                  <Link to="/matches" className="block px-4 py-2 rounded-lg hover:bg-indigo-500/20">
                  Smart Matching
                  </Link>  
                  </li>
                  
                  <li>
                    <Link
                      to="/premium"
                      className="block px-4 py-2 rounded-lg hover:bg-pink-500/20 text-pink-400"
                    >
                      ⭐ Premium
                    </Link>
                  </li>

                  <li className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400"
                    >
                      🚪 Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
