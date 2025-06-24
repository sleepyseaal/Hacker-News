import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

const ORIGIN = process.env.ORGIN || "localhost:3000";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { authRoutes } from "./src/routes/index.js";

import { errorHandler, notFound } from "./src/middleWares/errorHandler.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

app.use(cors({ origin: ORIGIN }));
app.use(helmet());
app.use(limiter);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    sucess: true,
    message: "Hello World!",
    data: null,
  });
});

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
