import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { pool } from "./db";

export const USER_ROLES = ["user", "admin"] as const;
export const POST_STATUS = ["deleted", "published"] as const;

export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", USER_ROLES).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const categoriesTable = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postsTable = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  content: text("content").notNull(),
  categoryId: int("category_id")
    .notNull()
    .references(() => categoriesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;
`;

const createCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;
`;

const createPostsTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_category
      FOREIGN KEY (category_id) REFERENCES categories(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE=InnoDB;
`;

export async function ensureDefaultCategories(): Promise<void> {
  const defaultCategories = [
    { name: "Olahraga", slug: "olahraga" },
    { name: "Pendidikan", slug: "pendidikan" },
    { name: "Teknologi", slug: "teknologi" },
  ];

  const [existingCategories] = await pool.query<any[]>("SELECT id, name, slug FROM categories");

  if (existingCategories.length === 0) {
    for (const category of defaultCategories) {
      await pool.query("INSERT INTO categories (name, slug) VALUES (?, ?)", [category.name, category.slug]);
    }
    console.log("Default categories berhasil dibuat.");
    return;
  }

  const names = existingCategories.map((item) => item.name);
  const slugs = existingCategories.map((item) => item.slug);
  const missing = defaultCategories.filter(
    (category) => !names.includes(category.name) || !slugs.includes(category.slug),
  );

  if (missing.length > 0) {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    await pool.query("DELETE FROM posts");
    await pool.query("DELETE FROM categories");
    await pool.query("ALTER TABLE categories AUTO_INCREMENT = 1");
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
    for (const category of defaultCategories) {
      await pool.query("INSERT INTO categories (name, slug) VALUES (?, ?)", [category.name, category.slug]);
    }
    console.log("Kategori diganti ke: Olahraga, Pendidikan, Teknologi.");
    return;
  }

  console.log("Default categories sudah sesuai.");
}

export async function initializeSchema(): Promise<void> {
  await pool.query(createUsersTable);
  await pool.query(createCategoriesTable);
  await pool.query(createPostsTable);
  await ensureDefaultCategories();
  console.log("Schema database berhasil dibuat.");
}