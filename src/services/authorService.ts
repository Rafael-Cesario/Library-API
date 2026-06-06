import { AUTHOR_ERRORS } from "../errors/authorErrors";
import { CustomError } from "../errors/customError";
import { CreateAuthorSchema, UpdateAuthorSchema, type CreateAuthor, type UpdateAuthor } from "../interfaces/authorInterface";
import { prisma } from "../prisma";

export class AuthorService {
        async create(data: CreateAuthor) {
                const authorData = CreateAuthorSchema.parse(data);

                const duplicated = await prisma.author.findFirst({ where: { name: authorData.name } });
                if (duplicated) throw new CustomError(AUTHOR_ERRORS.duplicated);

                const author = await prisma.author.create({ data: authorData });

                return author;
        }

        async read() {
                const authors = await prisma.author.findMany({});
                return authors;
        }

        async readOne(id: string) {
                const author = await prisma.author.findUnique({ where: { id }, include: { books: true } });
                if (!author) throw new CustomError(AUTHOR_ERRORS.notFound);

                return author;
        }

        async update(data: UpdateAuthor) {
                const authorData = UpdateAuthorSchema.parse(data);

                const author = await prisma.author.findUnique({ where: { id: authorData.id } });
                if (!author) throw new CustomError(AUTHOR_ERRORS.notFound);

                const sameNameDifferentId = { where: { NOT: { id: authorData.id }, name: authorData.name } };
                const duplicated = await prisma.author.findFirst(sameNameDifferentId);
                if (duplicated) throw new CustomError(AUTHOR_ERRORS.duplicated);

                const newAuthor = await prisma.author.update({ where: { id: authorData.id }, data: authorData });

                return newAuthor;
        }
}
