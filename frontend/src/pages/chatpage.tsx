import React, { useEffect, useRef, useState, useCallback, JSX } from "react";
import { MessageDto } from "../types/message.dto";
import api from "../api/axios";
import { Box, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import ChatMessageItem from "../components/chatMessageItem";
import { Send } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSocket } from "../contexts/SocketContext";

interface PaginatedMessages {
    messages: MessageDto[];
    total: number;
    hasMore: boolean;
}

interface Props {
    chatId: number;
    sessionUserId: number;
}

const ChatPage: React.FC<Props> = ({ chatId, sessionUserId }) => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    const topRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Fetch Messages by page
    const fetchMessages = useCallback(async (page: number) => {
        if (!hasMore) return;

        setLoading(true);
        const res = await api.get<PaginatedMessages>(
            `/message/from/${chatId}?page=${page}`
        );

        const newMessages = res.data.messages;
        // Avoid duplicated messages by filtering existing ones
        setMessages((prev) => {
            const existingIds = new Set(prev.map(msg => msg.id));
            const filterNewMssgs = newMessages.filter(msg => !existingIds.has(msg.id));
            return [...filterNewMssgs, ...prev];
        });
        setHasMore(res.data.hasMore);
        setLoading(false);
    }, [chatId, hasMore]);

    // Initial fetch
    useEffect(() => {
        fetchMessages(page);
    }, []);

    // WebSocket listener for incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg: MessageDto) => {
            if (msg.chatId !== chatId) return; // Ignore messages not in this chat

            setMessages((prev) => {
                // Prevent duplicated messages
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });

            // Scroll to bottom if almost at the bottom
            const container = scrollContainerRef.current;
            if (container) {
                const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
                if (nearBottom) {
                    requestAnimationFrame(() => {
                        container.scrollTop = container.scrollHeight;
                    });
                }
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        }
    }, [socket, chatId]);

    // Join chat room and leave previous one if exists
    useEffect(() => {
        if (!socket || !chatId) return;

        // Leave previous room if it exists
        const prevChatId = Number(localStorage.getItem("chatId"));
        if(prevChatId && prevChatId !== chatId) socket.emit("leaveChat", prevChatId);

        // Enter new chat room
        socket.emit("joinChat", chatId);
        localStorage.setItem("chatId", chatId.toString());
    }, [chatId, socket]);

    // Scroll listener for infinite scroll up
    const handleScroll = () => {
        if (
            scrollContainerRef.current &&
            scrollContainerRef.current.scrollTop === 0 &&
            hasMore &&
            !loading
        ) {
            setPage((prev) => {
                const nextPage = prev + 1;
                fetchMessages(nextPage);
                return nextPage;
            });
        }
    };

    // Scroll to bottom on new messages
    useEffect(() => {
        const container = scrollContainerRef.current;

        if (container) container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) container.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    // Scroll to the top on initial mount
    useEffect(() => {
        if (isInitialMount.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
            isInitialMount.current = false;
        }
    }, []);

    const sendMessage = async () => {
        if (error !== null) setError(null); // Clear error if before sending a message
        if (!newMessage.trim()) return; // Don't send empty messages
        const trimmed = newMessage.trim();
        if (!trimmed) return;

        if (trimmed.startsWith("<")) {
            setError(t('FIELD_CANNOT_START_WITH', {
                field: t('FORM_MESSAGE_LABEL'),
                char: "<",
            }));
            return;
        } else if (trimmed.endsWith(">")) {
            setError(t('FIELD_CANNOT_END_WITH', {
                field: t('FORM_MESSAGE_LABEL'),
                char: ">",
            }));
            return;
        } else {
            setError(null);
        }
        try {
            const res = await api.post<MessageDto>("/message/send", {
                chatId,
                content: trimmed,
            });
            const sentMessage = res.data;
            socket?.emit("sendMessage", sentMessage); // Emit new message to socket
            setNewMessage(""); // Clear input after sending

            setMessages((prev) => [...prev, sentMessage]); // Add message to the screen directly

            // Scroll to bottom after sending
            const container = scrollContainerRef.current;
            if (container) {
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError(t('FAILED_TO_SEND', {
                field: t('FORM_MESSAGE_LABEL'),
            }));
            return;
        }
    }

    const formatDay = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (a: Date, b: Date) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        if (isSameDay(date, today)) return t('DATE_TODAY');
        if (isSameDay(date, yesterday)) return t('DATE_YESTERDAY');

        return date.toLocaleDateString();
    };

    // Order messages by putting the old ones up
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime()
    );

    const renderMessages = () => {
        const items: JSX.Element[] = [];
        let lastDate = "";

        for (const msg of sortedMessages) {
            const dayLabel = formatDay(msg.sentDate);
            if (dayLabel !== lastDate) {
                items.push(
                    <Box
                        key={`day-${dayLabel}`}
                        textAlign="center"
                        my={2}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                px: 2,
                                py: 0.5,
                                borderRadius: 1
                            }}
                        >
                            {dayLabel}
                        </Typography>
                    </Box>
                );
                lastDate = dayLabel;
            }

            items.push(
                <ChatMessageItem
                    key={msg.id}
                    id={msg.id}
                    senderId={msg.senderId}
                    chatId={msg.chatId}
                    senderUsername={msg.senderUsername}
                    content={msg.content || ""}
                    sentDate={msg.sentDate}
                    isOwnMessage={msg.senderId === sessionUserId}
                    type={msg.type}
                    isDeleted={false}
                />
            );
        }

        return items;
    };

    return (
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
        >
            <Box
                ref={scrollContainerRef}
                flex={1}
                overflow="auto"
                px={1}
                py={2}
                display="flex"
                flexDirection="column"
            >
                <div ref={topRef} />
                {renderMessages()}
                {loading && (
                    <Box textAlign="center" my={2}>
                        <CircularProgress size={20} />
                    </Box>
                )}
            </Box>
            <Box
                display="flex"
                p={2}
                borderTop="1px solid #ddd"
                alignItems="center"
            >
                <TextField
                    fullWidth
                    placeholder={t('FORM_MESSAGE_PLACEHOLDER')}
                    value={newMessage}
                    error={error !== null}
                    helperText={error || ""}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />
                <IconButton onClick={sendMessage} sx={{ ml: 1 }}>
                    <Send />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatPage;