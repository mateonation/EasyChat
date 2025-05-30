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
            <DialogTitle
                component="header"
                id="create-chat-dialog-title"
            >{t('CREATE_CHAT_TITLE')}</DialogTitle>
            <DialogContent aria-labelledby="create-chat-dialog-title">
                <FormControl component="form" fullWidth margin="normal" aria-labelledby="chat-type-select">
                    <InputLabel id="chat-type-label">
                        {t('FORM_CHAT_TYPE_LABEL')}
                    </InputLabel>
                    <Select
                        value={chatType}
                        onChange={(e) => setChatType(e.target.value as ChatType)}
                        labelId="chat-type-select"
                        label={t('FORM_CHAT_TYPE_LABEL')}
                        id="chat-type-select"
                        aria-describedby="chat-type-description"
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