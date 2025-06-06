import mongoose from "mongoose";

const connectDb = async():Promise<void>=>{
      try {
       const connection = await mongoose.connect(process.env.MONGOODB_URL as string);
        console.log('database connected');
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
}

export default connectDb;