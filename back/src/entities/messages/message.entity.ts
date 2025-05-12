import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Chat } from "../chats/chat.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    user: User;

    @Column()
    senderId: number; // User ID who sent the message

    @ManyToOne(() => Chat, (chat) => chat.id, { onDelete: "CASCADE" })
    chat: Chat;

    @Column()
    chatId: number; // Chat ID where the message is sent

    @Column({
        default: false,
    })
    isDeleted: boolean; // Indicates if the message is deleted

    @Column({
        type: "text",
    })
    content: string; // Message content

    @CreateDateColumn()
    sentDate: Date; // Date and timestamp when the message was sent
}