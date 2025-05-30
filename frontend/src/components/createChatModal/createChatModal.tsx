import { useState } from "react";
import { ChatType } from "../../types/chat-type";
import { Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { t } from "i18next";
import PrivateChatForm from "../privateChatForm";
import GroupChatForm from "../groupChatForm";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateChatModal({ open, onClose }: Props) {
    const [chatType, setChatType] = useState<ChatType>('private');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{t('CREATE_CHAT_TITLE')}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="chat-type-select">
                        {t('FORM_CHAT_TYPE_LABEL')}
                    </InputLabel>
                    <Select
                        value={chatType}
                        onChange={(e) => setChatType(e.target.value as ChatType)}
                        labelId="chat-type-select"
                        label={t('FORM_CHAT_TYPE_LABEL')}
                    >
                        <MenuItem value="private">{t('CHAT_TYPE_PRIVATE')}</MenuItem>
                        <MenuItem value="group">{t('CHAT_TYPE_GROUP')}</MenuItem>
                    </Select>
                </FormControl>
                {chatType === 'private' ? (
                    <PrivateChatForm onClose={onClose} />
                ) : (
                    <GroupChatForm onClose={onClose} />
                )}
            </DialogContent>
        </Dialog>
    );
}