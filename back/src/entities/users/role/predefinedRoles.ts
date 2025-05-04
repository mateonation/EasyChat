// Predefined roles for users in the system.
// An user can have multiple roles associated to 
// their account and are used to manage permissions 
// and access control. These roles are subject to
// change and can be modified in the future.

export const predefinedRoles = [
    'admin',        // Full access and permission for anything in system
    'moderator',    // Ban users and manage ban lists
    'user',         // Regular user with basic permissions - everyone has this role by default
    'blog_author',  // Create blog posts and publish them in the landing page
    'tl_en',        // Translate to English
    'tl_es',        // Translate to Spanish
    'tl_gl',        // Translate to Galician
    'tl_ca',        // Translate to Catalan
    'tl_eu',        // Translate to Basque
    'tl_pt',        // Translate to Portuguese
    'tl_fr',        // Translate to French
    'tl_ro',        // Translate to Romanian
]