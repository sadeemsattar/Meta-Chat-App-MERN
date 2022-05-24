import React, { useState } from "react";
import ChatBox from "../Components/ChatBox";
import ChatPannel from "../Components/ChatPannel";
import { SideDrawer } from "../Components/SideDrawer";
import { ChatState } from "../Context/ContextProvider";
import { Box, HStack } from "@chakra-ui/react";
export const MyChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        color: "white",
      }}
    >
      {user && <SideDrawer />}
      <Box d="flex" w="100%" justifyContent="space-between" p="10px" h="91.5vh">
        {user && <ChatPannel fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};
