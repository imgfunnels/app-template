"use client";
import { ChakraProvider as Provider } from "@chakra-ui/react";

const ChakraProvider = ({ children }: any) => {
  return <Provider>{children}</Provider>;
};

export default ChakraProvider;
