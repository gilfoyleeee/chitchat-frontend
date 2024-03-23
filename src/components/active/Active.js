import React, { useEffect, useState } from "react";
import ActiveOne from "./ActiveOne";
import axios from "axios";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

const Active = ({ socket }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState("");
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const scrollContainerRef = React.useRef(null);
  //userDetails
  const [userDetails, setUserDetails] = useState([]);

  //profile pic
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    socket?.on("clientInfo", (data) => {
      setOnlineUsers(data);
    });
  }, [socket]);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/active",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/user/${userId}`,
      })
        .then((result) => {
          setFriends(result.data.findUserDetails.friends);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  const filteredOnlineUsers = onlineUsers.filter((user) =>
    friends.includes(user.userId)
  );

  const onScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer.scrollLeft > 0) {
      setShowLeft(true);
    } else {
      setShowLeft(false);
    }

    if (
      scrollContainer.scrollLeft ===
      scrollContainer.scrollWidth - scrollContainer.clientWidth
    ) {
      setShowRight(false);
    } else {
      setShowRight(true);
    }
  };

  //getting user data
  useEffect(() => {
    const userId = localStorage.getItem("user");

    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/user/${userId}`,
      })
        .then((result) => {
          setUserDetails(result.data.findUserDetails);
          setProfilePhoto(result.data.findUserDetails.profilePic);
          // setUpdateBio(result.data.findUserDetails.bio);
          // setUpdateUsername(result.data.findUserDetails.username);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  return (
    <div className="flex items-center gap-x-3 justify-between w-[80%]">
      <span className="text-sm font-poppins font-bold">Active Friends</span>
      <div className="relative w-[90%] select-none z-0">
        <div
          onScroll={onScroll}
          ref={scrollContainerRef}
          className="flex flex-row overflow-x-auto md:p-5 scrollbar-hide scroll-smooth"
        >
          <div className="flex-none">
            <div className="flex flex-row space-x-3">
              {filteredOnlineUsers.length > 0 ? (
                filteredOnlineUsers.map((user, index) => (
                  <ActiveOne key={index} active={user} />
                ))
              ) : (
                <div className="text-center font-poppins">
                  No active users found
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-0 p-3 w-full h-full flex justify-between z-10 items-center">
          <AiFillLeftCircle
            size={25}
            color="white"
            className={`drop-shadow-lg cursor-pointer ${
              showLeft ? "visible" : "invisible"
            }`}
            onClick={() => {
              scrollContainerRef.current.scrollLeft =
                scrollContainerRef.current.scrollLeft - 300;
            }}
          />
          <AiFillRightCircle
            size={25}
            fill="white"
            className={`drop-shadow-lg cursor-pointer ${
              showRight ? "visible" : "invisible"
            }`}
            onClick={() => {
              scrollContainerRef.current.scrollLeft =
                scrollContainerRef.current.scrollLeft + 300;
            }}
          />
        </div>
      </div>
      <div>
        {/* for profile  */}
        <Link to={`/profile/admin/${userDetails?.username}`}>
          <div className="flex gap-x-4">
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
            <div className="flex flex-col gap-y-1">
              <span className="text-md text-orange flex items-center gap-x-1 font-semibold">
                {userDetails.username} <span className="font-poppins text-sm">(You)</span>
              </span>
              <span className="text-xs font-poppins font-semibold">
                {userDetails.gender}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Active;
