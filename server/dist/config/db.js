import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is missing!");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
};
export default connectDB;
