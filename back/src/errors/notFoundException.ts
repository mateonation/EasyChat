import { HttpStatus, NotFoundException as NestNotFoundException } from "@nestjs/common";

export class NotFoundException extends NestNotFoundException {
    constructor(message = 'Resource not found') {
        super({
            statusCode: HttpStatus.NOT_FOUND,
            message,
            error: 'Not Found',
        });
    }
}