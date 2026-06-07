import request from "supertest";
import app from "../../app";
import type { CreateBook } from "../../interfaces/bookInterface";

export class BookRequests {
        async create(data: Partial<CreateBook>) {
                const response = await request(app).post("/books").send(data);
                return response;
        }
}
