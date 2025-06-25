import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import * as menuController from "../controllers/menuController";
const router = Router();

router.post("/menu", authenticatedUser, menuController.createMenu);
router.get("/menu/:page/:limit", menuController.getAllMenus);
router.delete("/menu/:menuId", authenticatedUser, menuController.deleteMenu);

router.post("/item", authenticatedUser, menuController.createItem);
router.delete("/item/:itemId", authenticatedUser, menuController.deleteItem);

router.get("/menuwithitem", menuController.getALLMenuWithItems);
export default router;



