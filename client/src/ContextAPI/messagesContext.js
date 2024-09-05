import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  baseUrl,
  getRequest,
  postRequest,
  updateRequest,
} from "../utils/services";
import { io } from "socket.io-client";
import axios from "axios";

export const messagesContext = createContext();

export default function MessagesGlobaleState({ children, user }) {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendMessageTextError, setSendMessageTextError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [errorDeletingMessage, setErrorDeletingMessage] = useState(null);

  // initialization socket
  useEffect(() => {
    const newSocket = io("https://chatapp-zz.onrender.com");

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  // add Online Users
  useEffect(() => {
    if (socket === null) return;
    // sending user info to socket server to init onlineUsers array
    socket.emit("addNewUser", user?.name, user?._id);
    // getting onlineUsers from socket io server
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user?.name, user?._id]);

  // send messages and notifications
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    if (recipientId) {
      socket.emit("sendMessage", { ...newMessage, recipientId });
    }
  }, [newMessage, socket, currentChat?.members, user?._id]);

  // receive message and notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some(
        (id) => id === res.receiverId
      );

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // part of socket end
  // get Messages from db

  const getMessages = useCallback(async () => {
    if (currentChat) {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/users/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    }
  }, [currentChat]);

  // function to send messages
  const sendMessage = useCallback(
    async (
      currentChatId,
      senderId,
      authorName,
      receiverId,
      messageText,
      setMessageText
    ) => {
      if (!messageText) {
        return alert("You can't send empty message.");
      }
      const response = await postRequest(`${baseUrl}/users/messages`, {
        chatId: currentChatId,
        senderId,
        authorName,
        receiverId,
        messageText,
      });

      if (response.error) {
        return setSendMessageTextError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setMessageText("");
    },
    []
  );

  // update Message function
  const updateMessage = useCallback(
    async (
      messageId,
      currentChatId,
      senderId,
      authorName,
      receiverId,
      messageText,
      setMessageText
    ) => {
      if (!messageText) {
        return alert("You cant send empty message.");
      }
      const response = await updateRequest(
        `${baseUrl}/users/messages/${messageId}`,
        { chatId: currentChatId, senderId, authorName, receiverId, messageText }
      );

      if (response.error) {
        return setSendMessageTextError(response);
      }

      setNewMessage(response?.config?.data);
      setMessages((prev) => [...prev, response?.config?.data]);
      setMessageText("");
    },
    []
  );

  // delete Message Function

  const deleteMessage = useCallback(
    async (messageId) => {
      try {
        await axios.delete(`${baseUrl}/users/messages/${messageId}`);

        const filteredMessages = messages?.filter((id) => id === messageId);

        setMessages(filteredMessages);
        getMessages();
      } catch (error) {
        setErrorDeletingMessage(error);
      }
    },
    [messages, getMessages]
  );

  // function to update current chat
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  // function to mark all notifications as read
  const markAllNotificationsAsRead = useCallback(() => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, [notifications]);

  // function to mark specific notification as read
  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      // find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(mNotifications);
    },
    [updateCurrentChat]
  );

  // mark a specific user friend notifications as read
  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const mNotifications = notifications.map((el) => {
        let notification;
        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });
      setNotifications(mNotifications);
    },
    []
  );

  return (
    <messagesContext.Provider
      value={{
        messages,
        isMessagesLoading,
        messagesError,
        updateCurrentChat,
        currentChat,
        sendMessage,
        sendMessageTextError,
        onlineUsers,
        notifications,
        errorDeletingMessage,
        deleteMessage,
        getMessages,
        updateMessage,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
      }}
    >
      {children}
    </messagesContext.Provider>
  );
}
