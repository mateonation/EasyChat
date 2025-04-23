import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { UserResponseDto } from './dto/user-response.dto';
import { ConflictException } from 'src/errors/conflictException';
import { SaveUserDto } from './dto/save-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from 'src/errors/unauthorizedException';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) {}

    // Authenticate and return user if credentials are valid
    async authenticate(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
        // Find user by username
        const user = await this.usersRepo.findOne({ where: { username: loginUserDto.username } });
        // Check if user exists and password matches
        if (!user || !(await argon2.verify(user.password, loginUserDto.password))) {
            throw new UnauthorizedException('Username or password is incorrect');
        }
        // Return user response dto
        return UserResponseDto.fromUser(user);
    }

    // Method to save a new user
    async save(saveUserDto: SaveUserDto): Promise<UserResponseDto> {
        // Check if username is already taken
        const existingUsername = await this.usersRepo.findOne({ where: { username: saveUserDto.username } });
        if (existingUsername) {
            throw new ConflictException('Username already taken');
        }
        // Hash the password using argon2 library
        const argon2psswrd = await argon2.hash(saveUserDto.password);
        // Get the current date w/o time
        const todayDate = new Date();
        const registerDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay());
        // Create a new user object
        const user = this.usersRepo.create({
            username: saveUserDto.username,
            password: argon2psswrd, 
            registerDate,
        });
        // Save user to the DB
        await this.usersRepo.save(user);
        // Return user response dto
        return UserResponseDto.fromUser(user);
    }
}
