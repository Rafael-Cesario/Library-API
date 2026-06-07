export interface ICustomError {
        status: number;
        code: string;
        message: string;
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
