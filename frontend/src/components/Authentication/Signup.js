import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill All Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (!pics) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
      fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select a Valid Image Format!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <VStack
      spacing="15px"
      p={5}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      maxWidth="400px"
      mx="auto"
      bg="#F5F7F9" // Background Color
    >
      <FormControl id="signup-name" isRequired>
        <FormLabel color="#4A4A4A">Name</FormLabel> {/* Text Color */}
        <Input
          value={name}
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          bg="white"
          borderColor="#D2D2D2" // Border Color
          _hover={{ borderColor: "#50E3C2" }} // Secondary Color
          _focus={{ borderColor: "#50E3C2", boxShadow: "0 0 0 1px #50E3C2" }} // Secondary Color
        />
      </FormControl>
      <FormControl id="signup-email" isRequired>
        <FormLabel color="#4A4A4A">Email Address</FormLabel> {/* Text Color */}
        <Input
          type="email"
          value={email}
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          bg="white"
          borderColor="#D2D2D2" // Border Color
          _hover={{ borderColor: "#50E3C2" }} // Secondary Color
          _focus={{ borderColor: "#50E3C2", boxShadow: "0 0 0 1px #50E3C2" }} // Secondary Color
        />
      </FormControl>
      <FormControl id="signup-password" isRequired>
        <FormLabel color="#4A4A4A">Password</FormLabel> {/* Text Color */}
        <InputGroup size="md">
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            bg="white"
            borderColor="#D2D2D2" // Border Color
            _hover={{ borderColor: "#50E3C2" }} // Secondary Color
            _focus={{ borderColor: "#50E3C2", boxShadow: "0 0 0 1px #50E3C2" }} // Secondary Color
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              bg="transparent"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="signup-confirmpassword" isRequired>
        <FormLabel color="#4A4A4A">Confirm Password</FormLabel>{" "}
        {/* Text Color */}
        <InputGroup size="md">
          <Input
            value={confirmpassword}
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
            bg="white"
            borderColor="#D2D2D2" // Border Color
            _hover={{ borderColor: "#50E3C2" }} // Secondary Color
            _focus={{ borderColor: "#50E3C2", boxShadow: "0 0 0 1px #50E3C2" }} // Secondary Color
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              bg="transparent"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="signup-pic">
        <FormLabel color="#4A4A4A">Upload Your Picture</FormLabel>{" "}
        {/* Text Color */}
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        bg="#7ED321" // Button Color
        color="white"
        width="100%"
        mt={4}
        onClick={submitHandler}
        isLoading={picLoading}
        loadingText="Signing Up..."
        _hover={{ bg: "#6BCC1F" }} // Darker Button Color
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
