import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as faqController from "../controllers/faqController";
const router = Router();

router.post("/", authenticatedUser, faqController.createFaq);
router.get("/", faqController.getAllFaqs);
router.get("/:id", faqController.getFaqbyId);
router.delete("/:faqId", authenticatedUser, faqController.deleteFaq);
export default router;



