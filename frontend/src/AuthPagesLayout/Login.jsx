import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../Context/ContextProvider";

export const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { user, setUser } = ChatState();
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Select All Fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/v1/metachat/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setLoading(false);
      toast({
        title: "Login Succesfull",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      localStorage.setItem("Info", JSON.stringify(data));
      setUser(data);
      history.push("/myChat");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Login Error",

        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired id="email">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl isRequired id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              size="sm"
              height="1.75rem"
              onClick={() => {
                setShow(!showPassword);
              }}
            >
              {showPassword ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        width="100%"
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        width="100%"
        style={{ marginTop: 15 }}
        variant="solid"
        onClick={() => {
          setEmail("metachat@gmail.com");
          setPassword("12345");
        }}
      >
        Guest User
      </Button>
    </VStack>
  );
};
