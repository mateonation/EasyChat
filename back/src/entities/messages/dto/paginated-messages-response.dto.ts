import { MessageResponseDto } from "./message-response.dto";

export class PaginatedMessagesResponseDto {
    messages: MessageResponseDto[]; // Array of messages
    hasMore: boolean; // Indicates if there are more messages to be loaded

    constructor(messages: MessageResponseDto[], hasMore: boolean,) {
        this.messages = messages;
        this.hasMore = hasMore;
    }

    static from(
        messages: MessageResponseDto[], 
        totalCount: number, // Total number of messages in the chat
        offset: number, // Current offset (page number)
        limit: number, // Number of messages per page
    ): PaginatedMessagesResponseDto {
        const hasMore = offset + limit < totalCount;
        return new PaginatedMessagesResponseDto(messages, hasMore);
    }
}