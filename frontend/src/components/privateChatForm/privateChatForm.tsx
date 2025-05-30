import { useState } from "react";
import api from "../../api/axios";
import { Avatar, Box, Button, CircularProgress, DialogActions, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Search, Close as CloseIcon } from "@mui/icons-material";
import { User } from "../../types/userdata.dto";
import { t } from "i18next";

export default function PrivateChatForm({ onClose }: { onClose: () => void }) {
    const [username, setUsername] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

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
    };

    return (
        <Box>
            {!selectedUser && (
                <>
                    <TextField
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
                                    <IconButton onClick={handleSearch}>
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
                            <Paper
                                elevation={3}
                                sx={{
                                    maxHeight: 300,
                                    overflowY: "auto",
                                    mt: 2,
                                    borderRadius: 2,
                                }}    
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
                        )
                    )}
                </>
            )}

            {selectedUser && (
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
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            <Button
                variant="contained"
                onClick={handleCreateChat}
                disabled={!selectedUser || loading}
                fullWidth
                sx={{ 
                    mt: 3 
                }}
            >
                {t("CHAT_CREATE")}
            </Button>
        </Box>
    );
}