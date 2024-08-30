import { CloseIcon, StarIcon } from "@chakra-ui/icons";
import { Badge, Box } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  console.log(user.isAdmin);
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme={user.isAdmin ? "yellow" : "purple"} // Gold color for admins
      cursor="pointer"
      display="flex"
      alignItems="center"
      onClick={handleFunction}
      aria-label={`Remove ${user.name} from the group`}
    >
      <Box display="flex" alignItems="center">
        {user.isAdmin && <StarIcon color="yellow.400" mr={1} />}{" "}
        {/* Gold star for admin */}
        {user.name}
      </Box>
      <CloseIcon pl={2} ml={2} />
    </Badge>
  );
};

export default UserBadgeItem;
