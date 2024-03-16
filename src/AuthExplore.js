import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Explore from "./pages/friendPage/Explore";

const AuthExplore = ({socket}) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth");
    const userId = localStorage.getItem("user");
    if (token == null || userId == null) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Explore socket={socket} />
    </>
  );
};

export default AuthExplore;;
