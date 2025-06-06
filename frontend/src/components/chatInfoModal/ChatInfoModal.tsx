import { useTranslation } from "react-i18next";
import { Avatar, Box, Dialog, DialogContent, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';
import { Add, Archive, Close, Edit, Logout, MoreVert, } from "@mui/icons-material";
import { ChatDto } from "../../types/chat.dto";
import { useState } from "react";
import ManageMembersForm from "../manageMembersForm";
import { Menu, MenuItem } from '@mui/material';
import MemberRemovalConfirmDialog from "../memberRemovalConfirmDialog";
import EditChatForm from "../editChatForm";
import MemberEditRoleDialog from "../memberEditRoleDialog";

interface Props {
    open: boolean;
    onClose: () => void;
    chat: ChatDto;
    sessionUserId: number;
    onChatUpdate: (chat: ChatDto) => void;
}

const ChatInfoModal = ({
    open,
    onClose,
    chat,
    sessionUserId,
    onChatUpdate,
}: Props) => {
    const { t } = useTranslation();
    const initial = chat.name.charAt(0).toUpperCase();
    const [isManagingMembers, setIsManagingMembers] = useState(false);
    const [isEditingChat, setIsEditingChat] = useState(false);
    const otherMember = chat.type === 'private' ? chat.members.find(m => m.id !== sessionUserId) : null;
    const currentMember = chat.type === 'group' ? chat.members.find(m => m.id === sessionUserId) : null;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [selectedMemberUsernameSubMenu, setSelectedMemberUsernameSubMenu] = useState<string>('');
    const [selectedMemberIdSubMenu, setSelectedMemberIdSubMenu] = useState<number | null>(null);
    const [selectedMemberRoleSubMenu, setSelectedMemberRoleSubMenu] = useState<string | null>(null);
    const [selectedOwnUser, setSelectedOwnUser] = useState<boolean>(false);
    const [confirmKickOpen, setConfirmKickOpen] = useState(false);
    const [editRoleOpen, setEditRoleOpen] = useState(false);

    const handleMenuEditMemberOpen = (event: React.MouseEvent<HTMLElement>, memberId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedMemberId(memberId);
    };

    const handleMenuEditMemberClose = () => {
        setAnchorEl(null);
        setSelectedMemberId(null);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    bgcolor="background.paper"
                    zIndex={10}
                >
                    <Tooltip title={t('GENERIC_ANSWER_CLOSE')}>
                        <IconButton
                            onClick={onClose}
                            aria-label={t('CLOSE')}
                            sx={{
                                position: 'absolute',
                                left: 10,
                                top: 12,
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Tooltip>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        maxWidth="lg"
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
                        <Box
                            display="flex"
                            justifyContent="center"
                            textAlign={"center"}
                            alignItems="center"
                            width="100%"
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                    padding: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 'sm',
                                }}
                            >
                                <Typography
                                    noWrap
                                    variant="h6"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {chat.name}
                                </Typography>
                            </Box>
                            {!isEditingChat && !isManagingMembers && chat.type === 'group' && currentMember?.role !== 'member' &&
                                <Tooltip title={t('GENERIC_ANSWER_EDIT')}>
                                    <IconButton
                                        aria-label={t('EDIT')}
                                        size="small"
                                        onClick={() => setIsEditingChat(true)}
                                        sx={{
                                            position: 'absolute',
                                            right: 10,
                                            top: 12,
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Box>
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
                    </Box>
                </Box>
                <DialogContent>
                    {isManagingMembers ? (
                        <ManageMembersForm
                            chat={chat}
                            onClose={onClose}
                            onChatUpdate={onChatUpdate}
                        />
                    ) : isEditingChat ? (
                        <EditChatForm
                            chat={chat}
                            onClose={onClose}
                            onChatUpdate={onChatUpdate}
                        />
                    ) : (
                        <>
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
                                    fontStyle={chat.description ? 'normal' : 'italic'}
                                    whiteSpace={'pre-wrap'} // Preserves whitespace and line breaks
                                    minHeight={100} // Ensures a minimum height for the description box
                                    mb={2} // Margin bottom for spacing
                                    sx={{
                                        wordBreak: 'break-word', // Ensures long words break correctly
                                        overflowWrap: 'break-word', // Ensures long words break correctly
                                    }}
                                >
                                    {chat.description || t('DESCRIPTION_ISEMPTY')}
                                </Typography>
                            </>
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
                                        {currentMember && chat.type === 'group' &&
                                            <ListItem
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                }}>
                                                {currentMember.role != "member" &&
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        width="50%"
                                                        borderRadius={2}
                                                        onClick={() => setIsManagingMembers(true)}
                                                        aria-label={t('FORM_MEMBERS_ADD')}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                textDecoration: 'underline',
                                                                color: 'primary.main',
                                                            },
                                                        }}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: 'primary.main',
                                                                    color: 'white',
                                                                }}
                                                            >
                                                                <Add />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={t('FORM_MEMBERS_ADD')}
                                                            sx={{
                                                                textAlign: 'left',
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    width={currentMember.role != "member" ? "50%" : "100%"}
                                                    onClick={() => {
                                                        setSelectedMemberIdSubMenu(currentMember.id);
                                                        setConfirmKickOpen(true);
                                                        setSelectedOwnUser(true);
                                                    }}
                                                    aria-label={t('FORM_MEMBERS_ADD')}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: currentMember.role != "member" ? "space-between" : "flex-end",
                                                        cursor: 'pointer',
                                                        flexDirection: currentMember.role != "member" ? "row" : "row-reverse",
                                                        '&:hover': {
                                                            textDecoration: 'underline',
                                                            color: 'error.main',
                                                        },
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={t('MEMBER_REMOVE_ITSELF')}
                                                        sx={{
                                                            textAlign: currentMember.role != "member" ? "right" : "left",
                                                        }}
                                                    />
                                                    <ListItemAvatar
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: currentMember.role != "member" ? "flex-end" : "flex-start",
                                                        }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: 'error.main',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            <Logout />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                </Box>
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
                                                        <Box>
                                                            <Typography>
                                                                {member.username} {currentMember?.id === member.id ? `(${t('YOU')})` : ''}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={t('DATE_JOINED', {
                                                        date: new Date(member.joinDate).toLocaleDateString(),
                                                    })}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    sx={{
                                                        marginRight: 0
                                                    }}
                                                >
                                                    {
                                                        member.role === 'owner' ? t('MEMBER_ROLE_OWNER') :
                                                            member.role === 'admin' ? t('MEMBER_ROLE_ADMIN') :
                                                                member.role === 'member' ? t('MEMBER_ROLE_MEMBER') :
                                                                    member.role
                                                    }
                                                </Typography>
                                                {currentMember && currentMember.role != 'member' ?
                                                    <IconButton
                                                        onClick={(e) => handleMenuEditMemberOpen(e, member.id)}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                    : null
                                                }
                                            </ListItem>
                                        ))}
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuEditMemberClose}
                                        >
                                            <MenuItem
                                                disabled={!!(() => {
                                                    const member = chat.members.find(m => m.id === selectedMemberId);
                                                    // Disable IF
                                                    return (
                                                        member && member.role === 'owner' ||   // The member to edit the is owner
                                                        currentMember && member && currentMember.id === member.id // The current member is the same as the member to edit
                                                    );
                                                })()}
                                                onClick={() => {
                                                    setSelectedMemberIdSubMenu(selectedMemberId);
                                                    setSelectedMemberUsernameSubMenu(chat.members.find(m => m.id === selectedMemberId)?.username ?? '');
                                                    setSelectedMemberRoleSubMenu(chat.members.find(m => m.id === selectedMemberId)?.role ?? '');
                                                    setEditRoleOpen(true);
                                                    handleMenuEditMemberClose();
                                                }}
                                            >
                                                {t('MEMBER_EDIT_ROLE_LABEL')}
                                            </MenuItem>
                                            <MenuItem
                                                disabled={!!(() => {
                                                    const member = chat.members.find(m => m.id === selectedMemberId);
                                                    // Disable IF
                                                    return (
                                                        member && member.role === 'owner' && currentMember && currentMember.id != member.id   // The member to kick out is the owner
                                                    );
                                                })()}
                                                onClick={() => {
                                                    setSelectedMemberIdSubMenu(selectedMemberId);
                                                    setSelectedMemberUsernameSubMenu(chat.members.find(m => m.id === selectedMemberId)?.username ?? '');
                                                    setConfirmKickOpen(true);
                                                    setSelectedOwnUser(currentMember?.id === selectedMemberId);
                                                    handleMenuEditMemberClose();
                                                }}
                                                sx={{ color: 'error.main' }}
                                            >
                                                {currentMember && currentMember.id === selectedMemberId ? t('MEMBER_REMOVE_ITSELF') : t('MEMBER_KICK_OUT')}
                                            </MenuItem>
                                        </Menu>
                                    </List>
                                    <Box
                                        display="flex"
                                        justifyContent="right"
                                        gap={2}
                                    >
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
            <MemberRemovalConfirmDialog
                open={confirmKickOpen}
                onClose={() => setConfirmKickOpen(false)}
                ownUserLeaving={selectedOwnUser}
                chatId={chat.id}
                memberId={selectedMemberIdSubMenu ?? 0}
                memberUsername={selectedMemberUsernameSubMenu}
            />
            <MemberEditRoleDialog
                open={editRoleOpen}
                onClose={() => setEditRoleOpen(false)}
                chatId={chat.id}
                memberId={selectedMemberIdSubMenu ?? 0}
                memberUsername={selectedMemberUsernameSubMenu}
                memberRole={selectedMemberRoleSubMenu ?? ''}
            />
        </>
    );
};

export default ChatInfoModal;