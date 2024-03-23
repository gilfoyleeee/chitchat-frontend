import React, { useState } from "react";
import LeftSide from "../../components/LeftSide";
import Conversation from "../../components/message/FriendList";
import {
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi2";

const CreateGCForm = () => {
  return <div></div>;
};
const CreateGroupChat = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      {/* title */}
      <DialogTitle sx={{ mb: 3 }}>Create New Group</DialogTitle>
      {/* content */}
      <DialogContent>
        {/* form for dialog content */}
        <CreateGCForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

const GroupPage = () => {
  const [openGCDialog, setopenGCDialog] = useState(false);
  const handleOpenGCDialog = () => {
    setopenGCDialog(true);
  };
  const handleCloseGCDialog = () => {
    setopenGCDialog(false);
  };
  return (
    <>
      <div className="flex items-center mt-10 ml-[9.65%]">
        <LeftSide />
      </div>
      <div className="flex flex-col w-[14%] items-center absolute top-20 ml-[30%]">
        <div className="flex flex-col ">
          <div className="flex  items-center gap-x-2">
            <span className="font-poppins font-bold my-3">Groups</span>
            <HiUserGroup color="#2D99FF" size={20} />
          </div>
          <div className="flex flex-row items-center">
            <Typography variant="subtitle2" className="font-poppins mr-2">
              Create New Group
            </Typography>
            <IconButton onClick={handleOpenGCDialog}>
              <BiPlus />
            </IconButton>
          </div>
        </div>
        {openGCDialog && (
          <CreateGroupChat
            open={openGCDialog}
            handleClose={handleCloseGCDialog}
          />
        )}
        <div className="flex flex-row rounded-md p-3 items-start justify-end select-none cursor-pointer hover:bg-[#eaeaeb] hover:text-black  w-[250px]">
          <div className="w-[40%]">
            {/* {profilePhoto == "" ? ( */}
            <img
              src="http://localhost:3000/images/user.png"
              className="w-[3rem] h-[3rem] rounded-full"
            />
            {/* ) : (
              <img
                src={`http://localhost:5000/${profilePhoto.replace(
                  "public\\",
                  ""
                )}`}
                className="w-[3rem] h-[3rem] rounded-full"
              />
            )} */}
          </div>
          <div className="w-[100%] flex flex-col gap-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-poppins font-semibold  max-[1067px]:text-xs">
                {/* {user} */} Group A
              </span>
            </div>
            <span className="text-xs font-poppins">Select to chat</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupPage;
