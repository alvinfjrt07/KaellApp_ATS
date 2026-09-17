import { Router } from "express";
import PostsController from "../controllers/posts.controller";

const router = Router();

router.get("/", PostsController.getAll);
router.get("/:id", PostsController.getById);
router.post("/", PostsController.create);
router.put("/:id", PostsController.update);
router.delete("/:id", PostsController.delete);

export default router;