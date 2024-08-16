import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI);
    if (response) {
      console.log(`MongoDB Connected...`);
      console.log(`Host: ${response.connection.host}`);
    }
  } catch (error) {
    console.log("Coonection Error: ",error);
    
  }
}

export default connectDb;