import { useState } from "react";
import api from "../../api/axios";
import { Avatar, Box, Button, DialogActions, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { t } from "i18next";
import { User } from "../../types/userdata.dto";

export default function GroupChatForm({ onClose }: { onClose: () => void }) {
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

    const addUser = (
        user: User,
    ) => {
        setSelectedUsers([...selectedUsers, user]); // Add to selected users
        setSearchResults([]); // Clear search results
        setQuery(""); // Reset query input
    }

    const removeUser = (
        uid: number,
    ) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== uid));
    }

    const createGroup = async () => {
        const usernames = selectedUsers.map((u) => u.username);
        const res = await api.post("/chats/create/group", {
            name,
            description,
            usernames,
        });
        alert("Group created");
        onClose();
    };

    return (
        <Box mt={2}>
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
                            label={t("FORM_USERNAME_LABEL")}
                            placeholder={t('FORM_MEMBERS_PLACEHOLDER')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
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
                    )}

            {selectedUsers.map((user) => (
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
    );
}
