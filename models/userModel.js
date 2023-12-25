import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      minLength: [2, "Name is shorter than the minimum length(2)"],
      maxLength: [15, "Name is longer than the maximum length(15)"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      maxLength: [35, "Email is longer than the maximum length(35)"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [5, "Password is shorter than the minimum length(5)"],
      maxLength: [15, "Password is longer than the maximum length(15)"],
    },
    confirmPassword: {
      type: String,
      required: function () {
        if (!this.isModified("password")) {
          return false;
        }
        return [true, "Please confirm your password!"];
      },
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords don't match",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving it to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
});

// Match user entered password to the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
