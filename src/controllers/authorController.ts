import type { Request, Response } from "express";
import type { CreateAuthor } from "../interfaces/authorInterface";
import type { AuthorService } from "../services/authorService";

export class AuthorController {
        constructor(private authorService: AuthorService) {}

        async create(req: Request, res: Response) {
                const data: CreateAuthor = req.body;
                const author = await this.authorService.create(data);
                res.status(201).json(author);
        }

        async read(_req: Request, res: Response) {
                const authors = await this.authorService.read();
                res.status(200).json(authors);
        }

        async readOne(req: Request, res: Response) {
                const id = req.params["id"] as string;
                const author = await this.authorService.readOne(id);
                res.status(200).json(author);
        }
}
