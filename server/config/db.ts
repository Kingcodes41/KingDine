import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("MongoDB connected successfully!"));
        mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err));
        
        const mongoURI = process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/king-dine";
        await mongoose.connect(mongoURI);
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;