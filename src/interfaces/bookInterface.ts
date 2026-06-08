import * as z from "zod";

export const CreateBookSchema = z.object({
        title: z.string().min(3).max(100),
        pages: z.number(),
        publishedAt: z
                .number()
                .int()
                .positive()
                .transform((time) => String(time)),
        authors: z.array(z.uuid()).optional().default([]),
});

export const UpdateBookSchema = z.object({
        id: z.uuid(),
        title: z.string().min(3).max(100),
        pages: z.number(),
        publishedAt: z
                .number()
                .int()
                .positive()
                .transform((time) => String(time)),
        authors: z.array(z.uuid()).optional().default([]),
});

export type CreateBook = z.input<typeof CreateBookSchema>;
export type UpdateBook = z.input<typeof UpdateBookSchema>;
