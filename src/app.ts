import Express, { json } from "express";
import { authorRoutes } from "./routes/authorRoutes";

const app = Express();

app.use(json());

app.use("/authors", authorRoutes);

export default app;
