import { useState } from "react";
import { ChatType } from "../../types/chat-type";
import { Dialog, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material";
import { t } from "i18next";

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
                <Select
                    value={chatType}
                    onChange={(e) => setChatType(e.target.value as ChatType)}
                    fullWidth
                    native
                    variant="outlined"
                    label={t('FORM_CHAT_TYPE_LABEL')}
                >
                    <MenuItem value="private">{t('CHAT_TYPE_PRIVATE')}</MenuItem>
                    <MenuItem value="group">{t('CHAT_TYPE_GROUP')}</MenuItem>
                </Select>
            </DialogContent>
        </Dialog>
    );
}