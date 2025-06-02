import { Message } from "../message.entity";

export class MessageResponseDto {
    id: number;
    sentDate: Date;
    senderId: number;
    senderUsername: string;
    chatId: number;
    type: string;
    isDeleted: boolean;
    content: string | null;

    constructor(message: Message) {
        this.id = message.id;
        this.sentDate = message.sentDate;
        this.senderId = message.user?.id ?? null;
        this.senderUsername = message.user?.username ?? null;
        this.chatId = message.chat.id;
        this.type = message.type;
        this.isDeleted = message.isDeleted;
        // If the message is deleted, do not show the content
        this.content = message.isDeleted ? null : message.content;
    }

    static fromMessage(message: Message): MessageResponseDto {
        return new MessageResponseDto(message);
    }

    static fromMessages(messages: Message[]): MessageResponseDto[] {
        return messages.map(msg => new MessageResponseDto(msg));
    }
}