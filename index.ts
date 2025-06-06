import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookiesParser from 'cookie-parser';
import connectDb from './config/dbConnect';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import addressRoutes from './routes/addressRoutes';
import userRoutes from './routes/userRoutes';


dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
const corsOption={
    origin:process.env.FRONT_URL, 
    credentials:true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookiesParser());


app.listen(PORT,()=>{
    console.log(`lission port ${PORT}`);
    
})


connectDb();

app.use("/api/auth",authRoutes)
app.use("/api/product",productRoutes)
app.use("/api/user/address",addressRoutes)
app.use("/api/user/profile",userRoutes)
