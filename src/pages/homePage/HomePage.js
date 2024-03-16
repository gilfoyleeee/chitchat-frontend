import React from "react";
import NavBar from "../../components/navBar/NavBar";
import Active from "../../components/active/Active";
import Message from "../../components/message/Message";
import LeftSide from "../../components/LeftSide";
import "./home.css";

const HomePage = ({ socket }) => {
  console.log(socket);
  return (
    <>
      {/* <NavBar socket={socket} /> */}
      {/* <Active socket={socket} />
      <Message socket={socket} /> */}
      {/* change  */}
      <div className="bg-white w-full flex items-center md:justify-center justify-center ">
        <div className="flex flex-col w-[90%] md:flex-row xl:w-[85%] 2xl:w-[75%] gap-x-4 p-0 md:p-5">
          <LeftSide socket={socket} />
          {/* mobile view  */}
          <div className="md:hidden flex items-center justify-between pt-2 pb-4 sticky top-0 bg-white z-50">
            <div className="flex flex-col items-center justify-center cursor-pointer select-none">
              <span className="text-orange font-poppins font-bold text-base tracking-wide leading-relaxed">
                Emotional
              </span>
              <span className="font-poppins text-black text-xs">Outlets</span>
            </div>
            {/* <div className="flex items-center justify-center cursor-pointer">
              <Link to={`/profile`}>
                {user && user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="my-profile-pic"
                    className="w-[3rem] h-[3rem] rounded-full border-solid border-2 border-blue-500"
                  />
                ) : user && user.gender === "male" ? (
                  <img
                    src="../assets/images/male-avatar.png"
                    alt="my-profile-pic"
                    className="w-[3rem] h-[3rem] rounded-full border-solid border-2 border-blue-500"
                  />
                ) : (
                  <img
                    src="../assets/images/female-avatar.png"
                    alt="my-profile-pic"
                    className="w-[3rem] h-[3rem] rounded-full border-solid border-2 border-blue-500"
                  />
                )}
              </Link>
            </div> */}
          </div>

          <Message socket={socket} />

          {/* right start  */}
          {/* <RightSide loggedUserData={user} /> */}
          {/* right end  */}
        </div>
      </div>
      {/* <MobileFooter socket={socket} /> */}
    </>
  );
};

export default HomePage;
