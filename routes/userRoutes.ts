import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import * as userController  from "../controllers/userController";
const router= Router();

router.put("/update",authenticatedUser,multerMiddleware,userController.updateUserByUserId);
export default router;



