import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
        path: path.resolve(process.cwd(), `.env.${process.env['NODE_ENV']}`),
});

interface Config {
        port: number;
        databaseURL: string;
}

const config: Config = {
        port: Number(process.env['PORT']) || 4000,
        databaseURL: `${process.env['DATABASE_URL']}`,
};

export default config;
