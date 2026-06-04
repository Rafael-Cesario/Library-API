import * as z from "zod";
import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";

export const errorMiddleware = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (error instanceof ZodError) {
                return res.status(400).json(z.flattenError(error));
        }

        return res.status(500).json({ error: "Internal server error" });
};
