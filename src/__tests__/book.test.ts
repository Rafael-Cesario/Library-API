import { faker } from "@faker-js/faker";
import { BookRequests } from "./utils/bookRequests";
import { prisma } from "../prisma";
import { AuthorRequests } from "./utils/authorRequests";
import { BOOK_ERRORS } from "../errors/bookErrors";
import type { CreateBook } from "../interfaces/bookInterface";

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
});
