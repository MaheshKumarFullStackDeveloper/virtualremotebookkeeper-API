import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import * as imageController from "../controllers/imageController";
const router = Router();

//router.post("/",authenticatedUser,multerMiddleware,imageController.uploadPhoto);
router.get("/:page/:limit", imageController.getAllImages);
router.delete("/:imageId", authenticatedUser, imageController.deleteImage);
//router.get("/user/:userId", imageController.getImagesByUserId);
export default router;



