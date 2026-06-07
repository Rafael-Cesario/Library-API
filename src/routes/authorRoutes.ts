import Express from "express";
import { AuthorController } from "../controllers/authorController";
import { AuthorService } from "../services/authorService";

const route = Express.Router();
const authorService = new AuthorService();
const authorController = new AuthorController(authorService);

route.post("/", (req, res) => authorController.create(req, res));
route.get("/", (req, res) => authorController.read(req, res));
route.get("/:id", (req, res) => authorController.readOne(req, res));
route.put("/", (req, res) => authorController.update(req, res));
route.delete("/", (req, res) => authorController.delete(req, res));

export { route as authorRoutes };
