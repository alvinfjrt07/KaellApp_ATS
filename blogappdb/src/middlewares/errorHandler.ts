import { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) { 
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server",
  });
}