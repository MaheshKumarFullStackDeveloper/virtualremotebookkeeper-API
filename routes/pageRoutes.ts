import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as pageController from "../controllers/pageController";
const router = Router();

router.post("/", authenticatedUser, pageController.createPage);
router.get("/", pageController.getAllPages);
router.get("/:slug", pageController.getPagebySlug);
router.delete("/:pageId", authenticatedUser, pageController.deletePage);
export default router;



