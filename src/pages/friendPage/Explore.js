import LeftSide from "../../components/LeftSide";
import React, { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MySnackbar from "../../feature/Snackbar";

function Explore({ socket }) {
  const navigate = useNavigate();

  const [showExplore, setShowExplore] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  //nav bar photo
  const [profilePhoto, setProfilePhoto] = useState("");
  const [username, setUsername] = useState("");

  //friends
  const [friendsName, setFriendsName] = useState([]);

  //add to friend requested
  const [requested, setRequested] = useState(false);

  const [toggle, setToggle] = useState(null);

  //my friend
  const [myFriend, setMyFriend] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token == null) {
      navigate("/");
    }
  }, []);

  //user id
  const [userId, setUserId] = useState("");

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/notification",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //data
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/user/${userId}`,
      })
        .then((result) => {
          setUsername(result.data.findUserDetails.username);
          setProfilePhoto(result.data.findUserDetails.profilePic);
          let friendArr = [];
          for (let i = 0; i < result.data.findUserDetails.friends.length; i++) {
            // setMyFriend((r)=>[...r , result.data.findUserDetails.friends[i]])
            friendArr.push(result.data.findUserDetails.friends[i]);
          }
          setMyFriend(friendArr);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/allUsers/${userId}`,
      })
        .then((result) => {
          let filteredFriends = result.data.data.filter(
            (friend) => !myFriend.includes(friend._id)
          );
          setFriendsName(filteredFriends);
          // Check if there are users available for sending friend requests
          if (filteredFriends.length > 0) {
            setShowExplore(false); // Hide the "No explore" message
          } else {
            setShowExplore(true); // Show the "No explore" message
          }
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId, myFriend]);

  return (
    <div className="bg-white w-full flex items-center justify-center mt-1 md:mt-[6rem]">
      <div className="flex flex-col md:flex-row xl:w-[75%] 2xl:w-[80%] gap-x-4 p-0 md:p-5 mt-[-75px]">
        {/* LeftSide component */}
        <LeftSide socket={socket} />
        {showExplore ? (
          <div className="flex flex-col gap-y-2 items-start justify-center mt-10">
            <span className="font-poppins font-bold text-xl">No user found</span>
            <img
              src="http://localhost:3000/images/conversationSVG1.svg"
              className="w-96 h-96" // Adjust width and height as needed
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-y-1 mt-5">
              <span className="font-poppins font-bold my-3 text-xl">
                Explore Friends
              </span>
              <div className="">
                <div className="">
                  {/* Friends List */}
                  <div className="flex flex-col">
                    {friendsName.map((val, index) => (
                      <div
                        key={val._id}
                        className="bg-white flex gap-x-10 mb-3 shadow-md rounded-lg p-4 w-[30rem]"
                      >
                        <div className="flex items-center w-[30%]">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            {val.profilePic ? (
                              <img
                                src={`http://localhost:5000/${val.profilePic.replace(
                                  "public\\",
                                  ""
                                )}`}
                                alt={val.username}
                                className="w-[3rem] h-[3rem] rounded-full"
                              />
                            ) : (
                              <img
                                src="http://localhost:3000/images/user.png"
                                alt="Default Profile"
                                className="w-[3rem] h-[3rem] rounded-full"
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-poppins font-bold">
                              {val.username}
                            </h3>
                          </div>
                        </div>
                        <div className="mt-2 mx-12">
                          <button
                            className="bg-orange rounded-md text-sm hover:bg-blue-700 text-white py-1.5 px-2  flex items-center font-poppins "
                            onClick={() => {
                              axios({
                                method: "POST",
                                url: "http://localhost:5000/notification/",
                                data: {
                                  senderId: userId,
                                  receiverId: val._id,
                                  notificationMsg:
                                    userId + " sent you a request",
                                },
                              })
                                .then(() => {
                                  // Update friendsName state by removing the friend who was sent the request
                                  setFriendsName((prevFriends) =>
                                    prevFriends.filter(
                                      (friend) => friend._id !== val._id
                                    )
                                  );
                                  setSnackbarSeverity("success");
                                  setSnackbarMessage(
                                    "Friend request sent successfully"
                                  );
                                  setSnackbarOpen(true);
                                })
                                .catch((error) => console.error(error.message));
                              setSnackbarSeverity("error");
                              setSnackbarMessage(
                                "Failed to send friend request"
                              );
                              setSnackbarOpen(true);

                              //for socket io
                              const messageData = {
                                senderId: userId,
                                receiverId: val._id,
                                notificationMsg: "sent you a friend request",
                              };
                              socket?.emit("message", messageData);
                            }}
                          >
                            <BsPersonFillAdd className="mr-2 font-poppins" />
                            {index === toggle
                              ? "Requested"
                              : "Send friend request"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <MySnackbar />
    </div>
  );
}

export default Explore;
