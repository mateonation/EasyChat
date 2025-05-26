import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { predefinedRoles } from './role/predefinedRoles';
import * as argon2 from 'argon2';
import { UserResponseDto } from './dto/user-response.dto';
import { ConflictException } from 'src/errors/conflictException';
import { SaveUserDto } from './dto/save-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from 'src/errors/unauthorizedException';
import { Role } from './role/role';
import { NotFoundException } from 'src/errors/notFoundException';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Role) private rolesRepo: Repository<Role>,
    ) {}

    // Autoinject predefined roles into the DB when initiating app if they do not exist
    async onModuleInit() {
        // Count existing roles in the DB
        const existingRoles = await this.rolesRepo.count();
        // Count total predefined roles
        const totalPreRoles = predefinedRoles.length;
        // If roles does not exist, create them
        if (existingRoles === 0) {
            console.log('Roles not found in DB, creating them...');
            await this.rolesRepo.save(predefinedRoles.map(name=>({name})));
            console.log(totalPreRoles + ' roles created.');
        // If there are less existing roles than the predefined ones, create the missing ones
        } else if (existingRoles < totalPreRoles) {
            console.log('Some roles are missing in DB, creating them...');
            const existingRoleNames = (await this.rolesRepo.find()).map(role => role.name);
            const newRoles = predefinedRoles.filter(role => !existingRoleNames.includes(role));
            await this.rolesRepo.save(newRoles.map(name => ({ name })));
            console.log(newRoles.length + ' roles created.');
        }
    }

    // Authenticate and return user if credentials are valid
    async authenticate(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
        // Find user by username
        const user = await this.usersRepo.findOne({ where: { username: loginUserDto.username }, relations: ['roles'] });
        // Check if user exists and password matches
        if (!user || !(await argon2.verify(user.password, loginUserDto.password))) {
            throw new UnauthorizedException('Username or password are incorrect');
        }
        // Return user response dto
        return UserResponseDto.fromUser(user);
    }

    // Find user by their ID
    // Return with UserResponseDto
    async findById(
        id: number
    ): Promise<UserResponseDto | null> {
        const user = await this.usersRepo.findOne({ where: { id }, relations: ['roles'] });
        if (!user) return null;
        return UserResponseDto.fromUser(user);
    }

    // Method to save a new user
    async save(saveUserDto: SaveUserDto): Promise<UserResponseDto> {
        // Count total users in the DB
        const totalUsers = await this.usersRepo.count();
        // If the user being registered is the first one, register it as an admin, moderator and user
        // If not, only user
        const rolesToAssign = totalUsers === 0 ? ['admin', 'moderator', 'user'] : ['user'];
        const roles = await Promise.all(
            rolesToAssign.map(async (name)=>{
                const role = await this.rolesRepo.findOne({ where: { name } });
                if(!role) throw new NotFoundException("Role with id '" + name + "' not found");
                return role;
            }),
        );
        // Hash the password using argon2 library
        const argon2psswrd = await argon2.hash(saveUserDto.password);
        // Create a new user object
        const user = this.usersRepo.create({
            username: saveUserDto.username,
            password: argon2psswrd,
            roles,
        });
        // Save user to the DB
        await this.usersRepo.save(user);
        // Return user response dto
        return UserResponseDto.fromUser(user);
    }

    // Method to return user data by username
    async findByUsername(
        username: string
    ): Promise<UserResponseDto | null> {
        const user = await this.usersRepo.findOne({ where: { username }, relations: ['roles'] });
        if (!user) return null;
        return UserResponseDto.fromUser(user);
    }
}
