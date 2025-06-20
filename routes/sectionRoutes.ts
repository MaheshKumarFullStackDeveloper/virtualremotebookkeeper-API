import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as sectionController  from "../controllers/sectionController";
const router= Router();

router.post("/",authenticatedUser,sectionController.createOrUpdateSectionsByPageId);
router.get("/pageId",sectionController.getSectionsBypageId);
router.delete("/:sectionId",authenticatedUser,sectionController.deleteSection);
export default router;



