import React, { useState } from "react";
import UserCard from "./UserCard";
import { url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const saveChanges = async () => {
    try {
      const res = await axios.patch(
        url + "/profile/edit",
        { firstName, lastName, age, gender, photoUrl, about },
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch(addUser(res.data));
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="flex justify-center items-center gap-5">
      <div>
        <div className="flex justify-center mt-10">
          <div className="card bg-base-200 w-96 shadow-sm">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">firstName</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">lastName</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">PhotoUrl</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Age</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Gender</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">About</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Type here"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </fieldset>
              <p>{error}</p>
              <div className="card-actions justify-center">
                <button className="btn btn-secondary" onClick={saveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserCard user={{ firstName, lastName, age, gender, photoUrl, about }} />
    </div>
  );
};

export default EditProfile;
