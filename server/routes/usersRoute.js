const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleWare");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");
// register new user

router.post("/register", async (req, res) => {
  try {
    // check if user is alr exixts
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "user already exists",
      });
    }

    //hash pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //save user
    const user = new User(req.body);
    await user.save();

    return res.send({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//login user

router.post("/login", async (req, res) => {
  try {
    //check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "user not found",
      });
    }

    //check if userType is matching
    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `user is not registered as a ${req.body.userType}`,
      });
    }

    //compare password

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "invalid password",
      });
    }
    //generate token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    return res.send({
      success: true,
      message: "user logged in sucessfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});
// get current user

router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    return res.send({
      success: true,
      message: "user fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unqiue donors
router.get("/get-all-donors", authMiddleware, async (req, res) => {
  try {
    //get all unique donor ids from inventory
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueDonorIds = await Inventory.distinct("donor", {
      organisation,
    });
    const donors = await User.find({
      _id: { $in: uniqueDonorIds },
    });
    return res.send({
      success: true,
      message: "donors fetched successfully",
      data: donors,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unque hospitals
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  try {
    //get all unique hospital ids from inventory
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organisation,
    });
    const hospitals = await User.find({
      _id: { $in: uniqueHospitalIds },
    });
    return res.send({
      success: true,
      message: "hospitals fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unique organisations for donor
router.get(
  "/get-all-organisations-of-a-donor",
  authMiddleware,
  async (req, res) => {
    try {
      //get all unique organisation ids from inventory
      const donor = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganisationIds = await Inventory.distinct("organisation", {
        donor,
      });
      const organisations = await User.find({
        _id: { $in: uniqueOrganisationIds },
      });
      return res.send({
        success: true,
        message: "organisations fetched successfully",
        data: organisations,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

// get all unqiue organisations for a hospital
router.get(
  "/get-all-organisations-of-a-hospital",
  authMiddleware,
  async (req, res) => {
    try {
      //get all unique organisation ids from inventory
      const hospital = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganisationIds = await Inventory.distinct("organisation", {
        hospital,
      });
      const organisations = await User.find({
        _id: { $in: uniqueOrganisationIds },
      });
      return res.send({
        success: true,
        message: "organisations fetched successfully",
        data: organisations,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
