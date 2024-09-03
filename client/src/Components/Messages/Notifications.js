import React, { useContext, useEffect, useRef, useState } from "react";
import { messagesContext } from "../../ContextAPI/messagesContext";
import { userContext } from "../../ContextAPI/userContext";
import { unreadNotifiactionsFunc } from "../../utils/services";
import { chatContext } from "../../ContextAPI/chatContext";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(userContext);
  const { allUsers, userChats } = useContext(chatContext);
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } =
    useContext(messagesContext);
  const scroll = useRef();

  // set unread notifications array
  const unreadNotifiactions = unreadNotifiactionsFunc(notifications);
  // set modified notifications array with insering sender name
  const modifiedNotifications = unreadNotifiactions?.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  // scrolling messages box in to view
  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  }, [notifications]);
  //  send notification when chat is not open
  useEffect(() => {
    toast("you have a new message", { position: "top-left" });
  }, [unreadNotifiactions]);

  return (
    <div className="notifications">
      <div
        className="notifications-icon"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-bell-fill mt-4"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
        </svg>
        {unreadNotifiactions?.length === 0 ? null : (
          <>
            <ToastContainer />
            <span className="notification-count">
              <span> {unreadNotifiactions?.length} </span>
            </span>
          </>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header ">
            <h3>Notificaions</h3>
            <div
              className="mark-as-read"
              onClick={() => {
                markAllNotificationsAsRead(notifications);
                setIsOpen(false);
              }}
            >
              mark all as read
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span>No notifiactions yet...</span>
          ) : null}
          <div ref={scroll} id="modified-notifications">
            {modifiedNotifications &&
              modifiedNotifications.map((n, index) => {
                return (
                  <div
                    onClick={() => {
                      markNotificationAsRead(n, userChats, user, notifications);
                      setIsOpen(false);
                    }}
                    key={index}
                    className={
                      n.isRead ? "notification" : "notification not-read"
                    }
                  >
                    <span> {`${n.senderName} sent you a new message`} </span>
                    <span className="notification-time">
                      {" "}
                      {moment(n.date).calendar()}{" "}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Notifications;
