import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_BASE_PATH;

interface Props {
    open: boolean;
    chatName: string;
}

const ModalKickedOut = ({ open, chatName }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Dialog
            open={open}
            onClose={() => {}}
            disableEscapeKeyDown
        >
            <DialogTitle>
                {t('MEMBER_ITSELF_KICKED_OUT_TITLE')}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {t('MEMBER_ITSELF_KICKED_OUT', {
                        chatName: chatName,
                    })}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="text"
                    onClick={() => navigate(`${BASE}/chats`, { replace: true })}
                >
                    {t('GENERIC_ANSWER_OK')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalKickedOut;