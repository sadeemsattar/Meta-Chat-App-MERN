import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

export const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
      <Skeleton height="50px"></Skeleton>
    </Stack>
  );
};
