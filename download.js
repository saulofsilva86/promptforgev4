// =============================================
// PROMPTFORGE STUDIO v4.0 - SISTEMA DE DOWNLOAD
// Empacotamento em ZIP usando JSZip
// ✅ Janeiro 2026
// =============================================

// ==================== CONFIGURAÇÃO ====================

const DOWNLOAD_CONFIG = {
    // JSZip (carregado via CDN)
    jszipUrl: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    
    // Estrutura do ZIP
    structure: {
        design: 'design/',              // Estampa sem fundo
        mockups: 'mockups/',            // Mockups
        copy: 'copy/',                  // Textos de venda
        social: 'social/',              // Posts sociais
        metadata: 'info.json'           // Metadados
    },
    
    // Formatos suportados
    formats: {
        png: 'image/png',
        jpg: 'image/jpeg',
        svg: 'image/svg+xml',
        txt: 'text/plain',
        json: 'application/json'
    },
    
    // Opções de compressão
    compression: {
        level: 6,                       // 0-9 (0=sem compressão, 9=máxima)
        type: 'blob'
    },
    
    // Estado
    isLibraryLoaded: false,
    isProcessing: false,
    currentProgress: 0
};

// ==================== INICIALIZAÇÃO ====================

/**
 * Carrega a biblioteca JSZip
 * @returns {Promise<boolean>} Sucesso do carregamento
 */
async function loadJSZip() {
    if (DOWNLOAD_CONFIG.isLibraryLoaded) {
        console.log('✅ JSZip já carregado');
        return true;
    }
    
    console.log('📦 Carregando JSZip...');
    
    try {
        await loadScript(DOWNLOAD_CONFIG.jszipUrl);
        
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip não carregou corretamente');
        }
        
        DOWNLOAD_CONFIG.isLibraryLoaded = true;
        console.log('✅ JSZip carregado');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao carregar JSZip:', error);
        return false;
    }
}

/**
 * Helper para carregar scripts
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ==================== CRIAÇÃO DO PACOTE ====================

/**
 * Cria pacote completo para download
 * @param {Object} files - Arquivos a incluir
 * @param {Object} metadata - Metadados do projeto
 * @returns {Promise<Blob>} ZIP file
 */
async function createDownloadPackage(files, metadata = {}) {
    console.log('📦 Criando pacote de download...');
    
    // Garantir que JSZip está carregado
    if (!DOWNLOAD_CONFIG.isLibraryLoaded) {
        const loaded = await loadJSZip();
        if (!loaded) {
            throw new Error('Não foi possível carregar JSZip');
        }
    }
    
    if (DOWNLOAD_CONFIG.isProcessing) {
        throw new Error('Já existe um pacote sendo criado. Aguarde.');
    }
    
    DOWNLOAD_CONFIG.isProcessing = true;
    DOWNLOAD_CONFIG.currentProgress = 0;
    
    try {
        const zip = new JSZip();
        const structure = DOWNLOAD_CONFIG.structure;
        
        // Validar entrada
        if (!files || typeof files !== 'object') {
            throw new Error('Arquivos inválidos');
        }
        
        let totalFiles = 0;
        let processedFiles = 0;
        
        // Contar total de arquivos
        if (files.design) totalFiles++;
        if (files.mockups) totalFiles += Object.keys(files.mockups).length;
        if (files.salesCopy) totalFiles++;
        if (files.socialPosts) totalFiles += files.socialPosts.length;
        totalFiles++; // info.json
        
        // 1. DESIGN (estampa sem fundo)
        if (files.design) {
            console.log('📸 Adicionando design...');
            await addFileToZip(
                zip,
                structure.design + 'design_no_background.png',
                files.design
            );
            processedFiles++;
            updateProgress(processedFiles, totalFiles);
        }
        
        // 2. MOCKUPS
        if (files.mockups && Object.keys(files.mockups).length > 0) {
            console.log('👕 Adicionando mockups...');
            
            for (const [templateId, blob] of Object.entries(files.mockups)) {
                await addFileToZip(
                    zip,
                    structure.mockups + `mockup_${templateId}.png`,
                    blob
                );
                processedFiles++;
                updateProgress(processedFiles, totalFiles);
            }
        }
        
        // 3. COPY DE VENDAS
        if (files.salesCopy) {
            console.log('✍️ Adicionando copy de vendas...');
            
            const copyText = formatSalesCopy(files.salesCopy);
            await addFileToZip(
                zip,
                structure.copy + 'sales_copy.txt',
                copyText,
                { type: 'text' }
            );
            
            // JSON também
            await addFileToZip(
                zip,
                structure.copy + 'sales_copy.json',
                JSON.stringify(files.salesCopy, null, 2),
                { type: 'text' }
            );
            
            processedFiles++;
            updateProgress(processedFiles, totalFiles);
        }
        
        // 4. POSTS SOCIAIS
        if (files.socialPosts && files.socialPosts.length > 0) {
            console.log('📱 Adicionando posts sociais...');
            
            for (let i = 0; i < files.socialPosts.length; i++) {
                const post = files.socialPosts[i];
                const platform = post.platform || 'instagram';
                
                const postText = formatSocialPost(post);
                await addFileToZip(
                    zip,
                    structure.social + `${platform}_post_${i + 1}.txt`,
                    postText,
                    { type: 'text' }
                );
                
                processedFiles++;
                updateProgress(processedFiles, totalFiles);
            }
        }
        
        // 5. METADADOS (info.json)
        console.log('📋 Adicionando metadados...');
        const info = generateMetadata(files, metadata);
        await addFileToZip(
            zip,
            structure.metadata,
            JSON.stringify(info, null, 2),
            { type: 'text' }
        );
        processedFiles++;
        updateProgress(processedFiles, totalFiles);
        
        // 6. README (opcional)
        if (metadata.includeReadme !== false) {
            const readme = generateReadme(metadata);
            await addFileToZip(
                zip,
                'README.txt',
                readme,
                { type: 'text' }
            );
        }
        
        // Gerar ZIP
        console.log('🔄 Comprimindo arquivos...');
        const zipBlob = await zip.generateAsync({
            type: DOWNLOAD_CONFIG.compression.type,
            compression: 'DEFLATE',
            compressionOptions: {
                level: DOWNLOAD_CONFIG.compression.level
            }
        }, (metadata) => {
            // Callback de progresso da compressão
            const percent = metadata.percent.toFixed(0);
            console.log(`Compressão: ${percent}%`);
            
            window.dispatchEvent(new CustomEvent('downloadProgress', {
                detail: { 
                    stage: 'compression',
                    progress: metadata.percent 
                }
            }));
        });
        
        console.log(`✅ Pacote criado: ${(zipBlob.size / 1024 / 1024).toFixed(2)}MB`);
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('packageCreated', {
            detail: { 
                size: zipBlob.size,
                files: totalFiles
            }
        }));
        
        return zipBlob;
        
    } catch (error) {
        console.error('❌ Erro ao criar pacote:', error);
        throw error;
    } finally {
        DOWNLOAD_CONFIG.isProcessing = false;
        DOWNLOAD_CONFIG.currentProgress = 0;
    }
}

/**
 * Adiciona arquivo ao ZIP
 */
async function addFileToZip(zip, path, content, options = {}) {
    if (content instanceof Blob) {
        // Blob direto
        zip.file(path, content, { binary: true });
    } else if (typeof content === 'string') {
        // Texto
        zip.file(path, content);
    } else {
        throw new Error('Tipo de conteúdo não suportado');
    }
}

/**
 * Atualiza progresso
 */
function updateProgress(current, total) {
    const percent = Math.round((current / total) * 100);
    DOWNLOAD_CONFIG.currentProgress = percent;
    
    console.log(`Progresso: ${percent}% (${current}/${total})`);
    
    window.dispatchEvent(new CustomEvent('downloadProgress', {
        detail: { 
            stage: 'packing',
            progress: percent,
            current: current,
            total: total
        }
    }));
}

// ==================== FORMATAÇÃO ====================

/**
 * Formata copy de vendas para texto legível
 */
function formatSalesCopy(salesCopy) {
    let text = '';
    
    text += '═══════════════════════════════════════\n';
    text += '   COPY DE VENDAS - PROMPTFORGE STUDIO\n';
    text += '═══════════════════════════════════════\n\n';
    
    if (salesCopy.titulo) {
        text += 'TÍTULO:\n';
        text += salesCopy.titulo + '\n\n';
    }
    
    if (salesCopy.descricao) {
        text += '───────────────────────────────────────\n';
        text += 'DESCRIÇÃO:\n';
        text += salesCopy.descricao + '\n\n';
    }
    
    if (salesCopy.bullet_points && salesCopy.bullet_points.length > 0) {
        text += '───────────────────────────────────────\n';
        text += 'PONTOS-CHAVE:\n';
        salesCopy.bullet_points.forEach(point => {
            text += '• ' + point + '\n';
        });
        text += '\n';
    }
    
    if (salesCopy.tags && salesCopy.tags.length > 0) {
        text += '───────────────────────────────────────\n';
        text += 'TAGS:\n';
        text += salesCopy.tags.join(', ') + '\n\n';
    }
    
    if (salesCopy.cta) {
        text += '───────────────────────────────────────\n';
        text += 'CALL-TO-ACTION:\n';
        text += salesCopy.cta + '\n\n';
    }
    
    text += '═══════════════════════════════════════\n';
    
    return text;
}

/**
 * Formata post social para texto legível
 */
function formatSocialPost(post) {
    let text = '';
    
    text += '═══════════════════════════════════════\n';
    text += `   POST ${(post.platform || 'INSTAGRAM').toUpperCase()}\n`;
    text += '═══════════════════════════════════════\n\n';
    
    if (post.legenda) {
        text += 'LEGENDA:\n';
        text += post.legenda + '\n\n';
    }
    
    if (post.hashtags && post.hashtags.length > 0) {
        text += '───────────────────────────────────────\n';
        text += 'HASHTAGS:\n';
        text += post.hashtags.join(' ') + '\n\n';
    }
    
    if (post.cta) {
        text += '───────────────────────────────────────\n';
        text += 'CTA:\n';
        text += post.cta + '\n\n';
    }
    
    text += '═══════════════════════════════════════\n';
    
    return text;
}

/**
 * Gera metadados do projeto
 */
function generateMetadata(files, userMetadata) {
    const info = {
        project: 'PromptForge Studio v4.0',
        generated: new Date().toISOString(),
        version: '4.0.0',
        ...userMetadata
    };
    
    // Informações dos arquivos
    info.files = {
        design: !!files.design,
        mockups: files.mockups ? Object.keys(files.mockups).length : 0,
        salesCopy: !!files.salesCopy,
        socialPosts: files.socialPosts ? files.socialPosts.length : 0
    };
    
    // Estatísticas
    info.stats = {
        totalFiles: (files.design ? 1 : 0) +
                   (files.mockups ? Object.keys(files.mockups).length : 0) +
                   (files.salesCopy ? 2 : 0) +
                   (files.socialPosts ? files.socialPosts.length : 0) + 1
    };
    
    return info;
}

/**
 * Gera README.txt
 */
function generateReadme(metadata) {
    const lang = metadata.language || 'pt';
    
    const readmes = {
        pt: `
════════════════════════════════════════════════
   PROMPTFORGE STUDIO v4.0 - PACOTE DE DESIGN
════════════════════════════════════════════════

📦 CONTEÚDO DO PACOTE:

/design/
  └─ design_no_background.png    Estampa pronta (PNG transparente)

/mockups/
  └─ mockup_*.png                 Visualizações em produtos

/copy/
  ├─ sales_copy.txt               Copy de vendas formatada
  └─ sales_copy.json              Copy em formato JSON

/social/
  └─ *_post_*.txt                 Posts para redes sociais

info.json                          Metadados do projeto

────────────────────────────────────────────────

🎨 COMO USAR:

1. DESIGN
   Use o arquivo design_no_background.png para:
   • Upload em plataformas POD (Printful, Printify, etc)
   • Edição adicional
   • Criar mais variações

2. MOCKUPS
   Use os mockups para:
   • Publicar em lojas online
   • Marketing nas redes sociais
   • Apresentação para clientes

3. COPY
   Use a copy de vendas para:
   • Descrição do produto em marketplaces
   • Anúncios
   • Landing pages

4. SOCIAL
   Use os posts para:
   • Instagram, Facebook, TikTok
   • Stories
   • Campanhas promocionais

────────────────────────────────────────────────

📝 INFORMAÇÕES:

Projeto: ${metadata.nicho || 'N/A'}
Estilo: ${metadata.estilo || 'N/A'}
Data: ${new Date().toLocaleDateString('pt-BR')}

────────────────────────────────────────────────

💡 DICAS:

• Teste diferentes cores de produto
• Adapte a copy para seu público
• Use hashtags relevantes para seu nicho
• Sempre verifique as políticas da plataforma POD

════════════════════════════════════════════════
         Criado com PromptForge Studio
         https://promptforgev2.vercel.app
════════════════════════════════════════════════
`,
        en: `
════════════════════════════════════════════════
   PROMPTFORGE STUDIO v4.0 - DESIGN PACKAGE
════════════════════════════════════════════════

📦 PACKAGE CONTENTS:

/design/
  └─ design_no_background.png    Ready design (transparent PNG)

/mockups/
  └─ mockup_*.png                Product visualizations

/copy/
  ├─ sales_copy.txt              Formatted sales copy
  └─ sales_copy.json             Copy in JSON format

/social/
  └─ *_post_*.txt                Social media posts

info.json                         Project metadata

────────────────────────────────────────────────

🎨 HOW TO USE:

1. DESIGN
   Use design_no_background.png for:
   • Upload to POD platforms (Printful, Printify, etc)
   • Further editing
   • Creating more variations

2. MOCKUPS
   Use mockups for:
   • Publishing in online stores
   • Social media marketing
   • Client presentations

3. COPY
   Use sales copy for:
   • Product descriptions in marketplaces
   • Advertisements
   • Landing pages

4. SOCIAL
   Use posts for:
   • Instagram, Facebook, TikTok
   • Stories
   • Promotional campaigns

────────────────────────────────────────────────

📝 INFORMATION:

Project: ${metadata.nicho || 'N/A'}
Style: ${metadata.estilo || 'N/A'}
Date: ${new Date().toLocaleDateString('en-US')}

════════════════════════════════════════════════
         Created with PromptForge Studio
         https://promptforgev2.vercel.app
════════════════════════════════════════════════
`
    };
    
    return readmes[lang] || readmes.pt;
}

// ==================== DOWNLOAD ====================

/**
 * Faz download do pacote
 * @param {Blob} zipBlob - Arquivo ZIP
 * @param {string} filename - Nome do arquivo
 */
function downloadPackage(zipBlob, filename = null) {
    if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `promptforge_package_${timestamp}.zip`;
    }
    
    // Garantir extensão .zip
    if (!filename.endsWith('.zip')) {
        filename += '.zip';
    }
    
    console.log(`💾 Baixando: ${filename}`);
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Download iniciado');
    
    // Disparar evento
    window.dispatchEvent(new CustomEvent('downloadStarted', {
        detail: { filename, size: zipBlob.size }
    }));
}

/**
 * Cria e baixa pacote em uma única chamada
 */
async function createAndDownload(files, metadata = {}) {
    console.log('🚀 Criando e baixando pacote...');
    
    try {
        // Criar pacote
        const zipBlob = await createDownloadPackage(files, metadata);
        
        // Baixar
        const filename = metadata.filename || 
                        `promptforge_${metadata.nicho || 'design'}_${Date.now()}`;
        downloadPackage(zipBlob, filename);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro:', error);
        throw error;
    }
}

// ==================== PREVIEW ====================

/**
 * Gera preview do conteúdo do ZIP
 * @param {Object} files - Arquivos que serão incluídos
 * @returns {Object} Preview estruturado
 */
function generatePreview(files) {
    const preview = {
        structure: [],
        totalSize: 0,
        fileCount: 0
    };
    
    // Design
    if (files.design) {
        preview.structure.push({
            path: 'design/design_no_background.png',
            type: 'image/png',
            size: files.design.size || 0
        });
        preview.totalSize += files.design.size || 0;
        preview.fileCount++;
    }
    
    // Mockups
    if (files.mockups) {
        Object.entries(files.mockups).forEach(([templateId, blob]) => {
            preview.structure.push({
                path: `mockups/mockup_${templateId}.png`,
                type: 'image/png',
                size: blob.size || 0
            });
            preview.totalSize += blob.size || 0;
            preview.fileCount++;
        });
    }
    
    // Copy
    if (files.salesCopy) {
        preview.structure.push(
            { path: 'copy/sales_copy.txt', type: 'text/plain', size: 2048 },
            { path: 'copy/sales_copy.json', type: 'application/json', size: 1024 }
        );
        preview.totalSize += 3072;
        preview.fileCount += 2;
    }
    
    // Social
    if (files.socialPosts) {
        files.socialPosts.forEach((post, i) => {
            const platform = post.platform || 'instagram';
            preview.structure.push({
                path: `social/${platform}_post_${i + 1}.txt`,
                type: 'text/plain',
                size: 1024
            });
            preview.totalSize += 1024;
            preview.fileCount++;
        });
    }
    
    // Metadados
    preview.structure.push({
        path: 'info.json',
        type: 'application/json',
        size: 512
    });
    preview.totalSize += 512;
    preview.fileCount++;
    
    // README
    preview.structure.push({
        path: 'README.txt',
        type: 'text/plain',
        size: 2048
    });
    preview.totalSize += 2048;
    preview.fileCount++;
    
    return preview;
}

/**
 * Cria elemento HTML com preview
 */
function createPreviewUI(files, metadata = {}) {
    const preview = generatePreview(files);
    
    const container = document.createElement('div');
    container.className = 'download-preview';
    container.style.cssText = `
        background: #f5f5f5;
        border-radius: 12px;
        padding: 20px;
        max-width: 600px;
        margin: 20px auto;
    `;
    
    let html = `
        <h3 style="margin: 0 0 15px 0;">📦 Preview do Pacote</h3>
        <div style="margin-bottom: 15px;">
            <strong>${preview.fileCount}</strong> arquivos • 
            <strong>${(preview.totalSize / 1024 / 1024).toFixed(2)}MB</strong> (aproximado)
        </div>
        <div style="background: white; border-radius: 8px; padding: 15px; max-height: 400px; overflow-y: auto;">
    `;
    
    preview.structure.forEach(file => {
        const icon = getFileIcon(file.type);
        const sizeText = formatFileSize(file.size);
        
        html += `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span>${icon} ${file.path}</span>
                <span style="color: #666; font-size: 0.9em;">${sizeText}</span>
            </div>
        `;
    });
    
    html += `
        </div>
        <button 
            onclick="confirmDownload()"
            style="
                width: 100%;
                margin-top: 15px;
                padding: 12px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
            ">
            💾 Baixar Pacote Completo
        </button>
    `;
    
    container.innerHTML = html;
    return container;
}

function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('json')) return '📋';
    if (type.includes('text')) return '📄';
    return '📁';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

// ==================== HELPERS ====================

/**
 * Valida arquivos antes de empacotar
 */
function validateFiles(files) {
    const errors = [];
    
    if (!files || typeof files !== 'object') {
        errors.push('Objeto de arquivos inválido');
        return { valid: false, errors };
    }
    
    // Deve ter pelo menos o design
    if (!files.design) {
        errors.push('Design é obrigatório');
    }
    
    // Validar tipos
    if (files.design && !(files.design instanceof Blob)) {
        errors.push('Design deve ser um Blob');
    }
    
    if (files.mockups) {
        if (typeof files.mockups !== 'object') {
            errors.push('Mockups deve ser um objeto');
        } else {
            Object.values(files.mockups).forEach((mockup, i) => {
                if (!(mockup instanceof Blob)) {
                    errors.push(`Mockup ${i} deve ser um Blob`);
                }
            });
        }
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/**
 * Obtém estatísticas do empacotamento
 */
function getStats() {
    return {
        isProcessing: DOWNLOAD_CONFIG.isProcessing,
        currentProgress: DOWNLOAD_CONFIG.currentProgress,
        isLibraryLoaded: DOWNLOAD_CONFIG.isLibraryLoaded
    };
}

// ==================== EXPORTAÇÃO ====================
window.downloadManager = {
    // Principais
    createPackage: createDownloadPackage,
    download: downloadPackage,
    createAndDownload: createAndDownload,
    
    // Preview
    generatePreview: generatePreview,
    createPreviewUI: createPreviewUI,
    
    // Utilidades
    loadLibrary: loadJSZip,
    validateFiles: validateFiles,
    getStats: getStats,
    
    // Helpers de formatação
    formatSalesCopy: formatSalesCopy,
    formatSocialPost: formatSocialPost,
    
    // Estado (read-only)
    get config() { return { ...DOWNLOAD_CONFIG }; }
};

// Auto-carregar JSZip
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ download.js v4.0 carregado (JSZip será carregado quando necessário)');
    });
} else {
    console.log('✅ download.js v4.0 carregado');
}
