import mongoose, { connect } from "mongoose";

import dotenv from "dotenv";

const connectiondb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connectd");
    
  } catch (error) {

    console.log("Mongodb connection failed",error);
    
  }
};

export default connectiondb;
