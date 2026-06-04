import Express, { json } from "express";
import { authorRoutes } from "./routes/authorRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = Express();

app.use(json());

app.use("/authors", authorRoutes);

app.use(errorMiddleware);

export default app;
