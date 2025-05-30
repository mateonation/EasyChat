import { Controller, Body, Res, Post, Get, Req, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { SaveUserDto } from './dto/save-user.dto';
import { ConflictException } from 'src/errors/conflictException';
import { NotFoundException } from 'src/errors/notFoundException';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { BadRequestException } from 'src/errors/badRequestException';
import { ForbiddenException } from 'src/errors/forbiddenException';

@UseGuards(RolesGuard)
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
            const textRegex = /^[a-zA-Z0-9_]+$/; // Regex for valid characters in username
            const textRegexAlt = /^[\p{L} ]+$/u; // Regex for valid unicode characters - first and last name

            // If username contains invalid characters, throw an error
            if (!textRegex.test(saveUserDto.username)) throw new BadRequestException('Invalid characters in username');

            // If username is too short or too long, throw an error
            if (saveUserDto.username.length < 3) throw new BadRequestException('Username not long enough (min 3 characters)');
            if (saveUserDto.username.length > 20) throw new BadRequestException('Username too long (max 20 characters)');

            // If first name contains invalid characters, throw an error
            if (!textRegexAlt.test(saveUserDto.firstName)) throw new BadRequestException('Invalid characters in first name');

            // If first name is too short or too long, throw an error
            if (saveUserDto.firstName.length < 2) throw new BadRequestException('First name not long enough (min 2 characters)');
            if (saveUserDto.firstName.length > 20) throw new BadRequestException('First name too long (max 20 characters)');
            
            // If last name is provided, validate it
            if (saveUserDto.lastName) {
                // If last name contains invalid characters, throw an error
                if (!textRegexAlt.test(saveUserDto.lastName)) throw new BadRequestException('Invalid characters in last name');

                // If last name is too long, throw an error
                if (saveUserDto.lastName.length > 35) throw new BadRequestException('Last name too long (max 35 characters)');
            }

            // If password is too short or too long, throw an error
            if (saveUserDto.password.length < 6) throw new BadRequestException('Password not long enough (min 6 characters)');
            if (saveUserDto.password.length > 30) throw new BadRequestException('Password too long (max 30 characters)');

            // Check user birth date
            const userIsOver18 = await this.usersService.isUserOver18(saveUserDto.birthDate);
            // If the user is under 18 years old, throw an error
            if(!userIsOver18) throw new ForbiddenException('You must be 18 years old or older');

            // Check if user with the same username already exists
            const existingUser = await this.usersService.findByUsername(saveUserDto.username);
            if (existingUser) throw new ConflictException('Username already taken');

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
            if (error instanceof ConflictException || error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ForbiddenException) {
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

    // TEST ENDPOINT: Verify if the user in session is admin
    @Get('admin')
    @Roles('admin')
    admin(
        @Res() res: Response,
    ){
        return res.status(200).json({
            statusCode: 200,
            message: 'You are an admin'
        })
    }
}
