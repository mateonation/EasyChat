import { useTranslation } from "react-i18next";
import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';
import { Add, Archive, } from "@mui/icons-material";
import { ChatDto } from "../../types/chat.dto";
import { useState } from "react";
import ManageMembersForm from "../manageMembersForm";

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
    const [isManagingMembers, setIsManagingMembers] = useState(false);
    const [isEditingChat, setIsEditingChat] = useState(false);

    const otherMember = chat.type === 'private' ? chat.members.find(m => m.id !== sessionUserId) : null;
    const currentMember = chat.type === 'group' ? chat.members.find(m => m.id === sessionUserId) : null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <Avatar
                sx={{
                    mx: "auto",
                    mt: 2,
                }}
            >
                {
                    chat.type === 'group' ? <GroupIcon /> :
                        chat.type === 'archive' ? <Archive /> :
                            chat.type === 'private' ? initial :
                                <WarningIcon />
                }
            </Avatar>
            <DialogTitle
                textAlign="center"
                sx={{
                    padding: 0,
                }}
            >
                {chat.name}
            </DialogTitle>
            <Typography
                variant="caption"
                textAlign="center"
                color="textSecondary"
            >
                {chat.type === 'private' ? (
                    t('DATE_REGISTRATION', {
                        date: new Date(otherMember?.registerDate ?? '').toLocaleDateString()
                    })
                ) : chat.type === 'group' ? (
                    t('DATE_CREATION', {
                        date: new Date(chat?.creationDate ?? '').toLocaleDateString(),
                    })
                ) : null}
            </Typography>
            <DialogContent>
                {isManagingMembers ? (
                    <ManageMembersForm
                        chat={chat}
                        onClose={() => setIsManagingMembers(false)}
                    />
                ) : isEditingChat ? (
                    null // Placeholder
                ) : (
                    <>
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
                                </Box>
                                <List
                                    dense
                                >
                                    {currentMember && currentMember.role != 'member' &&  // Add members button won't appear if the user has member role
                                        <ListItem
                                            onClick={() => setIsManagingMembers(true)}
                                            aria-label={t('FORM_MEMBERS_ADD')}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    color: 'primary.main',
                                                },
                                            }}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <Add />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={t('FORM_MEMBERS_ADD')}
                                            />
                                        </ListItem>
                                    } {chat.members.map((member) => (
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
                                <Box
                                    display="flex"
                                    justifyContent="right"
                                    gap={2}
                                >
                                    <Tooltip
                                        title={t('EDIT_CHAT_LABEL')}
                                    >
                                        <Button
                                            variant="contained"
                                            disabled={!currentMember?.role || currentMember.role === 'member'} // Disable if current user's role is member
                                            color="primary"
                                            onClick={() => setIsEditingChat(true)}
                                        >
                                            {t('EDIT_CHAT_LABEL')}
                                        </Button>
                                    </Tooltip>
                                </Box>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    display="block"
                                    textAlign="center"
                                    mt={2}
                                >
                                    {t('DATE_LAST_MODIFIED', {
                                        date: new Date(chat.updateDate).toLocaleDateString(),
                                    })}
                                </Typography>
                            </>
                        ) : <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            textAlign="center"
                            mt={2}
                        >
                            {t('CHAT_DATE_CREATION', {
                                date: new Date(chat.creationDate).toLocaleDateString(),
                            })}
                        </Typography>
                        }
                    </>
                )}
            </DialogContent>
        </Dialog >
    );
};

export default ChatInfoModal;