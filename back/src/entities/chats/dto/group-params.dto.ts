export class GroupParamsDto {
    usernames: string[]; // Array of user to be added to the chat
    name?: string;  // Only used in group chats
    description?: string; // Only used in group chats

    constructor(usernames: string[], name: string = '', description: string = '') {
        this.usernames = usernames;
        this.name = name;
        this.description = description;
    }

    static fromRequest(dto: GroupParamsDto): GroupParamsDto {
        return new GroupParamsDto(dto.usernames, dto.name, dto.description);
    }

    static fromRequests(dto: GroupParamsDto[]): GroupParamsDto[] {
        return dto.map(c => new GroupParamsDto(c.usernames, c.name, c.description));
    }
}