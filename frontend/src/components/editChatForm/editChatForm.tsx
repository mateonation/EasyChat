import { useTranslation } from "react-i18next";
import { ChatDto } from "../../types/chat.dto";
import { useState } from "react";
import api from "../../api/axios";
import { Box, Button, DialogActions, FormControlLabel, TextField, Typography } from "@mui/material";
import { Checkbox } from "@mui/material";

interface Props {
    chat: ChatDto;
    onClose: () => void;
    onChatUpdate: (chat: ChatDto) => void;
}

const EditChatForm = ({ chat, onClose, onChatUpdate }: Props) => {
    const { t } = useTranslation();
    const [name, setName] = useState(chat.name);
    const [description, setDescription] = useState(chat.description || ''); // Default to empty string if description is null
    const [clearDescription, setClearDescription] = useState(false);
    const [loading, setLoading] = useState(false);

    const nameChanged = name.trim() !== chat.name;
    const originalDescription = chat.description ?? '';
    const descriptionChanged = (description.trim() !== originalDescription); 
    const shouldClearDescription = clearDescription && originalDescription.trim() !== "";

    const hasChanges = nameChanged || descriptionChanged || shouldClearDescription;

    const submitDisabled =
        loading ||
        !hasChanges ||
        (description.trim() === "" && !clearDescription); // Don't allow empty description unless clearDescription is checked

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitDisabled) return;

        setLoading(true);
        try {
            const res = await api.patch<ChatDto>(`/chats/${chat.id}`, {
                name,
                description,
                clearDescription,
            });

            // Update the chat in the parent component
            onChatUpdate(res.data);
            onClose(); // Close modal after successful update
        } catch (error) {
            console.error("Failed to update chat:", error);
            alert(t("FAILED_TO_UPDATE", {
                field: t("CHAT"),
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
        >
            <Typography
                variant="h6"
                gutterBottom
            >
                {t('EDIT_CHAT_LABEL')}
            </Typography>
            <TextField
                label={t('FORM_GROUP_NAME_LABEL')}
                placeholder={t('FORM_GROUP_NAME_PLACEHOLDER')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                slotProps={{ 
                    htmlInput: { 
                        maxLength: 50, // Limit name of group to a maximum of 30 characters
                    } 
                }}
            />
            <TextField
                label={t('FORM_DESCRIPTION_LABEL')}
                placeholder={t('FORM_GROUP_DESCRIPTION_PLACEHOLDER')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={8}
                sx={{
                    my: 2,
                }}
                slotProps={{ 
                    htmlInput: { 
                        maxLength: 500, // Limit input length to 20 characters
                    } 
                }}
                disabled={clearDescription} // Disable description field if clearDescription is true
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={clearDescription}
                        onChange={(e) => setClearDescription(e.target.checked)}
                        disabled={loading} // Disable checkbox if loading
                    />
                }
                label={t('CLEAR_DESCRIPTION_LABEL')}
            />
            <DialogActions>
                <Button
                    variant="contained"
                    type="submit"
                    disabled={submitDisabled}
                    sx={{
                        mt: 2,
                    }}
                >
                    {t("GENERIC_ANSWER_SAVE")}
                </Button>
            </DialogActions>
        </Box>
    );
}

export default EditChatForm;