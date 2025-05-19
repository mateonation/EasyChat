import { Message } from "../message.entity";

export class MessageResponseDto {
    id: number;
    content: string | null;
    sentDate: Date;
    senderId: number;
    senderUsername: string;
    isDeleted: boolean;

    constructor(message: Message) {
        this.id = message.id;
        // If the message is deleted, do not show the content
        this.content = message.isDeleted ? null : message.content;
        this.sentDate = message.sentDate;
        this.senderId = message.user.id;
        this.senderUsername = message.user.username;
        this.isDeleted = message.isDeleted;
    }

    static fromMessage(message: Message): MessageResponseDto {
        return new MessageResponseDto(message);
    }

    static fromMessages(messages: Message[]): MessageResponseDto[] {
        return messages.map(msg => new MessageResponseDto(msg));
    }
}