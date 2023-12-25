import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { AppError } from "../utils/index.js";

// description  SignIn user and set token
// route        POST /api/v1/users/signIn
// access       Public
const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    let message = {};

    if (!email) {
      message.email = "Email is required!";
    }

    if (!password) {
      message.password = "Password id required!";
    }
    throw new AppError(JSON.stringify(message), 400);
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(201).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    throw new AppError("Invalid email or password", 401);
  }
});

// description  Sign up a user
// route        POST /api/v1/users
// access       Public
const signUpUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    throw new AppError("Invalid user data", 400);
  }
});

// description  Sign out user
// route        POST /api/v1/users/signOut
// access       Public
const signOutUser = asyncHandler((req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Signed out successfully" });
});

// description  Get a user profile
// route        GET /api/v1/users/profile
// access       Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    throw new AppError("User not found", 404);
  }
});

// description  Update user profile
// route        PUT /api/v1/users/profile
// access       Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const allowableFieldsForUpdate = ["name"];
  const updatePayload = {};

  for (let field of Object.keys(req.body)) {
    if (req.body[field] !== "" && allowableFieldsForUpdate.includes(field)) {
      updatePayload[field] = req.body[field];
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new AppError("Failed to udpate.", 400);
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updatePayload },
    { new: true }
  );

  res.status(200).json({
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });

  if (!updatedUser) {
    throw new AppError("Failed to udpate.", 400);
  }
});

export {
  signInUser,
  signUpUser,
  signOutUser,
  getUserProfile,
  updateUserProfile,
};
