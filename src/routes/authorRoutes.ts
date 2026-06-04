import Express from "express";
import { AuthorController } from "../controllers/authorController";
import { AuthorService } from "../services/authorService";

const route = Express.Router();
const authorService = new AuthorService();
const authorController = new AuthorController(authorService);

route.post("/", (req, res) => authorController.create(req, res));

export { route as authorRoutes };
