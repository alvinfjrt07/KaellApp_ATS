import { Router } from "express";
import categoryRoutes from "./categories.route";
import postRoutes from "./post.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/categories", categoryRoutes);
router.use("/posts", postRoutes);
router.use("/auth", authRoutes);

export default router;