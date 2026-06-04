interface ICustomError {
        message: string;
        code: string;
        status: number;
}

export class CustomError extends Error {
        readonly status: number;
        readonly code: string;

        constructor(error: ICustomError) {
                super(error.message);
                this.status = error.status;
                this.code = error.code;
        }
}
