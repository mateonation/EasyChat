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

const LoginPage = () => {
    const navigate = useNavigate();
    const auth = useAuthContext();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [netError, setNetError] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(false);
            setNetError(false);
            await auth.login(username, password);
            navigate('/');
        } catch (err: unknown) {
            if (err !== null && typeof err === "object" && "message" in err) {
                console.error(err);
                setError(true);
            } else {
                console.error("An unexpected error occurred:", err);
                setNetError(true);
            }
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
                    Log in to your account
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{ mt: 2, }}
                >
                    <TextField
                        label='E-mail address'
                        placeholder='ex: mateo@jacobo.es'
                        fullWidth
                        required
                        type="email"
                        autoFocus
                        value={username}
                        error={error}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: error ? '#ffebee' : 'transparent'
                            }
                        }}
                    />
                    <TextField
                        label='Password'
                        placeholder='Enter your password here'
                        fullWidth
                        required
                        type="password"
                        value={password}
                        error={error}
                        helperText={error ? 'Password or username are incorrect' : ''}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            mb: 2,
                            input: {
                                background: error ? '#ffebee' : 'transparent'
                            }
                        }}
                    />
                    {netError &&
                        <Typography sx={{ mb: 2, color: "red", textAlign: "center", }}>
                            Network error
                        </Typography>
                    }
                    <Button type="submit" variant="contained" fullWidth sx={{ mb: 2, }}>
                        LOGIN
                    </Button>
                </Box>
                <Link component={RouterLink} to="/register">
                    <Typography sx={{ textAlign: "center", }}>
                        Register a new user
                    </Typography>
                </Link>
            </Paper>
        </Container>
    );
};

export default LoginPage;