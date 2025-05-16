export class GroupParamsDto {
    users: number[]; // Array of user IDs to be added to the chat
    name?: string;  // Only used in group chats
    description?: string; // Only used in group chats

    constructor(users: number[], name: string = '', description: string = '') {
        this.users = users;
        this.name = name;
        this.description = description;
    }

    static fromRequest(dto: GroupParamsDto): GroupParamsDto {
        return new GroupParamsDto(dto.users, dto.name, dto.description);
    }

    static fromRequests(dto: GroupParamsDto[]): GroupParamsDto[] {
        return dto.map(c => new GroupParamsDto(c.users, c.name, c.description));
    }
}