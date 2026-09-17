import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  categoryId: z.number({ message: "categoryId harus angka" }),
});

export const updatePostSchema = z
  .object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    categoryId: z.number().optional(),
  })
  .transform((value) => ({
    ...(value.title !== undefined ? { title: value.title } : {}),
    ...(value.content !== undefined ? { content: value.content } : {}),
    ...(value.categoryId !== undefined ? { categoryId: value.categoryId } : {}),
  }));