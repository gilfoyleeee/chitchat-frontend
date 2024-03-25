import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = ({ notification, socket }) => {
  //user info
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  //userId
  const [userId, setUserId] = useState("");

  // State to control blur effect
  const [isBlurred, setIsBlurred] = useState(false);

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/friendReq",
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
    axios({
      method: "get",
      url: `http://localhost:5000/user/${notification.senderId}`,
    })
      .then((result) => {
        setUsername(result.data.findUserDetails.username);
        setProfilePhoto(result.data.findUserDetails.profilePic);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //friend request accept handler
  const acceptHandler = (e) => {
    if (userId !== "") {
      e.preventDefault();

      // add friend
      axios({
        method: "post",
        url: `http://localhost:5000/addFriend`,
        data: {
          friendId: notification.senderId,
          myId: userId,
        },
      })
        .then((result) => {})
        .catch((error) => console.error(error.message));

      const details = {
        senderId: notification.senderId,
        receiverId: userId,
      };
      axios({
        method: "post",
        url: `http://localhost:5000/conversation`,
        data: details,
      })
        .then(() => {})
        .catch((error) => console.error(error.message));

      //deleting notification
      axios({
        method: "get",
        url: `http://localhost:5000/deleteNotification/${userId}`,
      })
        .then((result) => {})
        .catch((error) => console.error(error.message));
      window.location.reload();
    }
  };

  //decline handler
  const declineHandler = () => {};

  return (
    <>
      <div className="notification-body-content flex items-center p-5 ">
        <div className="notification-img mr-2">
          {profilePhoto === "" ? (
            <img
              src="http://localhost:3000/images/user.png"
              className="notification-image rounded-full"
              alt="Profile"
            />
          ) : (
            <img
              src={`http://localhost:5000/${profilePhoto.replace(
                "public\\",
                ""
              )}`}
              className="notification-image rounded-full"
              alt="Profile"
            />
          )}
        </div>
        <div className="flex flex-col flex-grow">
          <div className="notification-content flex items-center justify-between">
            <div className="notification-name">
              <span className="font-poppins">
                <b>{username}</b> sent you friend request.{" "}
              </span>
            </div>
            <div className="flex gap-x-2">
              <button
                className="bg-green-600 py-2 px-4 text-white font-poppins rounded-md transition-colors hover:bg-green-700"
                onClick={acceptHandler}
              >
                Accept
              </button>
              <button
                className="bg-red-600 py-2 px-4 text-white font-poppins rounded-md transition-colors hover:bg-red-700"
                onClick={declineHandler}
              >
                Decline
              </button>
            </div>
          </div>
          {/* Add additional content or styling here if needed */}
        </div>
      </div>
    </>
  );
};

export default Notification;
