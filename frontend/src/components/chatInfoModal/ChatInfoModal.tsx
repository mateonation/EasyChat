import { useTranslation } from "react-i18next";
import { Avatar, Box, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';
import { Add, Archive, } from "@mui/icons-material";
import { ChatDto } from "../../types/chat.dto";

interface Props {
    open: boolean;
    onClose: () => void;
    chat: ChatDto;
    sessionUserId: number;
}

const ChatInfoModal = ({
    open,
    onClose,
    chat,
    sessionUserId,
}: Props) => {
    const { t } = useTranslation();
    const initial = chat.name.charAt(0).toUpperCase();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle
                textAlign="center"
            >
                <Avatar
                    sx={{
                        mx: "auto",
                    }}
                >
                    {
                        chat.type === 'group' ? <GroupIcon /> : 
                        chat.type === 'archive' ? <Archive /> : 
                        chat.type === 'private' ? initial :
                        <WarningIcon />
                    }
                </Avatar>
                <Typography
                    mt={0.5}
                >
                    {chat.name}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {chat.description &&
                    <>
                        <Typography
                            variant="subtitle1"
                        >
                            {
                                chat.type === 'group' ? 
                                t('FORM_GROUP_DESCRIPTION_LABEL') : 
                                t('FORM_DESCRIPTION_LABEL')
                            }
                        </Typography>
                        <Typography
                            component="p"
                            variant="body2"
                            color="textSecondary"
                            textAlign="justify"
                            minHeight={200} // Ensures a minimum height for the description box
                        >
                            {chat.description}
                        </Typography>
                    </>
                }
                {chat.type === "group" ? (
                    <>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                        >
                            <Typography
                                variant="subtitle1"
                            >
                                {t('FORM_MEMBERS_LABEL')}
                            </Typography>
                            <Tooltip
                                title={t('FORM_MEMBERS_ADD')}
                            >
                                <IconButton>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <List
                            dense
                        >
                            {chat.members.map((member) => (
                                <ListItem
                                    key={member.id}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            {member.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box 
                                                display="flex" 
                                                justifyContent="space-between"
                                            >
                                                <Typography>
                                                    {member.username}
                                                </Typography>
                                                <Typography 
                                                    variant="caption"
                                                >
                                                    {
                                                        member.role === 'owner' ? t('MEMBER_ROLE_OWNER') : 
                                                        member.role === 'admin' ? t('MEMBER_ROLE_ADMIN') : 
                                                        member.role === 'member' ? t('MEMBER_ROLE_MEMBER') : 
                                                        member.role
                                                    }
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={t('DATE_JOINED', {
                                            date: new Date(member.joinDate).toLocaleDateString(),
                                        })}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            textAlign="center"
                            mt={2}
                        >
                            {t('DATE_CREATION', {
                                date: new Date(chat.creationDate).toLocaleDateString(),
                            })}
                        </Typography>
                    </>
                ) : (
                    <Box textAlign="center">
                        <Typography variant="body2" mt={2}>
                            Date of register
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog >
    );
};

export default ChatInfoModal;