export class SaveUserDto {
    firstName: string;
    lastName?: string; // Last name can be optional
    username: string;
    password: string;
    birthDate: Date;
}