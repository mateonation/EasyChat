import { MessageResponseDto } from "./message-response.dto";

export class PaginatedMessagesResponseDto {
    messages: MessageResponseDto[]; // Array of messages
    total: number; // Total number of messages in el chat
    hasMore: boolean; // Indicates if there are more messages to be loaded

    static from(
        messages: MessageResponseDto[], 
        total: number,
        hasMore: boolean,
    ): PaginatedMessagesResponseDto {
        const dto = new PaginatedMessagesResponseDto();
        dto.messages = messages;
        dto.total = total;
        dto.hasMore = hasMore;
        return dto;
    }
}