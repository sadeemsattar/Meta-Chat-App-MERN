import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../Context/ContextProvider";
import { UserListItem } from "./UserListItem";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUser, setselectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast({
        title: "Please fill all Fields ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/v1/metachat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        { withCredentials: true }
      );

      setChats([data, ...chats]);
      onClose();

      toast({
        title: "New chat created Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to create Chat!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleGroup = (addUser) => {
    if (selectedUser.includes(addUser)) {
      toast({
        title: "User Already Added ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setselectedUser([...selectedUser, addUser]);
  };

  const handleDelete = (delUser) => {
    setselectedUser(
      selectedUser.filter((select) => select._id !== delUser._id)
    );
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/metachat?search=${search}`, {
        withCredentials: true,
      });

      setLoading(false);
      setsearchResult(data);
    } catch (error) {
      toast({
        title: "Failed To Load Error! ",
        description: "Failed To Load the Search Result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            fontSize="35px"
            d="flex"
            justifyContent="center"
          >
            Create GroupChat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                mb={3}
                placeholder="Chat Name"
                onChange={(e) => setgroupChatName(e.target.value)}
              />
              <Input
                mb={1}
                placeholder="Add User"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box d="flex" flexWrap="wrap" w="100%">
              {selectedUser.map((user) => (
                <UserBadgeItem
                  user={user}
                  key={user._id}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
