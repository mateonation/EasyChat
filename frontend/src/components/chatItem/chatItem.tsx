import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const BASE = import.meta.env.VITE_BASE_PATH;

interface ChatItemProps {
    chat: {
        id: number;
        name: string;
        type: string;
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
    const formatDate = (isoDate: string): string => {
        const now = new Date();
        const date = new Date(isoDate); // Parse the ISO date string into a Date object

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

    // Logic to format the last message sent based on prefix and type of chat
    const formatMessage = () => {
        const prefix = chat.lastMessagePrefix;
        let prefixStr = prefix;
        let content = chat.lastMessageContent;

        // If prefix says is a system message, format it in italics and return it
        if (prefix === '<system>') return <em>{content}</em>

        // If chat is private and the prefix is empty, it is understood that the author of that message is the user itself, so we return the content directly
        if (chat.type === 'private') {
            if (prefix === '') return content;
        }

        // If prefix is <you>, it means the user sent the last message, so we format it as translated string like "You: content"
        if (prefix === '<you>') prefixStr = t('CHAT_PREFIX_YOU');

        // If the prefix says that the user was deleted, we format it as translated string like "Deleted User: content"
        else if (prefix === '<user_deleted>') prefixStr = t('CHAT_DELETED_USER');

        // If the content of the message is <msg_deleted> we replace it with a translated string
        if (content === '<msg_deleted>') content = t('CHAT_MESSAGE_DELETED');

        // For other cases, it's understood that the sender is another member of a group, so we format it as "MemberName: content"
        return <><strong>{prefixStr}:</strong> {content}</>
    }
    return (
        <ListItem
            component="li"
            onClick={handleClick}
            sx={{
                cursor: 'pointer',
                borderRadius: 2,
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
                mb: 1,
            }}
        >
            <ListItemAvatar>
                <Avatar
                    sx={{ width: 40, height: 40, marginRight: 2 }}
                    alt={chat.name}
                >
                    {chat.type === 'group' ? <GroupIcon /> : chat.name.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                    >
                        {chat.name}
                    </Typography>
                }
                secondary={
                    <>
                        <Typography
                            variant="body2"
                            component="span"
                            color="text.secondary"
                            sx={{ display: 'block' }}
                        >
                            {formatMessage()}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="gray"
                            sx={{ fontSize: '0.75rem' }}
                        >
                            {formatDate(chat.lastMessageSentDate)}
                        </Typography>
                    </>
                }
            />
        </ListItem>
    );
};

export default ChatItem;