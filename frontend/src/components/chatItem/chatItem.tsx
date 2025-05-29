import { Avatar, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_BASE_PATH;

interface ChatItemProps {
    chat: {
        id: number;
        name: string;
        lastMessagePrefix: string;
        lastMessageContent: string;
        lastMessageSentDate: string;
    };
}

const ChatItem = ({ chat }: ChatItemProps) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`${BASE}/chats/${chat.id}`);
    };

    return (
        <ListItem
            component="li"
            onClick={handleClick}
        >
            <ListItemIcon>
                <ListItemAvatar>
                    <Avatar
                        sx={{ width: 40, height: 40, marginRight: 2 }}
                        alt={chat.name.charAt(0).toUpperCase()}
                    >
                        {chat.name.charAt(0).toUpperCase()}
                    </Avatar>
                </ListItemAvatar>
            </ListItemIcon>
            <ListItemText 
                primary={chat.name}
                secondary={
                    <>
                        <strong>{chat.lastMessagePrefix}:</strong> {chat.lastMessageContent}
                        <br />
                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>{new Date(chat.lastMessageSentDate).toLocaleString()}</span>
                    </>
                }
            />
        </ListItem>
    );
};

export default ChatItem;