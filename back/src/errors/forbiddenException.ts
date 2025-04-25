import { HttpStatus, ForbiddenException as NestForbiddenException } from "@nestjs/common";

export class ForbiddenException extends NestForbiddenException {
    constructor(message = 'Forbidden') {
        super({
            statusCode: HttpStatus.FORBIDDEN,
            message,
            error: 'Forbidden',
        });
    }
}
