// =============================================
// PROMPTFORGE STUDIO v4.0 - GERAÇÃO DE MOCKUPS
// Composição usando Canvas API (zero custo)
// ✅ Janeiro 2026
// =============================================

// ==================== CONFIGURAÇÃO ====================

const MOCKUP_CONFIG = {
    // Templates disponíveis
    templates: {
        tshirt_black: {
            id: 'tshirt_black',
            name: { pt: 'Camiseta Preta', en: 'Black T-Shirt', es: 'Camiseta Negra' },
            templateUrl: 'templates/tshirt_black.png', // Template com transparência
            printArea: { x: 0.35, y: 0.25, width: 0.30, height: 0.40 }, // Proporções relativas
            color: '#000000',
            category: 'tshirt'
        },
        tshirt_white: {
            id: 'tshirt_white',
            name: { pt: 'Camiseta Branca', en: 'White T-Shirt', es: 'Camiseta Blanca' },
            templateUrl: 'templates/tshirt_white.png',
            printArea: { x: 0.35, y: 0.25, width: 0.30, height: 0.40 },
            color: '#FFFFFF',
            category: 'tshirt'
        },
        hoodie_gray: {
            id: 'hoodie_gray',
            name: { pt: 'Moletom Cinza', en: 'Gray Hoodie', es: 'Sudadera Gris' },
            templateUrl: 'templates/hoodie_gray.png',
            printArea: { x: 0.38, y: 0.30, width: 0.24, height: 0.35 },
            color: '#808080',
            category: 'hoodie'
        }
    },
    
    // Configurações de renderização
    rendering: {
        quality: 0.95,           // Qualidade JPEG (0-1)
        format: 'image/png',     // Formato de saída
        maxWidth: 2048,          // Largura máxima
        maxHeight: 2048,         // Altura máxima
        smoothing: true          // Suavização
    },
    
    // Cache de templates carregados
    templateCache: new Map(),
    
    // Estado
    isProcessing: false,
    loadedTemplates: 0,
    totalTemplates: 3
};

// ==================== CARREGAMENTO DE TEMPLATES ====================

/**
 * Carrega um template de mockup
 * @param {string} templateId - ID do template
 * @returns {Promise<HTMLImageElement>} Imagem do template
 */
async function loadTemplate(templateId) {
    const template = MOCKUP_CONFIG.templates[templateId];
    if (!template) {
        throw new Error(`Template não encontrado: ${templateId}`);
    }
    
    // Verificar cache
    if (MOCKUP_CONFIG.templateCache.has(templateId)) {
        console.log(`✅ Template em cache: ${templateId}`);
        return MOCKUP_CONFIG.templateCache.get(templateId);
    }
    
    console.log(`📥 Carregando template: ${templateId}`);
    
    try {
        const img = await loadImage(template.templateUrl);
        
        // Adicionar ao cache
        MOCKUP_CONFIG.templateCache.set(templateId, img);
        MOCKUP_CONFIG.loadedTemplates++;
        
        console.log(`✅ Template carregado: ${templateId}`);
        
        return img;
        
    } catch (error) {
        console.error(`❌ Erro ao carregar template ${templateId}:`, error);
        throw new Error(`Falha ao carregar template: ${templateId}`);
    }
}

/**
 * Carrega todos os templates
 */
async function loadAllTemplates() {
    console.log('📦 Carregando todos os templates...');
    
    const templateIds = Object.keys(MOCKUP_CONFIG.templates);
    const promises = templateIds.map(id => loadTemplate(id));
    
    try {
        await Promise.all(promises);
        console.log(`✅ ${MOCKUP_CONFIG.loadedTemplates} templates carregados`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao carregar templates:', error);
        return false;
    }
}

/**
 * Helper para carregar imagem
 */
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Permitir CORS
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Falha ao carregar: ${url}`));
        img.src = url;
    });
}

// ==================== GERAÇÃO DE MOCKUPS ====================

/**
 * Gera um mockup com a estampa aplicada
 * @param {string|Blob|HTMLImageElement} designSource - Estampa
 * @param {string} templateId - ID do template
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Blob>} Imagem do mockup
 */
async function generateMockup(designSource, templateId, options = {}) {
    console.log(`🎨 Gerando mockup: ${templateId}`);
    
    if (MOCKUP_CONFIG.isProcessing) {
        throw new Error('Já existe um mockup sendo gerado. Aguarde.');
    }
    
    MOCKUP_CONFIG.isProcessing = true;
    
    try {
        // 1. Carregar template
        const templateImg = await loadTemplate(templateId);
        const template = MOCKUP_CONFIG.templates[templateId];
        
        // 2. Carregar design
        const designImg = await prepareDesignImage(designSource);
        
        // 3. Criar canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 4. Configurar tamanho do canvas (igual ao template)
        canvas.width = templateImg.width;
        canvas.height = templateImg.height;
        
        // 5. Configurar qualidade
        ctx.imageSmoothingEnabled = MOCKUP_CONFIG.rendering.smoothing;
        ctx.imageSmoothingQuality = 'high';
        
        // 6. Calcular área de impressão (proporções relativas)
        const printArea = {
            x: canvas.width * template.printArea.x,
            y: canvas.height * template.printArea.y,
            width: canvas.width * template.printArea.width,
            height: canvas.height * template.printArea.height
        };
        
        // 7. Calcular dimensões do design (manter proporção)
        const designDimensions = calculateDesignDimensions(
            designImg.width,
            designImg.height,
            printArea.width,
            printArea.height,
            options.fitMode || 'contain'
        );
        
        // 8. Centralizar design na área de impressão
        const designX = printArea.x + (printArea.width - designDimensions.width) / 2;
        const designY = printArea.y + (printArea.height - designDimensions.height) / 2;
        
        // 9. Desenhar design
        ctx.drawImage(
            designImg,
            designX,
            designY,
            designDimensions.width,
            designDimensions.height
        );
        
        // 10. Aplicar sombra/efeitos (opcional)
        if (options.addShadow) {
            addDesignShadow(ctx, designX, designY, designDimensions);
        }
        
        // 11. Desenhar template por cima (overlay)
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
        
        // 12. Converter para blob
        const blob = await canvasToBlob(canvas, {
            type: MOCKUP_CONFIG.rendering.format,
            quality: MOCKUP_CONFIG.rendering.quality
        });
        
        console.log(`✅ Mockup gerado: ${templateId} (${(blob.size / 1024).toFixed(1)}KB)`);
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('mockupGenerated', {
            detail: { templateId, size: blob.size }
        }));
        
        return blob;
        
    } catch (error) {
        console.error(`❌ Erro ao gerar mockup ${templateId}:`, error);
        throw error;
    } finally {
        MOCKUP_CONFIG.isProcessing = false;
    }
}

/**
 * Gera múltiplos mockups de uma vez
 * @param {string|Blob} designSource - Estampa
 * @param {string[]} templateIds - Array de IDs de templates
 * @returns {Promise<Object>} Objeto com mockups { templateId: blob }
 */
async function generateMultipleMockups(designSource, templateIds = null) {
    console.log('🎨 Gerando múltiplos mockups...');
    
    // Se não especificou, usar todos os templates padrão
    if (!templateIds) {
        templateIds = ['tshirt_black', 'tshirt_white', 'hoodie_gray'];
    }
    
    const mockups = {};
    const errors = [];
    
    for (const templateId of templateIds) {
        try {
            const blob = await generateMockup(designSource, templateId);
            mockups[templateId] = blob;
        } catch (error) {
            console.error(`❌ Erro no mockup ${templateId}:`, error);
            errors.push({ templateId, error: error.message });
        }
    }
    
    console.log(`✅ ${Object.keys(mockups).length}/${templateIds.length} mockups gerados`);
    
    if (errors.length > 0) {
        console.warn('⚠️ Alguns mockups falharam:', errors);
    }
    
    return { mockups, errors };
}

// ==================== HELPERS ====================

/**
 * Prepara a imagem do design
 */
async function prepareDesignImage(source) {
    if (source instanceof HTMLImageElement) {
        return source;
    }
    
    if (source instanceof Blob) {
        return loadImage(URL.createObjectURL(source));
    }
    
    if (typeof source === 'string') {
        return loadImage(source);
    }
    
    throw new Error('Formato de design não suportado');
}

/**
 * Calcula dimensões do design mantendo proporção
 */
function calculateDesignDimensions(designWidth, designHeight, maxWidth, maxHeight, fitMode = 'contain') {
    const designRatio = designWidth / designHeight;
    const areaRatio = maxWidth / maxHeight;
    
    let width, height;
    
    if (fitMode === 'contain') {
        // Caber dentro mantendo proporção
        if (designRatio > areaRatio) {
            // Design mais largo
            width = maxWidth;
            height = maxWidth / designRatio;
        } else {
            // Design mais alto
            height = maxHeight;
            width = maxHeight * designRatio;
        }
    } else if (fitMode === 'cover') {
        // Preencher área cortando se necessário
        if (designRatio > areaRatio) {
            height = maxHeight;
            width = maxHeight * designRatio;
        } else {
            width = maxWidth;
            height = maxWidth / designRatio;
        }
    } else if (fitMode === 'fill') {
        // Esticar para preencher (pode distorcer)
        width = maxWidth;
        height = maxHeight;
    }
    
    return { width, height };
}

/**
 * Adiciona sombra ao design (efeito realista)
 */
function addDesignShadow(ctx, x, y, dimensions) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Desenhar retângulo invisível para criar sombra
    ctx.fillStyle = 'transparent';
    ctx.fillRect(x, y, dimensions.width, dimensions.height);
    
    ctx.restore();
}

/**
 * Converte canvas para blob
 */
function canvasToBlob(canvas, options = {}) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Falha ao converter canvas para blob'));
                }
            },
            options.type || 'image/png',
            options.quality || 0.95
        );
    });
}

/**
 * Converte mockup para URL
 */
async function generateMockupURL(designSource, templateId, options = {}) {
    const blob = await generateMockup(designSource, templateId, options);
    return URL.createObjectURL(blob);
}

/**
 * Converte mockup para base64
 */
async function generateMockupBase64(designSource, templateId, options = {}) {
    const blob = await generateMockup(designSource, templateId, options);
    return blobToBase64(blob);
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// ==================== PREVIEW E GRID ====================

/**
 * Cria grid de mockups para visualização
 * @param {Object} mockups - Objeto com { templateId: blob }
 * @returns {HTMLElement} Elemento com grid
 */
function createMockupGrid(mockups) {
    const container = document.createElement('div');
    container.className = 'mockup-grid';
    container.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
    `;
    
    for (const [templateId, blob] of Object.entries(mockups)) {
        const template = MOCKUP_CONFIG.templates[templateId];
        const url = URL.createObjectURL(blob);
        
        const card = document.createElement('div');
        card.className = 'mockup-card';
        card.style.cssText = `
            background: #f5f5f5;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        
        card.innerHTML = `
            <div style="padding: 20px;">
                <img src="${url}" style="width: 100%; border-radius: 8px;">
            </div>
            <div style="padding: 0 20px 20px;">
                <h4 style="margin: 0 0 10px 0;">${template.name.pt}</h4>
                <button 
                    onclick="downloadBlob(mockups['${templateId}'], 'mockup_${templateId}.png')"
                    style="width: 100%; padding: 10px; background: #333; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    📥 Download
                </button>
            </div>
        `;
        
        container.appendChild(card);
    }
    
    return container;
}

/**
 * Download de mockup
 */
function downloadMockup(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==================== TEMPLATE PERSONALIZADO ====================

/**
 * Registra um novo template personalizado
 * @param {Object} templateConfig - Configuração do template
 */
function registerCustomTemplate(templateConfig) {
    const { id, name, templateUrl, printArea, color, category } = templateConfig;
    
    if (!id || !name || !templateUrl || !printArea) {
        throw new Error('Template inválido: faltam campos obrigatórios');
    }
    
    MOCKUP_CONFIG.templates[id] = {
        id,
        name: typeof name === 'string' ? { pt: name, en: name, es: name } : name,
        templateUrl,
        printArea,
        color: color || '#FFFFFF',
        category: category || 'custom'
    };
    
    MOCKUP_CONFIG.totalTemplates++;
    
    console.log(`✅ Template personalizado registrado: ${id}`);
}

/**
 * Lista todos os templates disponíveis
 */
function listTemplates() {
    return Object.values(MOCKUP_CONFIG.templates).map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        color: t.color
    }));
}

/**
 * Obtém template por categoria
 */
function getTemplatesByCategory(category) {
    return Object.values(MOCKUP_CONFIG.templates)
        .filter(t => t.category === category);
}

// ==================== BATCH PROCESSING ====================

/**
 * Processa múltiplos designs em múltiplos templates
 * @param {Array} designs - Array de designs
 * @param {Array} templateIds - Array de template IDs
 * @returns {Promise<Array>} Array de resultados
 */
async function batchProcess(designs, templateIds = null) {
    console.log(`🔄 Processamento em lote: ${designs.length} designs`);
    
    if (!templateIds) {
        templateIds = ['tshirt_black', 'tshirt_white', 'hoodie_gray'];
    }
    
    const results = [];
    let processed = 0;
    const total = designs.length * templateIds.length;
    
    for (const design of designs) {
        const designMockups = {};
        
        for (const templateId of templateIds) {
            try {
                const blob = await generateMockup(design, templateId);
                designMockups[templateId] = blob;
                processed++;
                
                // Disparar evento de progresso
                window.dispatchEvent(new CustomEvent('batchProgress', {
                    detail: { processed, total, percentage: (processed / total * 100).toFixed(1) }
                }));
                
            } catch (error) {
                console.error(`❌ Erro no batch [${templateId}]:`, error);
            }
        }
        
        results.push(designMockups);
    }
    
    console.log(`✅ Batch completo: ${processed}/${total} mockups gerados`);
    
    return results;
}

// ==================== EXPORTAÇÃO ====================
window.mockupGenerator = {
    // Geração
    generate: generateMockup,
    generateMultiple: generateMultipleMockups,
    generateURL: generateMockupURL,
    generateBase64: generateMockupBase64,
    
    // Batch
    batchProcess: batchProcess,
    
    // Templates
    loadTemplate: loadTemplate,
    loadAllTemplates: loadAllTemplates,
    listTemplates: listTemplates,
    getTemplatesByCategory: getTemplatesByCategory,
    registerCustomTemplate: registerCustomTemplate,
    
    // UI
    createGrid: createMockupGrid,
    download: downloadMockup,
    
    // Utilidades
    isProcessing: () => MOCKUP_CONFIG.isProcessing,
    
    // Estado (read-only)
    get config() { return { ...MOCKUP_CONFIG }; },
    get templates() { return { ...MOCKUP_CONFIG.templates }; }
};

// Helper global para download
window.downloadBlob = downloadMockup;

console.log('✅ mockup.js v4.0 carregado');
