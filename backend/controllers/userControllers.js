const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// routes/user.js or routes/api.js
const updateProfile = asyncHandler(async (req, res) => {
  let { name, email, password, pic, userId } = req.body;
  try {
    const user =
      userId && req.user.isAdmin
        ? await User.findById(userId)
        : await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (pic == user.pic) {
      pic = "";
    }

    // Remove old image from Cloudinary if new image is uploaded
    if (pic && user.pic) {
      if (user.pic.includes("cloudinary")) {
        try {
          const publicId = user.pic.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.log(error.message);
        }
      }
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (pic) user.pic = pic;
    if (!req.user.isAdmin && !userId) {
      if (password) {
        await user.save();
      } else {
        await User.findByIdAndUpdate(user._id, user, {
          new: true,
          runValidators: true,
        });
      }
    } else if (req.user.isAdmin && userId) {
      if (password) {
        await user.save();
      } else {
        await User.findOneAndUpdate({ _id: userId }, user, {
          new: true,
          runValidators: true,
        });
      }
    } else if (req.user.isAdmin) {
      if (password) {
        await user.save();
      } else {
        await User.findByIdAndUpdate(user._id, user, {
          new: true,
          runValidators: true,
        });
      }
    }

    const token = generateToken(req.user._id);
    if (req.user.isAdmin && userId) {
      res.json({
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        name: req.user.name,
        pic: req.user.pic,
        token,
        _id: req.user._id,
      });
    } else {
      res.json({
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
        pic: user.pic,
        token,
        _id: user._id,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const removeAccount = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Include userId from request body

  try {
    const user =
      userId && req.user.isAdmin
        ? await User.findById(userId)
        : await User.findById(req.user.id); // Find by userId if admin, otherwise by logged-in user ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.pic) {
      try {
        const publicId = user.pic.split("/").pop().split(".")[0]; // Extract public_id
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.log(error.message);
      }
    }

    await User.findByIdAndRemove(user._id);
    res.json({ message: "Account removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = {
  allUsers,
  registerUser,
  authUser,
  updateProfile,
  removeAccount,
};
