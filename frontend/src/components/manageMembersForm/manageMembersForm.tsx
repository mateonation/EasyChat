import { useTranslation } from "react-i18next";
import { useState } from "react";
import { User } from "../../types/userdata.dto";
import api from "../../api/axios";
import { Avatar, Box, Button, DialogActions, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import { ChatDto } from "../../types/chat.dto";

interface Props {
    chat: ChatDto;
    onClose: () => void;
}

const ManageMembersForm = ({ chat, onClose, }: Props) => {
    const { t } = useTranslation();

    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (query.trim().length === 0) return;
        setLoading(true);
        try {
            const results = await api.get<User[]>(`/users/search?username=${query}`);

            // Filter out already selected users from the results
            const filteredResults = results.data.filter((user: User) => !selectedUsers.find((u) => u.id === user.id));

            // Filter out users that are already members of the chat
            const chatMemberUsernames = chat.members.map(member => member.username);
            const finalResults = filteredResults.filter((user) => !chatMemberUsernames.includes(user.username));

            if (finalResults.length === 0) {
                setSearchError(t("NO_RESULTS_FOR", {
                    query: query.trim(),
                }));
            } else {
                setSearchError(null);
            }
            setSearchResults(finalResults);
        } catch (error) {
            console.error("Error searching users:", error);
            alert(t("FAILED_TO_FETCH", {
                field: t("USERS"),
            }));
        } finally {
            setLoading(false);
        }
    };

    const toggleUser = (user: User) => {
        if (selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers(prev => [...prev, user]);
        }
        setQuery("");
        setSearchResults([]);
    };

    const addMembers = async () => {
        if (selectedUsers.length === 0) return;
        setLoading(true);
        try {
            const response = await api.post(`/chats/${chat.id}/member`, {
                usernames: selectedUsers.map(user => user.username),
            });
            
            onClose();
        } catch (error) {
            console.error("Error adding members:", error);
            alert(t("MEMBERS_ADD_ERROR_UNEXPECTED"));
        } finally {
            setLoading(false);
            setSelectedUsers([]);
        }
    }

    const removeUser = (uid: number) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== uid));
    }

    return (
        <Box>
            <Typography
                variant="h6"
                gutterBottom
            >
                {t("MEMBERS_MANAGE_LABEL")}
            </Typography>
            <TextField
                id="user-search"
                label={t("FORM_USERNAME_LABEL")}
                placeholder={t('FORM_MEMBERS_PLACEHOLDER')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                }}
                sx={{
                    mb: 2,
                    input: {
                        background: searchError ? '#ffebee' : 'transparent'
                    }
                }}
                fullWidth
                error={searchError !== null}
                helperText={searchError ? searchError : ''}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" >
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
                                    onClick={() => toggleUser(user)}
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
            {selectedUsers.map((user) => (
                <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box
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
                    onClick={addMembers}
                    disabled={selectedUsers.length === 0 || loading}
                    sx={{
                        mt: 2,
                    }}
                >
                    {t("FORM_MEMBERS_ADD")}
                </Button>
            </DialogActions>
        </Box>
    )
}

export default ManageMembersForm;