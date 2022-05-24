import { useEffect, useRef, useState } from "react";
import React from "react";
import Peer from "simple-peer";
import io, { Socket } from "socket.io-client";
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
  Box,
  Text,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ContextProvider";

export const CallButton = ({ userSelected, socket, selectedChat }) => {
  const { user } = ChatState();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idTocall, setIdToCall] = useState("");
  const [callEnd, setcallEnd] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    setMe(user._id);
    setName(user.name);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    // socket.on("me", (id) => {
    //   setMe(id);
    // });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUsers = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("pickCall", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("pickCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };
  const leaveCall = () => {
    setcallEnd(true);
    connectionRef.current.destroy();
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        d={{ base: "flex" }}
        onClick={onOpen}
        icon={<i class="fas fa-phone-alt"></i>}
      ></IconButton>
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
            <Text
              fontFamily="Work sans"
              fontSize={{ base: "28px", md: "30px" }}
            >
              Name: {user.name}
            </Text>

            <Box d="flex" flexDir="column">
              <Box>
                {stream && (
                  <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    style={{ width: "300px" }}
                  />
                )}
              </Box>

              <Box>
                {callAccepted && !callEnd ? (
                  <video
                    playsInline
                    ref={userVideo}
                    autoPlay
                    style={{ width: "300px" }}
                  />
                ) : (
                  ""
                )}
              </Box>
              <Box>
                {callAccepted && !callEnd ? (
                  <Button colorScheme="blue" mr={3} onClick={leaveCall}>
                    Leave
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => callUsers(selectedChat.users)}
                  >
                    call
                  </Button>
                )}
                {idTocall}
              </Box>
              {receivingCall && !callAccepted ? (
                <>
                  <h1>{name} is calling...</h1>
                  <Button colorScheme="blue" mr={3} onClick={answerCall}>
                    Answer Call
                  </Button>
                </>
              ) : (
                ""
              )}
            </Box>
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
