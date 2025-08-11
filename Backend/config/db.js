import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect('mongodb+srv://VamsiKrishna:9381400vkV@mycluster.3u4evzc.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster')
    .then(() =>console.log("DB Connected"));
};