import React, { useEffect, useRef, useState, useCallback, JSX } from "react";
import { MessageDto } from "../types/message.dto";
import api from "../api/axios";
import { Box, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import ChatMessageItem from "../components/chatMessageItem";
import { Send } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSocket } from "../contexts/SocketContext";
import { ChatDto } from "../types/chat.dto";
import ChatHeader from "../components/chatHeader";
import ChatInfoModal from "../components/chatInfoModal";
import ModalKickedOut from "../components/modalKickedOut";

interface PaginatedMessages {
    messages: MessageDto[];
    total: number;
    hasMore: boolean;
}

interface Props {
    chatId: number;
    sessionUserId: number;
    onChatInfo: ChatDto;
}

const ChatPage: React.FC<Props> = ({ chatId, sessionUserId, onChatInfo }) => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const pageRef = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatDto | null>(null);
    const [chatInfo, setChatInfo] = useState<ChatDto>(onChatInfo);
    const [isKickedOutFromChat, setIsKickedOutFromChat] = useState(false);
    const fetchingRef = useRef(false);

    // Refs for scrolling and initial mount check
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const topMsgRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const handleChatUpdate = (updatedChat: ChatDto) => {
        setChatInfo(updatedChat);
    }

    const handleOpenInfo = (chat: ChatDto) => {
        setSelectedChat(chat);
        setInfoOpen(true);
    };

    const handleCloseInfo = () => {
        setSelectedChat(null);
        setInfoOpen(false);
    };

    // Fetch Messages by page
    const fetchMessages = useCallback(async () => {
        if (!hasMore || fetchingRef.current) return;

        fetchingRef.current = true;

        const container = scrollContainerRef.current;
        const prevTopMessage = topMsgRef.current;
        const prevTopOffset = prevTopMessage?.offsetTop ?? 0;

        try {
            const nextPage = pageRef.current + 1;

            const res = await api.get<PaginatedMessages>(`/message/from/${chatId}?page=${nextPage}`);
            const newMessages = res.data.messages;

            setMessages((prev) => {
                const existingIds = new Set(prev.map(msg => msg.id));
                const filterNewMssgs = newMessages.filter(msg => !existingIds.has(msg.id));
                return [...filterNewMssgs, ...prev];
            });

            if (!res.data.hasMore) setHasMore(false);

            pageRef.current = nextPage; // Update page reference
        } catch (err) {
            console.error(`Failed to fetch messages from chat_${chatId}:`, err);
        } finally {
            fetchingRef.current = false;

            // Restore scroll position after fetching new messages (wait 1 frame to ensure render is done)
            requestAnimationFrame(() => {
                if (container && prevTopMessage) {
                    const newTopOffset = prevTopMessage.offsetTop;
                    const diff = newTopOffset - prevTopOffset;
                    container.scrollTop += diff;
                }
            });
        }
    }, [chatId, hasMore]);

    // Initial fetch
    useEffect(() => {
        pageRef.current = 0; // Reset page on new chat
        setMessages([]); // Clear previous messages
        setHasMore(true); // Reset hasMore
        fetchMessages();
    }, [chatId]);

    // WebSocket listeners for incoming messages and chat updates
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg: MessageDto) => {
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

        const handleChatModifications = (updatedChat: ChatDto) => {
            if (updatedChat.id !== chatId) return;

            // Check if the user is still a member of the chat
            const stillAMember = updatedChat.members.some(m => m.id === sessionUserId);
            
            // If not, set the state to indicate kicking out of the chat and leave the chat web socket
            if (!stillAMember) {
                socket.emit('leaveChat', chatId);
                setIsKickedOutFromChat(true);
                return;
            }
            setChatInfo(updatedChat);
            setSelectedChat(updatedChat);
        };

        socket.on("chatUpdate", handleChatModifications);
        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("chatUpdate", handleChatModifications);
        }
    }, [socket, chatId]);

    // Join chat room and leave previous one if exists
    useEffect(() => {
        if (!socket || !chatId) return;

        // Leave previous room if it exists
        const prevChatId = Number(localStorage.getItem("chatId"));
        if (prevChatId && prevChatId !== chatId) socket.emit("leaveChat", prevChatId);

        // Enter new chat room
        socket.emit("joinChat", chatId);
        localStorage.setItem("chatId", chatId.toString());
    }, [chatId, socket]);

    // Scroll listener for infinite scroll up
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (
                container.scrollTop < 10 &&
                hasMore &&
                !fetchingRef.current
            ) {
                fetchMessages();
            }
        };

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) container.removeEventListener("scroll", handleScroll);
        };
    }, [fetchMessages, hasMore]);

    // Scroll to the bottom on initial mount
    useEffect(() => {
        if (isInitialMount.current && messages.length > 0 && bottomRef.current) {
            requestAnimationFrame(() => {
                bottomRef.current?.scrollIntoView({ behavior: "auto" });
            });
            isInitialMount.current = false; // Set to false after first render
        }
    }, [messages.length]);

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

            // Emit new message along with chatId to socket
            socket?.emit("sendMessage", {
                message: sentMessage,
                chatId: chatId,
            });

            // Clear input after sending
            setNewMessage("");

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

    // Render messages with day labels
    const renderMessages = () => {
        const items: JSX.Element[] = [];
        let lastDate = "";
        let firstMessageId: number | null = null;

        for (const msg of sortedMessages) {
            if (!firstMessageId) firstMessageId = msg.id; // Store ID of first message
            const dayLabel = formatDay(msg.sentDate);
            if (dayLabel !== lastDate) {
                items.push(
                    <Box
                        component="article"
                        key={`day-${dayLabel}`}
                        id={`day-${dayLabel}`}
                        aria-label={`day-${dayLabel}`}
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
                <article
                    key={msg.id}
                    id={`msg_${msg.id}`}
                    ref={msg.id === firstMessageId ? topMsgRef : null}
                >
                    <ChatMessageItem
                        id={msg.id}
                        senderId={msg.senderId}
                        senderUsername={msg.senderUsername}
                        content={msg.content || ""}
                        sentDate={msg.sentDate}
                        isOwnMessage={msg.senderId === sessionUserId}
                        type={msg.type}
                        isDeleted={msg.isDeleted}
                        chatType={onChatInfo.type}
                    />
                </article>
            );
        }

        return items;
    };

    return (
        <>
            <ChatHeader
                chat={chatInfo}
                onClick={() => handleOpenInfo(chatInfo)}
            />
            <Box
                component="main"
                ref={scrollContainerRef}
                flex={1}
                overflow="auto"
                px={1}
                display="flex"
                flexDirection="column"
            >
                {hasMore && fetchingRef.current === true && (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        my={2}
                    >
                        <CircularProgress
                            size={24}
                        />
                        <Typography
                            variant="body2"
                            mt={1}
                            color="text.secondary"
                            textAlign="center"
                        >
                            {t('GENERIC_MSG_LOADING')}
                        </Typography>
                    </Box>
                )}
                {renderMessages()}
                <div ref={bottomRef} />
            </Box>
            <Box
                component="footer"
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
            {selectedChat && (
                <ChatInfoModal
                    open={infoOpen}
                    onClose={handleCloseInfo}
                    chat={selectedChat!}
                    onChatUpdate={handleChatUpdate}
                    sessionUserId={sessionUserId}
                />
            )}
            <ModalKickedOut 
                open={isKickedOutFromChat}
                chatName={chatInfo.name}
            />
        </>
    );
};

export default ChatPage;