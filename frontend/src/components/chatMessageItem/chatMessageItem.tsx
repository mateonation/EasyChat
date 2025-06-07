import { ErrorOutline, MoreVert } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { useState } from "react";
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
    onDeleteRequest?: (messageId: number) => void;
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
    onDeleteRequest,
}) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        onDeleteRequest?.(id);
        handleMenuClose();
    };

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
                    minWidth: type !== 'system' ? "25%" : "10%",
                    backgroundColor: isOwnMessage ? "primary.main" : type === "system" ? "action.hover" : "grey.300",
                    color: isOwnMessage ? "primary.contrastText" : "text.primary",
                    borderRadius: 2,
                }}
            >
                {chatType !== 'private' && !isOwnMessage &&
                    <Typography
                        variant="caption"
                        fontWeight="bold"
                    >
                        {senderUsername}
                    </Typography>
                }

                <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="space-between"
                >
                    <Box 
                        display="flex" 
                        alignItems="center" 
                        flex={1}
                    >
                        {isDeleted && (
                            <ErrorOutline 
                                sx={{ 
                                    mr: 0.5, 
                                }} 
                            />
                        )}
                        <Typography
                            variant="body1"
                            sx={{
                                wordBreak: "break-word",
                                fontSize: type === 'system' ? "0.9rem" : "inherit",
                                fontStyle: type === 'system' || isDeleted ? "italic" : "normal",
                                verticalAlign: "middle",
                                textAlign: type === 'system' ? "center" : "left",
                            }}
                        >
                            {isDeleted ? t('CHAT_MESSAGE_DELETED') : content}
                        </Typography>
                    </Box>
                    {isOwnMessage && !isDeleted && (
                        <>
                            <IconButton
                                size="small"
                                onClick={handleMenuOpen}
                                sx={{
                                    mb: 'auto',
                                    color: "primary.contrastText",
                                }}
                            >
                                <MoreVert 
                                    fontSize="small" 
                                />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleDeleteClick}>
                                    {t('GENERIC_ANSWER_DELETE')}
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>

                {type !== 'system' && (
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
                )}
            </Paper>
        </Box>
    );
}

export default ChatMessageItem;