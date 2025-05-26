import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UnauthorizedException } from 'src/errors/unauthorizedException';
import { LoginUserDto } from 'src/entities/users/dto/login-user.dto';
import { UsersService } from 'src/entities/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    // Endpoint to authenticate user
    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() res: Response,
        @Req() req: Request,
    ){
        try{
            // Authenticate user
            const user = await this.usersService.authenticate(loginUserDto);
            // Set user in session
            req.session.user = {
                id: user.id,
                username: user.username,
            };
            // Return 'success' response
            return res.status(200).json({
                statusCode: 200,
                message: 'Logged in',
                user,
            });
        }catch(error){
            // Handle unauthorized error
            if (error instanceof UnauthorizedException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
        }
        // If error is not handled by service, return 500
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }

    // Endpoint to logout user
    @Post('logout')
    async logout(
        @Res() res: Response,
        @Req() req: Request,
    ){
        try{
            // Destroy session + clear cookie
            await new Promise(result => req.session.destroy(result));
            res.clearCookie('connect.sid');
            // Return 'success' response
            return res.status(200).json({
                statusCode: 200,
                message: 'Logged out',
            });
        } catch (error) {
            // Handle unauthorized error
            if (error instanceof UnauthorizedException) {
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
