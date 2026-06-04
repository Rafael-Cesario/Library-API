import { CreateAuthorSchema, type CreateAuthor } from "../interfaces/authorInterface";
import { prisma } from "../prisma";

export class AuthorService {
        async create(data: CreateAuthor) {
                const authorData = CreateAuthorSchema.parse(data);
                const author = await prisma.author.create({ data: authorData });
                
                return author;
        }
}
