import { React, useEffect } from "react";
import {
  Container,
  Box,
  Text,
  TabPanel,
  TabPanels,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { SignUp } from "../AuthPagesLayout/SignUp";
import { Login } from "../AuthPagesLayout/Login";
import { useHistory } from "react-router-dom";

export const HomePage = () => {
  const history = useHistory();
  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("Info"));

    if (userinfo) history.push("/myChat");
  }, [history]);
  return (
    <Container centerContent maxW="xl">
      <Box
        justifyContent="center"
        p={3}
        d="flex"
        bg="#061727"
        m="60px 0 15px 0"
        w="100%"
        borderRadius="lg"
      >
        <Text
          color="white"
          fontFamily="Work sans"
          fontSize="2xl"
          fontWeight="bold"
        >
          Meta Chat
        </Text>
      </Box>
      <Box bg="#061727" w="100%" borderRadius="lg" p={3}>
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login></Login>
            </TabPanel>
            <TabPanel>
              <SignUp></SignUp>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
