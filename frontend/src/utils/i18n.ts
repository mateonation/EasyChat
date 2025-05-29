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
            FORM_BIRTHDATE_LABEL: "Date of birth",
            FORM_BIRTHDATE_MINOR: "You must be at least 18 years old to register an account",

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

            // CHATS LIST PAGE
            CHATS_LIST_PAGE_TITLE: "My chats",
            CHATS_LIST_LOADING: "Loading chats...",
            CHATS_LIST_ERROR: "Failed to load chats",
            CHATS_LIST_UNEXPECTED_FORMAT: "Unexpected response format",
            CHATS_LIST_EMPTY_STRING0: "You have no chats yet...",
            CHATS_LIST_EMPTY_STRING1: "why not create one now?",
            CHAT_PREFIX_YOU: "You",
            CHAT_DELETED_USER: "[Deleted]",
            CHAT_MESSAGE_DELETED: "This message has been removed",

            // DATE AND TIMES
            DATE_TODAY: "Today",
            DATE_YESTERDAY: "Yesterday",
            DATE_NOW: "Just now",
            DATE_MONDAY: "Monday",
            DATE_TUESDAY: "Tuesday",
            DATE_WEDNESDAY: "Wednesday",
            DATE_THURSDAY: "Thursday",
            DATE_FRIDAY: "Friday",
            DATE_SATURDAY: "Saturday",
            DATE_SUNDAY: "Sunday",
            DATE_THIS_WEEK: "This week",
            DATE_LAST_WEEK: "Last week",
            DATE_THIS_MONTH: "This month",
            DATE_LAST_MONTH: "Last month",
            DATE_THIS_YEAR: "This year",
            DATE_LAST_YEAR: "Last year",
            DATE_MULTIPLE_DAYS: "{{count}} days ago",
            DATE_MULTIPLE_HOURS: "{{count}} hours ago",
            DATE_MULTIPLE_MINUTES: "{{count}} minutes ago",
            DATE_MULTIPLE_SECONDS: "{{count}} seconds ago",
            DATE_MULTIPLE_WEEKS: "{{count}} weeks ago",
            DATE_MULTIPLE_MONTHS: "{{count}} months ago",
            DATE_MULTIPLE_YEARS: "{{count}} years ago",
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
            FORM_BIRTHDATE_LABEL: "Fecha de nacimiento",
            FORM_BIRTHDATE_MINOR: "Debes tener 18 años como mínimo para crear una cuenta",

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
            
            // CHATS LIST PAGE
            CHATS_LIST_PAGE_TITLE: "Mis chats",
            CHATS_LIST_LOADING: "Cargando chats...",
            CHATS_LIST_ERROR: "Error al cargar los chats",
            CHATS_LIST_UNEXPECTED_FORMAT: "Formato de respuesta inesperado",
            CHATS_LIST_EMPTY_STRING0: "Aún no tienes ningún chat...",
            CHATS_LIST_EMPTY_STRING1: "¿por qué no creas uno ahora?",
            CHAT_PREFIX_YOU: "Tú",
            CHAT_DELETED_USER: "[Eliminado]",
            CHAT_MESSAGE_DELETED: "Este mensaje fue borrado",

            // DATE AND TIMES
            DATE_TODAY: "Hoy",
            DATE_YESTERDAY: "Ayer",
            DATE_NOW: "Ahora mismo",
            DATE_MONDAY: "Lunes",
            DATE_TUESDAY: "Martes",
            DATE_WEDNESDAY: "Miércoles",
            DATE_THURSDAY: "Jueves",
            DATE_FRIDAY: "Viernes",
            DATE_SATURDAY: "Sábado",
            DATE_SUNDAY: "Domingo",
            DATE_THIS_WEEK: "Esta semana",
            DATE_LAST_WEEK: "La semana pasada",
            DATE_THIS_MONTH: "Este mes",
            DATE_LAST_MONTH: "El mes pasado",
            DATE_THIS_YEAR: "Este año",
            DATE_LAST_YEAR: "El año pasado",
            DATE_MULTIPLE_DAYS: "Hace {{count}} días",
            DATE_MULTIPLE_HOURS: "Hace {{count}} horas",
            DATE_MULTIPLE_MINUTES: "Hace {{count}} minutos",
            DATE_MULTIPLE_SECONDS: "Hace {{count}} segundos",
            DATE_MULTIPLE_WEEKS: "Hace {{count}} semanas",
            DATE_MULTIPLE_MONTHS: "Hace {{count}} meses",
            DATE_MULTIPLE_YEARS: "Hace {{count}} años",
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
            FORM_BIRTHDATE_LABEL: "Data de nacemento",
            FORM_BIRTHDATE_MINOR: "Debes ter polo menos 18 anos para rexistrar unha conta",

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
            
            // CHATS LIST PAGE
            CHATS_LIST_PAGE_TITLE: "Chats",
            CHATS_LIST_LOADING: "Cargando chats...",
            CHATS_LIST_ERROR: "Erro ao cargar os chats",
            CHATS_LIST_UNEXPECTED_FORMAT: "Formato de resposta inesperábel",
            CHATS_LIST_EMPTY_STRING0: "Aínda non tes un chat...",
            CHATS_LIST_EMPTY_STRING1: "por qué non comezas un agora?",
            CHAT_PREFIX_YOU: "Ti",
            CHAT_DELETED_USER: "[Eliminado]",
            CHAT_MESSAGE_DELETED: "Esta mensaxe borrouse",

            // DATE AND TIMES
            DATE_TODAY: "Hoxe",
            DATE_YESTERDAY: "Onte",
            DATE_NOW: "Agora mesmo",
            DATE_MONDAY: "Luns",
            DATE_TUESDAY: "Martes",
            DATE_WEDNESDAY: "Mércores",
            DATE_THURSDAY: "Xoves",
            DATE_FRIDAY: "Venres",
            DATE_SATURDAY: "Sábado",
            DATE_SUNDAY: "Domingo",
            DATE_THIS_WEEK: "Esta semana",
            DATE_LAST_WEEK: "A semana pasada",
            DATE_THIS_MONTH: "Este mes",
            DATE_LAST_MONTH: "O mes pasado",
            DATE_THIS_YEAR: "Este ano",
            DATE_LAST_YEAR: "O año pasado",
            DATE_MULTIPLE_DAYS: "Fai {{count}} días",
            DATE_MULTIPLE_HOURS: "Fai {{count}} horas",
            DATE_MULTIPLE_MINUTES: "Fai {{count}} minutos",
            DATE_MULTIPLE_SECONDS: "Fai {{count}} segundos",
            DATE_MULTIPLE_WEEKS: "Fai {{count}} semanas",
            DATE_MULTIPLE_MONTHS: "Fai {{count}} meses",
            DATE_MULTIPLE_YEARS: "Fai {{count}} anos",
        }
    },
    // CATALAN
    ca: {
        translation: {
            // ERROS GENERICS
            ERR_NETWORK: "Error de xarxa",
            ERR_SERVER: "Error de servidor",
        }
    },
    // BASQUE
    eu: {
        translation: {
            // ERROREAK GENERIKOAK
            ERR_NETWORK: "Sareko errorea",
            ERR_SERVER: "Zerbitzariaren errorea",

            // FORMULARIOAREN EREMUAK
            FORM_USERNAME_LABEL: "Erabiltzaile izena",
            FORM_USERNAME_PLACEHOLDER: "Idatzi zure erabiltzaile izena",
            FORM_PASSWORD_LABEL: "Pasahitza",
            FORM_PASSWORD_PLACEHOLDER: "Idatzi zure pasahitza",
            FORM_PASSWORD2_LABEL: "Berretsi pasahitza",
            FORM_PASSWORD2_PLACEHOLDER: "Idatzi zure pasahitza berriro",
        }
    },
    // PORTUGUESE
    pt: {
        translation: {
            // ERROS GENÉRICOS
            ERR_NETWORK: "Erro de rede",
            ERR_SERVER: "Erro do servidor",
        }
    },
    // FRENCH
    fr: {
        translation: {
            // ERREURS GÉNÉRIQUES
            ERR_NETWORK: "Erreur réseau",
            ERR_SERVER: "Erreur serveur",
        }
    },
    // ROMANIAN
    ro: {
        translation: {
            // ERORI GENERICE
            ERR_NETWORK: "Eroare de rețea",
            ERR_SERVER: "Eroare de server",
        }
    },

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