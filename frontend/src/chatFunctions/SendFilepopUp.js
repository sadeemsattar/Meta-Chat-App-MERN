import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";

import axios from "axios";

export const SendFilepopUp = ({ sendMessage, newMessage, setnewMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [fileToBeSend, setFile] = useState("");
  const toast = useToast();

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!fileToBeSend) {
      toast({
        title: "Please Select File",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const data = new FormData();
    data.append("file", fileToBeSend);

    const { msg } = await axios.post("/api/v1/metachat/uploadFile", data, {
      withCredentials: true,
    });

    toast({
      title: "Upload",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    onClose();
  };

  const sendFile = (file) => {
    setLoading(true);
    if (file == undefined) {
      toast({
        title: "Please Select An File",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "meta-chat");
    data.append("cloud_name", "metachat");

    fetch("https://api.cloudinary.com/v1_1/metachat/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setnewMessage(data.url.toString());
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
    // setLoading(false);
  };

  return (
    <>
      <Button colorScheme="blue" p={3} w="100%" my={2} onClick={onOpen}>
        Upload File Here
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            fontSize="40px"
          >
            Select File
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            justifyContent={"space-between"}
            flexDirection="column"
            alignItems={"center"}
          >
            <FormControl isRequired id="upload-file">
              <FormLabel>Upload file</FormLabel>
              <Input
                type={"file"}
                p={1.5}
                accept=".gif, .jpg, .png, .doc, .pdf"
                onChange={(e) => {
                  sendFile(e.target.files[0]);
                  setFile(e.target.files[0]);
                }}
              />
              <Button
                colorScheme="blue"
                w="100%"
                my={2}
                color="black"
                onClick={uploadHandler}
                isLoading={loading}
              >
                Upload File
              </Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
