
import express, { Request, Response, NextFunction } from "express";

import dotenv from 'dotenv';
import cors from 'cors';
import helmet from "helmet";
import rateLimit from "express-rate-limit"; // Rate limiting

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
app.use(helmet());


const allowedOrigins: string[] | undefined = process.env.CORS_ORIGIN?.split(',');

const corsOption = {
    origin: allowedOrigins,
    credentials: true
}




// Middleware to handle CORS errors
const corsErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (allowedOrigins !== undefined) {
        if (!allowedOrigins.includes(req.headers.origin as string)) {
            //    console.log(`log domain -- ${req.headers.origin}`, allowedOrigins);
            //   console.log(`req--`, req);
            //  console.log('Request Headers:', req.headers);
            res.status(403).json({ error: `CORS error: Origin not allowed. only allowed -- ${req.headers.origin}   1 ${process.env.CORS_ORIGIN}` });
        } else {
            //  console.log('Request Headers:', req.headers);
            next();
        }
    } else {
        console.log(" log domain 2 ", allowedOrigins);
        res.status(403).json({ error: `CORS error: Origin not allowed. only allowed new vv ${process.env.CORS_ORIGIN}` });
    }
};



app.use(cors(corsOption));
app.use(corsErrorHandler);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});
app.use(limiter);



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



app.get('/', (req: Request, res: Response) => { res.send(`Hello - 13 from Express! ${PORT}`) }); 
