// =============================================
// PROMPTFORGE STUDIO v4.0 - SISTEMA DE APIs
// Gemini Imagen 3 (Free) + FAL.ai (Paid Fallback)
// ✅ Janeiro 2026
// =============================================

// ==================== CONFIGURAÇÃO ====================
const API_CONFIG = {
    // Gemini (Fase 1 - Free tier até 1.500/dia)
    gemini: {
        enabled: true,
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-2.0-flash-exp',
        imageModel: 'imagen-3.0-generate-001',
        apiKey: 'AIzaSyBId_M9V6aVcCxV6Akvv9sKELztKBtpz5M', // Será definida pelo usuário
        dailyLimit: 1500,
        timeout: 60000, // 60 segundos
        retryAttempts: 3,
        retryDelay: 2000 // 2 segundos
    },
    
    // FAL.ai (Fase 2 - Fallback pago ~$0.003/imagem)
    fal: {
        enabled: false, // Ativar quando Gemini atingir limite
        baseUrl: 'https://fal.run/fal-ai',
        model: 'flux/schnell',
        apiKey: '', // Será definida pelo usuário
        timeout: 90000, // 90 segundos
        retryAttempts: 2,
        retryDelay: 3000
    },
    
    // Controle de uso
    usage: {
        geminiCallsToday: 0,
        geminiLastReset: null,
        totalImages: 0,
        totalCost: 0
    }
};

// ==================== ESTADO DA API ====================
let apiState = {
    geminiAvailable: true,
    falAvailable: false,
    lastError: null,
    consecutiveErrors: 0,
    maxConsecutiveErrors: 5
};

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa o sistema de APIs
 * @param {Object} config - Configuração com API keys
 */
function initAPI(config = {}) {
    console.log('🔌 Inicializando sistema de APIs...');
    
    // Carregar configuração salva
    loadAPIConfig();
    
    // Aplicar configuração fornecida
    if (config.geminiApiKey) {
        API_CONFIG.gemini.apiKey = config.geminiApiKey;
        saveAPIConfig();
    }
    
    if (config.falApiKey) {
        API_CONFIG.fal.apiKey = config.falApiKey;
        API_CONFIG.fal.enabled = true;
        saveAPIConfig();
    }
    
    // Resetar contador diário se necessário
    checkDailyReset();
    
    console.log('✅ Sistema de APIs inicializado');
    console.log(`   Gemini: ${apiState.geminiAvailable ? '✅' : '❌'} (${API_CONFIG.usage.geminiCallsToday}/${API_CONFIG.gemini.dailyLimit} hoje)`);
    console.log(`   FAL.ai: ${apiState.falAvailable ? '✅' : '❌'}`);
}

/**
 * Define API keys
 */
function setAPIKeys(geminiKey, falKey) {
    if (geminiKey) {
        API_CONFIG.gemini.apiKey = geminiKey;
        API_CONFIG.gemini.enabled = true;
        apiState.geminiAvailable = true;
    }
    
    if (falKey) {
        API_CONFIG.fal.apiKey = falKey;
        API_CONFIG.fal.enabled = true;
        apiState.falAvailable = true;
    }
    
    saveAPIConfig();
    console.log('✅ API keys atualizadas');
}

// ==================== GERAÇÃO DE IMAGENS ====================

/**
 * Gera uma imagem usando o melhor serviço disponível
 * @param {string} prompt - Prompt completo para geração
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} {url, source, cost}
 */
async function generateImage(prompt, options = {}) {
    console.log('🎨 Gerando imagem...');
    
    // Validar prompt
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt inválido');
    }
    
    // Validar API keys
    if (!API_CONFIG.gemini.apiKey && !API_CONFIG.fal.apiKey) {
        throw new Error('Nenhuma API key configurada. Configure no menu Configurações.');
    }
    
    // Tentar Gemini primeiro (grátis)
    if (shouldUseGemini()) {
        try {
            console.log('📡 Tentando Gemini Imagen 3...');
            const result = await generateImageGemini(prompt, options);
            
            // Sucesso com Gemini
            incrementGeminiUsage();
            apiState.consecutiveErrors = 0;
            
            return {
                url: result.url,
                source: 'gemini',
                cost: 0,
                model: API_CONFIG.gemini.imageModel
            };
            
        } catch (error) {
            console.warn('⚠️ Gemini falhou:', error.message);
            apiState.consecutiveErrors++;
            
            // Se atingiu limite, desabilitar Gemini temporariamente
            if (apiState.consecutiveErrors >= apiState.maxConsecutiveErrors) {
                apiState.geminiAvailable = false;
                console.warn('❌ Gemini temporariamente desabilitado (muitos erros)');
            }
            
            // Continuar para FAL.ai se disponível
            if (!API_CONFIG.fal.enabled || !API_CONFIG.fal.apiKey) {
                throw new Error(`Gemini falhou: ${error.message}. Configure FAL.ai como fallback.`);
            }
        }
    }
    
    // Usar FAL.ai (pago)
    if (API_CONFIG.fal.enabled && API_CONFIG.fal.apiKey) {
        console.log('📡 Usando FAL.ai Flux...');
        
        try {
            const result = await generateImageFal(prompt, options);
            
            // Calcular custo
            const cost = 0.003; // $0.003 por imagem
            API_CONFIG.usage.totalCost += cost;
            saveAPIConfig();
            
            return {
                url: result.url,
                source: 'fal',
                cost: cost,
                model: API_CONFIG.fal.model
            };
            
        } catch (error) {
            console.error('❌ FAL.ai também falhou:', error.message);
            throw new Error('Todos os serviços de geração falharam. Tente novamente.');
        }
    }
    
    throw new Error('Nenhum serviço de geração disponível');
}

/**
 * Gera imagem usando Gemini Imagen 3
 */
async function generateImageGemini(prompt, options = {}) {
    const { 
        aspectRatio = '1:1',
        negativePrompt = 'blurry, low quality, distorted, mockup, person wearing shirt',
        safetyLevel = 'BLOCK_ONLY_HIGH'
    } = options;
    
    const url = `${API_CONFIG.gemini.baseUrl}/models/${API_CONFIG.gemini.imageModel}:generate`;
    
    const payload = {
        prompt: prompt,
        numberOfImages: 1,
        aspectRatio: aspectRatio,
        negativePrompt: negativePrompt,
        safetyFilterLevel: safetyLevel,
        personGeneration: 'DONT_ALLOW' // Importante para evitar pessoas
    };
    
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_CONFIG.gemini.apiKey
        },
        body: JSON.stringify(payload),
        timeout: API_CONFIG.gemini.timeout
    }, API_CONFIG.gemini.retryAttempts, API_CONFIG.gemini.retryDelay);
    
    if (!response.ok) {
        const error = await response.json();
        
        // Tratar erros específicos
        if (response.status === 429) {
            throw new Error('Limite diário do Gemini atingido (1.500/dia)');
        }
        
        if (response.status === 400) {
            throw new Error('Prompt bloqueado por filtro de segurança');
        }
        
        throw new Error(error.error?.message || `Gemini erro ${response.status}`);
    }
    
    const data = await response.json();
    
    // Gemini retorna base64
    if (data.predictions && data.predictions[0]) {
        const base64Image = data.predictions[0].bytesBase64Encoded;
        
        // Converter base64 para blob URL
        const blob = base64ToBlob(base64Image, 'image/png');
        const url = URL.createObjectURL(blob);
        
        return { url, blob };
    }
    
    throw new Error('Gemini não retornou imagem válida');
}

/**
 * Gera imagem usando FAL.ai Flux Schnell
 */
async function generateImageFal(prompt, options = {}) {
    const {
        imageSize = 'square_hd', // 1024x1024
        numInferenceSteps = 4, // Schnell = rápido
        guidanceScale = 7.5,
        enableSafetyChecker = true
    } = options;
    
    const url = `${API_CONFIG.fal.baseUrl}/${API_CONFIG.fal.model}`;
    
    const payload = {
        prompt: prompt,
        image_size: imageSize,
        num_inference_steps: numInferenceSteps,
        guidance_scale: guidanceScale,
        enable_safety_checker: enableSafetyChecker
    };
    
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${API_CONFIG.fal.apiKey}`
        },
        body: JSON.stringify(payload),
        timeout: API_CONFIG.fal.timeout
    }, API_CONFIG.fal.retryAttempts, API_CONFIG.fal.retryDelay);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `FAL.ai erro ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.images && data.images[0]) {
        return {
            url: data.images[0].url,
            seed: data.seed
        };
    }
    
    throw new Error('FAL.ai não retornou imagem válida');
}

// ==================== GERAÇÃO DE TEXTO ====================

/**
 * Gera texto usando Gemini Flash (copy de vendas, posts sociais, etc)
 */
async function generateText(prompt, options = {}) {
    console.log('✍️ Gerando texto...');
    
    if (!API_CONFIG.gemini.apiKey) {
        throw new Error('API key do Gemini não configurada');
    }
    
    const {
        temperature = 0.9,
        maxTokens = 2000,
        systemInstruction = ''
    } = options;
    
    const url = `${API_CONFIG.gemini.baseUrl}/models/${API_CONFIG.gemini.model}:generateContent`;
    
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxTokens,
            topP: 0.95,
            topK: 40
        }
    };
    
    if (systemInstruction) {
        payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }
    
    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_CONFIG.gemini.apiKey
        },
        body: JSON.stringify(payload),
        timeout: 30000
    }, 3, 2000);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gemini texto erro ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Gemini não retornou texto válido');
}

/**
 * Gera copy de vendas para uma estampa
 */
async function generateSalesCopy(params) {
    const { nicho, ideia, estilo, idioma = 'pt' } = params;
    
    const prompts = {
        pt: `Você é um especialista em copywriting para e-commerce de camisetas Print on Demand.

Crie uma descrição de produto irresistível para uma camiseta com a seguinte estampa:

NICHO: ${nicho}
IDEIA: ${ideia}
ESTILO: ${estilo}

Gere UM JSON com:
{
  "titulo": "Título chamativo para o produto (máx 60 caracteres)",
  "descricao": "Descrição persuasiva focando em benefícios (150-200 palavras)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "bullet_points": ["benefício 1", "benefício 2", "benefício 3"],
  "cta": "Call-to-action irresistível"
}

Retorne APENAS o JSON, sem markdown, sem explicações.`,
        
        en: `You are an e-commerce copywriting expert for Print on Demand t-shirts.

Create an irresistible product description for a t-shirt with this design:

NICHE: ${nicho}
IDEA: ${ideia}
STYLE: ${estilo}

Generate ONE JSON with:
{
  "titulo": "Catchy product title (max 60 chars)",
  "descricao": "Persuasive description focusing on benefits (150-200 words)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "bullet_points": ["benefit 1", "benefit 2", "benefit 3"],
  "cta": "Irresistible call-to-action"
}

Return ONLY the JSON, no markdown, no explanations.`,
        
        es: `Eres un experto en copywriting para e-commerce de camisetas Print on Demand.

Crea una descripción de producto irresistible para una camiseta con este diseño:

NICHO: ${nicho}
IDEA: ${ideia}
ESTILO: ${estilo}

Genera UN JSON con:
{
  "titulo": "Título llamativo para el producto (máx 60 caracteres)",
  "descricao": "Descripción persuasiva enfocada en beneficios (150-200 palabras)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "bullet_points": ["beneficio 1", "beneficio 2", "beneficio 3"],
  "cta": "Call-to-action irresistible"
}

Devuelve SOLO el JSON, sin markdown, sin explicaciones.`
    };
    
    const prompt = prompts[idioma] || prompts.pt;
    const text = await generateText(prompt, { temperature: 0.9 });
    
    // Limpar e parsear JSON
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    try {
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Erro ao parsear JSON:', text);
        throw new Error('Formato de resposta inválido');
    }
}

/**
 * Gera post para redes sociais
 */
async function generateSocialPost(params) {
    const { nicho, ideia, plataforma = 'instagram', idioma = 'pt' } = params;
    
    const platformText = {
        instagram: { pt: 'Instagram', en: 'Instagram', es: 'Instagram' },
        facebook: { pt: 'Facebook', en: 'Facebook', es: 'Facebook' },
        tiktok: { pt: 'TikTok', en: 'TikTok', es: 'TikTok' }
    };
    
    const prompts = {
        pt: `Crie uma legenda persuasiva para ${platformText[plataforma][idioma]} anunciando esta camiseta:

NICHO: ${nicho}
DESIGN: ${ideia}

Gere UM JSON com:
{
  "legenda": "Texto da legenda com emojis e quebras de linha",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "cta": "Call-to-action"
}

Retorne APENAS o JSON.`,
        
        en: `Create a persuasive caption for ${platformText[plataforma][idioma]} promoting this t-shirt:

NICHE: ${nicho}
DESIGN: ${ideia}

Generate ONE JSON with:
{
  "legenda": "Caption text with emojis and line breaks",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "cta": "Call-to-action"
}

Return ONLY the JSON.`,
        
        es: `Crea una leyenda persuasiva para ${platformText[plataforma][idioma]} promocionando esta camiseta:

NICHO: ${nicho}
DISEÑO: ${ideia}

Genera UN JSON con:
{
  "legenda": "Texto de la leyenda con emojis y saltos de línea",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "cta": "Call-to-action"
}

Devuelve SOLO el JSON.`
    };
    
    const prompt = prompts[idioma] || prompts.pt;
    const text = await generateText(prompt, { temperature: 0.95 });
    
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    try {
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Erro ao parsear JSON:', text);
        throw new Error('Formato de resposta inválido');
    }
}

// ==================== HELPERS ====================

/**
 * Fetch com retry automático
 */
async function fetchWithRetry(url, options, retries = 3, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), options.timeout || 30000);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            return response;
            
        } catch (error) {
            console.warn(`Tentativa ${attempt}/${retries} falhou:`, error.message);
            
            if (attempt === retries) {
                throw error;
            }
            
            // Aguardar antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}

/**
 * Converte base64 para Blob
 */
function base64ToBlob(base64, contentType = 'image/png') {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: contentType });
}

/**
 * Verifica se deve usar Gemini
 */
function shouldUseGemini() {
    return (
        API_CONFIG.gemini.enabled &&
        API_CONFIG.gemini.apiKey &&
        apiState.geminiAvailable &&
        API_CONFIG.usage.geminiCallsToday < API_CONFIG.gemini.dailyLimit
    );
}

/**
 * Incrementa uso do Gemini
 */
function incrementGeminiUsage() {
    API_CONFIG.usage.geminiCallsToday++;
    API_CONFIG.usage.totalImages++;
    saveAPIConfig();
    
    console.log(`📊 Uso Gemini: ${API_CONFIG.usage.geminiCallsToday}/${API_CONFIG.gemini.dailyLimit}`);
    
    // Avisar quando próximo do limite
    if (API_CONFIG.usage.geminiCallsToday >= API_CONFIG.gemini.dailyLimit * 0.9) {
        console.warn('⚠️ Próximo do limite diário do Gemini!');
    }
}

/**
 * Reseta contador diário
 */
function checkDailyReset() {
    const now = new Date();
    const lastReset = API_CONFIG.usage.geminiLastReset 
        ? new Date(API_CONFIG.usage.geminiLastReset)
        : null;
    
    // Resetar se passou de meia-noite UTC
    if (!lastReset || now.getUTCDate() !== lastReset.getUTCDate()) {
        console.log('🔄 Resetando contador diário do Gemini');
        API_CONFIG.usage.geminiCallsToday = 0;
        API_CONFIG.usage.geminiLastReset = now.toISOString();
        apiState.geminiAvailable = true;
        apiState.consecutiveErrors = 0;
        saveAPIConfig();
    }
}

/**
 * Salva configuração no localStorage
 */
function saveAPIConfig() {
    try {
        // Não salvar API keys por segurança (apenas em memória)
        const configToSave = {
            usage: API_CONFIG.usage,
            geminiEnabled: API_CONFIG.gemini.enabled,
            falEnabled: API_CONFIG.fal.enabled
        };
        
        localStorage.setItem('promptforge_api_config', JSON.stringify(configToSave));
    } catch (error) {
        console.warn('Erro ao salvar config:', error);
    }
}

/**
 * Carrega configuração do localStorage
 */
function loadAPIConfig() {
    try {
        const saved = localStorage.getItem('promptforge_api_config');
        if (saved) {
            const config = JSON.parse(saved);
            API_CONFIG.usage = config.usage || API_CONFIG.usage;
            API_CONFIG.gemini.enabled = config.geminiEnabled !== false;
            API_CONFIG.fal.enabled = config.falEnabled || false;
        }
    } catch (error) {
        console.warn('Erro ao carregar config:', error);
    }
}

/**
 * Obtém estatísticas de uso
 */
function getAPIStats() {
    return {
        gemini: {
            available: apiState.geminiAvailable,
            callsToday: API_CONFIG.usage.geminiCallsToday,
            dailyLimit: API_CONFIG.gemini.dailyLimit,
            percentage: (API_CONFIG.usage.geminiCallsToday / API_CONFIG.gemini.dailyLimit * 100).toFixed(1)
        },
        fal: {
            available: apiState.falAvailable,
            enabled: API_CONFIG.fal.enabled
        },
        total: {
            images: API_CONFIG.usage.totalImages,
            cost: API_CONFIG.usage.totalCost.toFixed(4)
        }
    };
}

// ==================== EXPORTAÇÃO ====================
window.promptForgeAPI = {
    // Inicialização
    init: initAPI,
    setAPIKeys: setAPIKeys,
    
    // Geração
    generateImage: generateImage,
    generateText: generateText,
    generateSalesCopy: generateSalesCopy,
    generateSocialPost: generateSocialPost,
    
    // Utilidades
    getStats: getAPIStats,
    checkDailyReset: checkDailyReset,
    
    // Acesso ao estado (read-only)
    get config() { return { ...API_CONFIG }; },
    get state() { return { ...apiState }; }
};

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAPI();
        console.log('✅ api.js v4.0 carregado');
    });
} else {
    initAPI();
    console.log('✅ api.js v4.0 carregado');
}
