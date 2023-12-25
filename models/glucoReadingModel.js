import mongoose from 'mongoose';
import { AppError } from '../utils/index.js';

const typeForMakingConsumedFoodsRequired = ['AB', 'AL', 'AD'];
const typeForMakingIsMedsTakenRequired = ['AB', 'AD'];

const glucoReadingSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please select the type!'],
      enum: ['BB', 'AB', 'BL', 'AL', 'BD', 'AD'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reading: {
      type: Number,
      required: [true, 'Reading is required!'],
      min: [51, 'Reading must be greater than 50'],
      max: [400, 'Exceeding the reading limit(400)'],
      validate: {
        validator: function (readingValue) {
          // Below regex is for allowing only positive non decimal numbers with null value
          if (!(/^(?!0+(?:\0+)?)\d*(?:\d+)?$/.test(readingValue))) {
            throw new AppError('Special characters are not allowed', 400)
          }
        }
      }
    },
    isMedsTaken: {
      type: Boolean,
      validate: {
        validator: function (isMedsTaken) {
          if (typeForMakingIsMedsTakenRequired.includes(this.type) && isMedsTaken === null) {
            throw new AppError('Have you taken your pills yet?', 400)
          }
        }
      }
    },
    consumedFoods: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Food',
      validate: {
        validator: function (consumedFoodsVal) {
          if (typeForMakingConsumedFoodsRequired.includes(this.type)) {
            if (consumedFoodsVal && consumedFoodsVal.length > 0) {
              return true
            } else {
              return false
            }
          } else {
            return true
          }
        },
        message: 'Please provide the food consumed!'
      }
    },
    description: {
      type: String,
      maxLength: [250, "Description is longer than the max length(250)"],
    },
    isExercised: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const GlucoReading = mongoose.model('GlucoReading', glucoReadingSchema);

export default GlucoReading;
