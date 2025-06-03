import { MessageResponseDto } from "./message-response.dto";

export class MessageResponseWithChatId {
    message: MessageResponseDto;
    chatId: number;
}