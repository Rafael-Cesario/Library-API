import Express from "express";
import { BookService } from "../services/bookService";
import { BookController } from "../controllers/bookController";

const route = Express.Router();
const bookService = new BookService();
const bookController = new BookController(bookService);

route.post("/", (req, res) => bookController.create(req, res));
route.get("/", (req, res) => bookController.read(req, res));
route.get("/:id", (req, res) => bookController.readOne(req, res));
route.put("/", (req, res) => bookController.update(req, res));
route.delete("/", (req, res) => bookController.delete(req, res));

export { route as bookRoutes };
