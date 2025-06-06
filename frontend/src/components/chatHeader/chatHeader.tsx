import { ArrowBack } from "@mui/icons-material";
import GroupIcon from '@mui/icons-material/Group';
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChatDto } from "../../types/chat.dto";

const BASE = import.meta.env.VITE_BASE_PATH;

interface Props {
    chat: ChatDto;
    onClick?: () => void;
}

const ChatHeader = ({ chat, onClick }: Props) => {
    const navigate = useNavigate();
    const initial = chat.name.charAt(0).toUpperCase();
    const { t } = useTranslation();

    return (
        <Box
            component="header"
            display="flex"
            alignItems="center"
            p={2}
            position={"sticky"}
            top={0}
            bgcolor="background.paper"
            zIndex={10}
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <IconButton
                edge="start"
                onClick={() => navigate(`${BASE}/chats`, { replace: true })}
                aria-label={t('BACK')}
            >
                <ArrowBack />
            </IconButton>
            <Box
                position="absolute"
                left="50%"
                display="flex"
                alignItems="center"
                gap={1.5}
                onClick={onClick}
                sx={{
                    transform: "translateX(-50%)",
                    cursor: onClick ? 'pointer' : 'default',
                }}
            >
                <Avatar>
                    {chat.type === 'group' ? (
                        <GroupIcon />
                    ) : (
                        initial
                    )}
                </Avatar>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 'lg',
                    }}
                >
                    {chat.name}
                </Typography>
            </Box>
        </Box>
    )
}

export default ChatHeader;