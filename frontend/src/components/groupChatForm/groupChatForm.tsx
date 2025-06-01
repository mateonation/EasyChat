import { useState } from "react";
import api from "../../api/axios";
import { Avatar, Box, Button, DialogActions, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { t } from "i18next";
import { User } from "../../types/userdata.dto";
import { ChatDto } from "../../types/chat.dto";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    onClose: () => void;
    onChatCreated: (chat: ChatDto) => void;
}

export default function GroupChatForm({ onClose, onChatCreated }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const handleSearch = async () => {
        const results = await api.get(`/users/search?username=${query}`);
        // Filter out already selected users from the results
        const filteredResults = results.data.filter((user: User) => !selectedUsers.find((u) => u.id === user.id));
        setSearchResults(filteredResults);
    };

    const addUser = (user: User) => {
        setSelectedUsers([...selectedUsers, user]); // Add to selected users
        setSearchResults([]); // Clear search results
        setQuery(""); // Reset query input
    }

    const removeUser = (uid: number) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== uid));
    }

    const createGroup = async () => {
        try {
            // Alert if group name is empty (this alert should not appear, but just in case)
            if (!name.trim()) {
                alert(t('FORM_GROUP_NAME_REQUIRED'));
                return;
            }

            // Return if no users are selected
            if (selectedUsers.length === 0) return;

            // Save selected users in a const
            const usernames = selectedUsers.map((u) => u.username);

            // Make API call to create group chat
            const res = await api.post("/chats/create/group", {
                name,
                description,
                usernames,
            });

            // Get chat from response
            const newChat: ChatDto = res.data.chat;

            // Send new chat to parent component
            onChatCreated(newChat);

            // Close modal
            onClose();
        } catch (error) {
            console.error("Failed to create group chat:", error);
            alert("Failed to create group chat. Please try again.");
            return;
        }

    };

    return (
        <AnimatePresence mode="wait">
            <Box mt={2}>
                <motion.div
                    key="search-form"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <TextField
                        label={t('FORM_GROUP_NAME_LABEL')}
                        placeholder={t('FORM_GROUP_NAME_PLACEHOLDER')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label={t('FORM_DESCRIPTION_LABEL')}
                        placeholder={t('FORM_GROUP_DESCRIPTION_PLACEHOLDER')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{
                            my: 2,
                            input: {
                                maxLength: 255
                            }
                        }}
                    />

                    <Typography
                        component="p"
                        variant="body1"
                    >
                        {t('FORM_MEMBERS_ADD')}
                    </Typography>
                    <Box mt={2}>
                        <TextField
                            id="user-search"
                            label={t("FORM_USERNAME_LABEL")}
                            placeholder={t('FORM_MEMBERS_PLACEHOLDER')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                            fullWidth
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
                    </Box>
                    {searchResults.length > 0 && (
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
                                aria-label="Results"
                            >
                                <List dense>
                                    {searchResults.map((user) => (
                                        <ListItem
                                            key={user.id}
                                            component="li"
                                            onClick={() => addUser(user)}
                                            role="option"
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
                    )}
                </motion.div>
                {selectedUsers.map((user) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box
                            key={user.id}
                            role="group"
                            aria-label={`${t('GENERIC_ANSWER_SELECT')}: ${user.username}`}
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
                        >
                            <Avatar>
                                {user.username[0].toUpperCase()}
                            </Avatar>
                            <Typography
                                sx={{
                                    flexGrow: 1,
                                }}
                            >
                                {user.username}
                            </Typography>
                            <IconButton
                                onClick={() => removeUser(user.id)}
                                aria-label={t("GENERIC_ANSWER_REMOVE")}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </motion.div>
                ))}

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={createGroup}
                        disabled={!name.trim() || selectedUsers.length === 0}
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
