import express from "express";
import connectDB from './config/db.js';  
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";


const app = express();

// Configure middleware - order is important

const allowedOrigin = 'http://localhost:5173';
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    console.log('Request Path:', req.path);
    next();
});

// Database connection
connectDB();

// Routes
app.get("/", (req, res) => {
    res.send("🚀 Server is working fine on localhost:4000");
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));