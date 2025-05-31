import { useState } from "react";
import api from "../../api/axios";
import { Avatar, Box, Button, CircularProgress, DialogActions, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { User } from "../../types/userdata.dto";
import { t } from "i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChatDto } from "../../types/chat.dto";

interface Props {
    onClose: () => void;
    userChats: ChatDto[];
}

export default function PrivateChatForm({ onClose, userChats }: Props) {
    const [username, setUsername] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [chatExists, setChatExists] = useState(false);

    const handleSearch = async () => {
        if (!username.trim()) return;
        try {
            setLoading(true);
            const res = await api.get(`/users/search?username=${username}`);
            setResults(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChat = async () => {
        if (!selectedUser) return;
        
        // Check for an existing private chat with the same name as the selected user's username
        const existingChat = userChats.find(chat =>
            chat.name === selectedUser.username 
            && chat.type === 'private'
        );

        // If it exists, set the chatExists state to true and return
        if (existingChat) {
            setChatExists(true);
            return;
        }

        // If not, then create it
        try {
            await api.post('/chats/create/private', {
                usernames: [selectedUser.username],
            });
            alert('Chat created');
            onClose();
        } catch (error) {
            console.error("Error creating chat:", error);
            alert('Error al crear el chat');
        }
    };

    const handleRemoveUser = () => {
        setSelectedUser(null);
        setUsername('');
        setResults([]);
        if (chatExists) setChatExists(false);
    };

    return (
        <AnimatePresence mode="wait">
            <Box>
                {!selectedUser && (
                    <motion.div
                        key="search-form"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TextField
                            id="user-search"
                            aria-label={t("FORM_USERNAME_LABEL")}
                            label={t("FORM_USERNAME_LABEL")}
                            placeholder={t("FORM_USERNAME_LABEL")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSearch}
                                            aria-label={t("GENERIC_ANSWER_SEARCH")}
                                        >
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {loading ? (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            results.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            maxHeight: 160,
                                            overflowY: "auto",
                                            mt: 2,
                                            borderRadius: 2,
                                        }}
                                        role="listbox"
                                        aria-label="results"
                                    >
                                        <List dense>
                                            {results.map((user) => (
                                                <ListItem
                                                    key={user.id}
                                                    component="li"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setResults([]);
                                                    }}
                                                    sx={{
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            backgroundColor: "action.hover",
                                                        },
                                                        transition: "background-color 0.2s",
                                                        padding: 1.5,
                                                        borderRadius: 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                    role="option"
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            {user.username[0].toUpperCase()}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={user.username} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                </motion.div>
                            )
                        )}
                    </motion.div>
                )}

                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            mt={2}
                            p={1}
                            sx={{
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor: "action.selected",
                            }}
                            role="group"
                            aria-label={`${t('GENERIC_ANSWER_SELECT')}: ${selectedUser.username}`}
                        >
                            <Avatar>
                                {selectedUser.username[0].toUpperCase()}
                            </Avatar>
                            <Typography
                                sx={{
                                    flexGrow: 1,
                                }}
                            >
                                {selectedUser.username}
                            </Typography>
                            <IconButton
                                onClick={handleRemoveUser}
                                aria-label={t("GENERIC_ANSWER_REMOVE")}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                        {chatExists && (
                            <Typography
                                color="error"
                                component="p"
                                variant="caption"
                                sx={{
                                    mt: 1,
                                }}
                            >
                                {t("PRIVATE_CHAT_EXISTS", {
                                    user: selectedUser.username
                                }
                                )}
                            </Typography>
                        )}
                    </motion.div>
                )}

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleCreateChat}
                        disabled={!selectedUser || loading || chatExists}
                        sx={{
                            mt: 2,
                        }}
                    >
                        {t("CHAT_CREATE")}
                    </Button>
                </DialogActions>
            </Box>
        </AnimatePresence>
    );
}