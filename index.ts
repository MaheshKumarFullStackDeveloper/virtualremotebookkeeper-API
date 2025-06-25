import dotenv from 'dotenv';

import { Request, Response, NextFunction } from "express";

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
const express = require('express');
const app = express();

dotenv.config();

const corsOption = {
    origin: '*',
    credentials: true
}

app.use(cors(corsOption));

const PORT = process.env.PORT || 8080;




app.use(express.json());
app.use(bodyParser.json());
app.use(cookiesParser());

connectDb();

app.get('/', (req: Request, res: Response) => { res.send(`Hello - from Express! ${PORT}`) });

module.exports = app; // ✅ Don't call app.listen()