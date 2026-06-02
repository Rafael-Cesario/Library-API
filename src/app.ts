import Express, { json } from 'express';
import type { Request, Response } from 'express';

const app = Express();

app.use(json());

app.get('/', (_req: Request, res: Response) => {
        res.status(200).json({ message: 'server on' });
});

export default app;
