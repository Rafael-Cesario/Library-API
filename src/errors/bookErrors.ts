import type { ICustomError } from "./customError";

export const BOOK_ERRORS = {
        authorsNotFound: { status: 404, code: "book_01", message: "Some authors were not found in the database" },
} satisfies Record<string, ICustomError>;
