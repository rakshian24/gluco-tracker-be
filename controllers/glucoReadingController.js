import asyncHandler from "express-async-handler";
import moment from "moment";

import User from "../models/userModel.js";
import GlucoReading from "../models/glucoReadingModel.js";
import Food from "../models/foodModel.js";
import { AppError, getFormattedTimeStamp, isArrayEmpty } from "../utils/index.js";

// description  Adding glucose reading data
// route        POST /api/v1/glucoseReading
// access       Private
const createReading = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const {
      type,
      reading,
      consumedFoods,
      description,
      isMedsTaken = null,
      isExercised } = req.body;

    //TODO: add logic to add only one value (BB, AB, BL, AL, BD, AD) for the day;

    const newReading = await GlucoReading.create({
      type,
      reading,
      consumedFoods,
      description,
      isExercised,
      isMedsTaken,
      userId: user._id
    });

    res.status(201).json({
      data: {
        _id: newReading._id,
        reading: newReading.reading,
        consumedFoods: newReading.consumedFoods,
        description: newReading.description,
        isExercised: newReading.isExercised,
        isMedsTaken: newReading.isMedsTaken,
        userId: newReading.userId,
        createdAt: getFormattedTimeStamp(newReading.createdAt)
      }
    })

  } else {
    throw new AppError('User not found', 404);
  }
});

// description  Get all the glucose readings of a loggedIn user.
// route        GET /api/v1/glucoseReading/all
// access       Private
const getAllReadings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    //TODO: Need to filter this based on loggedin user
    //Get the readings of all the foodIds passed in the query param
    const foodIds = req.query?.foodIds?.split(",");
    if (!isArrayEmpty(foodIds)) {
      const readingsForSelectedFood = await Food.find({ "_id": { $in: foodIds } }).populate('readings');
      return res.status(200).json(readingsForSelectedFood);
    }

    //Aggregation query for getting all the readings of a loggedIn user and grouping them by date
    const readings = await GlucoReading.aggregate([
      {
        $match: {
          'userId': user._id
        }
      },
      {
        $lookup:
        {
          from: "foods",
          localField: "consumedFoods",
          foreignField: "_id",
          as: "consumedFoods"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$createdAt"
            }
          },
          results: {
            $push: "$$ROOT"
          }
        }
      },
      {
        $sort: { '_id': -1 }
      }
    ]);

    res.status(200).json(readings);
  } else {
    throw new AppError('User not found', 404);
  }
});

// description  Get glucose readings for a passed date.
// route        GET /api/v1/glucoseReading/:date
// access       Private
const getReadingsForDate = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { date } = req.params;

  let startDate = moment(date, "DD-MM-YYYY").startOf('day').toDate();
  const endDate = moment(date, "DD-MM-YYYY").endOf('day').toDate();

  if (user) {
    const readings = await GlucoReading.find({
      userId: user._id,
      createdAt: {
        $gte: startDate,
        $lt: endDate
      }
    }).populate('consumedFoods');

    res.status(200).json(readings);
  } else {
    throw new AppError('User not found', 404);
  }
});

export {
  createReading,
  getAllReadings,
  getReadingsForDate
}