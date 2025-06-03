import { ArrowBack } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_BASE_PATH;

interface Props {
    chatName: string;
}

const ChatHeader = ({ chatName }: Props) => {
    const navigate = useNavigate();
    const initial = chatName.charAt(0).toUpperCase();
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
                onClick={() => navigate(`${BASE}/chats`, { replace: true })}
                aria-label={t('BACK')}
            >
                <ArrowBack />
            </IconButton>
            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
            >
                <Avatar>
                    {initial}
                </Avatar>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '85%',
                    }}
                >
                    {chatName}
                </Typography>
            </Box>
        </Box>
    )
}

export default ChatHeader;