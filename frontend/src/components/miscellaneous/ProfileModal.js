import { ViewIcon, StarIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Box,
  Badge,
} from "@chakra-ui/react";

const ProfileModal = ({ user = {}, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label="View Profile"
          colorScheme="teal" // Consistent color scheme
          variant="solid"
          size="lg" // Larger button for better visibility
        />
      )}
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size="md" // Set to medium size
      >
        <ModalOverlay />
        <ModalContent maxWidth="sm">
          <ModalHeader
            fontSize="2xl"
            fontFamily="Work sans"
            textAlign="center"
            bg="#F5F7F9" // Background color to match app theme
            borderBottom="1px"
            borderColor="#D2D2D2" // Border color
            d="flex"
            alignItems="center"
            justifyContent="space-around"
          >
            {user.name || "User Profile"}
            {user.isAdmin && (
              <Badge
                colorScheme="yellow"
                borderRadius="full"
                px={2}
                py={1}
                fontSize="sm"
                color="gold"
                fontWeight="bold"
                ml={2}
                variant="solid"
              >
                Admin
              </Badge>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            py={4}
            bg="#F9FAFB" // Background color to match app theme
          >
            <Image
              borderRadius="full"
              boxSize={{ base: "120px", md: "150px" }}
              src={user.pic || "https://via.placeholder.com/150"}
              alt={user.name || "User Profile"}
              mb={4}
              border="2px solid #D2D2D2" // Border around the image
              boxShadow="md" // Add shadow for depth
            />
            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="Work sans">
              {user.email || "No email provided"}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={onClose}
              width="100%" // Full width button
              _hover={{ bg: "blue.500" }} // Hover effect
              fontWeight="bold" // Bold text
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
