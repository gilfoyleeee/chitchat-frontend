import React, { useState, useEffect } from "react";
import axios from "axios";
import "./message.css";

const Conversation = ({ conversation, id }) => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    //filter the conversation which contains my id to get friends id
    const friendId = conversation.conversation.find((m) => m !== id);

    //fetching the friends all information
    axios({
      method: "get",
      url: `http://localhost:5000/friend/${friendId}`,
    })
      .then((result) => {
        setUser(result.data[0].username);
        setProfilePhoto(result.data[0].profilePic);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="flex flex-row rounded-md gap-x-2 w-full p-3 space-x-2 items-start justify-end select-none cursor-pointer hover:bg-[#eaeaeb] hover:text-black">
        <div className="w-[20%]">
          {profilePhoto == "" ? (
            <img
              src="http://localhost:3000/images/user.png"
              className="w-[3rem] h-[3rem] rounded-full"
            />
          ) : (
            <img
              src={`http://localhost:5000/${profilePhoto.replace(
                "public\\",
                ""
              )}`}
              className="w-[3rem] h-[3rem] rounded-full"
            />
          )}
        </div>
        <div className="w-[80%] flex flex-col gap-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-poppins font-semibold  max-[1067px]:text-xs">
              {user}
            </span>
          </div>
          <span className="text-xs font-poppins">Select to chat</span>
        </div>
      </div>
    </>
  );
};

export default Conversation;