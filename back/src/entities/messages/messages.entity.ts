import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Chat } from "../chats/chats.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    senderId: number; // User ID of the sender

    @ManyToOne(() => Chat, (chat) => chat.id, { onDelete: "CASCADE" })
    chatId: number; // Chat ID of the chat where the message was sent

    @Column({
        default: false,
    })
    isDeleted: boolean; // Indicates if the message is deleted

    @Column({
        type: "text",
        length: 280,
    })
    content: string;

    @Column()
    messageDate: Date;
}