import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookiesParser from "cookie-parser";

// Database
import connectDb from "../config/dbConnect";

// Routes
import authRoutes from "../routes/authRoutes";
import productRoutes from "../routes/productRoutes";
import imageRoutes from "../routes/imageRoutes";
import userRoutes from "../routes/userRoutes";
import pageRoutes from "../routes/pageRoutes";
import sectionRoutes from "../routes/sectionRoutes";
import blogRoutes from "../routes/blogRoutes";
import faqcategoryRoutes from "../routes/faqcategoryRoutes";
import faqRoutes from "../routes/faqRoutes";
import categoryRoutes from "../routes/categoryRoutes";
import menuRoutes from "../routes/menuRoutes";
import widgetRoutes from "../routes/widgetRoutes";

dotenv.config();

const app = express();
const corsOption = {
    origin: "*",
    credentials: true
};

// CORS handling
app.use(cors(corsOption));
app.options("/*", cors()); // 👈 Fixes wildcard crash

app.use(express.json());
app.use(bodyParser.json());
app.use(cookiesParser());

// Database connection (will only run once in serverless)
connectDb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/page", pageRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/faqcategory", faqcategoryRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/widget", widgetRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/navigation", menuRoutes);
app.use("/api/user/profile", userRoutes);

// Root
app.get("/", (req: Request, res: Response) => {
    res.send(`Hello from Express at ${new Date().toISOString()}`);
});

// ❌ Do NOT include app.listen — Vercel handles the HTTP server
export default app;