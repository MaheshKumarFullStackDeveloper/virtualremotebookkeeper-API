import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as userController from "../controllers/userController";
const router = Router();

router.delete("/:userId", authenticatedUser, userController.deleteUser);
router.get("/userslist", authenticatedUser, userController.getAllUsers);
router.post("/create", authenticatedUser, userController.createUser);
router.put("/update", authenticatedUser, userController.updateUserByUserId);
router.put("/update-password", authenticatedUser, userController.updateUserPasswordByUserId);
export default router;



