import React from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Spinner,
  effect,
} from "@chakra-ui/react";
import { ChevronDownIcon, BellIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ContextProvider";
import { ProfilePopUp } from "./ProfilePopUp";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { ChatLoading } from "../Components/ChatLoading";
import { UserListItem } from "../Components/UserListItem";
import { getSender } from "../chatFunctions/ChatFuntion";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
export const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const history = useHistory();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Search Field",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/metachat?search=${search}`, {
        withCredentials: true,
      });
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Failed To Load ",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accesChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        `/api/v1/metachat`,
        {
          userId,
        },
        { withCredentials: true }
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Failed To Load The Chat ",
        description: error.meassage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const Logout = () => {
    localStorage.removeItem("Info");
    history.push("/");
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        width="100%"
        p="5px 10px 5px 10px"
        alignItems="center"
        bg={"#2D3748"}
      >
        <Tooltip label="Search User Here" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search Here
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily={"Work sans"}>
          Meta Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={2}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon m={1} fontSize="2xl" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((item) => (
                <MenuItem
                  key={item._id}
                  onClick={() => {
                    setSelectedChat(item.chat);
                    setNotification(notification.filter((n) => n !== item));
                  }}
                >
                  {item.chat.isGroupChat
                    ? `New Message in ${item.chat.chatName}`
                    : `New Message from ${item.sender.name}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.avater}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfilePopUp user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfilePopUp>

              <MenuDivider />
              <MenuItem
                onClick={() => {
                  Logout();
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box pb={2} d="flex">
              <Input
                placeholder="Search By Name or Email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((item) => (
                <UserListItem
                  key={item._id}
                  user={item}
                  handleFunction={() => {
                    accesChat(item._id);
                  }}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
