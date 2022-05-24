import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ContextProvider";
import { Button, Stack, Text, useToast } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { ChatLoading } from "../Components/ChatLoading";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../chatFunctions/ChatFuntion";
import axios from "axios";
import GroupChatModel from "./GroupChatModel";

const ChatPannel = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChat = async () => {
    try {
      const { data } = await axios.get(`/api/v1/metachat/chat`, {
        withCredentials: true,
      });

      setChats(data);
    } catch (error) {
      toast({
        title: "Error In Loading ",
        description: "Failed To Load The Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("Info")));
    fetchChat();
  }, [fetchAgain]);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={3}
      alignItems="center"
      w={{ base: "100%", md: "31%" }}
      borderWidth="1px"
      borderRadius="lg"
      bg={"#2D3748"}
      // h="700px"
    >
      <Box
        px={3}
        pb={3}
        fontFamily="Work sans"
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        alignItems="center"
        w="100%"
        justifyContent="space-between"
      >
        My Chats
        <GroupChatModel>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            d="flex"
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        w="100%"
        d="flex"
        flexDir="column"
        h="100%"
        overflow="hidden"
        p={3}
        borderRadius="lg"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat && chat.users
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default ChatPannel;
