export interface MessageDto {
    id: number;
    sentDate: string;
    senderId: number;
    senderUsername: string;
    type: string;
    isDeleted: boolean;
    content: string | null;
}