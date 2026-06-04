import type { Request, Response } from "express";
import type { CreateAuthor } from "../interfaces/authorInterface";
import type { AuthorService } from "../services/authorService";

export class AuthorController {
        constructor(private authorService: AuthorService) {}

        async create(req: Request, res: Response) {
                const data: CreateAuthor = req.body;
                const author = await this.authorService.create(data);
                
                res.status(200).json(author);
        }
}
