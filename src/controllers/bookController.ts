import type { Request, Response } from "express";
import type { BookService } from "../services/bookService";
import type { CreateBook } from "../interfaces/bookInterface";

export class BookController {
        constructor(private bookService: BookService) {}

        async create(req: Request, res: Response) {
                const data: CreateBook = req.body;
                const book = await this.bookService.create(data);
                res.status(201).json(book);
        }
}
