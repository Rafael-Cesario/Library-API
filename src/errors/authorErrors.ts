export const AUTHOR_ERRORS = {
        duplicated: { status: 400, code: "author_01", message: "This author already exist." },
        notFound: { status: 404, code: "author_02", message: "Author not found, the current id should not be present in your frontend, please verify your cache or something else." },
};
