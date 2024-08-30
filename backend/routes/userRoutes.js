const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  removeAccount,
  updateProfile,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/remove").delete(protect, removeAccount);
router.route("/update").put(protect, updateProfile);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;
