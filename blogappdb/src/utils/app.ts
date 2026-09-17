import express, { Application } from "express";
import cors from "cors";
import routes from "../routes";
import { notFoundHandler, errorHandler } from "../middlewares/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog App API sedang berjalan",
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;