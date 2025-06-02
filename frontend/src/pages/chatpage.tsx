import React, { useEffect, useRef, useState, useCallback, JSX } from "react";
import { MessageDto } from "../types/message.dto";
import api from "../api/axios";
import { Box, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import ChatMessageItem from "../components/chatMessageItem";
import { Send } from "@mui/icons-material";

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
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

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

    // Scroll to bottom on initial load
    useEffect(() => {
        if (isInitialMount.current && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            isInitialMount.current = false;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        await api.post("/message/send", {
            chatId,
            content: newMessage.trim(),
        });
        setNewMessage("");
        // Web socket connection here???
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

        if (isSameDay(date, today)) return "Hoy";
        if (isSameDay(date, yesterday)) return "Ayer";

        return date.toLocaleDateString();
    };

    const renderMessages = () => {
        const items: JSX.Element[] = [];
        let lastDate = "";

        for (const msg of messages) {
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
                                bgcolor: "grey.300",
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
                flexDirection="column-reverse"
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
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
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