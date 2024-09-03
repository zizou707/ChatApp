import React, { useContext } from "react";
import { chatContext } from "../../ContextAPI/chatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "./UserChat";
import { userContext } from "../../ContextAPI/userContext";
import PotentialChats from "./PotentialChats";
import { messagesContext } from "../../ContextAPI/messagesContext";
import MessagesBox from "../Messages/MessagesBox";

function Chat() {
  const { user } = useContext(userContext);
  const { isUserChatsLoading, userChats, userChatsError, creatingChatError } =
    useContext(chatContext);
  const { updateCurrentChat } = useContext(messagesContext);

  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack
          direction="horizontal"
          gap={4}
          className="chat-messages align-items-start "
        >
          <Stack className="messages-box flex-grow-0 pt-2 pl-2 pe-3">
            {isUserChatsLoading && (
              <p>
                <img src="/Spinner@1x-1.0s-200px-200px.gif" alt="loading..." />{" "}
                Loading Chats...
              </p>
            )}
            {userChats &&
              userChats?.map((chat, index) => {
                return (
                  <div key={index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
          </Stack>
          <MessagesBox />
        </Stack>
      )}
      {userChatsError?.message?.error && (
        <div className="-mt-1 mb-2 bg-red-500 p-2">
          <p role="alert">{userChatsError.message.error}</p>
        </div>
      )}

      {creatingChatError && (
        <div className="-mt-10 mb-2 bg-red-500 p-2">
          <p role="alert">{creatingChatError.message}</p>
        </div>
      )}
    </Container>
  );
}

export default Chat;
