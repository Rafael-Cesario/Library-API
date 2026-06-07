import Express, { json } from "express";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authorRoutes } from "./routes/authorRoutes";
import { bookRoutes } from "./routes/bookRoute";

const app = Express();

app.use(json());

app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

app.use(errorMiddleware);

export default app;
