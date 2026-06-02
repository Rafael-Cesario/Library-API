import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
        path: path.resolve(process.cwd(), `.env.${process.env['NODE_ENV']}`),
});

interface Config {
        port: number;
}

const config: Config = {
        port: Number(process.env['PORT']) || 4000,
};

export default config;
