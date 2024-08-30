import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = () => {
  return (
    <Stack spacing={3}>
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
      <Skeleton height="45px" bg="#E0E0E0" />
    </Stack>
  );
};

export default ChatLoading;
