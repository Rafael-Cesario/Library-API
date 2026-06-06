import { prisma } from "../../prisma";

beforeAll(async () => {
        await prisma.$connect();
});

afterAll(async () => {
        await prisma.$disconnect();
});

afterEach(async () => {
        await prisma.author.deleteMany();
});
