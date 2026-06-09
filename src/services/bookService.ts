import { BOOK_ERRORS } from "../errors/bookErrors";
import { CustomError } from "../errors/customError";
import { CreateBookSchema, DeleteBookSchema, UpdateBookSchema, type CreateBook, type DeleteBook, type UpdateBook } from "../interfaces/bookInterface";
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

        async read() {
                const books = await prisma.book.findMany({ include: { authors: true } });
                return books;
        }

        async readOne(id: string) {
                const book = await prisma.book.findUnique({ where: { id }, include: { authors: true } });
                if (!book) throw new CustomError(BOOK_ERRORS.notFound);
                return book;
        }

        async update(data: UpdateBook) {
                const bookData = UpdateBookSchema.parse(data);

                const hasBook = await prisma.book.findUnique({ where: { id: bookData.id } });
                if (!hasBook) throw new CustomError(BOOK_ERRORS.notFound);

                const hasAuthors = bookData.authors.length > 0;
                if (hasAuthors) await this.validateAuthors(bookData.authors);

                const authorsSet = { set: bookData.authors.map((id) => ({ id })) };

                const book = await prisma.book.update({
                        where: { id: bookData.id },
                        data: { ...bookData, authors: authorsSet },
                        include: { authors: true },
                });

                return book;
        }

        async delete(data: DeleteBook) {
                const bookData = DeleteBookSchema.parse(data);

                const hasBook = await prisma.book.findUnique({ where: { id: bookData.id } });
                if (!hasBook) throw new CustomError(BOOK_ERRORS.notFound);

                const book = await prisma.book.delete({ where: { id: bookData.id } });

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
