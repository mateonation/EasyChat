import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Chat } from "../chats/chat.entity";
import { MessageType } from "src/common/enums/message-type.enum";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.messages, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true,
    })
    user: User; // User who sent the message

    @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: "CASCADE" })
    chat: Chat; // Chat where the message is sent

    @Column({
        default: false,
    })
    isDeleted: boolean; // Indicates if the message is deleted

    @Column({
        type: "text",
    })
    content: string; // Message content

    @Column({
        type: "enum",
        enum: MessageType,
        default: MessageType.TEXT,
    })
    type: MessageType; // Type of the message (text, image, video, etc.)

    @CreateDateColumn({ 
        type: 'timestamp',
    })
    sentDate: Date; // Date and timestamp when the message was sent
}