import { IsBoolean, IsString } from "class-validator";

export class EditGroupParamsDto {
    @IsString()
    name: string; // Name of the group chat, required for editing

    @IsString()
    description: string; // Description of the group chat, optional for editing

    @IsBoolean()
    clearDescription: boolean;
}