import React, { useEffect } from "react";
import EditProfile from "./EditProfile";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${url}/profile/view`, {
          withCredentials: true,
        });

        dispatch(addUser(res.data)); // 🔑 update redux from Redis/DB
      } catch (err) {
        console.error("Failed to load profile", err.message);
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (!user) return null;

  return <EditProfile user={user} />;
};

export default Profile;