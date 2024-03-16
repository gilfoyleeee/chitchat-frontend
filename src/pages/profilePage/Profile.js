import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  TextField,
} from "@mui/material";
import { HiPhoto } from "react-icons/hi2";
import React, { useEffect, useState } from "react";
import "./profile.css";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { updateOneUser } from "../../feature/userReducer";
import LeftSide from "../../components/LeftSide";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
// import UpgradeIcon from '@mui/icons-material/Upgrade';

const Profile = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = new FormData();

  //auth
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token == null) {
      navigate("/");
    }
  }, []);

  //userDetails
  const [userDetails, setUserDetails] = useState([]);

  const [imageSrc, setImageSrc] = useState();

  //profile pic
  const [profilePhoto, setProfilePhoto] = useState("");

  //update
  const [updated, setUpdated] = useState(false);
  const [updateBio, setUpdateBio] = useState("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [uploadImg, setUploadImg] = useState(null);

  //selector
  const updateUser = useSelector((state) => state.user);

  //user id
  const [userId, setUserId] = useState("");

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/profile",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //getting user data
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/user/${userId}`,
      })
        .then((result) => {
          setUserDetails(result.data.findUserDetails);
          setProfilePhoto(result.data.findUserDetails.profilePic);
          setUpdateBio(result.data.findUserDetails.bio);
          setUpdateUsername(result.data.findUserDetails.username);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  //update profile picture
  const updateProfilePic = () => {
    formData.append("postImg", uploadImg);
    formData.append("id", userId);
    const config = {
      headers: { "content-type": "application/json" },
    };
    axios({
      method: "post",
      url: "http://localhost:5000/updateProfilePicture",
      data: formData,
      headers: config,
    })
      .then((result) => {
        setProfilePhoto(result.data.result.profilePic);
        window.location.reload();
      })
      .catch((error) => console.error(error.message));
  };

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);

    setUploadImg(changeEvent.target.files[0]);
  }

  return (
    <>
      <div className="bg-white w-full flex items-center md:justify-center justify-center  mt-1 md:mt-5 select-none">
        <div className="flex flex-col w-[90%] md:flex-row xl:w-[85%] 2xl:w-[70%] gap-x-4 p-0 md:p-5">
          <LeftSide socket={socket} />
          {/* right side start  */}
          <div className="md:w-[75%] w-full">
            <div className="w-full flex justify-center items-center gap-y-5 md:gap-y-0 md:justify-start">
              <div className="w-[40%] flex flex-col items-center justify-around">
                {profilePhoto == "" ? (
                  <img
                    src="http://localhost:3000/images/user.png"
                    className="w-[7rem] h-[7rem] rounded-full"
                  />
                ) : (
                  <img
                    src={`http://localhost:5000/${profilePhoto.replace(
                      "public\\",
                      ""
                    )}`}
                    className="w-[7rem] h-[7rem] rounded-full"
                  />
                )}

                {/* <div className="flex items-center justify-center md:items-start md:justify-start flex-col gap-y-1 w-full md:w-[40%]"> */}
                <span className="text-[2rem] font-poppins font-semibold">
                  {userDetails?.username}
                </span>

                <span className="text-base font-poppins font-semibold">
                  {userDetails?.gender}
                </span>
                <span className="text-sm mt-[1rem]">{userDetails?.bio}</span>
              </div>
              {/* </div> */}
              <div className="md:w-[60%] w-full flex flex-col items-center justify-center md:justify-start cursor-pointer">
                <div className="relative p-6 flex-auto break-words space-y-3 overflow-y-scroll">
                  <div className="flex gap-x-[2rem] items-center">
                    <span className="text-xs font-poppins">
                      Change profile picture
                    </span>
                    <label htmlFor="postimg-input" className="cursor-pointer">
                      <HiPhoto size={25} color="#2D99FF" />
                    </label>
                    <input
                      type="file"
                      name="postImg"
                      id="postimg-input"
                      accept="image/jpeg, image/png"
                      onChange={handleOnChange}
                      style={{ display: "none" }}
                    />
                  </div>

                  {imageSrc ? (
                    <>
                      <div className="w-[100%] ">
                        <img
                          src={imageSrc}
                          className="w-[22rem] rounded-b-md"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-[100%] ">
                        <img
                          src={uploadImg}
                          className="w-[22rem] rounded-b-md"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="w-[100%] flex gap-x-[2rem]">
                  <button
                    className="bg-orange py-2 px-4 rounded-md text-white font-poppins"
                    onClick={updateProfilePic}
                  >
                    Change Profile
                  </button>
                  <span
                    className="py-2 px-4 bg-orange w-36 flex gap-x-2 items-center justify-center text-white rounded-md"
                    onClick={(e) => setUpdated(true)}
                  >
                    Edit profile <AiFillSetting size={25} />
                  </span>
                </div>
              </div>
              <Dialog open={updated} fullWidth>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Enter username to update:"
                    fullWidth
                    variant="standard"
                    autoComplete="off"
                    onChange={(e) => {
                      setUpdateUsername(e.target.value);
                    }}
                    value={updateUsername}
                  />
                  <TextField
                    margin="dense"
                    id="name"
                    label="Enter bio to update:"
                    fullWidth
                    variant="standard"
                    autoComplete="off"
                    onChange={(e) => {
                      setUpdateBio(e.target.value);
                    }}
                    value={updateBio}
                  />
                  {updateUser.updateUserStatus === "pending" ? (
                    <CircularProgress size={30} />
                  ) : null}
                  {updateUser.updateUserStatus === "success" ? (
                    <Alert severity="success">
                      Profile updated successfully!
                    </Alert>
                  ) : null}
                  {updateUser.updateUserStatus === "failed" ? (
                    <Alert severity="error">{updateUser.updateUserError}</Alert>
                  ) : null}
                </DialogContent>
                <DialogActions>
                  <Button
                    startIcon={<EditIcon />}
                    sx={{ color: "green" }}
                    onClick={(e) => {
                      if (updateBio === "" || updateUsername === "") {
                        <Alert severity="error">
                          Username or Bio can't be null
                        </Alert>;
                      } else {
                        dispatch(
                          updateOneUser({
                            username: updateUsername,
                            bio: updateBio,
                            id: userId,
                          })
                        );
                      }
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setUpdated(false);
                      window.location.reload();
                    }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="profile-container">
        <div className="profile-container-bg">
          <div className="profile-row-1">
            {profilePhoto == "" ? (
              <img
                src="http://localhost:3000/images/user.png"
                className="profile-row-1-pic"
              />
            ) : (
              <img
                src={`http://localhost:5000/${profilePhoto.replace(
                  "public\\",
                  ""
                )}`}
                className="profile-row-1-pic"
              />
            )}
            <div className="profile-edit">
              <input
                type="file"
                name="postImg"
                id="postImg-input"
                onChange={(e) => {
                  setUploadImg(e.target.files[0]);
                }}
              />
              <button className="update-button" onClick={updateProfilePic}>
                update
              </button>
            </div>
          </div>
          <div className="profile-row-2">
            <div className="profile-name">
              <span className="profile-name-text">{userDetails.username}</span>
            </div>
            <div className="profile-gender">
              <span className="profile-gender-text">{userDetails.gender}</span>
            </div>
            <div className="profile-bio">
              <span className="profile-bio-text">{userDetails.bio}</span>
            </div>
            <div className="edit-bio">
              <Button
                variant="contained"
                endIcon={<EditIcon />}
                sx={{
                  backgroundColor: "#2673ed",
                  "&:hover": {
                    backgroundColor: "#094cb5",
                    borderColor: "#0062cc",
                    boxShadow: "none",
                  },
                }}
                onClick={() => {
                  setUpdated(true);
                }}
              >
                <span className="btn-text">Edit Profile</span>
              </Button>
            </div>
          </div>
        </div>
        <Dialog open={updated} fullWidth>
          <DialogTitle>Update Todo</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter username to update:"
              fullWidth
              variant="standard"
              autoComplete="off"
              onChange={(e) => {
                setUpdateUsername(e.target.value);
              }}
              value={updateUsername}
            />
            <TextField
              margin="dense"
              id="name"
              label="Enter bio to update:"
              fullWidth
              variant="standard"
              autoComplete="off"
              onChange={(e) => {
                setUpdateBio(e.target.value);
              }}
              value={updateBio}
            />
            {updateUser.updateUserStatus === "pending" ? (
              <CircularProgress size={30} />
            ) : null}
            {updateUser.updateUserStatus === "success" ? (
              <Alert severity="success">Profile updated successfully!</Alert>
            ) : null}
            {updateUser.updateUserStatus === "failed" ? (
              <Alert severity="error">{updateUser.updateUserError}</Alert>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<EditIcon />}
              sx={{ color: "green" }}
              onClick={(e) => {
                if (updateBio === "" || updateUsername === "") {
                  <Alert severity="error">Username or Bio can't be null</Alert>;
                } else {
                  dispatch(
                    updateOneUser({
                      username: updateUsername,
                      bio: updateBio,
                      id: userId,
                    })
                  );
                }
              }}
            >
              Update
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setUpdated(false);
                window.location.reload();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div> */}
    </>
  );
};

export default Profile;
