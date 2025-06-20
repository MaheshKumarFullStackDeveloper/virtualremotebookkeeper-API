import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as userController  from "../controllers/userController";
const router= Router();

router.put("/update",authenticatedUser,userController.updateUserByUserId);
router.put("/update-password",authenticatedUser,userController.updateUserPasswordByUserId);
export default router;



