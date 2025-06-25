
import express, { Request, Response, NextFunction } from "express";

import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookiesParser from 'cookie-parser';
import connectDb from './config/dbConnect';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import imageRoutes from './routes/imageRoutes';
import userRoutes from './routes/userRoutes';
import pageRoutes from './routes/pageRoutes';
import sectionRoutes from './routes/sectionRoutes';
import blogRoutes from './routes/blogRoutes';
import faqcategoryRoutes from './routes/faqcategoryRoutes';
import faqRoutes from './routes/faqRoutes';
import categoryRoutes from './routes/categoryRoutes';
import menuRoutes from './routes/menuRoutes';
import widgetRoutes from './routes/widgetRoutes';


dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
const corsOption = {
    //origin: process.env.FRONT_URL,
    origin: '*',
    credentials: true
}




// Middleware to handle CORS errors
const corsErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
    const allowedOrigins = [process.env.FRONT_URL];
    if (!allowedOrigins.includes(req.headers.origin as string)) {
        res.status(403).json({ error: "CORS error: Origin not allowed" });
    } else {
        next();
    }
};



app.use(cors(corsOption));
//app.use(corsErrorHandler);



app.use(express.json());
app.use(bodyParser.json());
app.use(cookiesParser());


app.listen(PORT, () => {
    console.log(`lission port ${PORT}`);

})


connectDb();



app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/page", pageRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/blog", blogRoutes)
app.use("/api/faqcategory", faqcategoryRoutes)
app.use("/api/faq", faqRoutes)
app.use("/api/section", sectionRoutes)
app.use("/api/widget", widgetRoutes)
app.use("/api/image", imageRoutes)
app.use("/api/navigation", menuRoutes)
app.use("/api/user/profile", userRoutes)



app.get('/', (req: Request, res: Response) => { res.send(`Hello - 11 from Express! ${PORT}`) }); 
