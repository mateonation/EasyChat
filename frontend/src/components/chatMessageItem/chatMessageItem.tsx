import { ErrorOutline } from "@mui/icons-material";
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
    chatType: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
    id,
    sentDate,
    senderUsername,
    type,
    isDeleted,
    isOwnMessage,
    content,
    chatType,
}) => {
    const { t } = useTranslation();
    return (
        <Box
            id={`message_${id}`}
            display="flex"
            justifyContent={type === "system" ? "center" : isOwnMessage ? "flex-end" : "flex-start"}
            my={1}
            px={2}
        >
            <Paper
                elevation={2}
                sx={{
                    maxWidth: "70%",
                    padding: 1,
                    minWidth: type != 'system' ? "25%" : "10%",
                    backgroundColor: isOwnMessage ? "primary.main" : type === "system" ? "action.hover" : "grey.300",
                    color: isOwnMessage ? "primary.contrastText" : "text.primary",
                    borderRadius: 2,
                }}
            >
                {chatType != 'private' && !isOwnMessage && (
                    <Typography
                        variant="caption"
                        fontWeight="bold"
                    >
                        {senderUsername}
                    </Typography>
                )}
                <Box
                    display="flex"
                    alignItems="center"
                >
                    {isDeleted &&
                        <ErrorOutline 
                        sx={{ 
                            mr: 0.5, 
                        }}
                    />
                    }
                    <Typography
                        variant="body1"
                        sx={{
                            wordBreak: "break-word",
                            fontSize: type === 'system' ? "0.9rem" : "inherit",
                            fontStyle: type === 'system' || isDeleted ? "italic" : "normal",
                            verticalAlign: "middle",
                        }}
                    >
                        {isDeleted ? t('CHAT_MESSAGE_DELETED') : content}
                    </Typography>
                </Box>
                {type != 'system' &&
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
                }
            </Paper>
        </Box>
    )
}

export default ChatMessageItem;