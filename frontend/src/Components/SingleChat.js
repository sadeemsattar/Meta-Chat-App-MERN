import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import {
  background,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSenderFull, getSender } from "../chatFunctions/ChatFuntion";
import { ChatState } from "../Context/ContextProvider";
import { ProfilePopUp } from "./ProfilePopUp";
import { UpdateGroupModel } from "./UpdateGroupModel";
import "./Styles.css";
import { ScrollableChat } from "./ScrollableChat";
import io from "socket.io-client";

import Lottie from "react-lottie";
import animationData from "../animation/animation.json";
// import { CallButton } from "./CallButton";
import { SendFilepopUp } from "../chatFunctions/SendFilepopUp";

const ENDPOINT = "https://mern-meta-chat.herokuapp.com/";
var socket, selectedChatCompare;

export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setnewMessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setsocketConnected(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/metachat/${selectedChat._id}`, {
        withCredentials: true,
      });

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occured in fetching caht !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setnewMessage("");
        const { data } = await axios.post(
          `/api/v1/metachat/sendMessage`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          { withCredentials: true }
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error occured in message sending !",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHanlder = (e) => {
    setnewMessage(e.target.value);

    // if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var diff = timeNow - lastTypingTime;

      if (diff >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message Recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontFamily="Work sans"
            pb={3}
            px={2}
            w="100%"
            fontSize={{ base: "28px", md: "30px" }}
            d="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            // color="white"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon color="white" />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <Box d="flex">
                  {/* <CallButton
                    socket={socket}
                    userSelected={getSenderFull(user, selectedChat.users)}
                    selectedChat={selectedChat}
                  /> */}
                  <ProfilePopUp
                    user={getSenderFull(user, selectedChat.users)}
                  ></ProfilePopUp>
                </Box>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}

                <UpdateGroupModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                size="xl"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <Box
              mt={3}
              bg={"#1A202C"}
              borderWidth="1px"
              borderRadius="lg"
              px={2}
              py={2}
            >
              <FormControl mt={3} onKeyDown={sendMessage} isRequired>
                {isTyping ? (
                  <Lottie
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                    options={defaultOptions}
                  />
                ) : (
                  // <div style={{ color: "black" }}>typing...</div>
                  <></>
                )}
                <Input
                  variant="filled"
                  bg={"#2D3748"}
                  color="white"
                  placeholder="Enter a message here.."
                  onChange={typingHanlder}
                  value={newMessage}
                />
              </FormControl>

              <SendFilepopUp
                sendMessage={sendMessage}
                newMessage={newMessage}
                setnewMessage={setnewMessage}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" h="100%" justifyContent="center">
          <Text pd={3} fontSize="3xl" fontFamily="Work sans" color="white">
            Click on user to start chating.
          </Text>
        </Box>
      )}
    </>
  );
};
