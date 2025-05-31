import { 
    FormControl, 
    MenuItem, 
    Select, 
    SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import i18n from "../../utils/i18n";
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
const LanguageSelect = () => {
    const [language, setLanguage] = useState(i18n.language || 'en');

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang && savedLang !== language) {
            setLanguage(savedLang);
            i18n.changeLanguage(savedLang);
        }
    }, []);

    const handleLangChange = (event: SelectChangeEvent) => {
        const newLang = event.target.value;
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang);
    };

    return (
        <FormControl
            variant="outlined"
            size="small"
        >
            <Select
                labelId={t('LANGUAGE_SELECT_LABEL')}
                id="language-select"
                value={language}
                onChange={handleLangChange}
                aria-label={t('LANGUAGE_SELECT_LABEL')}
                label={t('LANGUAGE_SELECT_LABEL')}
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
        </FormControl>
    )
}

export default LanguageSelect;