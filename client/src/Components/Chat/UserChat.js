"use client";
import React, { useContext } from "react";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Image, Stack } from "react-bootstrap";
import { messagesContext } from "../../ContextAPI/messagesContext";
import { unreadNotifiactionsFunc } from "../../utils/services";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

function UserChat({ chat, user }) {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead } =
    useContext(messagesContext);
  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotifiactionsFunc(notifications);
  if (recipientUser) {
    var thisUserNotifications = unreadNotifications?.filter(
      (n) => n.senderId === recipientUser?._id
    );
  }
  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );
  const truncateText = (text) => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText = shortText + "...";
    }
    return shortText;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card items-center p-2 justify-center"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisUserNotificationsAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="d-flex ">
        <div className="me-2">
          <Image
            width={100}
            src={
              recipientUser?.profileImage === ""
                ? "/default-avatar.jpg"
                : recipientUser?.profileImage
            }
            alt="friend-img"
            roundedCircle
            fluid
          ></Image>
        </div>
        <div className="text-content">
          <div className="name">
            {" "}
            {recipientUser?.name[0].toUpperCase() +
              recipientUser?.name.slice(1)}{" "}
          </div>
          <div className="text mt-3 pl-2">
            {" "}
            {latestMessage?.messageText && (
              <span > {truncateText(latestMessage?.messageText)} </span>
            )}{" "}
          </div>
        </div>
      </div>
      <div className="d-flex flex-col items-end ">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <span
          className={
            thisUserNotifications?.length > 0
              ? "this-user notification-count"
              : ""
          }
        >
          <span>
            {" "}
            {thisUserNotifications?.length > 0
              ? thisUserNotifications?.length
              : ""}{" "}
          </span>
        </span>
        <span className={isOnline ? "user-online-recipientUser" : ""}></span>
      </div>
    </Stack>
  );
}

export default UserChat;
