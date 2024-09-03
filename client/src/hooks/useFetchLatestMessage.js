import { useContext, useEffect, useState } from "react";
import { messagesContext } from "../ContextAPI/messagesContext";
import { baseUrl, getRequest } from "../utils/services";

export function useFetchLatestMessage(chat) {
  const { newMessage, notifications } = useContext(messagesContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await getRequest(
          `${baseUrl}/users/messages/${chat?._id}`
        );
        const lastMessage = response[response?.length - 1];
        setLatestMessage(lastMessage);
      } catch (error) {
        return console.log("Error getting messages...", error);
      }
    };
    getMessages();
  }, [chat?._id, newMessage, notifications]);
  return { latestMessage };
}
