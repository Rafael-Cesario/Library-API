import * as z from "zod";

export const CreateAuthorSchema = z.object({
        name: z.string().min(3).max(40),
        bio: z.string().min(3).max(400),
});

export const UpdateAuthorSchema = z.object({
        id: z.uuid(),
        name: z.string().min(3).max(40),
        bio: z.string().min(3).max(400),
});

export const DeleteAuthorSchema = z.object({
        id: z.uuid(),
});

export type CreateAuthor = z.infer<typeof CreateAuthorSchema>;
export type UpdateAuthor = z.infer<typeof UpdateAuthorSchema>;
export type DeleteAuthor = z.infer<typeof DeleteAuthorSchema>;
