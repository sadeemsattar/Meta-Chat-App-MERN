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

export const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setconfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShow] = useState(false);
  const [avater, setAvater] = useState();
  const toast = useToast();
  const history = useHistory();

  const setProfile = (avater) => {
    setLoading(true);
    if (avater == undefined) {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (avater.type == "image/jpeg" || avater.type === "image/png") {
      const data = new FormData();
      data.append("file", avater);
      data.append("upload_preset", "meta-chat");
      data.append("cloud_name", "metachat");
      console.log(data);
      fetch("https://api.cloudinary.com/v1_1/metachat/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAvater(data.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Select All Fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (password != confirmPassword) {
      toast({
        title: "Password Not Match",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/v1/metachat/signup",
        {
          name,
          email,
          password,
          avater,
        },
        { withCredentials: true }
      );
      setLoading(false);
      toast({
        title: "Registration Succesfull",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      localStorage.setItem("Info", JSON.stringify(data));
      history.push("/myChat");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Registration Error",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired id="first-name">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
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
      <FormControl isRequired id="confrim-password">
        <FormLabel>Confrim Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password Again"
            onChange={(e) => {
              setconfirmPassword(e.target.value);
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
      <FormControl isRequired id="avater-pic">
        <FormLabel>Upload Pic</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            setProfile(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        width="100%"
        style={{ marginTop: 20 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
