export class CreateChatDto {
    users: number[]; // Array of user IDs to be added to the chat
    name: string;
    groupDescription: string;

    constructor(users: number[], name: string, groupDescription: string) {
        this.users = users;
        this.name = name;
        this.groupDescription = groupDescription;
    }

    static fromRequest(request: CreateChatDto): CreateChatDto {
        return new CreateChatDto(request.users, request.name, request.groupDescription);
    }

    static fromRequests(requests: CreateChatDto[]): CreateChatDto[] {
        return requests.map(request => new CreateChatDto(request.users, request.name, request.groupDescription));
    }
}