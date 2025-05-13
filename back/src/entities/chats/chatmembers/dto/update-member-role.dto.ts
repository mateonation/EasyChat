import { IsEnum } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { ChatMemberRole } from 'src/common/enums/chat-members-roles.enum';

export class UpdateMemberRoleDto {
    @IsEnum(ChatMemberRole)
    @IsNotEmpty()
    newRole: ChatMemberRole;
}