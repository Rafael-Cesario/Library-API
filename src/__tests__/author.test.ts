import { faker } from "@faker-js/faker";
import { prisma } from "../prisma";
import { AUTHOR_ERRORS } from "../errors/authorErrors";
import { AuthorRequests } from "./utils/authorRequests";
import type { CreateAuthor } from "../interfaces/authorInterface";

describe("Author Routes", () => {
        const authorRequests = new AuthorRequests();

        describe("Create", () => {
                it("Should create a new author", async () => {
                        const data: CreateAuthor = { name: faker.person.fullName(), bio: faker.lorem.paragraph({ min: 1, max: 3 }) };
                        const response = await authorRequests.create(data);
                        const author = await prisma.author.findFirst({ where: { name: data.name } });

                        expect(author).not.toBeNull();
                        expect(author?.name).toBe(data.name);

                        expect(response.status).toBe(201);

                        expect(response.body).toEqual(
                                expect.objectContaining({
                                        id: expect.any(String),
                                        name: data.name,
                                        bio: data.bio,
                                        createdAt: expect.any(String),
                                        updatedAt: expect.any(String),
                                }),
                        );
                });

                it("Request Body is invalid", async () => {
                        const data = { name: "" };
                        const response = await authorRequests.create(data);

                        expect(response.status).toBe(400);

                        expect(response.body).toEqual(
                                expect.objectContaining({
                                        fieldErrors: {
                                                name: expect.any(Array),
                                                bio: expect.any(Array),
                                        },
                                }),
                        );
                });

                it("Can not create an author with the same name", async () => {
                        const data = { name: faker.person.fullName(), bio: faker.lorem.paragraph() };
                        const { status, ...body } = AUTHOR_ERRORS.duplicated;

                        await authorRequests.create(data);
                        const response = await authorRequests.create(data);

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });

        describe("Read", () => {
                it("Gets ten authors", async () => {
                        await authorRequests.createMany(10);

                        const response = await authorRequests.read();

                        expect(response.status).toBe(200);
                        expect(response.body.length).toBe(10);

                        expect(response.body[0]).toEqual(
                                expect.objectContaining({
                                        id: expect.any(String),
                                        name: expect.any(String),
                                        bio: expect.any(String),
                                        createdAt: expect.any(String),
                                        updatedAt: expect.any(String),
                                }),
                        );
                });

                it("Gets an empty array", async () => {
                        const response = await authorRequests.read();

                        expect(response.status).toBe(200);
                        expect(response.body).toEqual([]);
                });
        });

        describe("ReadOne", () => {
                it("Reads one author", async () => {
                        let response = await authorRequests.create({ name: faker.person.fullName(), bio: faker.lorem.paragraph() });
                        const id = response.body.id;

                        response = await authorRequests.readOne(id);

                        expect(response.status).toBe(200);

                        expect(response.body).toEqual(
                                expect.objectContaining({
                                        id: expect.any(String),
                                        name: expect.any(String),
                                        bio: expect.any(String),
                                        createdAt: expect.any(String),
                                        updatedAt: expect.any(String),
                                        books: expect.any(Array),
                                }),
                        );
                });

                it("Author not found", async () => {
                        const id = faker.string.uuid();
                        const response = await authorRequests.readOne(id);
                        const { status, ...body } = AUTHOR_ERRORS.notFound;

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });
});
