import request from "supertest";
import app from "../../app";
import { faker } from "@faker-js/faker";
import type { CreateAuthor, UpdateAuthor } from "../../interfaces/authorInterface";

export class AuthorRequests {
        async create(data: Partial<CreateAuthor>) {
                const response = await request(app).post("/authors").send(data);
                return response;
        }

        async createMany(total: number) {
                const promises = [];

                for (let i = 0; i < total; i++) {
                        promises.push(this.create({ name: faker.person.fullName(), bio: faker.lorem.paragraph() }));
                }

                await Promise.all(promises);
        }

        async read() {
                const response = await request(app).get("/authors");
                return response;
        }

        async readOne(id: string) {
                const response = await request(app).get(`/authors/${id}`);
                return response;
        }

        async update(data: Partial<UpdateAuthor>) {
                const response = await request(app).put("/authors").send(data);
                return response;
        }
}
