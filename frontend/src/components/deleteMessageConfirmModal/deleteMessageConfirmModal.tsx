import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteMessageConfirmModal: React.FC<Props> = ({ open, onClose, onConfirm }) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                {t('FORM_MESSAGE_DELETE')}
            </DialogTitle>
            <DialogContent>
                {t('FORM_MESSAGE_DELETE_CONFIRM')}
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
                    onClick={onConfirm} 
                    color="error"
                    variant="contained"
                >
                    {t('GENERIC_ANSWER_CONFIRM')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteMessageConfirmModal;