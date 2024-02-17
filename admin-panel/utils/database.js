import mongoose from "mongoose";

const connectDb = async () => {
    try {
        if(mongoose.connections[0].readyState){
            return true;
        }
        await mongoose.connect(process.env.MONGO_URI);
        // console.log('MongoDB connected');
        return true;
        
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDb;