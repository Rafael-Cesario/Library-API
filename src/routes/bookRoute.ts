import Express from "express";
import { BookService } from "../services/bookService";
import { BookController } from "../controllers/bookController";

const route = Express.Router();
const bookService = new BookService();
const bookController = new BookController(bookService);

route.post("/", (req, res) => bookController.create(req, res));

export { route as bookRoutes };
