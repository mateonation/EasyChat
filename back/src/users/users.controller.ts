import { Controller, Body, Res, Post, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { SaveUserDto } from './dto/save-user.dto';
import { ConflictException } from 'src/errors/conflictException';
import { NotFoundException } from 'src/errors/notFoundException';
import { UnauthorizedException } from 'src/errors/unauthorizedException';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    // Endpoint to register a new user
    @Post('register')
    async register(
        @Body() saveUserDto: SaveUserDto,
        @Res() res: Response,
    ){
        try{
            // Register user in service
            const user = await this.usersService.save(saveUserDto);
            // Return 'success' response
            return res.status(201).json({
                statusCode: 201,
                message: 'User registered successfully',
                user,
            });
        } catch (error) {
            // Handle conflict error
            if (error instanceof ConflictException || error instanceof NotFoundException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
        }
        // If error is not handled by service, return 500
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }

    // Endpoint to get the info of the logged in user
    @Get('me')
    async getLoggedUser(
        @Res() res: Response,
        @Req() req: Request,
    ){
        try{
            if (!req.session.user?.id) return;
            // Get user info from service
            const user = await this.usersService.findById(req.session.user.id);
            // Return 'success' response
            return res.status(200).json({
                statusCode: 200,
                user,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
        }
        // If error is not handled by service, return 500
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
}
