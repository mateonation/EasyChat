import { IsArray } from "class-validator";

export class AddMembersDto {
    @IsArray()
    usernames: string[];
}