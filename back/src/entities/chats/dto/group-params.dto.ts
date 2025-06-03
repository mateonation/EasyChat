import { IsArray, IsString } from "class-validator";

export class GroupParamsDto {
    @IsArray()
    usernames?: string[]; // Array of user to be added to the chat, can be empty if the dto is only used to edit a group

    @IsString()
    name?: string;  // Only used in group chats, empty for private chats

    @IsString()
    description?: string; // Only used in group chats, empty for private chats

    constructor(usernames: string[], name: string = '', description: string = '') {
        this.usernames = usernames;
        this.name = name;
        this.description = description;
    }

    static fromRequest(
        dto: GroupParamsDto
    ): GroupParamsDto {
        return new GroupParamsDto(dto.usernames ?? [], dto.name, dto.description);
    }

    static fromRequests(
        dto: GroupParamsDto[]
    ): GroupParamsDto[] {
        return dto.map(dto => new GroupParamsDto(dto.usernames ?? [], dto.name, dto.description));
    }
}