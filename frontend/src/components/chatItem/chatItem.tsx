import { ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_BASE_PATH;

interface ChatItemProps {
    chat: {
        id: number;
        name: string;
        lastMessagePrefix: string;
        lastMessageContent: string;
        lastMessageDate: string;
    };
}

const ChatItem = ({ chat }: ChatItemProps) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`${BASE}/chats/${chat.id}`);
    };

    return (
        <ListItem
            component="button"
            onClick={handleClick}
        >
            <ListItemText 
                primary={chat.name}
                secondary={
                    <>
                        <strong>{chat.lastMessagePrefix}:</strong> {chat.lastMessageContent.slice(0, 15) + '...'}
                        <br />
                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>{new Date(chat.lastMessageDate).toLocaleString()}</span>
                    </>
                }
            />
        </ListItem>
    );
};

export default ChatItem;