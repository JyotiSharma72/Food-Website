import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://jyotisharma6672:234567890@cluster0.g5zdk.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}