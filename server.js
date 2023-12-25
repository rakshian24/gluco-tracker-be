import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import connectDB from "./database/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import glucoReadingRoutes from "./routes/glucoReadingRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
dotenv.config({ path: "./.env" });

connectDB();

const { SERVER_PORT, NODE_ENV } = process.env;

const app = express();
const port = SERVER_PORT || 5000;

// Since we are using E6 modules for NodeJS, __dirname will not be present for modules, we need to do some work around as below for making __dirname to work
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ['http://localhost:3000', 'https://rakshian-gluco-tracker.vercel.app']
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/glucoseReading", glucoReadingRoutes);
app.use("/api/v1/foods", foodRoutes);

if (NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else if (NODE_ENV === "development") {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
