import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../../ContextAPI/userContext";
import { messagesContext } from "../../ContextAPI/messagesContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Alert, Dropdown, Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import { useClickOutSide } from "../../hooks/useClickOutSide";

function MessagesBox() {
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isEditMessage, setIsEditMessage] = useState(false);
  const [myMessages, setMyMessages] = useState([]);
  const [isFileUploadInput, setIsFileUploadInput] = useState(false);
  const [selectBackground, setSelectBackground] = useState(false);
  const [chooseBackground, setChooseBackground] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const scroll = useRef();

  const { user } = useContext(userContext);
  const {
    currentChat,
    messages,
    getMessages,
    isMessagesLoading,
    sendMessage,
    updateMessage,
    sendMessageTextError,
    errorDeletingMessage,
    deleteMessage,
  } = useContext(messagesContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);
  const [messageText, setMessageText] = useState("");

  // toggle isFileUploadInput to false when click outside

  const btnRef = useClickOutSide(() => {
    setIsFileUploadInput(false);
  });
  
  const paramaterRef = useClickOutSide(() => {
    setSelectBackground(false);
  });

  // function to choose background for messages box
  const handleChange = async (e) => {
    const newFile = e.currentTarget.files[0];
    setBackgroundImage(newFile);

    // handle upload background image

    try {
      const response = await axios.post(
        "http://localhost:4000/upload",
        { file: backgroundImage },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setBackgroundUrl(
        JSON.stringify(response.data.filePath.split("public").pop())
      );
    } catch (error) {
      console.log(error);
    }
  };

  // filtering my messages
  useEffect(() => {
    const result = messages?.filter((m) => m?.senderId === user?._id);
    setMyMessages(result);
  }, [messages, user?._id]);

  // scroll messages box into view to see latest messages
  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  // getting messages from db
  useEffect(() => {
    getMessages();
  }, [currentChat, getMessages]);
  // Handler to toggle the edit/delete options for a specific message and selecting the id
  const handleEditDeleteClick = (messageId) => {
    setSelectedMessageId(messageId);
  };
  // know when user want to update message or not
  const toggleIsEditMessage = (messageText) => {
    setIsEditMessage(!isEditMessage);

    setMessageText(messageText);
  };

  // early check if there is no recipient user show a msg or if msgs is being loaded from db
  if (!recipientUser) {
    return (
      <h5 style={{ textAlign: "center", width: "100%", alignSelf: "center" }}>
        Select a conversation to display here...
      </h5>
    );
  }
  if (isMessagesLoading) {
    return (
      <h5
        style={{
          display: "flex",
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <img
          width={100}
          src="/Spinner@1x-1.0s-200px-200px.gif"
          alt="loading..."
        />
        <span className="self-center"> Loading...</span>{" "}
      </h5>
    );
  }

  return (
    <>
      {!sendMessageTextError ? (
        <Stack
          gap={4}
          className="chat-box"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        >
          <div ref={paramaterRef} className="chat-header">
            <strong className="pl-96">
              {recipientUser?.name[0].toUpperCase() +
                recipientUser?.name.slice(1)}{" "}
            </strong>
            <span
              onClick={() => setSelectBackground(!selectBackground)}
              className="float-right cursor-pointer"
              title="parameters"
            >
              <svg
                data-icon="fa-cog"
                viewBox="0 0 512 512"
                className="fa"
                style={{ width: "1em" }}
              >
                <path
                  fill="currentColor"
                  d="M452.515 237l31.843-18.382c9.426-5.441 13.996-16.542 11.177-27.054-11.404-42.531-33.842-80.547-64.058-110.797-7.68-7.688-19.575-9.246-28.985-3.811l-31.785 18.358a196.276 196.276 0 0 0-32.899-19.02V39.541a24.016 24.016 0 0 0-17.842-23.206c-41.761-11.107-86.117-11.121-127.93-.001-10.519 2.798-17.844 12.321-17.844 23.206v36.753a196.276 196.276 0 0 0-32.899 19.02l-31.785-18.358c-9.41-5.435-21.305-3.877-28.985 3.811-30.216 30.25-52.654 68.265-64.058 110.797-2.819 10.512 1.751 21.613 11.177 27.054L59.485 237a197.715 197.715 0 0 0 0 37.999l-31.843 18.382c-9.426 5.441-13.996 16.542-11.177 27.054 11.404 42.531 33.842 80.547 64.058 110.797 7.68 7.688 19.575 9.246 28.985 3.811l31.785-18.358a196.202 196.202 0 0 0 32.899 19.019v36.753a24.016 24.016 0 0 0 17.842 23.206c41.761 11.107 86.117 11.122 127.93.001 10.519-2.798 17.844-12.321 17.844-23.206v-36.753a196.34 196.34 0 0 0 32.899-19.019l31.785 18.358c9.41 5.435 21.305 3.877 28.985-3.811 30.216-30.25 52.654-68.266 64.058-110.797 2.819-10.512-1.751-21.613-11.177-27.054L452.515 275c1.22-12.65 1.22-25.35 0-38zm-52.679 63.019l43.819 25.289a200.138 200.138 0 0 1-33.849 58.528l-43.829-25.309c-31.984 27.397-36.659 30.077-76.168 44.029v50.599a200.917 200.917 0 0 1-67.618 0v-50.599c-39.504-13.95-44.196-16.642-76.168-44.029l-43.829 25.309a200.15 200.15 0 0 1-33.849-58.528l43.819-25.289c-7.63-41.299-7.634-46.719 0-88.038l-43.819-25.289c7.85-21.229 19.31-41.049 33.849-58.529l43.829 25.309c31.984-27.397 36.66-30.078 76.168-44.029V58.845a200.917 200.917 0 0 1 67.618 0v50.599c39.504 13.95 44.196 16.642 76.168 44.029l43.829-25.309a200.143 200.143 0 0 1 33.849 58.529l-43.819 25.289c7.631 41.3 7.634 46.718 0 88.037zM256 160c-52.935 0-96 43.065-96 96s43.065 96 96 96 96-43.065 96-96-43.065-96-96-96zm0 144c-26.468 0-48-21.532-48-48 0-26.467 21.532-48 48-48s48 21.533 48 48c0 26.468-21.532 48-48 48z"
                ></path>
              </svg>
            </span>
            {selectBackground && (
              <button
                className="select-bg"
                onClick={() => setChooseBackground(true)}
              >
                <Dropdown.Item className="bg-btn" eventKey="1">
                  choose background
                </Dropdown.Item>
                {chooseBackground && (
                  <>
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    ></input>
                  </>
                )}
              </button>
            )}
          </div>

          <Stack gap={3} className="messages">
            {messages &&
              !errorDeletingMessage &&
              messages.map((m, index) => (
                <Stack
                  ref={scroll}
                  key={index}
                  className={`${
                    m?.senderId === user._id ? "my-messages" : "others-messages"
                  }`}
                >
                  <div
                    onClick={() => handleEditDeleteClick(m._id)}
                    className="edit-delete-btn"
                    id={`${index}`}
                  >
                    {myMessages.map((myMsg, i) => {
                      if (myMsg?._id === m?._id) {
                        return (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="currentColor"
                            className="bi bi-three-dots-vertical cursor-pointer mt-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                          </svg>
                        );
                      }
                      return null;
                    })}

                    {selectedMessageId === m?._id && (
                      <div className="message-edit-delete">
                        <div className="edit-deletle-func -mt-2">
                          <button
                            className="delete-msg"
                            onClick={() => {
                              deleteMessage(m._id);
                              setSelectedMessageId(null);
                            }}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              toggleIsEditMessage(m.messageContent)
                            }
                            className="edit-msg"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {m.senderId === user._id ? (
                    <div>
                      <span>{m?.messageText} </span>
                      <span className="messages-footer pl-5">
                        {moment(m?.updatedAt).format("ddd, h:m a")}{" "}
                      </span>
                    </div>
                  ) : null}
                  {m.senderId === recipientUser._id ? (
                    <div>
                      <span className="messages-footer pr-5">
                        {moment(m?.updatedAt).format("ddd, h:m a")}{" "}
                      </span>
                      <span>{m?.messageText} </span>
                    </div>
                  ) : null}
                  {isEditMessage && selectedMessageId === m._id ? (
                    <>
                      <input
                        onChange={(e) => setMessageText(e.target.value)}
                        style={{ color: "black" }}
                      />
                      <span className="messages-footer">
                        {moment(m?.updatedAt).format("ddd, h:m a")}{" "}
                      </span>
                      <button
                        onClick={() => {
                          updateMessage(
                            m._id,
                            currentChat._id,
                            user._id,
                            user.name,
                            recipientUser._id,
                            messageText,
                            setMessageText
                          );
                          setSelectedMessageId(null);
                          setIsEditMessage(false);
                        }}
                      >
                        Update
                      </button>
                    </>
                  ) : null}
                </Stack>
              ))}
            {errorDeletingMessage && (
              <Alert>
                An Error Occur during deleting...{errorDeletingMessage.message}{" "}
              </Alert>
            )}
          </Stack>
          <Stack
            direction="horizontal"
            gap={3}
            className="chat-input flex-grow-0"
            ref={btnRef}
          >
            <InputEmoji
              onEnter={() => {
                sendMessage(
                  currentChat._id,
                  user._id,
                  user.name,
                  recipientUser._id,
                  messageText,
                  setMessageText
                );
              }}
              value={messageText}
              onChange={setMessageText}
              borderColor="rgba(72,112,223,0.2)"
            ></InputEmoji>

            <svg
              onClick={() => setIsFileUploadInput(!isFileUploadInput)}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-paperclip cursor-pointer"
              viewBox="0 0 16 16"
            >
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
            </svg>

            {isFileUploadInput && (
              <div className="absolute right-7 bottom-0">
                <input className="upload-input " type="file" multiple></input>

                <button className="flex flex-row gap-2 bg-slate-500 p-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-cloud-arrow-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
                  </svg>
                </button>
              </div>
            )}

            <button
              className="send-btn"
              onClick={() => {
                sendMessage(
                  currentChat._id,
                  user._id,
                  user.name,
                  recipientUser._id,
                  messageText,
                  setMessageText
                );
              }}
              title="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-send-fill"
                viewBox="0 0 16 16"
              >
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
              </svg>
            </button>
          </Stack>
        </Stack>
      ) : (
        <Alert className="w-full h-full bg-red-500">
          {JSON.stringify(sendMessageTextError.message)}
        </Alert>
      )}
    </>
  );
}

export default MessagesBox;
