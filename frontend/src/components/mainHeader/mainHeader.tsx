import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { 
    AppBar, 
    Avatar, 
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    IconButton, 
    Menu, 
    MenuItem, 
    Toolbar, 
    Typography 
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LanguageSelect from "../languageSelect";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_BASE_PATH;

const MainHeader = () => {
    const { t } = useTranslation();
    const { logout } = useAuthContext();
    const navigate = useNavigate();

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [confirmLogoutModal, setConfirmLogoutModal] = useState(false);
    const [usernameInitial, setUsernameInitial] = useState('');

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            let parsedUser = null;
            if (storedUser) parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.username) setUsernameInitial(parsedUser.username.charAt(0).toUpperCase());
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
        }
    }, []);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(event.currentTarget);

    const handleMenuClose = () => setMenuAnchorEl(null);

    const handleLogoutClick = () => {
        handleMenuClose();
        setConfirmLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        await logout();
        setConfirmLogoutModal(false);
        navigate(`${BASE}/login`, { replace: true });
    };

    return (
        <>
            <AppBar
                position="static"
                component="header"
                sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'primary.contrastText', 
                }}
            >
                <Toolbar
                    component="nav"
                    aria-label="main navigation"
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ flexGrow: 1 }}
                    >
                        {t('HEADER_TITLE')}
                    </Typography>
                    <Box
                        component="section"
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <LanguageSelect 
                            textColor="primary.contrastText"
                            backgroundColor="primary.main"
                        />
                        <IconButton
                            onClick={handleAvatarClick}
                            color="inherit"
                            aria-label="User menu"
                            aria-haspopup="true"
                        >
                            <Avatar>
                                {
                                    usernameInitial ||
                                    <PersonIcon/>
                                }
                            </Avatar>
                        </IconButton>
                    </Box>
                    <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem
                            onClick={handleLogoutClick}
                        >
                            {t('LOGOUT_MENU_LABEL')}
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Dialog
                open={confirmLogoutModal}
                onClose={() => setConfirmLogoutModal(false)}
                aria-labelledby={t('LOGOUT_DIALOG_TITLE')}
            >
                <DialogTitle 
                    id={t('LOGOUT_DIALOG_TITLE')}
                >
                    {t('LOGOUT_DIALOG_TITLE')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('LOGOUT_DIALOG_CONFIRMATION')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmLogoutModal(false)}
                        variant="text"
                        color="inherit"
                    >
                        {t('GENERIC_ANSWER_NO')}
                    </Button>
                    <Button
                        onClick={handleLogoutConfirm}
                        variant="contained"
                        autoFocus
                    >
                        {t('GENERIC_ANSWER_YES')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MainHeader;