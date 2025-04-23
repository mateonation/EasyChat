import { HttpStatus, ConflictException as NestConflictException } from "@nestjs/common";

export class ConflictException extends NestConflictException {
    constructor(message = 'Conflict occurred') {
        super({
            statusCode: HttpStatus.CONFLICT,
            message,
            error: 'Conflict',
        });
    }
}