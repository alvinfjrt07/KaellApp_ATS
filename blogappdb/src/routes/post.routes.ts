import { Router } from "express";
import PostsController from "../controllers/posts.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(PostsController.getAll));
router.get("/:id", asyncHandler(PostsController.getById));
router.post("/", asyncHandler(PostsController.create));
router.put("/:id", asyncHandler(PostsController.update));
router.delete("/:id", asyncHandler(PostsController.delete));

export default router;