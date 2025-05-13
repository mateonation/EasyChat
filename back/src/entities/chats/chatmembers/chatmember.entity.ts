import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../users/user.entity";
import { Chat } from "../../chats/chat.entity";
import { ChatMemberRole } from "src/common/enums/chat-members-roles.enum";

@Entity()
@Unique(["user", "chat"]) // Only an user can be member of a chat once
export class ChatMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.memberOf, { eager: true, onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Chat, (chat) => chat.members, { eager: true, onDelete: "CASCADE" })
    chat: Chat;

    @Column({
        type: 'enum',
        enum: ChatMemberRole,
        default: ChatMemberRole.MEMBER,
        nullable: false,
    })
    role: ChatMemberRole; // Role of the user in the group chat ('creator' and 'admin' are only used in group chats)

    @CreateDateColumn()
    joinDate: Date;
}