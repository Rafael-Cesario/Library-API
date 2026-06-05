import app from "../app";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { prisma } from "../prisma";
import { AUTHOR_ERRORS } from "../errors/authorErrors";
import type { CreateAuthor } from "../interfaces/authorInterface";

describe("Author Routes", () => {
        const createAuthor = async (data: Partial<CreateAuthor>) => {
                const response = await request(app).post("/authors").send(data);
                return response;
        };

        describe("Create", () => {
                it("Should create a new author", async () => {
                        const data: CreateAuthor = { name: faker.person.fullName(), bio: faker.lorem.paragraph({ min: 1, max: 3 }) };
                        const response = await createAuthor(data);
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
                        const response = await createAuthor(data);

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

                        await createAuthor(data);
                        const response = await createAuthor(data);

                        expect(response.status).toBe(status);
                        expect(response.body).toEqual(body);
                });
        });
});
