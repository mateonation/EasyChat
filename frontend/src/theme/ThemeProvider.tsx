import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { Theme } from "./palette";
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
    toggleColorMode: () => { },
    mode: 'light',
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const toggleColorMode = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => {
        return createTheme({
            ...Theme,
            palette: {
                ...Theme.palette,
                mode,
            },
        });
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ toggleColorMode, mode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
}