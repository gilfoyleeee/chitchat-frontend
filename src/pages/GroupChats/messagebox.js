import React, { useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

const Messagebox = () => {
  const [showConversation, setShowConversation] = useState(false);
  const [friendProfilepic, setFriendProfilePic] = useState("");
  const chatRef = useRef(null);
  const messageCombo = []; // Dummy data for messageCombo
  const userId = 1; // Dummy user ID
  const format = (date) => date; // Dummy format function
  const setNewMessage = () => {}; // Dummy function for setNewMessage
  const newMessage = ""; // Dummy data for newMessage
  const handleSubmit = () => {}; // Dummy function for handleSubmit

  return (
    <>
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
                      {/* {friendUsername ? friendUsername : null} */}Anil
                    </span>
                  </div>
                  {/* Call Options */}
                  {/* <div className="flex items-center">
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
                  </div> */}
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
    </>
  );
};

export default Messagebox;
