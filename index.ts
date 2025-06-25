import { Request, Response } from "express";

const express = require('express');
const app = express();

app.get('/', (req: Request, res: Response) => { res.send('Hello from Express!') });

module.exports = app; // ✅ Don't call app.listen()