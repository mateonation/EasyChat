import { Controller, Body, Res, Post } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    // Endpoint to register a new user
    @Post('register')
    async register(
        @Body() saveUserDto: { username: string; password: string },
        @Res() res: Response
    ){
        try{
            // Register user in service
            const user = await this.usersService.save(
                saveUserDto.username,
                saveUserDto.password,
            );
            // Return 'success' response
            return res.status(201).json({
                statusCode: 201,
                message: 'User registered successfully',
                user,
            });
        } catch (error) {
            // Handle errors throwed by service
            return res.status(error.getStatus()).json(error.getResponse());
        }
        // If error is not handled by service, return 500
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
}
