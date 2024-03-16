import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { MdNotifications, MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { GiTeamIdea } from "react-icons/gi";
import { MdExplore } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

// import Search from "./Search";
// import Notification from "./Notification";
import axios from "axios";
import Notification from "./notification/Notification";
// import { useDispatch } from "react-redux";
// import { authActions } from "../feature/authReducer";
// axios.defaults.withCredentials = true;

const LeftSide = ({ socket }) => {
  const navigate = useNavigate();

  //user id
  const [userId, setUserId] = useState("");

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/home",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //user profile photo and user name
  const [profilePhoto, setProfilePhoto] = useState("");
  const [username, setUsername] = useState("");

  const [notificationBar, setNotificationBar] = useState(false);

  //notification on and off
  const [notification, setNotification] = useState(false);
  const [notificationEvent, setNotificationEvent] = useState([]);

  const [arrivalMessage, setArrivalMessage] = useState(null);

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
          // socket io send client id and get online users
          socket.emit("clientUsername", {
            username: result.data.findUserDetails.username,
            userId: userId,
          });
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId, socket]);

  //log out
  const logOutHandler = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  //notification handler
  const notificationHandler = (e) => {
    e.preventDefault();
    setNotification(true);
  };

  //get notification
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/getNotification/${userId}`,
      })
        .then((result) => {
          var newArray = result.data.n.filter(function (el) {
            return el.receiverId === userId;
          });
          setNotificationEvent(newArray);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  //go to profile page
  const profilePageHandler = () => {
    navigate(`/profile/admin/${username}`);
  };

  //socket io get message from back to the specific client
  useEffect(() => {
    socket?.on("messageFromBack", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        notificationMsg: data.notificationMsg,
      });
    });
  }, [socket]);

  // socket io get message from back to the specific client
  useEffect(() => {
    arrivalMessage &&
      setNotificationEvent((notificationEvent) => [
        ...notificationEvent,
        arrivalMessage,
      ]);
  }, [arrivalMessage]);

  //notification mark all as read
  const markAsReadHandler = () => {
    alert(
      "Once you click 'mark all as read' your notification will be deleted from databases"
    );
    axios({
      method: "get",
      url: `http://localhost:5000/deleteNotification/${userId}`,
    })
      .then((result) => {})
      .catch((error) => console.error(error.message));
    setNotificationEvent([]);
  };

  // logout handling-->
  //log out
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="hidden md:w-[25%] md:flex flex-col gap-y-10 sticky top-10 h-max">
        {/* logo */}
        {/* <Link to="/"> */}
          {/* <div className="w-full flex gap-x-2 items-center justify-center cursor-pointer select-none">
            <span className="text-orange font-poppins font-bold text-xl md:text-2xl tracking-wide leading-relaxed">
              Chit
            </span>
            <span className="font-poppins text-black text-base">Chat</span>
          </div> */}
          <div className="w-full flex gap-x-2 items-center justify-center cursor-pointer select-none">
            <img
              src="http://localhost:3000/images/logo.png"
              className="w-[8rem]"
            />
          </div>
        {/* </Link> */}
        {/* icons  */}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-start justify-center gap-y-6 select-none">
            <Link to="/home">
              <div className="flex gap-x-4 items-center justify-center cursor-pointer">
                <i>
                  <TbMessageCircle2Filled color="#2D99FF" size={25} />
                </i>
                <span className="font-poppins">Chats</span>
              </div>
            </Link>

            <Link to="/explore">
              <div className="flex gap-x-4 items-center justify-center cursor-pointer">
                <i>
                  <MdExplore color="#2D99FF" size={25} />
                </i>
                <span className="font-poppins">Explore</span>
              </div>
            </Link>

            <Link to="/group">
              <div className="flex gap-x-4 items-center justify-center cursor-pointer">
                <i>
                  <GiTeamIdea color="#2D99FF" size={25} />
                </i>
                <span className="font-poppins">Group</span>
              </div>
            </Link>

            <div
              className="flex gap-x-4 items-center justify-center cursor-pointer relative"
              onClick={() => setNotificationBar(true)}
            >
              <div
                className={`absolute left-3 top-[-10px] font-poppins text-xs text-white w-6 flex items-center justify-center h-6 rouned-full rounded-full bg-red-600 ${
                  notificationEvent.length === 0 ? "hidden" : "block"
                }`}
              >
                {notificationEvent.length}
              </div>
              <i>
                <MdNotifications color="#2D99FF" size={25} />
              </i>
              <span className="font-poppins">Notifications</span>
            </div>

            <div
              className="flex gap-x-4 items-center justify-center cursor-pointer"
              onClick={handleLogout}
            >
              <i>
                <MdLogout color="#2D99FF" size={25} />
              </i>
              <span className="font-poppins">Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* for search  */}
      {/* {searchBar ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-2xl">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <Search props={handleBoolValueChange} />
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : (
        ""
      )} */}

      {notificationBar ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-2xl">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-[28rem] lg:h-[30rem] pb-5 z-50">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  {/* notification */}
                  <div className=" md:w-96 pl-10 p-2.5 items-center">
                    <span className="font-poppins text-[1.5rem] font-bold text-center">
                      Notifications
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <span
                      className="py-2 px-4 bg-orange text-white font-poppins text-[0.75rem] flex items-center justify-center rounded-b-lg cursor-pointer"
                      onClick={markAsReadHandler}
                    >
                      Mark all as read
                    </span>
                  </div>

                  <i
                    className="p-1 ml-auto float-right"
                    onClick={() => setNotificationBar(false)}
                  >
                    <AiOutlineClose
                      size={30}
                      className="text-red-900 block cursor-pointer"
                    />
                  </i>
                </div>
                <div>
                  {notificationEvent.map((val) => (
                    <>
                      <Notification notification={val} socket={socket} />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default LeftSide;
