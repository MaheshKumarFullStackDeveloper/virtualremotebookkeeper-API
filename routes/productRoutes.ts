import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import * as productController  from "../controllers/productController";
const router= Router();

router.post("/",authenticatedUser,multerMiddleware,productController.createProduct);
router.get("/",productController.getAllProducts);
router.get("/:id",productController.getProductbyId);
router.delete("/seller/:productId",authenticatedUser,productController.deleteProduct);
router.get("/seller/:sellerId",productController.getProductsBySellerId);
export default router;



