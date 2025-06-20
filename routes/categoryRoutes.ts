import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as categoryController from "../controllers/categoryController";
const router = Router();

router.post("/", authenticatedUser, categoryController.createCategory);
router.get("/:page/:limit", categoryController.getAllCategory);
router.get("/:slug", categoryController.getCategorybySlug);
router.delete("/:categoryId", authenticatedUser, categoryController.deleteCategory);
export default router;



