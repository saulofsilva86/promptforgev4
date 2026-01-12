// =============================================
// PROMPTFORGE STUDIO v4.0 - REMOÇÃO DE FUNDO
// Processamento 100% no navegador (zero custo)
// Usa: @imgly/background-removal
// ✅ Janeiro 2026
// =============================================

// ==================== CONFIGURAÇÃO ====================

const BG_REMOVAL_CONFIG = {
    // Biblioteca carregada via CDN
    libraryUrl: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser.js',
    
    // Configurações do modelo
    model: 'medium', // 'small', 'medium', 'large'
    
    // Opções de processamento
    options: {
        publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/',
        debug: false,
        progress: null // Callback para progresso
    },
    
    // Cache de imagens processadas
    cache: new Map(),
    maxCacheSize: 50, // Máximo de imagens em cache
    
    // Estado
    isLibraryLoaded: false,
    isProcessing: false,
    currentProgress: 0
};

// ==================== INICIALIZAÇÃO ====================

/**
 * Carrega a biblioteca de remoção de fundo
 * @returns {Promise<boolean>} Sucesso do carregamento
 */
async function loadBackgroundRemovalLibrary() {
    if (BG_REMOVAL_CONFIG.isLibraryLoaded) {
        console.log('✅ Biblioteca já carregada');
        return true;
    }
    
    console.log('📦 Carregando biblioteca de remoção de fundo...');
    
    try {
        // Carregar script via CDN
        await loadScript(BG_REMOVAL_CONFIG.libraryUrl);
        
        // Verificar se carregou
        if (typeof removeBackground === 'undefined') {
            throw new Error('Biblioteca não carregou corretamente');
        }
        
        BG_REMOVAL_CONFIG.isLibraryLoaded = true;
        console.log('✅ Biblioteca de remoção de fundo carregada');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao carregar biblioteca:', error);
        return false;
    }
}

/**
 * Helper para carregar scripts dinamicamente
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        // Verificar se já existe
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.type = 'module';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ==================== REMOÇÃO DE FUNDO ====================

/**
 * Remove o fundo de uma imagem
 * @param {string|Blob|HTMLImageElement} imageSource - Fonte da imagem
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Blob>} Imagem PNG com transparência
 */
async function removeImageBackground(imageSource, options = {}) {
    console.log('🎨 Removendo fundo da imagem...');
    
    // Garantir que biblioteca está carregada
    if (!BG_REMOVAL_CONFIG.isLibraryLoaded) {
        const loaded = await loadBackgroundRemovalLibrary();
        if (!loaded) {
            throw new Error('Não foi possível carregar a biblioteca');
        }
    }
    
    // Verificar se já está processando
    if (BG_REMOVAL_CONFIG.isProcessing) {
        throw new Error('Já existe uma remoção em andamento. Aguarde.');
    }
    
    BG_REMOVAL_CONFIG.isProcessing = true;
    BG_REMOVAL_CONFIG.currentProgress = 0;
    
    try {
        // Converter source para formato aceito
        const imageInput = await prepareImageInput(imageSource);
        
        // Verificar cache
        const cacheKey = await getImageHash(imageInput);
        if (BG_REMOVAL_CONFIG.cache.has(cacheKey)) {
            console.log('✅ Usando imagem do cache');
            return BG_REMOVAL_CONFIG.cache.get(cacheKey);
        }
        
        // Configurar callback de progresso
        const progressCallback = options.onProgress || ((progress) => {
            BG_REMOVAL_CONFIG.currentProgress = Math.round(progress * 100);
            console.log(`Progresso: ${BG_REMOVAL_CONFIG.currentProgress}%`);
            
            // Disparar evento
            window.dispatchEvent(new CustomEvent('backgroundRemovalProgress', {
                detail: { progress: BG_REMOVAL_CONFIG.currentProgress }
            }));
        });
        
        // Configurar opções
        const config = {
            ...BG_REMOVAL_CONFIG.options,
            model: options.model || BG_REMOVAL_CONFIG.model,
            progress: progressCallback
        };
        
        console.log('🔄 Processando... (pode levar 5-15 segundos)');
        
        // REMOVER FUNDO (executa no browser)
        const blob = await removeBackground(imageInput, config);
        
        // Adicionar ao cache
        addToCache(cacheKey, blob);
        
        console.log('✅ Fundo removido com sucesso!');
        
        // Disparar evento de conclusão
        window.dispatchEvent(new CustomEvent('backgroundRemovalComplete', {
            detail: { blob, size: blob.size }
        }));
        
        return blob;
        
    } catch (error) {
        console.error('❌ Erro ao remover fundo:', error);
        
        // Disparar evento de erro
        window.dispatchEvent(new CustomEvent('backgroundRemovalError', {
            detail: { error: error.message }
        }));
        
        throw new Error(`Falha ao remover fundo: ${error.message}`);
        
    } finally {
        BG_REMOVAL_CONFIG.isProcessing = false;
        BG_REMOVAL_CONFIG.currentProgress = 0;
    }
}

/**
 * Prepara a entrada da imagem
 */
async function prepareImageInput(source) {
    // Se já é string (URL/base64), retornar direto
    if (typeof source === 'string') {
        return source;
    }
    
    // Se é Blob, converter para URL
    if (source instanceof Blob) {
        return URL.createObjectURL(source);
    }
    
    // Se é HTMLImageElement
    if (source instanceof HTMLImageElement) {
        return source.src;
    }
    
    // Se é File
    if (source instanceof File) {
        return URL.createObjectURL(source);
    }
    
    throw new Error('Formato de imagem não suportado');
}

/**
 * Gera hash da imagem para cache
 */
async function getImageHash(imageInput) {
    // Para URLs, usar a própria URL como chave
    if (typeof imageInput === 'string') {
        return imageInput;
    }
    
    // Para outros, gerar hash simples baseado no tamanho
    return `image_${Date.now()}`;
}

/**
 * Adiciona ao cache com limite de tamanho
 */
function addToCache(key, blob) {
    // Se cache cheio, remover mais antigo
    if (BG_REMOVAL_CONFIG.cache.size >= BG_REMOVAL_CONFIG.maxCacheSize) {
        const firstKey = BG_REMOVAL_CONFIG.cache.keys().next().value;
        BG_REMOVAL_CONFIG.cache.delete(firstKey);
        console.log('🗑️ Cache limpo (removido item mais antigo)');
    }
    
    BG_REMOVAL_CONFIG.cache.set(key, blob);
}

/**
 * Limpa o cache
 */
function clearCache() {
    BG_REMOVAL_CONFIG.cache.clear();
    console.log('🗑️ Cache limpo completamente');
}

// ==================== HELPERS ====================

/**
 * Remove fundo e retorna URL para usar direto
 * @param {string|Blob} imageSource - Fonte da imagem
 * @returns {Promise<string>} URL da imagem processada
 */
async function removeBackgroundAndGetURL(imageSource) {
    const blob = await removeImageBackground(imageSource);
    return URL.createObjectURL(blob);
}

/**
 * Remove fundo e retorna base64
 * @param {string|Blob} imageSource - Fonte da imagem
 * @returns {Promise<string>} Base64 da imagem
 */
async function removeBackgroundAndGetBase64(imageSource) {
    const blob = await removeImageBackground(imageSource);
    return blobToBase64(blob);
}

/**
 * Converte Blob para Base64
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Download da imagem processada
 */
async function downloadProcessedImage(imageSource, filename = 'design_no_bg.png') {
    const blob = await removeImageBackground(imageSource);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Download iniciado: ${filename}`);
}

/**
 * Verifica se o processamento está em andamento
 */
function isProcessing() {
    return BG_REMOVAL_CONFIG.isProcessing;
}

/**
 * Obtém o progresso atual (0-100)
 */
function getCurrentProgress() {
    return BG_REMOVAL_CONFIG.currentProgress;
}

/**
 * Obtém estatísticas do cache
 */
function getCacheStats() {
    return {
        size: BG_REMOVAL_CONFIG.cache.size,
        maxSize: BG_REMOVAL_CONFIG.maxCacheSize,
        percentage: (BG_REMOVAL_CONFIG.cache.size / BG_REMOVAL_CONFIG.maxCacheSize * 100).toFixed(1)
    };
}

// ==================== PREVIEW E COMPARAÇÃO ====================

/**
 * Cria comparação lado a lado (antes/depois)
 * @param {string} originalUrl - URL da imagem original
 * @param {string} processedUrl - URL da imagem processada
 * @returns {HTMLElement} Elemento de comparação
 */
function createComparisonView(originalUrl, processedUrl) {
    const container = document.createElement('div');
    container.className = 'bg-removal-comparison';
    container.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        padding: 20px;
    `;
    
    // Original
    const originalDiv = document.createElement('div');
    originalDiv.innerHTML = `
        <h4 style="margin-bottom: 10px;">Original</h4>
        <img src="${originalUrl}" style="width: 100%; border-radius: 12px;">
    `;
    
    // Processada
    const processedDiv = document.createElement('div');
    processedDiv.innerHTML = `
        <h4 style="margin-bottom: 10px;">Sem Fundo</h4>
        <div style="background: 
            repeating-conic-gradient(#ddd 0% 25%, white 0% 50%) 
            50% / 20px 20px;
            border-radius: 12px;
            padding: 10px;">
            <img src="${processedUrl}" style="width: 100%; display: block;">
        </div>
    `;
    
    container.appendChild(originalDiv);
    container.appendChild(processedDiv);
    
    return container;
}

/**
 * Mostra preview com background transparente (grid)
 */
function showTransparencyPreview(imageUrl, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.style.cssText = `
        background: 
            repeating-conic-gradient(#ddd 0% 25%, white 0% 50%) 
            50% / 20px 20px;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = 'max-width: 100%; height: auto;';
    
    container.innerHTML = '';
    container.appendChild(img);
}

// ==================== TRATAMENTO DE ERROS ====================

/**
 * Valida se a imagem é adequada para remoção de fundo
 */
async function validateImage(imageSource) {
    const errors = [];
    
    try {
        // Converter para blob se necessário
        let blob;
        if (typeof imageSource === 'string') {
            const response = await fetch(imageSource);
            blob = await response.blob();
        } else if (imageSource instanceof Blob) {
            blob = imageSource;
        } else {
            errors.push('Formato de imagem não suportado');
            return { valid: false, errors };
        }
        
        // Verificar tipo
        if (!blob.type.startsWith('image/')) {
            errors.push('Arquivo não é uma imagem');
        }
        
        // Verificar tamanho (max 10MB recomendado)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (blob.size > maxSize) {
            errors.push(`Imagem muito grande (${(blob.size / 1024 / 1024).toFixed(1)}MB). Máximo recomendado: 10MB`);
        }
        
        // Verificar dimensões
        const img = await blobToImage(blob);
        if (img.width > 4096 || img.height > 4096) {
            errors.push(`Dimensões muito grandes (${img.width}x${img.height}). Máximo recomendado: 4096x4096`);
        }
        
        if (img.width < 100 || img.height < 100) {
            errors.push(`Imagem muito pequena (${img.width}x${img.height}). Mínimo: 100x100`);
        }
        
    } catch (error) {
        errors.push(`Erro ao validar: ${error.message}`);
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/**
 * Converte blob para elemento de imagem
 */
function blobToImage(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

// ==================== EXPORTAÇÃO ====================
window.backgroundRemoval = {
    // Principais
    removeBackground: removeImageBackground,
    removeBackgroundAndGetURL: removeBackgroundAndGetURL,
    removeBackgroundAndGetBase64: removeBackgroundAndGetBase64,
    
    // Utilidades
    loadLibrary: loadBackgroundRemovalLibrary,
    validateImage: validateImage,
    isProcessing: isProcessing,
    getCurrentProgress: getCurrentProgress,
    
    // Cache
    clearCache: clearCache,
    getCacheStats: getCacheStats,
    
    // UI Helpers
    createComparisonView: createComparisonView,
    showTransparencyPreview: showTransparencyPreview,
    
    // Download
    download: downloadProcessedImage,
    
    // Estado (read-only)
    get config() { return { ...BG_REMOVAL_CONFIG }; }
};

// Auto-carregar biblioteca
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Carregar apenas quando necessário (lazy load)
        console.log('✅ background.js v4.0 carregado (biblioteca será carregada quando necessário)');
    });
} else {
    console.log('✅ background.js v4.0 carregado');
}
