import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as widgetController from "../controllers/widgetController";
const router = Router();

router.post("/", authenticatedUser, widgetController.createWidget);
router.get("/:page/:limit", widgetController.getAllWidgets);
router.get("/:id", widgetController.getWidgetbyId);
router.delete("/:widgetId", authenticatedUser, widgetController.deleteWidget);
export default router;



