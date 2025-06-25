import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as faqcategoryController from "../controllers/faqcategoryController";
const router = Router();

router.post("/", authenticatedUser, faqcategoryController.createFaqcategory);
router.get("/:page/:limit", faqcategoryController.getAllFaqcategory);
router.get("/:slug", faqcategoryController.getFaqcategorybySlug);
router.delete("/:categoryId", authenticatedUser, faqcategoryController.deleteFaqcategory);
export default router;



