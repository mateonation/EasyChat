import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    // ENGLISH
    en: {
        translation: {
            // GENERIC ERRORS
            ERR_NETWORK: "Network error",
            ERR_SERVER: "Server error",

            // FORM FIELDS
            FORM_USERNAME_LABEL: "Username",
            FORM_USERNAME_PLACEHOLDER: "Enter your username here",
            FORM_PASSWORD_LABEL: "Password",
            FORM_PASSWORD_PLACEHOLDER: "Enter your password here",
            FORM_PASSWORD2_LABEL: "Repeat password",
            FORM_PASSWORD2_PLACEHOLDER: "Repeat your password here",

            // LOGIN PAGE
            LOGIN_PAGE_TITLE: "Log in to your account",
            LOGIN_FORM_SUBMIT: "Login",
            LOGIN_FORM_ERROR: "Username or password is incorrect",
            LOGIN_REGISTER_LINK: "Register a new account",
        }
    },
    // SPANISH
    es: {
        translation: {
            // ERRORES GENÉRICOS
            ERR_NETWORK: "Error de red",
            ERR_SERVER: "Error del servidor",

            // CAMPOS DE FORMULARIO
            FORM_USERNAME_LABEL: "Nombre de usuario",
            FORM_USERNAME_PLACEHOLDER: "Introduce tu nombre de usuario",
            FORM_PASSWORD_LABEL: "Contraseña",
            FORM_PASSWORD_PLACEHOLDER: "Introduce tu contraseña",
            FORM_PASSWORD2_LABEL: "Confirmar contraseña",
            FORM_PASSWORD2_PLACEHOLDER: "Introduce tu contraseña de nuevo",

            // PÁGINA DE INICIAR SESIÓN
            LOGIN_PAGE_TITLE: "Iniciar sesión",
            LOGIN_FORM_SUBMIT: "Iniciar sesión",
            LOGIN_FORM_ERROR: "El nombre de usuario o la contraseña son incorrectos",
            LOGIN_REGISTER_LINK: "Crear una cuenta",
        }
    },
    // GALICIAN
    gl: {
        translation: {
            // ERROS XENÉRICOS
            ERR_NETWORK: "Erro da red",
            ERR_SERVER: "Erro do servidor",

            // CAMPOS DO FORMULARIO
            FORM_USERNAME_LABEL: "Nome de usuario",
            FORM_USERNAME_PLACEHOLDER: "Escribe o teu nome de usuario",
            FORM_PASSWORD_LABEL: "Contrasinal",
            FORM_PASSWORD_PLACEHOLDER: "Escribe o teu contrasinal",
            FORM_PASSWORD2_LABEL: "Confirmar contrasinal",
            FORM_PASSWORD2_PLACEHOLDER: "Escribe o teu contrasinal unha vez máis",

            // PÁXINA DE INICIAR SESIÓN
            LOGIN_PAGE_TITLE: "Iniciar sesión",
            LOGIN_FORM_SUBMIT: "Iniciar sesión",
            LOGIN_FORM_ERROR: "O nome de usuario ou o contrasinal non son correctos",
            LOGIN_REGISTER_LINK: "Rexistrar unha conta",
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "es", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;