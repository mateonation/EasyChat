import { IsEnum, IsNumber } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { ChatMemberRole } from 'src/common/enums/chat-members-roles.enum';

export class UpdateMemberRoleDto {
    @IsNotEmpty()
    @IsNumber()
    editId: number;

    @IsEnum(ChatMemberRole)
    @IsNotEmpty()
    role: ChatMemberRole;
}