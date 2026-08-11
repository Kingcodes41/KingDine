import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allows all device browser types to securely handshake
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const port = process.env.PORT || 10000;

app.use("/api/auth",authRouter);
app.use("/api/restaurant",restaurantRouter);
app.use("/api/booking",bookingRouter);
app.use("/api/owner",ownerRouter);
app.use("/api/admin",adminRouter);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error", stack: process.env.NODE_ENV === "production" ? undefined : err.stack });

});

const startServer = async () => {
    try {
        await connectDB();

        app.get('/', (req: Request, res: Response) => {
            res.send('Server is Live!');
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();