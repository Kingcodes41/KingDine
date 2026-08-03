import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // FORCE IPv4 address to bypass local DNS lookup bugs
    const mongoURI = "mongodb://127.0.0.1:27017/king-dine";
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000, // Drop connection attempt after 3 seconds instead of 10
    });
    
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
};


export default connectDB;