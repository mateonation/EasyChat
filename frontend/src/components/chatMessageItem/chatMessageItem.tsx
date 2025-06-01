import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface ChatMessageItemProps {
    id: number;
    sentDate: string;
    senderId: number;
    senderUsername: string;
    type: string;
    isDeleted: boolean;
    isOwnMessage: boolean;
    content: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
    id,
    sentDate,
    senderId,
    senderUsername,
    type,
    isDeleted,
    isOwnMessage,
    content,
}) => {
    const { t } = useTranslation();
    return (
        <Box
            display="flex"
            justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
            my={1}
            px={2}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: "70%",
                    padding: 1.5,
                    backgroundColor: isOwnMessage ? "primary.main" : "grey.300",
                    color: isOwnMessage ? "white" : "black",
                    borderRadius: 2,
                }}
            >
                {!isOwnMessage && (
                    <Typography
                        variant="caption"
                        fontWeight="bold"
                    >
                        {senderUsername}
                    </Typography>
                )}
                <Typography
                    variant="body1"
                    sx={{
                        wordBreak: "break-word",
                    }}
                >
                    {isDeleted ? t('CHAT_MESSAGE_DELETED') : content}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        display: "block", 
                        textAlign: "right",
                        mt: 0.5, 
                    }}
                >
                    {new Date(sentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Typography>
            </Paper>
        </Box>
    )
}

export default ChatMessageItem;