import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "src/errors/unauthorizedException";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        // Throw an unauthorized exception if the user is not logged in 
        if(!req.session.user) {
            throw new UnauthorizedException('You have to be logged in to access this resource');
        }
        next();
    }
}