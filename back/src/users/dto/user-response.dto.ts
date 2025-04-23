import { User } from "../user.entity";

export class UserResponseDto {
    id: number;
    username: string;
    registerDate: Date;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.registerDate = user.registerDate;
    }

    static fromUser(user: User): UserResponseDto {
        return new UserResponseDto(user);
    }
    static fromUsers(users: User[]): UserResponseDto[] {
        return users.map(user => new UserResponseDto(user));
    }
}
