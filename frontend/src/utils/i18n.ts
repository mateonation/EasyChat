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

            // LOGIN PAGE
            LOGIN_PAGE_TITLE: "Log in to your account",
            LOGIN_FORM_USERNAME: "Username",
            LOGIN_FORM_USERNAME_PLACEHOLDER: "Enter your username here",
            LOGIN_FORM_PASSWORD: "Password",
            LOGIN_FORM_PASSWORD_PLACEHOLDER: "Enter your password here",
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

            // PÁGINA DE INICIAR SESIÓN
            LOGIN_PAGE_TITLE: "Iniciar sesión",
            LOGIN_FORM_USERNAME: "Nombre de usuario",
            LOGIN_FORM_USERNAME_PLACEHOLDER: "Escribe tu nombre de usuario",
            LOGIN_FORM_PASSWORD: "Contraseña",
            LOGIN_FORM_PASSWORD_PLACEHOLDER: "Introduce tu contraseña",
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

            // PÁXINA DE INICIAR SESIÓN
            LOGIN_PAGE_TITLE: "Iniciar sesión",
            LOGIN_FORM_USERNAME: "Nome de usuario",
            LOGIN_FORM_USERNAME_PLACEHOLDER: "Escribe o teu nome de usuario",
            LOGIN_FORM_PASSWORD: "Contrasinal",
            LOGIN_FORM_PASSWORD_PLACEHOLDER: "Introduce o teu contrasinal",
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