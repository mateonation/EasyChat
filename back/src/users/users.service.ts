import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) {}
    
    async save(username: string, password: string): Promise<User> {
        // Check if username is already taken
        const existingUsername = await this.usersRepo.findOne({ where: { username } });
        if (existingUsername) {
            throw new Error('Username already taken');
        }
        // Hash the password using argon2 library
        const argon2psswrd = await argon2.hash(password);
        // Get the current date
        const todayDate = new Date();
        const registerDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay());
        // Create a new user object
        const user = this.usersRepo.create({
            username,
            password: argon2psswrd, 
            registerDate,
        });
        // Save user to the DB
        return this.usersRepo.save(user);
    }
}
