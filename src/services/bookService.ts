import { BOOK_ERRORS } from "../errors/bookErrors";
import { CustomError } from "../errors/customError";
import { CreateBookSchema, type CreateBook } from "../interfaces/bookInterface";
import { prisma } from "../prisma";

export class BookService {
        async create(data: CreateBook) {
                const bookData = CreateBookSchema.parse(data);

                const hasAuthors = bookData.authors.length > 0;
                if (hasAuthors) await this.validateAuthors(bookData.authors);

                const authorsConnect = { connect: bookData.authors.map((id) => ({ id })) };

                const book = await prisma.book.create({
                        data: { ...bookData, authors: authorsConnect },
                        include: { authors: true },
                });

                return book;
        }

        private async validateAuthors(authorsIDs: string[]) {
                const authors = await prisma.author.findMany({
                        where: { id: { in: authorsIDs } },
                        select: { id: true },
                });

                const hasAllAuthors = authors.length === authorsIDs.length;
                if (!hasAllAuthors) throw new CustomError(BOOK_ERRORS.authorsNotFound);
        }
}
