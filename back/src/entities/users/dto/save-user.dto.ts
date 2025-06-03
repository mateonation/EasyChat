import { IsDate, IsDateString, IsEmpty, IsString } from "class-validator";

export class SaveUserDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName?: string; // Last name can be optional

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsDateString()
    birthDate: Date;
}