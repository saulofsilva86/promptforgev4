// =============================================
// PROMPTFORGE STUDIO v4.0 - SISTEMA DE IDIOMAS
// Internacionalização completa PT/EN/ES
// ✅ Janeiro 2026
// =============================================

const TRANSLATIONS = {
    // ==================== PORTUGUÊS (BR) ====================
    pt: {
        code: 'pt',
        name: 'Português',
        flag: '🇧🇷',
        
        // Interface principal
        ui: {
            app_title: 'PromptForge Studio',
            app_subtitle: 'Crie estampas profissionais em minutos',
            welcome: 'Bem-vindo',
            
            // Navegação
            nav_studio: 'Studio',
            nav_history: 'Histórico',
            nav_favorites: 'Favoritos',
            nav_settings: 'Configurações',
            nav_logout: 'Sair',
            
            // Créditos
            credits_remaining: 'Créditos restantes',
            credits_used: 'Créditos usados',
            credits_get_more: 'Obter mais créditos',
            credits_insufficient: 'Créditos insuficientes',
            credits_required: 'Requer {count} crédito(s)',
            
            // Steps do formulário
            step1_title: 'Escolha o Nicho',
            step1_subtitle: 'Selecione a categoria da sua estampa',
            
            step2_title: 'Escolha o Estilo Visual',
            step2_subtitle: 'Defina a aparência artística',
            
            step3_title: 'Paleta de Cores',
            step3_subtitle: 'Escolha o clima cromático',
            
            step4_title: 'Descreva sua Ideia',
            step4_subtitle: 'Seja específico: personagens, ações, cenários...',
            
            // Opções do Studio
            studio_options: 'Opções de Geração',
            option_design: 'Estampa PNG',
            option_mockups: 'Mockups (3x)',
            option_copy: 'Copy de Vendas',
            option_remove_bg: 'Remover Fundo',
            option_upscale: 'Upscale 4K',
            option_social: 'Post Social Media',
            
            included: 'incluso',
            optional: 'opcional',
            
            // Botões
            btn_generate: 'Gerar Tudo',
            btn_random_idea: 'Ideia Aleatória',
            btn_another_idea: 'Outra Ideia',
            btn_download: 'Baixar',
            btn_download_all: 'Baixar Tudo (ZIP)',
            btn_copy: 'Copiar',
            btn_favorite: 'Favoritar',
            btn_share: 'Compartilhar',
            btn_close: 'Fechar',
            btn_cancel: 'Cancelar',
            btn_confirm: 'Confirmar',
            
            // Progresso
            progress_title: 'Gerando sua criação...',
            progress_preparing: 'Preparando...',
            progress_generating_image: 'Gerando imagem...',
            progress_removing_bg: 'Removendo fundo...',
            progress_creating_mockups: 'Criando mockups...',
            progress_generating_copy: 'Gerando copy de vendas...',
            progress_generating_social: 'Criando post social...',
            progress_packaging: 'Empacotando arquivos...',
            progress_done: 'Pronto!',
            
            // Mensagens
            msg_copied: 'Copiado para área de transferência!',
            msg_favorited: 'Adicionado aos favoritos',
            msg_unfavorited: 'Removido dos favoritos',
            msg_error: 'Erro',
            msg_success: 'Sucesso',
            msg_loading: 'Carregando...',
            msg_select_niche: 'Selecione um nicho',
            msg_select_style: 'Selecione um estilo',
            msg_select_palette: 'Selecione uma paleta',
            msg_describe_idea: 'Descreva sua ideia',
            
            // Tutoriais
            tutorial_title: 'Como usar',
            tutorial_tab_leonardo: 'Leonardo.ai',
            tutorial_tab_midjourney: 'Midjourney',
            tutorial_tab_gemini: 'Google Gemini',
            tutorial_tab_tips: 'Dicas',
        },
        
        // Categorias
        categories: {
            action: 'Ação',
            equipment: 'Equipamento',
            humor: 'Humor',
            icons: 'Ícones',
            phrases: 'Frases',
            art: 'Arte'
        },
        
        // Paletas
        palettes: {
            vibrant: 'Vibrante',
            pastel: 'Pastel',
            bw: 'Preto & Branco',
            neon: 'Neon',
            earth: 'Terroso',
            ocean: 'Oceano',
            sunset: 'Pôr do Sol',
            forest: 'Floresta',
            auto: 'IA Decide'
        }
    },
    
    // ==================== ENGLISH (US) ====================
    en: {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
        
        ui: {
            app_title: 'PromptForge Studio',
            app_subtitle: 'Create professional designs in minutes',
            welcome: 'Welcome',
            
            nav_studio: 'Studio',
            nav_history: 'History',
            nav_favorites: 'Favorites',
            nav_settings: 'Settings',
            nav_logout: 'Logout',
            
            credits_remaining: 'Credits remaining',
            credits_used: 'Credits used',
            credits_get_more: 'Get more credits',
            credits_insufficient: 'Insufficient credits',
            credits_required: 'Requires {count} credit(s)',
            
            step1_title: 'Choose Niche',
            step1_subtitle: 'Select your design category',
            
            step2_title: 'Choose Visual Style',
            step2_subtitle: 'Define the artistic look',
            
            step3_title: 'Color Palette',
            step3_subtitle: 'Choose the chromatic mood',
            
            step4_title: 'Describe Your Idea',
            step4_subtitle: 'Be specific: characters, actions, scenarios...',
            
            studio_options: 'Generation Options',
            option_design: 'Design PNG',
            option_mockups: 'Mockups (3x)',
            option_copy: 'Sales Copy',
            option_remove_bg: 'Remove Background',
            option_upscale: 'Upscale 4K',
            option_social: 'Social Media Post',
            
            included: 'included',
            optional: 'optional',
            
            btn_generate: 'Generate All',
            btn_random_idea: 'Random Idea',
            btn_another_idea: 'Another Idea',
            btn_download: 'Download',
            btn_download_all: 'Download All (ZIP)',
            btn_copy: 'Copy',
            btn_favorite: 'Favorite',
            btn_share: 'Share',
            btn_close: 'Close',
            btn_cancel: 'Cancel',
            btn_confirm: 'Confirm',
            
            progress_title: 'Creating your design...',
            progress_preparing: 'Preparing...',
            progress_generating_image: 'Generating image...',
            progress_removing_bg: 'Removing background...',
            progress_creating_mockups: 'Creating mockups...',
            progress_generating_copy: 'Generating sales copy...',
            progress_generating_social: 'Creating social post...',
            progress_packaging: 'Packaging files...',
            progress_done: 'Done!',
            
            msg_copied: 'Copied to clipboard!',
            msg_favorited: 'Added to favorites',
            msg_unfavorited: 'Removed from favorites',
            msg_error: 'Error',
            msg_success: 'Success',
            msg_loading: 'Loading...',
            msg_select_niche: 'Select a niche',
            msg_select_style: 'Select a style',
            msg_select_palette: 'Select a palette',
            msg_describe_idea: 'Describe your idea',
            
            tutorial_title: 'How to use',
            tutorial_tab_leonardo: 'Leonardo.ai',
            tutorial_tab_midjourney: 'Midjourney',
            tutorial_tab_gemini: 'Google Gemini',
            tutorial_tab_tips: 'Tips',
        },
        
        categories: {
            action: 'Action',
            equipment: 'Equipment',
            humor: 'Humor',
            icons: 'Icons',
            phrases: 'Phrases',
            art: 'Art'
        },
        
        palettes: {
            vibrant: 'Vibrant',
            pastel: 'Pastel',
            bw: 'Black & White',
            neon: 'Neon',
            earth: 'Earthy',
            ocean: 'Ocean',
            sunset: 'Sunset',
            forest: 'Forest',
            auto: 'AI Decides'
        }
    },
    
    // ==================== ESPAÑOL ====================
    es: {
        code: 'es',
        name: 'Español',
        flag: '🇪🇸',
        
        ui: {
            app_title: 'PromptForge Studio',
            app_subtitle: 'Crea diseños profesionales en minutos',
            welcome: 'Bienvenido',
            
            nav_studio: 'Estudio',
            nav_history: 'Historial',
            nav_favorites: 'Favoritos',
            nav_settings: 'Configuración',
            nav_logout: 'Salir',
            
            credits_remaining: 'Créditos restantes',
            credits_used: 'Créditos usados',
            credits_get_more: 'Obtener más créditos',
            credits_insufficient: 'Créditos insuficientes',
            credits_required: 'Requiere {count} crédito(s)',
            
            step1_title: 'Elige el Nicho',
            step1_subtitle: 'Selecciona la categoría de tu diseño',
            
            step2_title: 'Elige el Estilo Visual',
            step2_subtitle: 'Define el aspecto artístico',
            
            step3_title: 'Paleta de Colores',
            step3_subtitle: 'Elige el ambiente cromático',
            
            step4_title: 'Describe tu Idea',
            step4_subtitle: 'Sé específico: personajes, acciones, escenarios...',
            
            studio_options: 'Opciones de Generación',
            option_design: 'Diseño PNG',
            option_mockups: 'Mockups (3x)',
            option_copy: 'Copy de Ventas',
            option_remove_bg: 'Quitar Fondo',
            option_upscale: 'Aumentar 4K',
            option_social: 'Post Redes Sociales',
            
            included: 'incluido',
            optional: 'opcional',
            
            btn_generate: 'Generar Todo',
            btn_random_idea: 'Idea Aleatoria',
            btn_another_idea: 'Otra Idea',
            btn_download: 'Descargar',
            btn_download_all: 'Descargar Todo (ZIP)',
            btn_copy: 'Copiar',
            btn_favorite: 'Favorito',
            btn_share: 'Compartir',
            btn_close: 'Cerrar',
            btn_cancel: 'Cancelar',
            btn_confirm: 'Confirmar',
            
            progress_title: 'Creando tu diseño...',
            progress_preparing: 'Preparando...',
            progress_generating_image: 'Generando imagen...',
            progress_removing_bg: 'Quitando fondo...',
            progress_creating_mockups: 'Creando mockups...',
            progress_generating_copy: 'Generando copy de ventas...',
            progress_generating_social: 'Creando post social...',
            progress_packaging: 'Empaquetando archivos...',
            progress_done: '¡Listo!',
            
            msg_copied: '¡Copiado al portapapeles!',
            msg_favorited: 'Añadido a favoritos',
            msg_unfavorited: 'Eliminado de favoritos',
            msg_error: 'Error',
            msg_success: 'Éxito',
            msg_loading: 'Cargando...',
            msg_select_niche: 'Selecciona un nicho',
            msg_select_style: 'Selecciona un estilo',
            msg_select_palette: 'Selecciona una paleta',
            msg_describe_idea: 'Describe tu idea',
            
            tutorial_title: 'Cómo usar',
            tutorial_tab_leonardo: 'Leonardo.ai',
            tutorial_tab_midjourney: 'Midjourney',
            tutorial_tab_gemini: 'Google Gemini',
            tutorial_tab_tips: 'Consejos',
        },
        
        categories: {
            action: 'Acción',
            equipment: 'Equipo',
            humor: 'Humor',
            icons: 'Íconos',
            phrases: 'Frases',
            art: 'Arte'
        },
        
        palettes: {
            vibrant: 'Vibrante',
            pastel: 'Pastel',
            bw: 'Blanco y Negro',
            neon: 'Neón',
            earth: 'Terroso',
            ocean: 'Océano',
            sunset: 'Atardecer',
            forest: 'Bosque',
            auto: 'IA Decide'
        }
    }
};

// ==================== ESTADO DO IDIOMA ====================
let currentLanguage = 'pt'; // Padrão: Português

// ==================== FUNÇÕES PRINCIPAIS ====================

/**
 * Inicializa o sistema de idiomas
 * Detecta idioma do navegador ou carrega preferência salva
 */
function initI18n() {
    // 1. Tentar carregar idioma salvo
    const savedLang = localStorage.getItem('promptforge_language');
    
    if (savedLang && TRANSLATIONS[savedLang]) {
        currentLanguage = savedLang;
        console.log('🌐 Idioma carregado do storage:', currentLanguage);
        return currentLanguage;
    }
    
    // 2. Detectar idioma do navegador
    const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    
    if (browserLang.startsWith('pt')) {
        currentLanguage = 'pt';
    } else if (browserLang.startsWith('es')) {
        currentLanguage = 'es';
    } else {
        currentLanguage = 'en';
    }
    
    // 3. Salvar preferência
    localStorage.setItem('promptforge_language', currentLanguage);
    
    console.log('🌐 Idioma detectado:', currentLanguage, '(browser:', browserLang, ')');
    return currentLanguage;
}

/**
 * Obtém uma tradução
 * @param {string} key - Chave no formato 'ui.app_title' ou 'categories.action'
 * @param {Object} replacements - Objeto com substituições {placeholder: valor}
 * @returns {string} Texto traduzido
 * 
 * @example
 * t('ui.app_title') // => 'PromptForge Studio'
 * t('ui.credits_required', {count: 3}) // => 'Requer 3 crédito(s)'
 */
function t(key, replacements = {}) {
    const keys = key.split('.');
    let value = TRANSLATIONS[currentLanguage];
    
    // Navegar pelo objeto de traduções
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            console.warn(`⚠️ Tradução não encontrada: ${key} (${currentLanguage})`);
            return key; // Retorna a chave se não encontrar
        }
    }
    
    // Se não é string, retornar a chave
    if (typeof value !== 'string') {
        console.warn(`⚠️ Valor inválido para: ${key} (${currentLanguage})`);
        return key;
    }
    
    // Aplicar substituições {placeholder}
    let result = value;
    for (const [placeholder, replacement] of Object.entries(replacements)) {
        result = result.replace(`{${placeholder}}`, replacement);
    }
    
    return result;
}

/**
 * Troca o idioma da aplicação
 * @param {string} lang - Código do idioma ('pt', 'en', 'es')
 * @returns {boolean} Sucesso da operação
 */
function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) {
        console.error('❌ Idioma não suportado:', lang);
        return false;
    }
    
    const oldLang = currentLanguage;
    currentLanguage = lang;
    localStorage.setItem('promptforge_language', lang);
    
    console.log(`✅ Idioma alterado: ${oldLang} → ${lang}`);
    
    // Disparar evento customizado para atualizar UI
    window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { oldLang, newLang: lang } 
    }));
    
    return true;
}

/**
 * Obtém o idioma atual
 * @returns {string} Código do idioma
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Obtém todas as traduções do idioma atual
 * @returns {Object} Objeto completo de traduções
 */
function getCurrentTranslations() {
    return TRANSLATIONS[currentLanguage];
}

/**
 * Obtém lista de idiomas disponíveis
 * @returns {Array<Object>} Lista com {code, name, flag}
 */
function getAvailableLanguages() {
    return Object.keys(TRANSLATIONS).map(lang => ({
        code: TRANSLATIONS[lang].code,
        name: TRANSLATIONS[lang].name,
        flag: TRANSLATIONS[lang].flag
    }));
}

/**
 * Helper para pluralização
 * @param {number} count - Quantidade
 * @param {string} singular - Forma singular
 * @param {string} plural - Forma plural
 * @returns {string} Forma correta
 * 
 * @example
 * plural(1, 'crédito', 'créditos') // => 'crédito'
 * plural(5, 'crédito', 'créditos') // => 'créditos'
 */
function plural(count, singular, plural) {
    return count === 1 ? singular : plural;
}

/**
 * Formata número com separadores localizados
 * @param {number} number - Número a formatar
 * @returns {string} Número formatado
 */
function formatNumber(number) {
    const locales = {
        pt: 'pt-BR',
        en: 'en-US',
        es: 'es-ES'
    };
    
    return new Intl.NumberFormat(locales[currentLanguage]).format(number);
}

// ==================== EXPORTAÇÃO GLOBAL ====================
window.i18n = {
    // Funções principais
    init: initI18n,
    t: t,
    setLanguage: setLanguage,
    getCurrentLanguage: getCurrentLanguage,
    getCurrentTranslations: getCurrentTranslations,
    getAvailableLanguages: getAvailableLanguages,
    
    // Helpers
    plural: plural,
    formatNumber: formatNumber,
    
    // Acesso direto às traduções (para debug)
    TRANSLATIONS: TRANSLATIONS
};

// Atalho global para tradução
window.t = t;

// ==================== AUTO-INICIALIZAÇÃO ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initI18n();
        console.log('✅ i18n.js v4.0 inicializado');
    });
} else {
    initI18n();
    console.log('✅ i18n.js v4.0 inicializado');
}
