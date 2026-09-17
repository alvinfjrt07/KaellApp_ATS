import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD } = process.env;

export default defineConfig({
  schema: './src/config/schema.ts',
  dialect: "mysql",
  dbCredentials: {
    host: DB_HOST!,
    port: Number(DB_PORT || 3306),
    user: DB_USER!,
    database: DB_NAME!,
    password: DB_PASSWORD!,
  },
});