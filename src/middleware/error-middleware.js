import { ResponseError } from "../error/response-error.js";

const errorMiddleware = (error, request, response, next) => {
    if(!error) {
        next();
        return;
    }

    if(error instanceof ResponseError) {
        response.status(error.status).json({
            errors: error.message,
        }).end();
    } else {
        response.status(500).json({
            errors: error.message,
        }).end();
    }
}

export {
    errorMiddleware,
}