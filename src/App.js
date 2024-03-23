import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup/LoginSignup";
import Auth from "./Auth";
import GroupPage from "./pages/GroupChats/Group";
import FriendPage from "./pages/friendPage/FriendPage";
import AuthProfile from "./AuthProfile";
import AuthExplore from "./AuthExplore";
import { io } from "socket.io-client";

const App = () => {
  //socket
  const [socket, setSocket] = useState(null);

  //for socketConnection
  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  return (
    <>
      {socket && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginSignup />} exact />
            <Route path="/home" element={<Auth socket={socket} />} exact />
            <Route path="/profile/admin/:id" element={<AuthProfile socket={socket}/>} exact />
            <Route path="/explore" element={<AuthExplore socket={socket}/>} exact />
            <Route path="/group" element={<GroupPage socket={socket}/>} exact />
            <Route
              path="/friends"
              element={<FriendPage socket={socket} />}
              exact
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
