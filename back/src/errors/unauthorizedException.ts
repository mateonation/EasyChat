import { HttpStatus, UnauthorizedException as NestUnauthorizedException, } from '@nestjs/common';

export class UnauthorizedException extends NestUnauthorizedException {
    constructor(message = 'You are not authorized') {
        super({
            statusCode: HttpStatus.UNAUTHORIZED,
            message,
            error: 'Unauthorized',
        });
    }
}

