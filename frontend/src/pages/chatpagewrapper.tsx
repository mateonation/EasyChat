import { useParams, useNavigate } from "react-router-dom";
import ChatPage from "./chatpage";
import { useAuthContext } from "../contexts/AuthContext";
import api from "../api/axios";
import { ChatDto } from "../types/chat.dto";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

const BASE = import.meta.env.VITE_BASE_PATH;

const ChatPageWrapper = () => {
    const { t } = useTranslation();
    const { chatId } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [chat, setChat] = useState<ChatDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorType, setErrorType] = useState<null | number>(null);

    useEffect(() => {
        // Check if user is logged in
        const loggedUser = localStorage.getItem("user");
        if (!loggedUser) {
            navigate(`${BASE}/login`, { replace: true });
            return;
        }

        const parsedChatId = Number(chatId);
        const isValidChatId = !isNaN(parsedChatId) && parsedChatId > 0;

        if (!isValidChatId) {
            navigate(`${BASE}/chats`, { replace: true });
            return;
        }

        const fetchChat = async () => {
            try {
                const res = await api.get<ChatDto>(`/chats/${parsedChatId}`);
                setChat(res.data);
            } catch (err: any) {
                if (err.response) {
                    setErrorType(err.response.status); // Set error type based on response status
                    console.error(err.response.data.message);
                } else {
                    setErrorType(500); // Internal Server Error
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
    }, [chatId]);

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
                {t('GENERIC_MSG_LOADING')}
            </Box>
        );
    };

    if (errorType) {
        return (
            <Dialog
                open={true}
                onClose={() => { }}
                disableEscapeKeyDown
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {errorType === 404 ?
                        t('GENERIC_MSG_NOT_FOUND')
                        : errorType === 403 ?
                            t('GENERIC_MSG_FORBIDDEN')
                            : t('ERR_UNEXPECTED')
                    }
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {errorType === 404 ?
                            t('DOES_NOT_EXIST', {
                                field: t('CHAT'),
                            })
                            : errorType === 403 ?
                                t('YOU_ARE_NOT_MEMBER')
                                : t('FAILED_TO_FETCH_DETAILS', {
                                    field: t('CHAT'),
                                })
                        }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="text"
                        onClick={() => navigate(`${BASE}/chats`, { replace: true })}
                    >
                        {t('GENERIC_ANSWER_OK')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (chat && user) {
        return (
            <ChatPage chatId={chat.id} sessionUserId={user.id} onChatInfo={chat} />
        );
    }
}


export default ChatPageWrapper;