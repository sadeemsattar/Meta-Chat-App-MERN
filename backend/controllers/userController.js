const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const createToken = require("../JWTauth/jwt");
const bcryptPassword = require("../encryption/passwordEncryption");
const dcryptPassword = require("../encryption/passwordDcryption");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avater } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Insert ALL Fields");
  }
  const userExit = await User.findOne({ email });
  if (userExit) {
    res.status(400);
    throw new Error("User Already Exist");
  }

  const newUser = await User.create({
    name,
    email,
    password: await bcryptPassword(password),
    avater,
  });
  if (newUser) {
    res.cookie("accessToken", createToken(newUser._id), {
      // maxAge: 1800000, //30 min
      httpOnly: true,
    });
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avater: newUser.avater,
      token: createToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed To Create New User");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  const match = await dcryptPassword(password, findUser.password);
  if (findUser && match) {
    res.cookie("accessToken", createToken(findUser._id), {
      // maxAge: 1800000, //30 min
      httpOnly: true,
    });
    res.status(200).json({
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      avater: findUser.avater,
      token: createToken(findUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Credentials");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const findWord = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  res.send(await User.find(findWord).find({ _id: { $ne: req.userID } }));
});
module.exports = { registerUser, authUser, allUsers };
