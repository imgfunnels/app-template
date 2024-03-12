import { useToast } from "@chakra-ui/react";

export default function useCustomToast() {
  const toast = useToast();
  return ({
    message = "",
    status = "success",
    variant = "left-accent",
    duration = 9000,
    isClosable = true
  }: {
    [key: string]: any;
  }) => {
    if (message.match("Unexpected token '<'")) {
      message = "Ensure bailed.";
    } else if (message.match(/prisma/gi)) {
      message = "Prisma error. " + new Date().toISOString();
    }
    return toast({
      description: message,
      status,
      variant,
      duration,
      isClosable
    });
  };
}
