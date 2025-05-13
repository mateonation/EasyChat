export class CreateChatDto {
    users: number[]; // Array of user IDs to be added to the chat
    name?: string;  // Only used in group chats
    description?: string; // Only used in group chats

    constructor(users: number[], name: string = '', description: string = '') {
        this.users = users;
        this.name = name;
        this.description = description;
    }

    static fromRequest(dto: CreateChatDto): CreateChatDto {
        return new CreateChatDto(dto.users, dto.name, dto.description);
    }

    static fromRequests(dto: CreateChatDto[]): CreateChatDto[] {
        return dto.map(c => new CreateChatDto(c.users, c.name, c.description));
    }
}