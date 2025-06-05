import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

const BASE = import.meta.env.VITE_BASE_PATH;

interface Props {
    open: boolean;
    onClose: () => void;
    ownUserLeaving: boolean;
    chatId: number;
    memberId: number;
    memberUsername: string;
}

const MemberRemovalConfirmDialog = ({
    open,
    onClose,
    ownUserLeaving,
    chatId,
    memberId,
    memberUsername,
}: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleConfirm = async () => {
        if (!memberId) return;
        try {
            const res = await api.delete(`/chats/${chatId}/member`, {
                data: {
                    rmId: memberId,
                },
            });

            console.log(res.data.message);
            // If user is leaving the chat, redirect to chats list
            if (ownUserLeaving) {
                navigate(`${BASE}/chats`);
            }
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
                            username: memberUsername
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