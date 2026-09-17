import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postsRouter from "./routes/posts.route";
import categoriesRouter from "./routes/categories.route";
import authRoutes from "./routes/auth.routes";
import { initializeSchema } from "./config/schema";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/categories", categoriesRouter);

app.get("/", (req, res) => {
  res.send("Blog API is running!");
});

async function startServer() {
  await initializeSchema();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Gagal menjalankan server:", error);
  process.exit(1);
});