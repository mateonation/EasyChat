import { 
    Avatar, 
    ListItem, 
    ListItemAvatar, 
    ListItemIcon, 
    ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

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

    // Format the date of the last message based on the difference
    const formatDate = (isoDate: string) => {
        const now = new Date();
        const date = new Date(isoDate);
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        // If the difference is less than a minute, return "Now"
        if (diffMinutes < 1) return t('DATE_NOW');

        // If it's sent in the same day, return the time in "HH:MM" format
        const sameDay = now.toDateString() === date.toDateString();
        if (sameDay) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // If it was sent more than 24 hours ago, return "Yesterday"
        if (diffDays === 1) return t('DATE_YESTERDAY');

        // If it was sent within the last 6 days, return the day of the week
        if (diffDays <= 6) {
            return date.toLocaleDateString(undefined, { weekday: 'long' });
        }

        // If it was sent in the last year, return the date in "MM/DD/" format
        if (date.getFullYear() === now.getFullYear()) {
            return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        }

        // For older dates, return the full date in "MM/DD/YY" format
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().slice(2)}`;
    }

    // Logic for the content of the message
    const formatMessage = () => {
        const prefix = chat.lastMessagePrefix;
        let prefixStr = prefix;

        if(prefix === '<you>') prefixStr = t('CHAT_PREFIX_YOU');
        else if(prefix === '<user_deleted>') prefixStr = t('CHAT_DELETED_USER');
        else if(prefix === '<system>') prefixStr = "";

        let content = chat.lastMessageContent;
        if (content === '<msg_deleted>') content = t('CHAT_MESSAGE_DELETED');

        if(prefix === '<system>') return <em>{content}</em>

        return <><strong>{prefixStr}:</strong> {content}</>
    }
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
                        {formatMessage()}
                        <br />
                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>{formatDate(chat.lastMessageSentDate)}</span>
                    </>
                }
            />
        </ListItem>
    );
};

export default ChatItem;