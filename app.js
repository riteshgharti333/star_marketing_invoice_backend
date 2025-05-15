import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import { errorMiddleware } from "./middlewares/error.js";

import authRouter from "./routes/authRoute.js";
import customerRouter from "./routes/customerRoute.js";
import productRouter from "./routes/productRoute.js";
import bankRouter from "./routes/bankRoute.js";
import sigRouter from "./routes/sigRoute.js";
import invoiceRouter from "./routes/invoiceRoute.js";
import quotationRouter from "./routes/quotationRoute.js";

import ErrorHandler from "./utils/errorHandler.js";

// Initialize Express app
export const app = express();

app.use(helmet());
app.use(mongoSanitize());

// Load environment variables
config({
  path: "./data/config.env",
});

// Configure CORS settings
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new ErrorHandler("Not allowed by CORS", 403));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/backend/api/auth", authRouter);
app.use("/backend/api/customer", customerRouter);
app.use("/backend/api/product", productRouter);
app.use("/backend/api/bank", bankRouter);
app.use("/backend/api/signature", sigRouter);
app.use("/backend/api/invoice", invoiceRouter);
app.use("/backend/api/quotation", quotationRouter);

app.get("/backend", (req, res) => {
  res.send("Welcome to Backend");
});

// Error Middleware
app.use(errorMiddleware);
