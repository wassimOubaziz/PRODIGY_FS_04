import { ViewIcon } from "@chakra-ui/icons";
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
  Image,
  Input,
  FormControl,
  FormLabel,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { set } from "mongoose";

const ProfileModify = ({ user = {}, children, fetchUserData, admin = {} }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(user.pic || "");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPic(user.pic || "");
    setPassword("");
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const data = new FormData();
      data.append("file", file);
      data.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "post",
            body: data,
          }
        );
        const uploadData = await res.json();
        setPic(uploadData.url.toString());
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setLoading(false);
      }
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (jpeg/png).",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.isAdmin ? admin.token : user.token}`, // Assuming you have a token for authorization
        },
      };

      const payload = admin.isAdmin
        ? { name, email, password, pic, userId: user._id }
        : { name, email, password, pic };

      const { data } = await axios.put("/api/user/update", payload, config);

      toast({
        title: "Profile Updated",
        description: "Profile has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      if (!admin.isAdmin) {
        user = data;
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
      onClose();
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRemoveAccount = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${admin.isAdmin ? admin.token : user.token}`,
        },
      };

      const payload = admin.isAdmin ? { data: { userId: user._id } } : {};

      await axios.delete(`/api/user/remove`, config, payload);

      toast({
        title: "Account Removed",
        description: "Account has been successfully removed.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.removeItem("userInfo");
      history.push("/");
    } catch (error) {
      console.error("Error removing account:", error);
      toast({
        title: "Error",
        description: "Failed to remove the account.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label="View Profile"
          colorScheme="teal"
          variant="solid"
          size="lg"
        />
      )}
      <Modal onClose={onClose} isOpen={isOpen} isCentered size="md">
        <ModalOverlay />
        <ModalContent maxWidth="sm">
          <ModalHeader
            fontSize="2xl"
            fontFamily="Work sans"
            textAlign="center"
            bg="#F5F7F9"
            borderBottom="1px"
            borderColor="#D2D2D2"
          >
            Update Profile
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
            bg="#F9FAFB"
          >
            <FormControl id="pic">
              <FormLabel>Profile Picture</FormLabel>
              <Image
                borderRadius="full"
                boxSize={{ base: "120px", md: "150px" }}
                src={pic || "https://via.placeholder.com/150"}
                alt={name || "User Profile"}
                mb={4}
                border="2px solid #D2D2D2"
                boxShadow="md"
              />
              <Input
                type="file"
                onChange={handleImageUpload}
                isDisabled={loading}
              />
            </FormControl>
            <FormControl id="name" mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                isDisabled={loading}
              />
            </FormControl>
            <FormControl id="email" mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isDisabled={loading}
              />
            </FormControl>
            <FormControl id="password" mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isDisabled={loading}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSaveChanges}
              isLoading={loading}
              width="full"
              _hover={{ bg: "blue.500" }}
              fontWeight="bold"
              mr={2}
            >
              Save Changes
            </Button>
            <Button
              colorScheme="red"
              onClick={handleRemoveAccount}
              isLoading={loading}
              width="full"
              _hover={{ bg: "red.500" }}
              fontWeight="bold"
            >
              Remove Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModify;
