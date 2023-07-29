const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
//add inventory

router.post("/add", authMiddleware, async (req, res) => {
  try {
    // validate email and inventoryType
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid Email");
    if (req.body.inventoryType === "in" && user.userType !== "donor") {
      throw new Error("this email is not registered as a donor");
    }
    if (req.body.inventoryType === "out" && user.userType !== "hospital") {
      throw new Error("this email is not registered as a hospital");
    }
    if (req.body.inventoryType === "out") {
      //check if inventory is avail
      const requestedGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);

      const totalInofRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalIn = totalInofRequestedGroup[0].total || 0;
      const totalOutofRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutofRequestedGroup[0]?.total || 0;
      const availableQuantityofRequestedGroup = totalIn - totalOut;
      if (availableQuantityofRequestedGroup < requestedQuantity) {
        throw new Error(
          `only ${availableQuantityofRequestedGroup} units of ${requestedGroup.toUpperCase()} is available`
        );
      }
      req.body.hospital = user._id;
    } else {
      req.body.donor = user._id;
    }
    //add inventory
    const inventory = new Inventory(req.body);
    await inventory.save();
    return res.send({ success: true, message: "inventory added successfully" });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get inventory
router.get("/get", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find({
      organisation: req.body.userId,
    })
      .sort({ createdAt: -1 })
      .populate("donor")
      .populate("hospital");
    return res.send({
      success: true,
      data: inventory,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/filter", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find(req.body.filters)
      .limit(req.body.limit || 10)
      .sort({ createdAt: -1 })
      .populate("donor")
      .populate("hospital")
      .populate("organisation");
    return res.send({
      success: true,
      data: inventory,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
