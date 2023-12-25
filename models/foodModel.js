import mongoose from 'mongoose';

const foodSchema = mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, 'Please enter the food you consumed!'],
      maxLength: [35, 'Food name is exceeding the max character(35)'],
      unique: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: [true, 'Please enter the food label!'],
      maxLength: [35, 'Food label is exceeding the max character(35)'],
      unique: true,
      lowercase: true,
    }
  },
  {
    timestamps: true,
  }
);

foodSchema.set('toObject', { virtuals: true });
foodSchema.set('toJSON', { virtuals: true });

foodSchema.virtual('readings', {
  ref: 'GlucoReading',
  localField: '_id',
  foreignField: 'consumedFoods',
  justOne: false
});

const Food = mongoose.model('Food', foodSchema);

export default Food;
