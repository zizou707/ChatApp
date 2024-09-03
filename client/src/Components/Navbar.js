import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Image } from "react-bootstrap";
import { userContext } from "../ContextAPI/userContext";
import Notifications from "./Messages/Notifications";
import { useClickOutSide } from "../hooks/useClickOutSide";

function Navbar() {
  const [openDropDown, setOpenDropDown] = useState(false);
  const { user, logoutUser } = useContext(userContext);

  const dopDownRef = useClickOutSide(() => {
    setOpenDropDown(false);
  });

  return (
    <nav>
      <Link to="/">
        <Image
          className="w-16 h-16 m-4"
          alt="logo"
          src="/icons8-chat.gif"
        ></Image>
      </Link>

      <ul className="flex absolute right-5 top-0 gap-3 mt-2 ">
        {user ? (
          <>
            {" "}
            {/*  if there is a user show the logout button or if not show login and signUp buttons */}
            <Notifications />
            <div ref={dopDownRef} className="flex flex-col">
              <button
                onClick={() => setOpenDropDown(!openDropDown)}
                id={`dropdown-split-variants-Primary`}
                variant="primary"
                title="primary"
                className="profile-btn"
              >
                <Image
                  className="profile-img "
                  roundedCircle
                  fluid
                  src={
                    user.profileImage === ""
                      ? "/default-avatar.jpg"
                      : user?.profileImage
                  }
                  alt="profile-pic"
                />
              </button>
              <h3 className="text-center text-white">
                {user?.name[0].toUpperCase() + user.name.slice(1)}{" "}
              </h3>
              {openDropDown && (
                <div className="dropdown-menu flex absolute flex-col top-20 right-5">
                  <Dropdown.Item eventKey="1">Profile</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Friend Requests</Dropdown.Item>
                  <Dropdown.Item eventKey="3">Change Profile img</Dropdown.Item>
                  <Dropdown.Divider />
                  <Link onClick={logoutUser} to="/">
                    <Dropdown.Item eventKey="4">Disconnect</Dropdown.Item>
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link className="navbar-btn text-white" to="/Login">
              Login
            </Link>
            <Link className="navbar-btn text-white" to="/Register">
              SignUp
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
