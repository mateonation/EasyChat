import { useParams, useNavigate } from "react-router-dom";
import ChatPage from "./chatpage";
import { useAuthContext } from "../contexts/AuthContext";
import api from "../api/axios";
import { ChatDto } from "../types/chat.dto";
import { ErrorResponse } from "../types/errorResponse.interface";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

const BASE = import.meta.env.VITE_BASE_PATH;

const ChatPageWrapper = () => {
    const { t } = useTranslation();
    const { chatId } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [chat, setChat] = useState<ChatDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem("user");
        if (!user) {
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
            } catch (error: unknown) {
                if (error !== null && typeof error === "object" && "message" in error) {
                    const reason = (error as ErrorResponse).message;
                    console.error(reason);
                    switch (reason) {
                        case `Chat with ID ${chatId} not found`:
                            alert(t('DOES_NOT_EXIST', { field: t('CHAT') }));
                            break;
                        case `You are not a member of this chat`:
                            alert(t('YOU_ARE_NOT_MEMBER'));
                            break;
                        default:
                            alert(t('ERR_UNEXPECTED'));
                            break;
                    }
                }
                navigate(`${BASE}/chats`, { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
    }, [chatId, navigate, t, user]);

    if (loading || !chat || !user) return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <CircularProgress />
        </Box>
    );

    return (
        <ChatPage chatId={chat.id} sessionUserId={user.id} onChatInfo={chat} />
    );
}


export default ChatPageWrapper;