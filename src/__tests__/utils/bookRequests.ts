import request from "supertest";
import app from "../../app";
import type { CreateBook, DeleteBook, UpdateBook } from "../../interfaces/bookInterface";
import { faker } from "@faker-js/faker";
import { AuthorRequests } from "./authorRequests";

export class BookRequests {
        private authorRequests = new AuthorRequests();

        async create(data: Partial<CreateBook>) {
                const response = await request(app).post("/books").send(data);
                return response;
        }

        async createMany(total: number) {
                const promises = [];

                const authorResponse = await this.authorRequests.create({
                        name: faker.person.fullName(),
                        bio: faker.lorem.paragraph(),
                });

                const author = authorResponse.body;

                for (let i = 0; i < total; i++) {
                        const data: CreateBook = {
                                title: faker.book.title(),
                                pages: faker.number.int({ min: 50, max: 400 }),
                                publishedAt: faker.date.past().getTime(),
                                authors: [author.id],
                        };

                        promises.push(this.create(data));
                }

                const response = await Promise.all(promises);

                return response;
        }

        async read() {
                const response = await request(app).get("/books");
                return response;
        }

        async readOne(id: string) {
                const response = await request(app).get(`/books/${id}`);
                return response;
        }

        async update(data: Partial<UpdateBook>) {
                const response = await request(app).put("/books").send(data);
                return response;
        }

        async delete(data: Partial<DeleteBook>) {
                const response = await request(app).delete("/books").send(data);
                return response;
        }
}
