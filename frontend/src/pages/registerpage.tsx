import { useState } from "react";
import { t } from "i18next"; // Ensure t is imported from your i18n library
import api from "../api/axios";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { PersonAdd } from "@mui/icons-material";
import {
    Container,
    Paper,
    Avatar,
    Typography,
    Box,
    TextField,
    Button,
    Link,
} from "@mui/material";

const BASE = import.meta.env.VITE_BASE_PATH;

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [usernameValid, setUsernameValid] = useState(true);
    const [usernameText, setUsernameText] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordText, setPasswordText] = useState('');
    const [birthDateValid, setBirthDateValid] = useState(true);
    const [birthDateText, setBirthDateText] = useState('');
    const [netError, setNetError] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Set all validation flags
        setNetError(false);
        setUsernameValid(true);
        setPasswordValid(true);
        setBirthDateValid(true);

        // Validate username
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setUsernameText(t('REGISTER_USERNAME_NOT_VALID'));
            setUsernameValid(false);
            setPassword('');
            setPassword2('');
            return;
        }
        if (username.length < 3) {
            setUsernameText(t('REGISTER_USERNAME_SHORT'));
            setUsernameValid(false);
            setPassword('');
            setPassword2('');
            return;
        }
        if (username.length > 20) {
            setUsernameText(t('REGISTER_USERNAME_LONG'));
            setUsernameValid(false);
            setPassword('');
            setPassword2('');
            return;
        }

        // Validate birth date
        // Check if the user is over 18 years old
        const isOver18 = (dateString: string): boolean => {
            const today = new Date();
            const birthDate = new Date(dateString);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();

            if (age > 18) return true;
            if (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0))) return true;
            return false;
        };

        if (!isOver18(birthDate)) {
            setBirthDateText(t('FORM_BIRTHDATE_MINOR'));
            setBirthDateValid(false);
            return;
        }

        // Validate password
        if (password.length < 6) {
            setPasswordText(t('REGISTER_PASSWORD_SHORT'));
            setPasswordValid(false);
            setPassword('');
            setPassword2('');
            return;
        }
        if (password.length > 30) {
            setPasswordText(t('REGISTER_PASSWORD_LONG'));
            setPasswordValid(false);
            setPassword('');
            setPassword2('');
            return;
        }
        if (password !== password2) {
            setPasswordText(t('REGISTER_PASSWORD_MISMATCH'));
            setPasswordValid(false);
            setPassword('');
            setPassword2('');
            return;
        }

        // If all validations pass, proceed with registration
        try {
            await api.post('/users/register', {
                username: username,
                password: password,
                birthDate: birthDate,
            })
            console.log('User registered:');
            console.log(username);
            alert(t('REGISTER_SUCCESSFUL'));
            navigate(`${BASE}/login`, { replace: true }); // Redirect to login page after successful registration
        } catch (err: unknown) {
            // If an error occurred, empty the password fields
            setPassword('');
            setPassword2('');
            // Handle specific error cases if using axios
            if (axios.isAxiosError(err)) {
                const reason = err.response?.data;
                console.error(reason?.message);
                switch (reason?.message) {
                    case 'Username already taken':
                        setUsernameText(t('REGISTER_USERNAME_IN_USE'));
                        setUsernameValid(false);
                        break;
                    case 'Invalid characters in username':
                        setUsernameText(t('REGISTER_USERNAME_NOT_VALID'));
                        setUsernameValid(false);
                        break;
                    case 'Username not long enough (min 3 characters)':
                        setUsernameText(t('REGISTER_USERNAME_SHORT'));
                        setUsernameValid(false);
                        break;
                    case 'Username too long (max 20 characters)':
                        setUsernameText(t('REGISTER_USERNAME_LONG'));
                        setUsernameValid(false);
                        break;
                    case 'Password not long enough (min 6 characters)':
                        setPasswordText(t('REGISTER_PASSWORD_SHORT'));
                        setPasswordValid(false);
                        break;
                    case 'Password too long (max 30 characters)':
                        setPasswordText(t('REGISTER_PASSWORD_LONG'));
                        setPasswordValid(false);
                        break;
                    case 'You must be 18 years old or older':
                        setBirthDateText(t('FORM_BIRTHDATE_MINOR'));
                        setBirthDateValid(false);
                        break;
                    default:
                        setNetError(true); // Set a generic network error
                        break;
                }
            } else setNetError(true); // If it's not an axios error, set a generic error
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
                    bgcolor: "primary.main",
                }}>
                    <PersonAdd />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ textAlign: "center", }}>
                    {t('REGISTER_PAGE_TITLE')}
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleRegister}
                    sx={{ mt: 2, }}
                >
                    <TextField
                        label={t('FORM_USERNAME_LABEL')}
                        placeholder={t('FORM_USERNAME_PLACEHOLDER')}
                        fullWidth
                        required
                        type="text"
                        value={username}
                        error={!usernameValid}
                        helperText={!usernameValid ? usernameText : ''}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: !usernameValid ? '#ffebee' : 'transparent'
                            }
                        }}
                    />
                    <TextField
                        label={t('FORM_BIRTHDATE_LABEL')}
                        placeholder={t('FORM_BIRTHDATE_LABEL')}
                        fullWidth
                        required
                        type="date"
                        value={birthDate}
                        error={!birthDateValid}
                        helperText={!birthDateValid ? birthDateText : ''}
                        onChange={(e) => setBirthDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            mb: 2,
                            input: {
                                background: !birthDateValid ? '#ffebee' : 'transparent'
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
                        error={!passwordValid}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: !passwordValid ? '#ffebee' : 'transparent'
                            }
                        }}
                    />
                    <TextField
                        label={t('FORM_PASSWORD2_LABEL')}
                        placeholder={t('FORM_PASSWORD2_PLACEHOLDER')}
                        fullWidth
                        required
                        type="password"
                        value={password2}
                        error={!passwordValid}
                        helperText={!passwordValid ? passwordText : ''}
                        onChange={(e) => setPassword2(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: !passwordValid ? '#ffebee' : 'transparent'
                            }
                        }}
                    />
                    {netError &&
                        <Typography sx={{ mb: 2, color: "red", textAlign: "center", }}>
                            {t('ERR_SERVER')}
                        </Typography>
                    }
                    <Button type="submit" variant="contained" fullWidth sx={{ mb: 2, }}>
                        {t('REGISTER_FORM_SUBMIT')}
                    </Button>
                </Box>
                <Typography sx={{ textAlign: "center", }}>
                    {t('REGISTER_LOGIN_LABEL')}<br />
                    <Link component={RouterLink} to={`${BASE}/login`}>
                        {t('REGISTER_LOGIN_LINK')}
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

export default RegisterPage;