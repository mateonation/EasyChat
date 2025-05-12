export class CreateChatDto {
    users: number[]; // Array of user IDs to be added to the chat
    name: string;
    groupDescription: string;
}