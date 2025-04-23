import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { UserResponseDto } from './dto/user-response.dto';
import { ConflictException } from 'src/errors/conflictException';
import { SaveUserDto } from './dto/save-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) {}

    async save(saveUserDto: SaveUserDto): Promise<UserResponseDto> {
        // Check if username is already taken
        const existingUsername = await this.usersRepo.findOne({ where: { username: saveUserDto.username } });
        if (existingUsername) {
            throw new ConflictException('Username already taken');
        }
        // Hash the password using argon2 library
        const argon2psswrd = await argon2.hash(saveUserDto.password);
        // Get the current date
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
