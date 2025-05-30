import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    // ENGLISH
    en: {
        translation: {
            // GENERIC ERRORS
            ERR_NETWORK: "Network error",
            ERR_SERVER: "Server error",
            ERR_UNEXPECTED: "Unexpected error",
            ERR_UNEXPECTED_FORMAT: "Unexpected response format",

            // GENERIC ANSWERS
            GENERIC_ANSWER_YES: "Yes",
            GENERIC_ANSWER_NO: "No",
            GENERIC_ANSWER_CANCEL: "Cancel",
            GENERIC_ANSWER_CONFIRM: "Confirm",
            GENERIC_ANSWER_DELETE: "Delete",
            GENERIC_ANSWER_REMOVE: "Remove",
            GENERIC_ANSWER_LEAVE: "Leave",
            GENERIC_ANSWER_OK: "OK",
            GENERIC_ANSWER_CLOSE: "Close",
            GENERIC_ANSWER_ADD: "Add",
            GENERIC_ANSWER_EDIT: "Edit",
            GENERIC_ANSWER_SAVE: "Save",
            GENERIC_ANSWER_SUBMIT: "Submit",
            GENERIC_ANSWER_SEARCH: "Search",
            GENERIC_ANSWER_SEND: "Send",

            // GENERIC MESSAGES
            GENERIC_MSG_ERROR: "Error",
            GENERIC_MSG_SUCCESS: "Success",
            GENERIC_MSG_WARNING: "Warning",
            GENERIC_MSG_INFO: "Info",
            GENERIC_MSG_LOADING: "Loading...",
            GENERIC_MSG_NOT_FOUND: "Not found",
            GENERIC_MSG_UNAUTHORIZED: "Unauthorized",

            // FORM FIELDS
            FORM_NAME_LABEL: "Name",
            FORM_DESCRIPTION_LABEL: "Description",
            FORM_EMAIL_LABEL: "Email",
            FORM_EMAIL_PLACEHOLDER: "Enter your email here",
            FORM_FIRSTNAME_LABEL: "First name",
            FORM_LASTNAME_LABEL: "Last name",
            FORM_USERNAME_LABEL: "Username",
            FORM_USERNAME_PLACEHOLDER: "Enter your username here",
            FORM_PASSWORD_LABEL: "Password",
            FORM_PASSWORD_PLACEHOLDER: "Enter your password here",
            FORM_PASSWORD2_LABEL: "Repeat password",
            FORM_PASSWORD2_PLACEHOLDER: "Repeat your password here",
            FORM_BIRTHDATE_LABEL: "Date of birth",
            FORM_CHAT_TYPE_LABEL: "Chat type",
            FORM_TYPE_LABEL: "Type",
            FORM_CHAT_TYPE_PLACEHOLDER: "Select the type of chat you want to create",
            FORM_GROUP_NAME_LABEL: "Group name",
            FORM_GROUP_NAME_PLACEHOLDER: "Enter the name of the group chat here",
            FORM_GROUP_DESCRIPTION_LABEL: "Group description",
            FORM_GROUP_DESCRIPTION_PLACEHOLDER: "Write here a description of the group chat",
            FORM_MEMBERS_LABEL: "Members",
            FORM_MEMBERS_PLACEHOLDER: "Add members to the chat by entering their usernames here",
            FORM_MEMBERS_ADD: "Add members",
            FORM_SEARCH_CLEAR: "Clear search",
            FORM_CHAT_SEARCH_LABEL: "Search chats",
            FORM_CHAT_SEARCH_PLACEHOLDER: "Search for a chat by its name",
            FORM_MESSAGE_SEARCH_LABEL: "Search messages",
            FORM_MESSAGE_SEARCH_PLACEHOLDER: "Search for a message by its content",
            FORM_MESSAGE_PLACEHOLDER: "Write a message...",
            FORM_MESSAGE_LABEL: "Message",
            FORM_MESSAGE_SEND: "Send message",

            // LOGIN PAGE
            LOGIN_PAGE_TITLE: "Log in to your account",
            LOGIN_FORM_SUBMIT: "Login",
            LOGIN_FORM_ERROR: "Username or password is incorrect",
            LOGIN_REGISTER_LABEL: "Don't have an account?",
            LOGIN_REGISTER_LINK: "Register a new one",

            // REGISTER PAGE
            REGISTER_PAGE_TITLE: "Create a new account",
            REGISTER_FORM_SUBMIT: "Register",
            REGISTER_SUCCESSFUL: "Congratulations! You have registered your account successfully. You can now log in to it",
            REGISTER_LOGIN_LABEL: "Already have an account?",
            REGISTER_LOGIN_LINK: "Log in here",

            // FORM MESSAGES
            MINIMUM_LENGTH: "{{field}} must have {{length}} characters at least",
            MAXIMUM_LENGTH: "{{field}} must have {{length}} characters at most",
            INVALID_FIELD_CHARACTERS: "{{field}} contains invalid characters",
            ALREADY_IN_USE: "'{{data}}' already in use",
            REQUIRED_FIELD: "{{field}} is required",
            PASSWORD_MISMATCH: "Passwords do not match",
            BIRTHDATE_INVALID: "You must be at least 18 years old",
            FAILED_TO_CREATE: "Failed to create {{field}}",
            FAILED_TO_UPDATE: "Failed to update {{field}}",
            FAILED_TO_DELETE: "Failed to delete {{field}}",
            FAILED_TO_LOAD: "Failed to load {{field}}",

            // CHATS LIST PAGE
            CHATS_LIST_PAGE_TITLE: "My chats",
            CHATS_LIST_PAGE_SUBTITLE: "Click on a chat to open it",
            CHATS_LIST_LOADING: "Loading chats...",
            CHATS_LIST_ERROR: "Failed to load chats",
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

            // CREATE A CHAT
            CREATE_CHAT_TITLE: "Create a new chat",
            CHAT_TYPE_PRIVATE: "Private",
            CHAT_TYPE_GROUP: "Group",
            CHAT_TYPE_PUBLIC: "Public",
            CHAT_CREATE: "Create chat",
            CHAT_CREATE_SUCCESS: "Chat created successfully",
            CHAT_CREATE_ERROR: "Failed to create chat.",

            // MEMBERS
            MEMBER_ROLE_ADMIN: "Admin",
            MEMBER_ROLE_MEMBER: "Member",
            MEMBER_ROLE_OWNER: "Owner",
            MEMBERS_ADD_ERROR: "Failed to add members",
            MEMBER_ALREADY_EXISTS: "{{username}} is already a member of this chat",
            MEMBERS_ADD_ERROR_UNEXPECTED: "Unexpected error while adding members",
            MEMBER_REMOVE_ERROR_UNEXPECTED: "Unexpected error while removing member",
            MEMBERS_ADD_ERROR_NOT_ENOUGH: "You must add at least one member to the group",
            MEMBERS_ADD_ERROR_NOT_FOUND: "Some of the users you tried to add were not found",
            MEMBER_REMOVE_ERROR: "Failed to remove the member",
            MEMBER_REMOVE_OWNER_ERROR: "You can't remove the owner of this group",
            MEMBER_REMOVAL_UNAUTHORIZED_ADMIN: "You have to be an admin to remove members from this group",
            MEMBERS_ADD_SUCCESS: "Members added successfully",
            
            MEMBER_ERROR_INVALID: "Invalid members list",
            MEMBER_ERROR_EMPTY: "Members list cannot be empty",
            MEMBER_REMOVE_SUCCESS: "{{username}} was removed from the group successfully",
            MEMBER_ERROR_NOT_FOUND: "{{username}} is not a member of this chat",
            MEMBER_REMOVE_ITSELF_QUESTION: "Are you sure you want to leave this chat?",
            MEMBER_REMOVE_ITSELF_SUCCESS: "You have left the chat successfully",
            MEMBER_REMOVE_ITSELF_ERROR: "Failed to leave the chat",

            // USER PROFILE
            USER_PROFILE_PAGE_TITLE: "User Profile",
            USER_PROFILE_LOADING: "Loading user profile...",
            USER_PROFILE_ERROR: "Failed to load user profile",
            USER_JOIN_DATE: "Joined on {{date}}",
            USER_ROLE_ADMIN: "Admin",
            USER_ROLE_USER: "Member",
            USER_ROLE_BLOG_AUTHOR: "Blog Author",
            USER_ROLE_MODERATOR: "Moderator",
            USER_ROLE_TL_EN: "English Translator",
            USER_ROLE_TL_ES: "Spanish Translator",
            USER_ROLE_TL_FR: "French Translator",
            USER_ROLE_TL_PT: "Portuguese Translator",
            USER_ROLE_TL_RO: "Romanian Translator",
            USER_ROLE_TL_GL: "Galician Translator",
            USER_ROLE_TL_EU: "Basque Translator",
            USER_ROLE_TL_CA: "Catalan Translator",

            // LANGUAGES
            LANGUAGE_EN: "English",
            LANGUAGE_ES: "Spanish",
            LANGUAGE_GL: "Galician",
            LANGUAGE_CA: "Catalan",
            LANGUAGE_EU: "Basque",
            LANGUAGE_PT: "Portuguese",
            LANGUAGE_FR: "French",
            LANGUAGE_RO: "Romanian",
        }
    },
    // SPANISH
    es: {
        translation: {
            // ERRORES GENÉRICOS
            ERR_NETWORK: "Error de red",
            ERR_SERVER: "Error del servidor",
            ERR_UNEXPECTED: "Error inesperado",
            ERR_UNEXPECTED_FORMAT: "Formato de respuesta inesperado",

            // RESPUESTAS GENERICAS
            GENERIC_ANSWER_YES: "Sí",
            GENERIC_ANSWER_NO: "No",
            GENERIC_ANSWER_CANCEL: "Cancelar",
            GENERIC_ANSWER_CONFIRM: "Confirmar",
            GENERIC_ANSWER_DELETE: "Eliminar",
            GENERIC_ANSWER_REMOVE: "Borrar",
            GENERIC_ANSWER_LEAVE: "Salir",
            GENERIC_ANSWER_OK: "OK",
            GENERIC_ANSWER_CLOSE: "Cerrar",
            GENERIC_ANSWER_ADD: "Añadir",
            GENERIC_ANSWER_EDIT: "Editar",
            GENERIC_ANSWER_SAVE: "Guardar",
            GENERIC_ANSWER_SUBMIT: "Enviar",

            // MENSAJES GENERICOS
            GENERIC_MSG_ERROR: "Error",
            GENERIC_MSG_SUCCESS: "Éxito",
            GENERIC_MSG_WARNING: "Advertencia",
            GENERIC_MSG_INFO: "Info",
            GENERIC_MSG_LOADING: "Cargando...",
            GENERIC_MSG_NOT_FOUND: "No encontrado",
            GENERIC_MSG_UNAUTHORIZED: "No autorizado",

            // CAMPOS DE FORMULARIO
            FORM_FIRSTNAME_LABEL: "Nombre",
            FORM_LASTNAME_LABEL: "Apellidos",
            FORM_USERNAME_LABEL: "Nombre de usuario",
            FORM_USERNAME_PLACEHOLDER: "Introduce tu nombre de usuario",
            FORM_PASSWORD_LABEL: "Contraseña",
            FORM_PASSWORD_PLACEHOLDER: "Introduce tu contraseña",
            FORM_PASSWORD2_LABEL: "Confirmar contraseña",
            FORM_PASSWORD2_PLACEHOLDER: "Introduce tu contraseña de nuevo",
            FORM_BIRTHDATE_LABEL: "Fecha de nacimiento",
            FORM_CHAT_TYPE_LABEL: "Tipo de chat",
            FORM_CHAT_TYPE_PLACEHOLDER: "Selecciona el tipo de chat",
            FORM_GROUP_NAME_LABEL: "Nombre del grupo",
            FORM_GROUP_NAME_PLACEHOLDER: "Escribe el nombre del grupo",
            FORM_GROUP_DESCRIPTION_LABEL: "Descripción del grupo",
            FORM_GROUP_DESCRIPTION_PLACEHOLDER: "Escribe una descripción del grupo",
            FORM_MEMBERS_LABEL: "Miembros",
            FORM_MEMBERS_PLACEHOLDER: "Añade members al grupo escribiendo sus nombres de usuario",
            FORM_MEMBERS_ADD: "Añadir miembros",
            FORM_SEARCH_LABEL: "Buscar",
            FORM_SEARCH_CLEAR: "Vaciar búsqueda",
            FORM_CHAT_SEARCH_LABEL: "Buscar chats",
            FORM_CHAT_SEARCH_PLACEHOLDER: "Busca un chat por su nombre",
            FORM_MESSAGE_SEARCH_LABEL: "Buscar mensajes",
            FORM_MESSAGE_SEARCH_PLACEHOLDER: "Busca un mensaje por su contenido",
            FORM_MESSAGE_PLACEHOLDER: "Escribe un mensaje...",

            // PÁGINA DE INICIAR SESIÓN
            LOGIN_PAGE_TITLE: "Iniciar sesión",
            LOGIN_FORM_SUBMIT: "Iniciar sesión",
            LOGIN_FORM_ERROR: "El nombre de usuario o la contraseña son incorrectos",
            LOGIN_REGISTER_LABEL: "¿Aún no tienes una cuenta?",
            LOGIN_REGISTER_LINK: "Crea una nueva",

            // PAGINA DE REGISTRO
            REGISTER_PAGE_TITLE: "Registrar cuenta",
            REGISTER_FORM_SUBMIT: "Crear cuenta",
            REGISTER_SUCCESSFUL: "¡Felicidades! Tu cuenta fue registrada con éxito. Ahora puedes iniciar sesión en ella",
            REGISTER_LOGIN_LABEL: "¿Ya tienes una cuenta?",
            REGISTER_LOGIN_LINK: "Inicia sesión aquí",
            
            // FORM MESSAGES
            MINIMUM_LENGTH: "'{{field}}' debe tener {{length}} caracteres como mínimo",
            MAXIMUM_LENGTH: "'{{field}}' no puede tener más de {{length}} caracteres",
            INVALID_FIELD: "'{{field}}' solo puede tener letras, números y guiones bajos",
            INVALID_FIELD_ALT: "'{{field}}' solo puede tener letras, números, guiones bajos y espacios",
            ALREADY_IN_USE: "'{{data}}' ya está en uso",
            PASSWORD_MISMATCH: "Las contraseñas no coinciden",
            BIRTHDATE_INVALID: "Debes tener 18 años como mínimo",

            // PAGINA DE LISTA DE CHATS
            CHATS_LIST_PAGE_TITLE: "Mis chats",
            CHATS_LIST_LOADING: "Cargando chats...",
            CHATS_LIST_ERROR: "Error al cargar los chats",
            CHATS_LIST_UNEXPECTED_FORMAT: "Formato de respuesta inesperado",
            CHATS_LIST_EMPTY_STRING0: "Aún no tienes ningún chat...",
            CHATS_LIST_EMPTY_STRING1: "¿por qué no creas uno ahora?",
            CHAT_PREFIX_YOU: "Tú",
            CHAT_DELETED_USER: "[Eliminado]",
            CHAT_MESSAGE_DELETED: "Este mensaje fue borrado",

            // FECHAS Y HORAS
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
            
            // CREAR CHAT
            CREATE_CHAT_TITLE: "Crear un chat nuevo",
            CHAT_TYPE_PRIVATE: "Chat privado",
            CHAT_TYPE_GROUP: "Chat grupal",
            CHAT_TYPE_PUBLIC: "Chat público",
            CHAT_CREATE: "Crear chat",
            CHAT_CREATE_SUCCESS: "Chat creado correctamente",
            CHAT_CREATE_ERROR: "Fallo al crear chat.",
            CHAT_CREATE_ERROR_UNEXPECTED: "Error inesperado al crear el chat",
            GROUP_CREATE_ERROR_NAME: "El nombre del grupo debe tener al menos 3 caracteres y como máximo 50 caracteres",
            GROUP_CREATE_ERROR_DESCRIPTION: "La descripción del grupo debe tener como máximo 255 caracteres",
            CHAT_CREATE_ERROR_TYPE: "El tipo de chat es requerido",

            // MIEMBROS
            MEMBER_ROLE_ADMIN: "Administrador",
            MEMBER_ROLE_MEMBER: "Miembro",
            MEMBER_ROLE_OWNER: "Propietario",
            MEMBERS_ADD_ERROR: "Fallo al añadir miembros",
            MEMBER_ALREADY_EXISTS: "{{username}} ya es un miembro de este chat",
            MEMBERS_ADD_ERROR_UNEXPECTED: "Error inesperado al añadir miembros",
            MEMBER_REMOVE_ERROR_UNEXPECTED: "Error inesperado al eliminar miembro",
            MEMBERS_ADD_ERROR_NOT_ENOUGH: "Debes añadir al menos un miembro al grupo",
            MEMBERS_ADD_ERROR_NOT_FOUND: "Algunos de los usuarios que intentaste añadir no fueron encontrados",
            MEMBER_REMOVE_ERROR: "Fallo al eliminar el miembro",
            MEMBER_REMOVE_OWNER_ERROR: "No puedes eliminar al propietario de este grupo",
            MEMBER_REMOVAL_UNAUTHORIZED_ADMIN: "Debes ser un administrador para eliminar miembros de este grupo",
            MEMBERS_ADD_SUCCESS: "Miembros añadidos correctamente",
            
            MEMBER_ERROR_INVALID: "Lista de miembros inválida",
            MEMBER_ERROR_EMPTY: "La lista de miembros no puede estar vacía",
            MEMBER_REMOVE_SUCCESS: "{{username}} fue eliminado del grupo correctamente",
            MEMBER_ERROR_NOT_FOUND: "{{username}} no es un miembro de este grupo",
            MEMBER_REMOVE_ITSELF_QUESTION: "¿Estás seguro de que quieres abandonar este grupo?",
            MEMBER_REMOVE_ITSELF_SUCCESS: "Abandonaste el grupo",
            MEMBER_REMOVE_ITSELF_ERROR: "Fallo al abandonar el grupo",
        }
    },
    // GALICIAN
    gl: {
        translation: {
            // ERROS XENÉRICOS
            ERR_NETWORK: "Erro da red",
            ERR_SERVER: "Erro do servidor",
            ERR_UNEXPECTED: "Error inesperado",
            ERR_UNEXPECTED_FORMAT: "Formato de resposta inesperado",

            // RESPOSTAS XENÉRICAS
            GENERIC_ANSWER_YES: "Sí",
            GENERIC_ANSWER_NO: "Non",
            GENERIC_ANSWER_CANCEL: "Cancelar",
            GENERIC_ANSWER_CONFIRM: "Confirmar",
            GENERIC_ANSWER_DELETE: "Remover",
            GENERIC_ANSWER_REMOVE: "Borrar",
            GENERIC_ANSWER_LEAVE: "Sair",
            GENERIC_ANSWER_OK: "OK",
            GENERIC_ANSWER_CLOSE: "Pechar",
            GENERIC_ANSWER_ADD: "Engadir",
            GENERIC_ANSWER_EDIT: "Editar",
            GENERIC_ANSWER_SAVE: "Gardar",
            GENERIC_ANSWER_SUBMIT: "Enviar",

            // MENSAXES XENÉRICOS
            GENERIC_MSG_ERROR: "Error",
            GENERIC_MSG_SUCCESS: "Éxito",
            GENERIC_MSG_WARNING: "Advertencia",
            GENERIC_MSG_INFO: "Info",
            GENERIC_MSG_LOADING: "Cargando...",
            GENERIC_MSG_NOT_FOUND: "Non atopado",
            GENERIC_MSG_UNAUTHORIZED: "Non autorizado",

            // CAMPOS DO FORMULARIO
            FORM_FIRSTNAME_LABEL: "Nome",
            FORM_LASTNAME_LABEL: "Apelidos",
            FORM_USERNAME_LABEL: "Nome de usuario",
            FORM_USERNAME_PLACEHOLDER: "Escribe o teu nome de usuario",
            FORM_PASSWORD_LABEL: "Contrasinal",
            FORM_PASSWORD_PLACEHOLDER: "Escribe o teu contrasinal",
            FORM_PASSWORD2_LABEL: "Confirmar contrasinal",
            FORM_PASSWORD2_PLACEHOLDER: "Escribe o teu contrasinal unha vez máis",
            FORM_CHAT_TYPE_LABEL: "Tipo de chat",
            FORM_CHAT_TYPE_PLACEHOLDER: "Selecciona o tipo de chat",
            FORM_GROUP_NAME_LABEL: "Nome do grupo",
            FORM_GROUP_NAME_PLACEHOLDER: "Nome do chat grupal",
            FORM_GROUP_DESCRIPTION_LABEL: "Descripción do grupo",
            FORM_GROUP_DESCRIPTION_PLACEHOLDER: "Engádelle unha descripción ao grupo",
            FORM_MEMBERS_LABEL: "Membros",
            FORM_MEMBERS_PLACEHOLDER: "Engade membros ao grupo escribindo os seus nomes de usuario",
            FORM_MEMBERS_ADD: "Engadir membros",
            FORM_SEARCH_LABEL: "Buscar",
            FORM_SEARCH_CLEAR: "Baleirar búsqueda",
            FORM_CHAT_SEARCH_LABEL: "Buscar chats",
            FORM_CHAT_SEARCH_PLACEHOLDER: "Busca un chat polo seu nome",
            FORM_MESSAGE_SEARCH_LABEL: "Buscar mensaxes",
            FORM_MESSAGE_SEARCH_PLACEHOLDER: "Busca unha mensaxe polo seu contenido",
            FORM_MESSAGE_PLACEHOLDER: "Escribe unha mensaxe...",

            // PÁXINA DE INICIAR SESIÓN
            LOGIN_PAGE_TITLE: "Iniciar sesión",
            LOGIN_FORM_SUBMIT: "Iniciar sesión",
            LOGIN_FORM_ERROR: "O nome de usuario ou o contrasinal non son correctos",
            LOGIN_REGISTER_LABEL: "Aínda non tes unha conta?",
            LOGIN_REGISTER_LINK: "Rexistrar unha nova",
            FORM_BIRTHDATE_LABEL: "Data de nacemento",

            // REGISTER PAGE
            REGISTER_PAGE_TITLE: "Rexistrar conta nova",
            REGISTER_FORM_SUBMIT: "Crear usuario",
            REGISTER_SUCCESSFUL: "Noraboa! Rexistráchesche correctamente. Agora podes iniciar sesión na túa conta",
            REGISTER_LOGIN_LABEL: "Xa tes unha conta creada?",
            REGISTER_LOGIN_LINK: "Inicia sesión nela",
            
            // FORM MESSAGES
            MINIMUM_LENGTH: "'{{field}}' debe ter {{length}} caracteres como mínimo",
            MAXIMUM_LENGTH: "'{{field}}' non pode ter máis de {{length}} caracteres",
            INVALID_FIELD: "'{{field}}' só pode ter letras, números e guións baixos",
            INVALID_FIELD_ALT: "'{{field}}' só pode ter letras, números, guións baixos e espazos",
            ALREADY_IN_USE: "'{{data}}' actualmente en uso",
            PASSWORD_MISMATCH: "Os contrasinais non coinciden",
            BIRTHDATE_INVALID: "Debes ter polo menos 18 anos",

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
            
            // CREAR CHAT
            CREATE_CHAT_TITLE: "Crear un chat novo",
            CHAT_TYPE_PRIVATE: "Chat privado",
            CHAT_TYPE_GROUP: "Chat grupal",
            CHAT_TYPE_PUBLIC: "Chat público",
            CHAT_CREATE: "Crear chat",
            CHAT_CREATE_SUCCESS: "Chat creado correctamente",
            CHAT_CREATE_ERROR: "Erro ao crear chat.",
            CHAT_CREATE_ERROR_UNEXPECTED: "Erro inesperado ao crear o chat",
            GROUP_CREATE_ERROR_NAME: "O nome do grupo debe ter polo menos 3 caracteres e como máximo 50 caracteres",
            GROUP_CREATE_ERROR_DESCRIPTION: "A descripción do grupo debe ter como máximo 255 caracteres",
            CHAT_CREATE_ERROR_TYPE: "Tipo do chat requerido",

            // MEMBROS
            MEMBER_ROLE_ADMIN: "Administrador",
            MEMBER_ROLE_MEMBER: "Membro",
            MEMBER_ROLE_OWNER: "Propietario",
            MEMBERS_ADD_ERROR: "Erro ao engadir membros",
            MEMBER_ALREADY_EXISTS: "{{username}} xa é un membro deste grupo",
            MEMBERS_ADD_ERROR_UNEXPECTED: "Erro inesperado ao engadir membros",
            MEMBER_REMOVE_ERROR_UNEXPECTED: "Erro inesperado ao eliminar membro",
            MEMBERS_ADD_ERROR_NOT_ENOUGH: "Tes que engadir polo menos un membro ao grupo",
            MEMBERS_ADD_ERROR_NOT_FOUND: "Algúns dos usuarios que tentaches engadir non foron atopados",
            MEMBER_REMOVE_ERROR: "Erro ao eliminar o membro",
            MEMBER_REMOVE_OWNER_ERROR: "Non podes eliminar ao propietario deste grupo",
            MEMBER_REMOVAL_UNAUTHORIZED_ADMIN: "Tes que ser administrador para eliminar membros deste grupo",
            MEMBERS_ADD_SUCCESS: "Membros engadidos correctamente",
            
            MEMBER_ERROR_INVALID: "Lista de membros inválida",
            MEMBER_ERROR_EMPTY: "A lista de membros non pode estar baleira",
            MEMBER_REMOVE_SUCCESS: "{{username}} foi eliminado do grupo",
            MEMBER_ERROR_NOT_FOUND: "{{username}} non é un membro deste grupo",
            MEMBER_REMOVE_ITSELF_QUESTION: "Seguro que queres abandonar este grupo?",
            MEMBER_REMOVE_ITSELF_SUCCESS: "Abandonaches o grupo",
            MEMBER_REMOVE_ITSELF_ERROR: "Erro ao abandonar o grupo",
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