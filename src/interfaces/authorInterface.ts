import * as z from "zod";

export const CreateAuthorSchema = z.object({
        name: z.string().min(3).max(20),
        bio: z.string().min(3).max(200),
});

export type CreateAuthor = z.infer<typeof CreateAuthorSchema>;
