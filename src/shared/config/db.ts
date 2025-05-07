import mongoose from "mongoose";
import { CONNECTION_STRING } from "../constants/env";

const connectToDatabase = async () => {
  try {
    console.log("Connecting to db...");
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to the server");
    process.exit(1);
  }
};

export default connectToDatabase;
