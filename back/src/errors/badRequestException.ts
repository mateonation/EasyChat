import { HttpStatus, BadRequestException as NestBadRequestException } from "@nestjs/common";

export class BadRequestException extends NestBadRequestException {
    constructor(message = 'Bad Request sent') {
        super({
            statusCode: HttpStatus.BAD_REQUEST,
            message,
            error: 'Bad Request',
        });
    }
}