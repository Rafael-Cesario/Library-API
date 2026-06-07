import type { ICustomError } from "./customError";

export const BOOK_ERRORS = {
        authorsNotFound: { status: 404, code: "book_01", message: "Some authors were not found in the database" },
        notFound: { status: 404, code: "book_02", message: "Book not found, the current id should not be present in your frontend, please verify your cache or something else." },
} satisfies Record<string, ICustomError>;
