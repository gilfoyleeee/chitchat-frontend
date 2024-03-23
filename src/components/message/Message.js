import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { IoSend } from "react-icons/io5";
import axios from "axios";
// import "./message.css";
import Conversation from "./FriendList";
import { format } from "timeago.js";
import { BiPhoneCall } from "react-icons/bi";
import Peer from "peerjs";
import { BsFillTelephoneFill } from "react-icons/bs";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { BsFillCameraVideoOffFill, BsEmojiSmile } from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";
import Active from "../active/Active";
import { FaVideo } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const Message = ({ socket }) => {
  const peerRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  // my peer ID
  const [myPeerId, setMyPeerId] = useState(null);

  // other peer ID
  const [otherPeerId, setOtherPeerId] = useState(null);

  const [onGoingCalling, setOnGoingCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false); // Added state for modal

  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const [showConversation, setShowConversation] = useState(false);

  // other user id
  const [otherUserId, setOtherUserId] = useState("");

  // userId or my id
  const [userId, setUserId] = useState("");

  // conversation list
  const [conversationList, setConversationList] = useState([]);

  // get messages
  const [messageCombo, setMessageCombo] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // current chat or get conversation of me and my user after clicking the conversation
  const [currentChat, setCurrentChat] = useState(null);

  // get conversation id
  const [conversationId, setConversationId] = useState(null);

  // socket id
  const [socketFriendId, setSocketFriendId] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // friend info
  const [friendId, setFriendId] = useState(null);
  const [friendUsername, setFriendUsername] = useState(null);
  const [friendProfilepic, setFriendProfilePic] = useState("");

  // for click
  const [clickedId, setClickedId] = useState(null);

  const [sendCall, setSendCall] = useState(false);

  const chatRef = useRef(null);
  
  useEffect(() => {
    if (isConnected) {
      setSendCall(false);
      setIsVideoModalOpen(true); // Open the modal when isConnected is true
    } else {
      setIsVideoModalOpen(false); // Close the modal when isConnected is false
    }
  }, [isConnected]);

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/conversationList",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  // fetch all conversation which contains my id
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/conversation/${userId}`,
      })
        .then((result) => {
          setConversationList(result.data.result);
        })
        .catch((error) => console.error(error));
    }
  }, [userId]);

  // socket io get message from back to the specific client
  useEffect(() => {
    socket?.on(
      "textMessageFromBack",
      ({ sender, message, senderPeerId, receiver }) => {
        setOtherPeerId(senderPeerId);
        if (sender === userId) {
          setOtherUserId(receiver);
        } else {
          setOtherUserId(sender);
          setOnGoingCalling(true);
        }
      }
    );
  }, [socket]);

  // socket io get message from back to the specific client
  useEffect(() => {
    socket?.on("messageFromBackOnly", ({ sender, message, receiver }) => {
      setArrivalMessage({
        sender: sender,
        msg: message,
      });
    });
  }, [socket]);

  // socket io to get the message and update it after getting from the server
  useEffect(() => {
    arrivalMessage &&
      currentChat?.conversation.includes(arrivalMessage.sender) &&
      setMessageCombo((messageCombo) => [...messageCombo, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // for sending message
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      conversationId: conversationId,
      senderId: userId,
      msg: newMessage,
    };
    const config = {
      headers: { "content-type": "application/json" },
    };

    axios({
      method: "post",
      url: "http://localhost:5000/messages",
      data,
      headers: config,
    })
      .then((result) => {
        setNewMessage("");
        // to set the messages before and after and automatically update
        setMessageCombo((messageCombo) => [
          ...messageCombo,
          result.data.messages,
        ]);
      })
      .catch((error) => console.error(error.message));

    // for socket io
    const messageData = {
      sender: userId,
      receiver: socketFriendId,
      message: newMessage,
    };
    socket.emit("messageOnly", messageData);
  };

  const callHandler = (otherUserId) => {
    console.log(otherUserId);
    // for socket io
    const messageData = {
      sender: userId,
      receiver: otherUserId,
      message: "someone is calling",
      senderPeerId: myPeerId,
    };
    socket?.emit("textMessage", messageData);
    setSendCall(true);
  };

  // peer connection
  useEffect(() => {
    let peer = new Peer();

    peer.on("open", (id) => {
      console.log("My Peer ID: ", id);
      setMyPeerId(id);
    });

    peer.on("connection", (conn) => {
      conn.on("open", () => {
        console.log("Connected to another peer 1st !");
        setIsConnected(true);
        setOnGoingCalling(false);
      });
    });

    // handle incoming call from other users
    // get a call and providing the stream
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.style.transform = "scaleX(-1)";

          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.style.transform = "scaleX(-1)";
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    });

    peerRef.current = peer;

    return () => {
      peer.disconnect();
      peer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    console.log("Connecting to peer", otherPeerId);
    const conn = peerRef.current.connect(otherPeerId);
    conn.on("open", () => {
      console.log("Connected to another peer!");
      setIsConnected(true);
      setOnGoingCalling(false);
      console.log(conn.peer);
      socket?.emit("twoConnectedPeer", {
        peer1: myPeerId,
        peer2: conn.peer,
      });
    });

    // for local video
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.style.transform = "scaleX(-1)";

        // call the other user peer or start the call
        const call = peerRef.current.call(otherPeerId, stream);

        // accept the stream of the remote user
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.style.transform = "scaleX(-1)";
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  const hangupFunction = (e) => {
    e.preventDefault();

    // console.log("Hangup initiated");

    // // Stop and clear the local stream for the hung-up user
    const localStream = localVideoRef.current.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
      console.log("Local stream stopped");
    }


    // // Stop and clear the remote stream for the other user
    // const remoteStream = remoteVideoRef.current.srcObject;
    // if (remoteStream) {
    //   remoteStream.getTracks().forEach((track) => track.stop());
    //   remoteVideoRef.current.srcObject = null;
    //   console.log("Remote stream stopped");
    // }

    // Close the PeerJS connection and notify the other user
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
      console.log("PeerJS connection closed");
    }

    // // Close the video modal on the local side
    setIsVideoModalOpen(false);

    // // Send a signaling message to the remote peer(s) to inform them about the call hangup
    // socket.emit("call-hangup", { receiverId: otherPeerId });

    // Clear the UI to reflect call hangup
    setIsConnected(false);
    setOnGoingCalling(false);

    // // Reload the window or perform other necessary actions
    window.location.reload();
  };

  //video mute function
  const videoMuteFunction = (e) => {
    e.preventDefault();
    console.log("hello");
    setIsVideoMuted(true);
  };

  console.log("video muted:", isVideoMuted);

  console.log("onGoingCalling:", onGoingCalling);

  console.log("isConnected:", isConnected);

  function functionNameHandler(id) {
    console.log("clicked");
    axios({
      method: "get",
      url: `http://localhost:5000/friend/${id}`,
    })
      .then((result) => {
        console.log(result);
        setFriendUsername(result.data[0].username);
        setFriendProfilePic(result.data[0].profilePic);
      })
      .catch((error) => console.error(error));
  }

  return (
    <React.Fragment>
      <div className="w-[100%] flex flex-col gap-y-3">
        <Active socket={socket} />
        <div className="w-[100%] h-full flex">
          {/* left  */}
          <div className="w-[35%]">
            <div className="flex items-center gap-x-2">
              <span className="font-poppins font-bold my-3">Friends</span>
              <FaUserFriends color="#2D99FF" size={20} />
            </div>
            {/* mapping conversation  */}
            {conversationList.map((val) => (
              <div
                className={`${
                  clickedId === val._id ? "bg-orange text-white" : "bg-white"
                } rounded-md mb-[0.5rem] w-[95%]`}
                key={val._id}
                onClick={(e) => {
                  e.preventDefault();
                  const friendId = val.conversation.find((m) => m !== userId);
                  setSocketFriendId(friendId);
                  setShowConversation(true);
                  setConversationId(val._id);
                  setCurrentChat(val);
                  functionNameHandler(friendId);
                  setClickedId(val._id);

                  // fetching the messages from conversation id or combo id
                  axios({
                    method: "get",
                    url: `http://localhost:5000/messagesCombo/${val._id}`,
                  })
                    .then((result) => {
                      setMessageCombo(result.data.result);
                    })
                    .catch((error) => console.error(error));
                }}
              >
                <Conversation id={userId} conversation={val} />
              </div>
            ))}
          </div>
          {sendCall ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-2xl">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/* //notification  */}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none pb-5 z-50">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <span className="font-poppins">
                        <button
                          // onClick={connectToPeer}
                          className="flex items-center justify-center gap-x-2"
                        >
                          Calling{" "}
                          <BsFillTelephoneFill color="green" size={20} />
                          <span className="font-bold text-orange">
                            {userId}
                          </span>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}

          {onGoingCalling ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-2xl">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/* //notification  */}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none pb-5 z-50">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <span className="font-poppins">
                        <button
                          onClick={connectToPeer}
                          className="flex items-center justify-center gap-x-2"
                        >
                          Accept the call.. from{" "}
                          <span className="font-bold text-orange">
                            {userId}
                          </span>
                          <BsFillTelephoneFill color="green" size={20} />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}

          {/* right */}
          <div className="w-[65%]">
            {!showConversation ? (
              <div className="flex flex-col gap-y-2">
                <span className="font-poppins font-bold">
                  Select one conversation
                </span>
                <img
                  src="http://localhost:3000/images/conversationSVG1.svg"
                  className="w-[50rem]"
                  style={{ width: "28rem", height: "28rem" }} // Inline CSS for width and height
                />
              </div>
            ) : (
              <>
                {/* if there is conversation */}
                <div className="w-[100%] bg-[#f9fafb]  h-16 flex items-center gap-x-5 px-2 justify-between">
                  <div className="flex gap-x-2 items-center">
                    {friendProfilepic == "" ? (
                      <img
                        src="http://localhost:3000/images/user.png"
                        className="w-[3rem] h-[3rem] rounded-full"
                      />
                    ) : (
                      <img
                        src={`http://localhost:5000/${friendProfilepic.replace(
                          "public\\",
                          ""
                        )}`}
                        className="w-[3rem] h-[3rem] rounded-full"
                      />
                    )}
                    <span className="font-bold font-poppins">
                      {friendUsername ? friendUsername : null}
                    </span>
                  </div>
                  {/* Call Options */}
                  <div className="flex items-center">
                    <div
                      className="flex items-center justify-center bg-green-500 text-white rounded-full w-8 h-8 mr-2 cursor-pointer"
                      onClick={() => callHandler(socketFriendId, "video")}
                    >
                      <IoCallSharp />
                    </div>
                    <div
                      className="flex items-center justify-center bg-orange text-white rounded-full w-8 h-8 cursor-pointer"
                      onClick={() => callHandler(socketFriendId, "audio")}
                    >
                      <FaVideo />
                    </div>
                  </div>
                </div>
                <hr className="border-t-[1px] border-orange" />

                {/* message body start */}
                <div
                  className="w-[100%] h-[27.5rem] bg-[#f9fafb] p-5 overflow-y-scroll"
                  ref={chatRef}
                >
                  {messageCombo.map((val, index) => (
                    <div
                      key={index}
                      className={`mt-2 ${
                        val.senderId === userId
                          ? "flex justify-end"
                          : "flex justify-start"
                      }`}
                    >
                      <div
                        className={`${
                          val.senderId === userId
                            ? "bg-gray-300 text-black rounded-md max-w-[70%]"
                            : "bg-orange text-white rounded-md max-w-[70%]"
                        }`}
                      >
                        <span className="text-sm font-poppins p-2 ">
                          {val.msg}
                        </span>
                        <div className="mt-2 bg-[#f9fafb] text-black">
                          <span className="text-[0.65rem] font-poppins">
                            {format(val.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* message body end */}
                <div className="absolute w-[38%] bottom-0 h-16 pr-3 flex items-center">
                  {/* chat input start */}
                  <form className="flex items-center w-full">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <BsEmojiSmile />
                      </div>
                      <input
                        type="text"
                        id="message"
                        className="border border-gray-300 w-full text-gray-900 text-sm rounded-lg focus:outline-none pl-10 p-2.5"
                        placeholder="Message..."
                        autoComplete="off"
                        required
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-5 ml-2 text-sm font-medium text-white bg-orange rounded-lg focus:ring-0"
                      onClick={handleSubmit}
                    >
                      <IoSend />
                    </button>
                  </form>
                  {/* chat input end */}
                </div>
              </>
            )}
          </div>
        </div>
        {/* <div className="flex w-[100%] h-screen gap-x-5 bg-blue-300"> */}
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[800px] h-[600px]">
              <div className="flex flex-col gap-y-10 items-center justify-center h-full">
                <div className="flex items-center justify-center gap-x-4 mt-4 w-full">
                  <div className="w-1/2 flex flex-col items-center justify-center">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-[300px] object-cover"
                    ></video>
                    <span className="font-poppins mt-3">
                      {userId && <>{userId} camera</>}
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col items-center justify-center">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-[300px] object-cover"
                    ></video>
                    <span className="font-poppins mt-3">
                      {otherUserId} camera
                    </span>
                  </div>
                </div>
                <div className="flex gap-x-6">
                  <AiOutlineAudioMuted size={30} onClick={videoMuteFunction} />
                  <BsFillCameraVideoOffFill size={30} />
                  <ImPhoneHangUp
                    size={30}
                    color="red"
                    className="cursor-pointer"
                    onClick={hangupFunction}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* </div> */}
      </div>
    </React.Fragment>
  );
};

export default Message;
