import * as z from "zod";
import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";

export const errorMiddleware = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (error instanceof ZodError) {
                return res.status(400).json(z.flattenError(error));
        }

        if (error instanceof CustomError) {
                const { status, code, message } = error;
                return res.status(status).json({ code, message });
        }

        return res.status(500).json({ error: "Internal server error" });
};
