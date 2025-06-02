export interface MessageDto {
    id: number;
    sentDate: string;
    senderId: number;
    senderUsername: string;
    chatId: number;
    type: string;
    isDeleted: boolean;
    content: string | null;
}