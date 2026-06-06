import * as z from "zod";

// export interface Author {
//         id: string;
//         name: string;
//         bio: string;
//         books?: [];
// }

export const CreateAuthorSchema = z.object({
        name: z.string().min(3).max(40),
        bio: z.string().min(3).max(400),
});

export const UpdateAuthorSchema = z.object({
        id: z.uuid(),
        name: z.string().min(3).max(40),
        bio: z.string().min(3).max(400),
});

export type CreateAuthor = z.infer<typeof CreateAuthorSchema>;
export type UpdateAuthor = z.infer<typeof UpdateAuthorSchema>;
