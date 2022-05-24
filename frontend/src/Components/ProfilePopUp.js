import React from "react";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Text,
  Box,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

export const ProfilePopUp = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          onClick={onOpen}
          icon={<ViewIcon />}
        ></IconButton>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent height={410}>
          <ModalHeader
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            fontSize="40px"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            justifyContent={"space-between"}
            flexDirection="column"
            alignItems={"center"}
          >
            <Image
              boxSize="150px"
              src={user.avater}
              alt={user.name}
              borderRadius="full"
            />
            <Text
              fontFamily="Work sans"
              fontSize={{ base: "28px", md: "30px" }}
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
