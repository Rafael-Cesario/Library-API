import type { CreateAuthor } from "../interfaces/authorInterface";
import { prisma } from "../prisma";

export class AuthorService {
        async create(data: CreateAuthor) {
                const author = await prisma.author.create({ data });
                return author;
        }
}
