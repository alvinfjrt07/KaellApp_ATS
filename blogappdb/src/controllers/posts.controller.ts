import { Request, Response } from "express";
import { db } from "../config/db";
import { postsTable } from "../config/schema";
import {
  createPostSchema,
  updatePostSchema,
} from "../validations/posts.validation";
import { eq } from "drizzle-orm";

export default class PostsController {
  // GET semua posts
  static getAll = async (req: Request, res: Response) => {
    try {
      const posts = await db.query.postsTable.findMany();
      return res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET post by ID
  static getById = async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = Number(idParam);
      const post = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, id),
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Artikel tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // CREATE post
  static create = async (req: Request, res: Response) => {
    try {
      const body = req.body ?? {};
      const normalizedBody = {
        title: body.title,
        content: body.content,
        categoryId: body.categoryId ?? body.category_id,
      };

      const validated = createPostSchema.parse(normalizedBody);
      const { title, content, categoryId } = validated;

      const slug = `${title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")}-${Date.now()}`;

      const result = await db
        .insert(postsTable)
        .values({ title, slug, content, categoryId });

      const newPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.slug, slug),
      });

      return res.status(201).json({
        success: true,
        message: "Artikel berhasil dibuat",
        data: newPost,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Gagal membuat artikel",
      });
    }
  };

  // UPDATE post
  static update = async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = Number(idParam);
      const body = req.body ?? {};
      const normalizedBody = {
        title: body.title,
        content: body.content,
        categoryId: body.categoryId ?? body.category_id,
      };
      const validated = updatePostSchema.parse(normalizedBody);

      const existing = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, id),
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Artikel tidak ditemukan",
        });
      }

      const dataUpdate: any = { ...validated };

      await db
        .update(postsTable)
        .set(dataUpdate)
        .where(eq(postsTable.id, id));

      const updated = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, id),
      });

      return res.status(200).json({
        success: true,
        message: "Artikel berhasil diupdate",
        data: updated,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Gagal update artikel",
      });
    }
  };

  // DELETE post
  static delete = async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = Number(idParam);

      const existing = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, id),
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Artikel tidak ditemukan",
        });
      }

      await db.delete(postsTable).where(eq(postsTable.id, id));

      return res.status(200).json({
        success: true,
        message: "Artikel berhasil dihapus",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}