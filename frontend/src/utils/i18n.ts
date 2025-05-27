import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
            LOGIN_REGISTER_LABEL: "Don't have an account?",
            LOGIN_REGISTER_LINK: "Register a new one",

            // REGISTER PAGE
            REGISTER_PAGE_TITLE: "Create a new account",
            REGISTER_FORM_SUBMIT: "Register",
            REGISTER_USERNAME_SHORT: "Username must be at least 3 characters long",
            REGISTER_USERNAME_LONG: "Username must be at most 20 characters long",
            REGISTER_USERNAME_NOT_VALID: "Username can only contain letters, numbers, and underscores",
            REGISTER_USERNAME_IN_USE: "This username has been already taken. Please, use another one",
            REGISTER_PASSWORD_SHORT: "Password must be at least 6 characters long",
            REGISTER_PASSWORD_LONG: "Password must be at most 30 characters long",
            REGISTER_PASSWORD_MISMATCH: "Passwords do not match",
            REGISTER_SUCCESSFUL: "Congratulations! You have registered your account successfully. You can now log in to it",
            REGISTER_LOGIN_LABEL: "Already have an account?",
            REGISTER_LOGIN_LINK: "Log in here",
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
            LOGIN_REGISTER_LABEL: "¿Aún no tienes una cuenta?",
            LOGIN_REGISTER_LINK: "Crea una nueva",

            // REGISTER PAGE
            REGISTER_PAGE_TITLE: "Registrar cuenta",
            REGISTER_FORM_SUBMIT: "Crear cuenta",
            REGISTER_USERNAME_SHORT: "El nombre de usuario debe tener al menos 3 caracteres",
            REGISTER_USERNAME_LONG: "El nombre de usuario no debe tener más de 20 caracteres",
            REGISTER_USERNAME_NOT_VALID: "El nombre de usuario solo puede contener letras, números y guiones bajos",
            REGISTER_USERNAME_IN_USE: "Este nombre de usuario no está libre. Por favor, usa otro",
            REGISTER_PASSWORD_SHORT: "Tu contraseña debe tener al menos 6 caracteres",
            REGISTER_PASSWORD_LONG: "Tu contraseña no puede exceder los 30 caracteres",
            REGISTER_PASSWORD_MISMATCH: "Las contraseñas no coinciden",
            REGISTER_SUCCESSFUL: "¡Felicidades! Tu cuenta fue registrada con éxito. Ahora puedes iniciar sesión en ella",
            REGISTER_LOGIN_LABEL: "¿Ya tienes una cuenta?",
            REGISTER_LOGIN_LINK: "Inicia sesión aquí",
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
            LOGIN_REGISTER_LABEL: "Aínda non tes unha conta?",
            LOGIN_REGISTER_LINK: "Rexistrar unha nova",

            // REGISTER PAGE
            REGISTER_PAGE_TITLE: "Rexistrar conta nova",
            REGISTER_FORM_SUBMIT: "Crear usuario",
            REGISTER_USERNAME_SHORT: "O nome de usuario debe ter 3 caracteres como mínimo",
            REGISTER_USERNAME_LONG: "O nome de usuario non pode ter máis de 20 caracteres",
            REGISTER_USERNAME_NOT_VALID: "O nome de usuario só pode conter letras, números, e guións baixos",
            REGISTER_USERNAME_IN_USE: "Este nome de usuario non está disponíbel. Por favor, usa outro",
            REGISTER_PASSWORD_SHORT: "O teu contrasinal debe ter 6 caracteres como mínimo",
            REGISTER_PASSWORD_LONG: "O teu contrasinal non pode exceder os 30 caracteres",
            REGISTER_PASSWORD_MISMATCH: "Os contrasinais non coinciden",
            REGISTER_SUCCESSFUL: "Noraboa! Rexistráchesche correctamente. Agora podes iniciar sesión na túa conta",
            REGISTER_LOGIN_LABEL: "Xa tes unha conta creada?",
            REGISTER_LOGIN_LINK: "Inicia sesión nela",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;