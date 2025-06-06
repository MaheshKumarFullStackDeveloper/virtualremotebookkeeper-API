import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import * as addressController  from "../controllers/addressController";
const router= Router();

router.post("/create-or-update",authenticatedUser,multerMiddleware,addressController.createOrUpdateAddressByUserId);
router.get("/",authenticatedUser,addressController.getAddressByIserId);
export default router;



