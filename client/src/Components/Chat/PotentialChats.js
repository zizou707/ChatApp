import React, { useContext } from "react";
import { chatContext } from "../../ContextAPI/chatContext";
import { userContext } from "../../ContextAPI/userContext";
import { messagesContext } from "../../ContextAPI/messagesContext";
import { Image } from "react-bootstrap";

function PotentialChats() {
  const { user } = useContext(userContext);
  const { potentialChats, createChat, potentialChatsError } =
    useContext(chatContext);
  const { onlineUsers } = useContext(messagesContext);

  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user._id, u._id)}
              >
                <Image
                  width={100}
                  src={
                    u?.profileImage === ""
                      ? "/default-avatar.jpg"
                      : u?.profileImage
                  }
                  alt="user-img"
                  className="w-12 "
                  roundedCircle
                  fluid
                ></Image>
                {u?.name[0].toUpperCase() + u?.name.slice(1)}
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId === u._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
        {potentialChatsError && (
          <div className="-mt-10 mb-2 bg-red-500 p-2">
            <p role="alert">{potentialChatsError.message}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default PotentialChats;
