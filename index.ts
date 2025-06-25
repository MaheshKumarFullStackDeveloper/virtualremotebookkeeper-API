import { Request, Response } from "express";
import dotenv from 'dotenv';
const express = require('express');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 8080;

app.get('/', (req: Request, res: Response) => { res.send(`Hello from Express! ${PORT}`) });

module.exports = app; // ✅ Don't call app.listen()