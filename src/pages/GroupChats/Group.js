import React, { useState } from "react";
import LeftSide from "../../components/LeftSide";
import Conversation from "../../components/message/FriendList";
import Messagebox from "./messagebox";
import {
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi2";

const CreateGCForm = ({ handleClose, addGroup }) => {
  const [groupName, setGroupName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleCreate = () => {
    // Prepare the group data to send to the backend
    const groupData = {
      groupName,
      password,
    };

    fetch(`http://localhost:5000/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Group created:", data);
        addGroup(data.groupName); // Assuming data contains the created group info
        handleClose(); // Close the dialog after handling create action
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        // Log the full response for further inspection
        console.error("Response:", error.response);
      });
  };

  const handleCancel = () => {
    // Handle cancel button click here
    handleClose(); // Close the dialog without performing any action
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Group name text field */}
      <TextField
        label="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        fullWidth
        margin="normal"
      />
      {/* Password text field */}
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="contained" color="error" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </div>
  );
};

const CreateGroupChat = ({ open, handleClose, addGroup }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 1 }}
    >
      {/* title */}
      <DialogTitle className="font-poppins">Create New Group</DialogTitle>
      {/* content */}
      <DialogContent>
        {/* form for dialog content */}
        <CreateGCForm handleClose={handleClose} addGroup={addGroup} />
      </DialogContent>
    </Dialog>
  );
};

const GroupPage = () => {
  const [openGCDialog, setopenGCDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groups, setGroups] = useState([
    "Group A",
    "Group B",
    "Group C",
    "Group D",
    "Group E",
  ]); // Initial list of groups

  const handleOpenGCDialog = () => {
    setopenGCDialog(true);
  };

  const handleCloseGCDialog = () => {
    setopenGCDialog(false);
  };

  const addGroup = (groupName) => {
    setGroups([...groups, groupName]); // Add the new group to the list of groups
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
            addGroup={addGroup} // Pass the addGroup function to the dialog
          />
        )}
        {groups.map((group, index) => (
          <div
            key={index}
            className={`flex flex-row rounded-md mb-2 p-3 gap-x-2 items-start justify-end select-none cursor-pointer ${
              selectedGroup === group
                ? "bg-orange text-white"
                : "hover:bg-[#eaeaeb] hover:text-black"
            } w-[250px]`}
            onClick={() => setSelectedGroup(group)}
          >
            <div className="w-[40%]">
              <img
                src="http://localhost:3000/images/user.png"
                className="w-[3rem] h-[3rem] rounded-full"
                alt="User"
              />
            </div>
            <div className="w-[100%] flex flex-col gap-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-poppins font-semibold max-[1067px]:text-xs">
                  {group}
                </span>
              </div>
              <span className="text-xs font-poppins">Select to chat</span>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed top-10 right-10">
        <Messagebox/>
      </div>
    </>
  );
};

export default GroupPage;
