import mongoose from "mongoose";
const connectDB = async () => {
    mongoose.connection.on("connected", () => console.log("MongoDB connected successfully!"));
    mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err));
    // Hardcoded string bypasses OneDrive .env file locks entirely
    const fallbackURI = "mongodb://127.0.0.1:27017/king-dine2";
};
export default connectDB;
