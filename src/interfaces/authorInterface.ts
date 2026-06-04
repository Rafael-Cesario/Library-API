import * as z from "zod";

export const CreateAuthorSchema = z.object({
        name: z.string().min(3).max(40),
        bio: z.string().min(3).max(400),
});

export type CreateAuthor = z.infer<typeof CreateAuthorSchema>;
