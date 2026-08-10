import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // FORCE IPv4 address to bypass local DNS lookup bugs
   const mongoURI = "mongodb+srv://abimajegideonchubiojo_db_user:Declanrice41@cluster0.z1lwwdb.mongodb.net/king-dine?retryWrites=true&w=majority";

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