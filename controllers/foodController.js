import asyncHandler from "express-async-handler";

import Food from "../models/foodModel.js";
import { AppError } from "../utils/index.js";
import User from "../models/userModel.js";

// description  Adding food consumed data
// route        POST /api/v1/foods
// access       Private
const createFood = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { value, label } = req.body;
    const newFood = await Food.create({ value, label });

    res.status(201).json({
      data: {
        _id: newFood._id,
        value: newFood.value,
        label: newFood.label
      }
    })
  } else {
    throw new AppError('User not found', 404);
  }
});

// description  Get all the glucose readings of a loggedIn user.
// route        GET /api/v1/foods/all
// access       Private
const getAllFoods = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const foods = await Food.find();
    res.status(200).json(foods);
  } else {
    throw new AppError('User not found', 404);
  }
});

export {
  createFood,
  getAllFoods
}