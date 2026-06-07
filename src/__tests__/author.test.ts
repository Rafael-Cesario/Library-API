import { faker } from "@faker-js/faker";
import { prisma } from "../prisma";
import { AUTHOR_ERRORS } from "../errors/authorErrors";
import { AuthorRequests } from "./utils/authorRequests";
import type { CreateAuthor, UpdateAuthor } from "../interfaces/authorInterface";

describe("Author Routes", () => {
        const authorRequests = new AuthorRequests();

        describe("Create", () => {
                test("Should create a new author", async () => {
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

                test("Request Body is invalid", async () => {
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

                test("Can not create an author with the same name", async () => {
                        const data = { name: faker.person.fullName(), bio: faker.lorem.paragraph() };
                        const { status, ...body } = AUTHOR_ERRORS.duplicated;

                        await authorRequests.create(data);
                        const response = await authorRequests.create(data);

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });

        describe("Read", () => {
                test("Gets ten authors", async () => {
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

                test("Gets an empty array", async () => {
                        const response = await authorRequests.read();

                        expect(response.status).toBe(200);
                        expect(response.body).toEqual([]);
                });
        });

        describe("ReadOne", () => {
                test("Reads one author", async () => {
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

                test("Author not found", async () => {
                        const id = faker.string.uuid();
                        const response = await authorRequests.readOne(id);
                        const { status, ...body } = AUTHOR_ERRORS.notFound;

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });

        describe("Update", () => {
                test("Updates an author", async () => {
                        const data = { name: faker.person.fullName(), bio: faker.lorem.paragraph() };
                        const oldAuthor = (await authorRequests.create(data)).body;

                        const response = await authorRequests.update({
                                id: oldAuthor.id,
                                name: faker.person.fullName(),
                                bio: faker.lorem.paragraph(),
                        });

                        const newAuthor = response.body;

                        expect(response.status).toBe(200);
                        expect(oldAuthor).not.toEqual(newAuthor);
                });

                test("Request body is invalid", async () => {
                        const response = await authorRequests.update({ id: "123", name: "" });

                        expect(response.status).toBe(400);

                        expect(response.body).toEqual(
                                expect.objectContaining({
                                        fieldErrors: {
                                                id: ["Invalid UUID"],
                                                name: ["Too small: expected string to have >=3 characters"],
                                                bio: ["Invalid input: expected string, received undefined"],
                                        },
                                }),
                        );
                });

                test("Author not found", async () => {
                        const data: UpdateAuthor = { id: faker.string.uuid(), name: faker.person.fullName(), bio: faker.lorem.paragraph() };
                        const response = await authorRequests.update(data);
                        const { status, ...body } = AUTHOR_ERRORS.notFound;

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });

                test("An author with the same name already exist", async () => {
                        let data: CreateAuthor = { name: faker.person.fullName(), bio: faker.lorem.paragraph() };
                        const authorA = (await authorRequests.create(data)).body;

                        data = { name: faker.person.fullName(), bio: faker.lorem.paragraph() };
                        const authorB = (await authorRequests.create(data)).body;

                        const response = await authorRequests.update({ id: authorB.id, name: authorA.name, bio: authorB.bio });

                        const { status, ...body } = AUTHOR_ERRORS.duplicated;

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });

        describe("Delete", () => {
                test("Deletes an author", async () => {
                        const data = { name: faker.person.fullName(), bio: faker.lorem.paragraph() };

                        let response = await authorRequests.create(data);
                        let author = response.body;

                        let authors = await prisma.author.findMany({});
                        expect(authors.length).toBe(1);

                        response = await authorRequests.delete({ id: author.id });
                        author = response.body;

                        authors = await prisma.author.findMany({});
                        expect(authors.length).toBe(0);

                        expect(author.name).toBe(data.name);
                });

                test("Id is required", async () => {
                        const response = await authorRequests.delete({});

                        expect(response.status).toBe(400);
                        expect(response.body).toEqual({
                                fieldErrors: { id: ["Invalid input: expected string, received undefined"] },
                                formErrors: [],
                        });
                });

                test("Id is invalid", async () => {
                        const response = await authorRequests.delete({ id: "123" });

                        expect(response.status).toBe(400);
                        expect(response.body).toEqual({
                                fieldErrors: { id: ["Invalid UUID"] },
                                formErrors: [],
                        });
                });

                test("Author not found", async () => {
                        const response = await authorRequests.delete({ id: faker.string.uuid() });

                        const { status, ...body } = AUTHOR_ERRORS.notFound;

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });
});
