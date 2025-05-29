import { useEffect, useState } from "react"
import { ChatDto } from "../types/chat.dto"
import api from "../api/axios";
import { Box, CircularProgress, Fab, List, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { t } from "i18next";
import ChatItem from "../components/chatItem";

const ChatsListPage = () => {
    const [chats, setChats] = useState<ChatDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        api.get<ChatDto[]>('/chats/my')
            .then(res => {
                if(Array.isArray(res.data)) {
                    setChats(res.data);
                } else {
                    setError(t('CHATS_LIST_UNEXPECTED_FORMAT'));
                    setChats([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch chats:", err);
                setError(t('CHATS_LIST_ERROR'));
                setChats([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // Render the list of chats or a loading indicator
    if (loading) {
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            sx={{ fontSize: '1.5rem', color: 'secondary.main' }}
        >
            <Typography
            variant="h6"
            mb={2}
            >
                {t('CHATS_LIST_LOADING')}
            </Typography>
            <CircularProgress />
        </Box>
    }

    if (error) {
        return (
            <Typography
                align="center"
                variant="h6"
                mt={4}
                sx={{ fontSize: '1.5rem', color: 'error.main' }}
            >
                {error}
            </Typography>
        );
    }

    if (chats.length === 0) {
        return (
            <Typography
                align="center"
                variant="h6"
                mt={4}
                sx={{ fontSize: '1.5rem', color: 'info.main' }}
            >
                {t('CHATS_LIST_EMPTY_STRING0')}
                <br />
                {t('CHATS_LIST_EMPTY_STRING1')}
            </Typography>
        );
    }

    return (
        <Box
            p={2}
        >
            <Typography
                variant="h4"
                gutterBottom
            >
                {t('CHATS_LIST_PAGE_TITLE')}
            </Typography>
            <List
                component="ul"
            >
                {chats.map(chat => (
                    <ChatItem key={chat.id} chat={chat} />
                ))}
            </List>
            <Fab 
                color="primary"
                aria-label="Create new chat"
                onClick={handleOpenModal}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1100,
                    boxShadow: '0px 3px 7px rgba(0, 0, 0, 0.45)',
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default ChatsListPage;