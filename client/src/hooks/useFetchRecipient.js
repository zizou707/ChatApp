import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const recipientId = await chat?.members.find((id) => id !== user?._id);

        if (!recipientId) {
          return null;
        }

        const response = await getRequest(`${baseUrl}/users/${recipientId}`);

        setRecipientUser(response);
      } catch (error) {
        setError(error);
      }
    };
    getUser();
  }, [user?._id, chat?.members]);
  return { recipientUser, error };
};
