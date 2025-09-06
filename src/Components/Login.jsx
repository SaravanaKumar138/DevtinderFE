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
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(response.data));
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data);
      console.error("Login error:", err);
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
      return navigate("/profile");
    } catch (err) {
       setError(err?.response?.data);
    }
  };
  return (
    <div className="flex justify-center mt-10">
      <div className="card bg-base-200 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLogin ? "Login" : "SignUp"}
          </h2>
          {!isLogin && (
            <>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">FirstName</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">LastName</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
            </>
          )}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email Id</legend>
            <input
              type="text"
              className="input"
              placeholder="Type here"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input"
              placeholder="Type here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
          <p className="text-red-600">{error}</p>
          <div className="card-actions flex items-center mx-auto">
            <button
              className="btn btn-primary p-5 "
              onClick={isLogin ? handleLogin : handleSignUp}
            >
              {isLogin ? "Login" : "SignUp"}
            </button>
            <p className="cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
              {isLogin
                ? "New User ? Sign Up Here"
                : "Existing User? Login Here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
