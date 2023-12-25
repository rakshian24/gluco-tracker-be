import { AppError } from "../utils/index.js";

const notFound = (req, res, next) => {
  const error = new AppError(`Can't find the route - ${req.originalUrl}`, 404);
  next(error);
};

const handleValidationError = (error) => {
  let allErrors = {};

  //Storing errors in key value pair
  Object.values(error.errors).forEach((item) => {
    return (allErrors[item.path] = item.message);
  });

  const message = JSON.stringify(allErrors);
  return new AppError(message, 400);
};

const handleDuplicateFieldsError = (error) => {
  let allErrors = {};

  Object.keys(error.keyValue).forEach((item) => {
    return (allErrors[
      item
    ] = `This value already exists. Please use another value`);
  });

  return new AppError(JSON.stringify(allErrors), 400);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.name = err.name;
  error.code = err.code;
  error.message = err.message;

  if (error.name === "ValidationError") {
    error = handleValidationError(err);
  }

  if (error.code === 11000) {
    error = handleDuplicateFieldsError(error);
  }

  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      ...process.env.NODE_ENV === "development" && { errorStack: error.stack }
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }


};

export { notFound, errorHandler };