import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { categoriesTable } from "../config/schema";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/categories.validation";

export default class CategoriesController {
  static getAll = async (_req: Request, res: Response) => {
    try {
      const categories = await db.query.categoriesTable.findMany();

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = Number(idParam);

      const category = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, id),
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Kategori tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const validated = createCategorySchema.parse(req.body);
      const { name } = validated;
      const slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "kategori";

      const [inserted] = await db
        .insert(categoriesTable)
        .values({ name, slug })
        .$returningId();

      const newCategory = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, inserted.id),
      });

      return res.status(201).json({
        success: true,
        message: "Kategori berhasil dibuat",
        data: newCategory,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Gagal membuat kategori",
      });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = Number(idParam);
      const validated = updateCategorySchema.parse(req.body);

      const existing = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, id),
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Kategori tidak ditemukan",
        });
      }

      const dataUpdate: any = { ...validated };

      await db
        .update(categoriesTable)
        .set(dataUpdate)
        .where(eq(categoriesTable.id, id));

      const updated = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, id),
      });

      return res.status(200).json({
        success: true,
        message: "Kategori berhasil diupdate",
        data: updated,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Gagal update kategori",
      });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = Number(idParam);

      const existing = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, id),
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Kategori tidak ditemukan",
        });
      }

      await db.delete(categoriesTable).where(eq(categoriesTable.id, id));

      return res.status(200).json({
        success: true,
        message: "Kategori berhasil dihapus",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}