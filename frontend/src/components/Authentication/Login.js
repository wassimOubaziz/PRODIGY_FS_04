import React, { useState } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();

  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <Box width="100%" maxWidth="400px" margin="auto" mt={1}>
      <VStack
        spacing={8}
        align="stretch"
        bg="#F5F7F9" // Background Color
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        border="1px"
        borderColor="#D2D2D2" // Border Color
      >
        <Heading as="h1" size="xl" textAlign="center" color="#4A4A4A">
          Login to Wassy-Talk
        </Heading>
        <FormControl id="email" isRequired>
          <FormLabel color="#4A4A4A">Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="white"
            borderColor="#D2D2D2" // Border Color
            _hover={{ borderColor: "#50E3C2" }} // Secondary Color
            _focus={{ borderColor: "#50E3C2", boxShadow: "0 0 0 1px #50E3C2" }} // Secondary Color
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel color="#4A4A4A">Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="white"
              borderColor="#D2D2D2" // Border Color
              _hover={{ borderColor: "#50E3C2" }} // Secondary Color
              _focus={{
                borderColor: "#50E3C2",
                boxShadow: "0 0 0 1px #50E3C2",
              }} // Secondary Color
            />
            <InputRightElement width="3rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShow(!show)}
                bg="transparent"
                _hover={{ bg: "#F0F4F8" }} // Background Color on hover
              >
                {show ? (
                  <ViewOffIcon color="#50E3C2" /> // Secondary Color
                ) : (
                  <ViewIcon color="#50E3C2" /> // Secondary Color
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          bg="#7ED321" // Button Color
          color="white"
          width="100%"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Logging in..."
          _hover={{ bg: "#6BCC1F" }} // Darker Button Color
        >
          Login
        </Button>
        <Button
          variant="outline"
          color="#7ED321" // Button Color
          width="100%"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
          _hover={{ bg: "#F0F4F8" }} // Background Color on hover
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
