import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const chatContext = createContext();

export default function ChatGlobalState({ children, user }) {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [creatingChatError, setCreatingChatError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [potentialChatsError, setPotentialChatsError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // creating a chat in database
  const createChat = useCallback(async (senderId, recieverId) => {
    try {
      const response = await postRequest(`${baseUrl}/users/chats`, {
        senderId,
        recieverId,
      });

      setUserChats((prev) => [...prev, response]);
    } catch (error) {
      console.log(error);
      setCreatingChatError(error);
    }
  }, []);

  // getting all users from db then filtering the potential chat with removing the current user
  // and find is that user is already have a chat with the current logged in user
  useEffect(() => {
    const getPotentialChats = async () => {
      try {
        const response = await getRequest(`${baseUrl}/users`);

        const pChats = response?.filter((u) => {
          if (user?._id === u._id) {
            return false;
          }

          let isChatCreated = false;
          if (userChats) {
            isChatCreated = userChats?.some((chat) => {
              return chat.members[0] === u._id || chat.members[1] === u._id;
            });
          }
          return !isChatCreated;
        });
        setPotentialChats(pChats);
        setAllUsers(response);
      } catch (error) {
        setPotentialChatsError(error);
      }
    };
    getPotentialChats();
  }, [user?._id, userChats]);

  // get User chats whenever the user changes
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(
          `${baseUrl}/users/chats/${user?._id}`
        );

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  return (
    <chatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        allUsers,
        creatingChatError,
        potentialChatsError,
      }}
    >
      {children}
    </chatContext.Provider>
  );
}
