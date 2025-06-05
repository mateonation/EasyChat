import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { LockOutline } from "@mui/icons-material";
import {
    Container,
    Paper,
    Avatar,
    Typography,
    Box,
    TextField,
    Button,
    Link
} from "@mui/material";
import { ErrorResponse } from "../types/errorResponse.interface";
import { useTranslation } from "react-i18next";
import LanguageSelect from "../components/languageSelect.tsx";

const BASE = import.meta.env.VITE_BASE_PATH;

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const auth = useAuthContext();

    const [username, setUsername] = useState('');
    const [usernameText, setUsernameText] = useState('');
    const [usernameValid, setUsernameValid] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [error, setError] = useState(false);
    const [netError, setNetError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let valid = true;
            setError(false);
            setNetError(false);
            setUsernameValid(true);
            setPasswordValid(true);

            // Validate username
            const textRegex = /^[a-zA-Z0-9_]+$/;
            if (!textRegex.test(username)) {
                setUsernameText(t('INVALID_FIELD', {
                    field: t('FORM_USERNAME_LABEL'),
                }));
                setUsernameValid(false);
                valid = false;
            } else if (username.length < 3) {
                setUsernameText(t('MINIMUM_LENGTH', {
                    field: t('FORM_USERNAME_LABEL'),
                    length: 3,
                }));
                setUsernameValid(false);
                valid = false;
            } else if (username.length > 20) {
                setUsernameText(t('MAXIMUM_LENGTH', {
                    field: t('FORM_USERNAME_LABEL'),
                    length: 20,
                }));
                setUsernameValid(false);
                valid = false;
            }

            // Validate password
            if (password.length < 6) {
                setPasswordText(t('MINIMUM_LENGTH', {
                    field: t('FORM_PASSWORD_LABEL'),
                    length: 6,
                }));
                setPasswordValid(false);
                valid = false;
            } else if (password.length > 30) {
                setPasswordText(t('MAXIMUM_LENGTH', {
                    field: t('FORM_PASSWORD_LABEL'),
                    length: 30,
                }));
                setPasswordValid(false);
                valid = false;
            }

            // If validation check failed, empty password field and return before sending request 
            if (!valid) {
                setPassword('');
                setError(true);
                return;
            }
            setLoading(true);
            await auth.login(username, password);
            console.log("User logged: @", username, " [", new Date().toLocaleString(), "]");
            setLoading(false);
            navigate(`${BASE}/chats`, { replace: true });
        } catch (err: unknown) {
            setLoading(false);
            if (err !== null && typeof err === "object" && "message" in err) {
                setPassword(''); // Clear password field on error
                console.error(err);
                const reason = (err as ErrorResponse).message;
                switch (reason) {
                    case 'Invalid credentials':
                        setPasswordText(t('LOGIN_FORM_ERROR'));
                        setError(true);
                        break;
                    default:
                        setNetError(true);
                        break;
                }
            } else throw err;
        }
    };

    return (
        <Container
            component="main" 
            maxWidth="xs"
        >
            <Paper elevation={12} 
                component="section"
                sx={{
                    marginTop: 8,
                    padding: 2,
                }}
            >
                <Box 
                    component="article"
                    sx={{
                        float: "right",
                        position: "absolute",
                    }}
                >
                    <LanguageSelect />
                </Box>
                <Avatar
                    component="article"
                    sx={{
                        mx: "auto",
                        mb: 2,
                        textAlign: "center",
                        bgcolor: "secondary.main",
                    }}
                >
                    <LockOutline />
                </Avatar>
                <Typography 
                    component="h1" 
                    variant="h5" 
                    sx={{ 
                        textAlign: "center", 
                    }}
                >
                    {t('LOGIN_PAGE_TITLE')}
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{ mt: 2, }}
                >
                    <TextField
                        label={t('FORM_USERNAME_LABEL')}
                        placeholder={t('FORM_USERNAME_PLACEHOLDER')}
                        fullWidth
                        required
                        type="text"
                        autoFocus
                        value={username}
                        error={!usernameValid || error}
                        disabled={loading} // Disable username field if loading
                        helperText={!usernameValid ? usernameText : ''}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: error ? '#ffebee' : !usernameValid ? '#ffebee' : 'transparent'
                            }
                        }}
                        slotProps={{ 
                            htmlInput: { 
                                maxLength: 20, // Limit input length to 20 characters
                            } 
                        }} 
                    />
                    <TextField
                        label={t('FORM_PASSWORD_LABEL')}
                        placeholder={t('FORM_PASSWORD_PLACEHOLDER')}
                        fullWidth
                        required
                        type="password"
                        value={password}
                        error={!passwordValid || error}
                        disabled={loading} // Disable password field if loading
                        helperText={!passwordValid ? passwordText : error ? t('LOGIN_FORM_ERROR') : ''}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: error ? '#ffebee' : !passwordValid ? '#ffebee' : 'transparent'
                            }
                        }}
                        slotProps={{ 
                            htmlInput: { 
                                maxLength: 30, // Limit input length to 30 characters
                            } 
                        }} 
                    />
                    {netError ?
                        <Typography
                            sx={{
                                mb: 2,
                                color: "red",
                                textAlign: "center",
                            }}
                        >
                            {t('ERR_SERVER')}
                        </Typography>
                        : null
                    }
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mb: 2,
                        }}
                        disabled={loading} // Disable button if loading
                    >
                        {t('LOGIN_FORM_SUBMIT')}
                    </Button>
                </Box>
                <Typography
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {t('LOGIN_REGISTER_LABEL')}<br />
                    <Link
                        component={RouterLink}
                        to={`${BASE}/register`}
                    >
                        {t('LOGIN_REGISTER_LINK')}
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default LoginPage;