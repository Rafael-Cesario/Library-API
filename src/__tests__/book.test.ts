import { faker } from "@faker-js/faker";
import { BookRequests } from "./utils/bookRequests";
import { prisma } from "../prisma";
import { AuthorRequests } from "./utils/authorRequests";
import { BOOK_ERRORS } from "../errors/bookErrors";
import type { CreateBook, UpdateBook } from "../interfaces/bookInterface";

describe("Book Routes", () => {
        const authorRequests = new AuthorRequests();
        const bookRequests = new BookRequests();

        describe("Create", () => {
                test("Create a new book without authors", async () => {
                        const data: Partial<CreateBook> = {
                                title: faker.book.title(),
                                pages: faker.number.int({ min: 50, max: 400 }),
                                publishedAt: faker.date.past().getTime(),
                        };

                        const response = await bookRequests.create(data);
                        const books = await prisma.book.findMany({});

                        expect(books.length).toBe(1);
                        expect(books[0]?.title).toBe(data.title);

                        expect(response.status).toBe(201);
                        expect(response.body).toEqual(
                                expect.objectContaining({
                                        id: expect.any(String),
                                        title: data.title,
                                        pages: data.pages,
                                        publishedAt: data.publishedAt?.toString(),
                                        createdAt: expect.any(String),
                                        updatedAt: expect.any(String),
                                        authors: [],
                                }),
                        );
                });

                test("Create a new book with authors", async () => {
                        const authorResponse = await authorRequests.createMany(2);
                        const [authorA, authorB] = authorResponse.map((res) => res.body);

                        const data: Partial<CreateBook> = {
                                title: faker.book.title(),
                                pages: faker.number.int({ min: 50, max: 400 }),
                                publishedAt: faker.date.past().getTime(),
                                authors: [authorA.id, authorB.id],
                        };

                        const bookResponse = await bookRequests.create(data);

                        expect(bookResponse.status).toBe(201);
                        expect(bookResponse.body.authors).toEqual([authorA, authorB]);
                });

                test("Request body is invalid", async () => {
                        const response = await bookRequests.create({ authors: ["123"] });

                        expect(response.status).toBe(400);
                        expect(response.body.fieldErrors).toEqual({
                                pages: ["Invalid input: expected number, received undefined"],
                                publishedAt: ["Invalid input: expected number, received undefined"],
                                title: ["Invalid input: expected string, received undefined"],
                                authors: ["Invalid UUID"],
                        });
                });

                test("Some authors were not found", async () => {
                        const response = await bookRequests.create({
                                title: faker.book.title(),
                                pages: faker.number.int({ min: 50, max: 400 }),
                                publishedAt: faker.date.past().getTime(),
                                authors: [faker.string.uuid(), faker.string.uuid()],
                        });

                        const { status, ...body } = BOOK_ERRORS.authorsNotFound;

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });

        describe("Read", () => {
                test("Read all books", async () => {
                        const totalBooks = 5;

                        await bookRequests.createMany(totalBooks);

                        const response = await bookRequests.read();

                        expect(response.status).toBe(200);
                        expect(response.body.length).toBe(totalBooks);
                        expect(response.body[0]).toHaveProperty("authors");
                });

                test("Gets an empty array", async () => {
                        const response = await bookRequests.read();
                        expect(response.status).toBe(200);
                        expect(response.body).toEqual([]);
                });
        });

        describe("Read One", () => {
                test("Read One book", async () => {
                        const bookResponse = await bookRequests.createMany(1);
                        const { id, title, authors } = bookResponse[0]?.body;

                        const response = await bookRequests.readOne(id);

                        expect(response.status).toBe(200);
                        expect(response.body.title).toBe(title);
                        expect(response.body.authors).toEqual(authors);
                });

                test("Book not found", async () => {
                        const response = await bookRequests.readOne(faker.string.uuid());
                        const { status, ...body } = BOOK_ERRORS.notFound;

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });

        describe("Update", () => {
                test("Update a book and its authors", async () => {
                        const authorsResponse = await authorRequests.createMany(2);
                        const [authorA, authorB] = authorsResponse.map((author) => author.body);

                        const [bookResponse] = await bookRequests.createMany(1);
                        const book = bookResponse?.body;

                        const newData: UpdateBook = {
                                id: book.id,
                                title: faker.book.title(),
                                pages: faker.number.int({ min: 50, max: 400 }),
                                publishedAt: faker.date.past().getTime(),
                                authors: [authorA.id, authorB.id],
                        };

                        const response = await bookRequests.update(newData);

                        expect(response.status).toBe(200);

                        expect(response.body).toEqual(
                                expect.objectContaining({
                                        id: newData.id,
                                        title: newData.title,
                                        pages: newData.pages,
                                        publishedAt: String(newData.publishedAt),
                                        authors: expect.any(Array),
                                        createdAt: expect.any(String),
                                        updatedAt: expect.any(String),
                                }),
                        );

                        expect(response.body.authors.length).toBe(2);

                        const authorsIds = response.body.authors.map((author: { id: string }) => author.id);

                        expect(authorsIds).toEqual(expect.arrayContaining([authorA.id, authorB.id]));
                });
        });
});
