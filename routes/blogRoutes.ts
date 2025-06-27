import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as blogController from "../controllers/blogController";
const router = Router();

router.post("/", authenticatedUser, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:slug", blogController.getBlogbySlug);
router.delete("/:blogId", authenticatedUser, blogController.deleteBlog);
export default router;



