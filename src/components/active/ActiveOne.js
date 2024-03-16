import React, { useEffect, useState } from "react";
import axios from "axios";

const ActiveOne = ({ active }) => {
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/user/${active.userId}`,
    })
      .then((result) => {
        setUsername(result.data.findUserDetails.username);
        setProfilePhoto(result.data.findUserDetails.profilePic);
      })
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <div className="relative items-center">
      <div className="flex flex-col items-center">
        {profilePhoto === "" ? (
          <img
            src="http://localhost:3000/images/user.png"
            className="w-[3rem] h-[3rem] rounded-full"
            alt="Profile"
          />
        ) : (
          <img
            src={`http://localhost:5000/${profilePhoto.replace(
              "public\\",
              ""
            )}`}
            className="w-[3rem] h-[3rem] rounded-full"
            alt="Profile"
          />
        )}
        <div className="absolute bottom-6 right-0">
          <div className="w-3 h-3 rounded-full bg-green-700"></div>
        </div>
      </div>
      <span className="text-center mt-1 truncate font-poppins">{username}</span>
    </div>
  );
};

export default ActiveOne;
