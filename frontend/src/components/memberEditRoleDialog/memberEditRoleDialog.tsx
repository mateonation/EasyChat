import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Typography } from "@mui/material";
import { t } from "i18next";

interface Props {
    open: boolean;
    onClose: () => void;
    chatId: number;
    memberId: number;
    memberUsername: string;
    memberRole: string;
}
const selectableRoles = [
    { value: 'member', label: t('MEMBER_ROLE_MEMBER') },
    { value: 'admin', label: t('MEMBER_ROLE_ADMIN') },
];

const MemberEditRoleDialog = ({
    open,
    onClose,
    chatId,
    memberId,
    memberUsername,
    memberRole,
}: Props) => {
    const { t } = useTranslation();
    const [role, setRole] = useState<string>('member');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEditRole = async () => {
        if (loading || !memberId || !chatId) return;

        setError(null); // Reset error state
        setLoading(true);
        try {
            // Assuming there's an API endpoint to edit member role
            const res = await api.patch(`/chats/${chatId}/member/role`, {
                editId: memberId,
                role
            });
            console.log(res.data.message);
            onClose(); // Close modal after successful update
        } catch (error) {
            console.error("Failed to edit member role:", error);
            setError(t("MEMBER_EDIT_ROLE_ERROR"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                {t('MEMBER_EDIT_ROLE_PLACEHOLDER', {
                    username: memberUsername,
                })}
            </DialogTitle>
            <DialogContent
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Select
                    size="small"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    aria-label={t('MEMBER_EDIT_ROLE_PLACEHOLDER', {
                        username: memberUsername,
                    })}
                    error={!!error}
                >
                    {selectableRoles.map((role) => (
                        <MenuItem
                            key={role.value}
                            value={role.value}
                            disabled={loading}
                            aria-label={role.label}
                        >
                            {role.label}
                        </MenuItem>
                    ))}
                </Select>
                {error && 
                    <Typography
                        color="error"
                        variant="body2"
                        mt={1}
                    >
                        {error}
                    </Typography>
                }
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
                    onClick={handleEditRole}
                    color="primary"
                    variant="contained"
                    disabled={loading || role === memberRole}
                >
                    {t('GENERIC_ANSWER_CONFIRM')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberEditRoleDialog;