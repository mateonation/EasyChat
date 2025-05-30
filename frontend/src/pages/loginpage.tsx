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

const BASE = import.meta.env.VITE_BASE_PATH;

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const auth = useAuthContext();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [netError, setNetError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(false);
            setNetError(false);
            await auth.login(username, password);
            alert("Login successful!");
            console.log("User logged: @", username, " [",new Date().toLocaleString(), "]");
            setLoading(false);
            navigate(`${BASE}/chats`, { replace: true });
        } catch (err: unknown) {
            setLoading(false);
            if (err !== null && typeof err === "object" && "message" in err) {
                setPassword(''); // Clear password field on error
                console.error(err);
                const reason=(err as ErrorResponse).message;
                switch (reason) {
                    case 'Username or password are incorrect':
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
        <Container maxWidth="xs">
            <Paper elevation={12} sx={{
                marginTop: 8,
                padding: 2,
            }}>
                <Avatar sx={{
                    mx: "auto",
                    mb: 2,
                    textAlign: "center",
                }}>
                    <LockOutline />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ textAlign: "center", }}>
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
                        error={error}
                        disabled={loading} // Disable username field if loading
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: error ? '#ffebee' : 'transparent'
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
                        error={error}
                        disabled={loading} // Disable password field if loading
                        helperText={error ? t('LOGIN_FORM_ERROR') : ''}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: error ? '#ffebee' : 'transparent'
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