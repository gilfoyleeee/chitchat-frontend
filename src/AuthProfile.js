import React,{useEffect} from "react";
import Profile from "./pages/profilePage/Profile";
import { useNavigate } from "react-router-dom";


const AuthProfile = ({socket}) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth");
    const userId = localStorage.getItem("user");
    if (token == null || userId== null) {
      navigate("/");
    }
  }, []);
  return (
      <>
      <Profile socket={socket}/>
      </>
  );
};

export default AuthProfile;
