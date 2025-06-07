import {
    MenuItem, 
    Select, 
    SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import i18n from "../../utils/i18n";
import { useTranslation } from 'react-i18next';
import { t } from "i18next";

// Languages array to select languages
// Add more languages as needed
const languages = [
    { code: 'en', label: t('LANGUAGE_EN') }, // English
    { code: 'es', label: t('LANGUAGE_ES') }, // Spanish
    { code: 'gl', label: t('LANGUAGE_GL') }, // Galician
    { code: 'ca', label: t('LANGUAGE_CA') }, // Catalan
    { code: 'eu', label: t('LANGUAGE_EU') }, // Basque
    { code: 'pt', label: t('LANGUAGE_PT') }, // Portuguese
    { code: 'fr', label: t('LANGUAGE_FR') }, // French
    { code: 'ro', label: t('LANGUAGE_RO') }, // Romanian
]

interface Props {
    textColor: string;
    backgroundColor: string;
}
const LanguageSelect = ({ textColor, backgroundColor }: Props) => {
    const [language, setLanguage] = useState(i18n.language || 'en');
    const { t } = useTranslation();

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang && savedLang !== language) {
            setLanguage(savedLang);
            i18n.changeLanguage(savedLang);
        }
    }, []);

    const handleLangChange = (event: SelectChangeEvent) => {
        console.log("language selected:", event.target.value);
        const newLang = event.target.value;
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang);
    };

    return (
            <Select
                variant="outlined"
                size="small"
                id="language-select"
                value={language}
                onChange={handleLangChange}
                aria-label={t('LANGUAGE_SELECT_LABEL')}
                sx={{
                    width: 120, // Set a fixed width for the select box
                    marginLeft: 'auto', // Align to the right in the toolbar
                    marginRight: 2, // Add some space from the right edge
                    bgcolor: backgroundColor, // Pass background color from props
                    color: textColor, // Pass text color from props
                }}
            >
                {languages.map(lang => (
                    <MenuItem
                        key={lang.code} 
                        value={lang.code}
                        aria-label={lang.label}
                    >
                        {lang.label}
                    </MenuItem>
                ))}
            </Select>
    )
}

export default LanguageSelect;