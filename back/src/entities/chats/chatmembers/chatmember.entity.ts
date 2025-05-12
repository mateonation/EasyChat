import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../users/user.entity";
import { Chat } from "../../chats/chat.entity";
import { ChatMemberRole } from "src/types/chat-members-roles";

@Entity()
@Unique(["user", "chat"]) // Only an user can be member of a chat once
export class ChatMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.memberOf, { eager: true, onDelete: "CASCADE" })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Chat, (chat) => chat.members, { onDelete: "CASCADE" })
    chat: Chat;

    @Column()
    chatId: number;

    @Column({
        type: 'enum',
        enum: ['creator', 'admin', 'member'],
        default: 'member',
    })
    role: ChatMemberRole; // Role of the user in the group chat ('creator' and 'admin' are only used in group chats)

    @CreateDateColumn()
    joinDate: Date;
}