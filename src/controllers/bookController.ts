import type { Request, Response } from "express";
import type { BookService } from "../services/bookService";
import type { CreateBook, UpdateBook } from "../interfaces/bookInterface";

export class BookController {
        constructor(private bookService: BookService) {}

        async create(req: Request, res: Response) {
                const data: CreateBook = req.body;
                const book = await this.bookService.create(data);
                res.status(201).json(book);
        }

        async read(_req: Request, res: Response) {
                const books = await this.bookService.read();
                res.status(200).json(books);
        }

        async readOne(req: Request, res: Response) {
                const id = req.params["id"] as string;
                const book = await this.bookService.readOne(id);
                res.status(200).json(book);
        }

        async update(req: Request, res: Response) {
                const data: UpdateBook = req.body;
                const book = await this.bookService.update(data);
                res.status(200).json(book);
        }
}
