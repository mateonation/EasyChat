import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useSocket } from "../../contexts/SocketContext";
import { MemberDto } from "../../types/member.dto";

const BASE = import.meta.env.VITE_BASE_PATH;

interface Props {
    open: boolean;
    onClose: () => void;
    ownUserLeaving: boolean;
    chatId: number;
    member: MemberDto | null;
}

const MemberRemovalConfirmDialog = ({
    open,
    onClose,
    ownUserLeaving,
    chatId,
    member,
}: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const socket = useSocket();

    const handleConfirm = async () => {
        if (!member || !chatId || !socket) return;
        try {
            // If user is leaving the chat, leave chat via socket and clear chatId from localStorage
            if (ownUserLeaving) {
                socket.emit("leaveChat", chatId);
                const chatIdInLocalStorage = localStorage.getItem('chatId');
                if(chatIdInLocalStorage && parseInt(chatIdInLocalStorage) === chatId) localStorage.removeItem('chatId');
            };

            // Send request to remove member from chat
            const res = await api.delete(`/chats/${chatId}/member`, {
                data: {
                    rmId: member.id,
                },
            });

            console.log(res.data.message);

            // If user is leaving the chat, redirect to chats list
            if (ownUserLeaving) navigate(`${BASE}/chats`);
        } catch (error) {
            console.error('Error removing member:', error);
        } finally {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                    {ownUserLeaving
                        ? t('MEMBER_REMOVE_ITSELF')
                        : t('MEMBER_KICK_OUT')
                    }
            </DialogTitle>
            <DialogContent>
                <Typography
                    maxWidth={400}
                >
                    {ownUserLeaving
                        ? t('MEMBER_REMOVE_ITSELF_QUESTION')
                        : t('MEMBER_KICK_OUT_CONFIRM', {
                            username: member ? member.username : t('GENERIC_MSG_NOT_FOUND'),
                        })
                    }
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    color="inherit"
                    variant="text"
                >
                    {t('GENERIC_ANSWER_CANCEL')}
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    color="error"
                    variant="contained"
                >
                    {t('GENERIC_ANSWER_CONFIRM')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberRemovalConfirmDialog;