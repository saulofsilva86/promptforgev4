// =============================================
// PROMPTFORGE STUDIO v4.0 - ORQUESTRAÇÃO
// Integração completa de todas as partes
// ✅ Janeiro 2026
// =============================================

// ==================== ESTADO GLOBAL ====================

const StudioState = {
    // Projeto atual
    project: {
        id: null,
        name: null,
        created: null,
        modified: null
    },
    
    // Seleções do usuário
    selections: {
        nicho: null,
        categoria: null,
        estilo: null,
        paleta: null,
        ideia: null
    },
    
    // Resultados gerados
    results: {
        prompt: null,
        image: null,
        imageNoBg: null,
        mockups: null,
        salesCopy: null,
        socialPosts: null
    },
    
    // Etapas do workflow
    workflow: {
        currentStep: 0,
        steps: [
            'select',      // Seleção de nicho/estilo
            'generate',    // Geração de imagem
            'process',     // Remoção de fundo
            'mockups',     // Criação de mockups
            'content',     // Copy e posts sociais
            'download'     // Empacotamento
        ],
        completed: []
    },
    
    // Estado de processamento
    processing: {
        isActive: false,
        currentTask: null,
        progress: 0,
        error: null
    },
    
    // Configurações
    settings: {
        autoSave: true,
        language: 'pt',
        removeBackground: true,
        generateMockups: true,
        generateCopy: true,
        generateSocial: true
    },
    
    // Histórico (undo/redo)
    history: {
        past: [],
        present: null,
        future: []
    }
};

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa o PromptForge Studio
 */
async function initializeStudio() {
    console.log('🎨 Inicializando PromptForge Studio v4.0...');
    
    try {
        // 1. Verificar autenticação
        console.log('🔐 Verificando autenticação...');
        if (!window.auth || !window.auth.verificarAutenticacao()) {
            throw new Error('Usuário não autenticado');
        }
        
        // 2. Inicializar i18n
        console.log('🌍 Inicializando idiomas...');
        if (window.i18n) {
            const savedLang = localStorage.getItem('promptforge_language') || 'pt';
            StudioState.settings.language = savedLang;
        }
        
        // 3. Inicializar créditos
        console.log('💳 Inicializando créditos...');
        if (window.promptForgeCredits) {
            await window.promptForgeCredits.init();
        }
        
        // 4. Inicializar APIs
        console.log('🤖 Inicializando APIs...');
        if (window.promptForgeAPI) {
            // Carregar API keys salvas (se houver)
            loadAPIKeys();
        }
        
        // 5. Carregar projeto salvo (se houver)
        console.log('📂 Verificando projetos salvos...');
        loadSavedProject();
        
        // 6. Configurar eventos
        console.log('🔔 Configurando eventos...');
        setupEventListeners();
        
        // 7. Inicializar UI
        console.log('🎨 Inicializando interface...');
        updateUI();
        
        console.log('✅ PromptForge Studio inicializado com sucesso!');
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('studioReady'));
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao inicializar Studio:', error);
        showError('Erro ao inicializar: ' + error.message);
        return false;
    }
}

// ==================== WORKFLOW PRINCIPAL ====================

/**
 * Executa o workflow completo
 */
async function executeFullWorkflow(options = {}) {
    console.log('🚀 Iniciando workflow completo...');
    
    // Validar seleções
    if (!validateSelections()) {
        throw new Error('Seleções incompletas. Configure nicho, estilo e ideia.');
    }
    
    // Verificar créditos
    const totalCost = calculateWorkflowCost(options);
    if (!window.promptForgeCredits.hasEnoughCredits(totalCost)) {
        throw new Error(`Créditos insuficientes. Necessário: ${totalCost}`);
    }
    
    StudioState.processing.isActive = true;
    
    try {
        // ETAPA 1: GERAR IMAGEM
        await executeStep('generate', async () => {
            console.log('📸 ETAPA 1: Gerando imagem...');
            updateProgress('Gerando design com IA...', 10);
            
            const prompt = buildPrompt();
            StudioState.results.prompt = prompt;
            
            const imageResult = await window.promptForgeAPI.generateImage(prompt);
            StudioState.results.image = imageResult;
            
            updateProgress('Design gerado!', 25);
        });
        
        // ETAPA 2: REMOVER FUNDO (se habilitado)
        if (options.removeBackground !== false && StudioState.settings.removeBackground) {
            await executeStep('process', async () => {
                console.log('🎨 ETAPA 2: Removendo fundo...');
                updateProgress('Removendo fundo...', 30);
                
                const noBgBlob = await window.backgroundRemoval.removeBackground(
                    StudioState.results.image.url,
                    {
                        model: 'medium',
                        onProgress: (p) => updateProgress('Removendo fundo...', 30 + (p * 15))
                    }
                );
                
                StudioState.results.imageNoBg = noBgBlob;
                updateProgress('Fundo removido!', 45);
            });
        } else {
            // Usar imagem original
            StudioState.results.imageNoBg = StudioState.results.image.blob || 
                                             await fetchAsBlob(StudioState.results.image.url);
        }
        
        // ETAPA 3: GERAR MOCKUPS (se habilitado)
        if (options.generateMockups !== false && StudioState.settings.generateMockups) {
            await executeStep('mockups', async () => {
                console.log('👕 ETAPA 3: Gerando mockups...');
                updateProgress('Criando mockups em produtos...', 50);
                
                const templateIds = options.templates || ['tshirt_black', 'tshirt_white', 'hoodie_gray'];
                
                const { mockups, errors } = await window.mockupGenerator.generateMultiple(
                    StudioState.results.imageNoBg,
                    templateIds
                );
                
                StudioState.results.mockups = mockups;
                
                if (errors.length > 0) {
                    console.warn('⚠️ Alguns mockups falharam:', errors);
                }
                
                updateProgress('Mockups criados!', 65);
            });
        }
        
        // ETAPA 4: GERAR CONTEÚDO (copy + social)
        if (options.generateContent !== false && 
            (StudioState.settings.generateCopy || StudioState.settings.generateSocial)) {
            
            await executeStep('content', async () => {
                console.log('✍️ ETAPA 4: Gerando conteúdo...');
                
                // Copy de vendas
                if (StudioState.settings.generateCopy) {
                    updateProgress('Gerando copy de vendas...', 70);
                    
                    const salesCopy = await window.promptForgeAPI.generateSalesCopy({
                        nicho: getNichoName(),
                        ideia: StudioState.selections.ideia,
                        estilo: getEstiloName(),
                        idioma: StudioState.settings.language
                    });
                    
                    StudioState.results.salesCopy = salesCopy;
                }
                
                // Posts sociais
                if (StudioState.settings.generateSocial) {
                    updateProgress('Gerando posts sociais...', 80);
                    
                    const platforms = options.socialPlatforms || ['instagram'];
                    const socialPosts = [];
                    
                    for (const platform of platforms) {
                        const post = await window.promptForgeAPI.generateSocialPost({
                            nicho: getNichoName(),
                            ideia: StudioState.selections.ideia,
                            plataforma: platform,
                            idioma: StudioState.settings.language
                        });
                        
                        post.platform = platform;
                        socialPosts.push(post);
                    }
                    
                    StudioState.results.socialPosts = socialPosts;
                }
                
                updateProgress('Conteúdo gerado!', 90);
            });
        }
        
        // ETAPA 5: PREPARAR DOWNLOAD
        await executeStep('download', async () => {
            console.log('📦 ETAPA 5: Preparando download...');
            updateProgress('Preparando pacote...', 95);
            
            // Pacote já preparado, apenas marcar como completo
            updateProgress('Pronto para download!', 100);
        });
        
        // DEDUZIR CRÉDITOS
        if (window.promptForgeCredits) {
            await window.promptForgeCredits.deductCredits(
                totalCost,
                'workflow_completo'
            );
        }
        
        // AUTO-SAVE
        if (StudioState.settings.autoSave) {
            saveProject();
        }
        
        console.log('✅ Workflow completo executado com sucesso!');
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('workflowComplete', {
            detail: { results: StudioState.results }
        }));
        
        return StudioState.results;
        
    } catch (error) {
        console.error('❌ Erro no workflow:', error);
        StudioState.processing.error = error.message;
        
        // Disparar evento de erro
        window.dispatchEvent(new CustomEvent('workflowError', {
            detail: { error: error.message }
        }));
        
        throw error;
        
    } finally {
        StudioState.processing.isActive = false;
        StudioState.processing.currentTask = null;
        updateUI();
    }
}

/**
 * Executa uma etapa individual
 */
async function executeStep(stepName, stepFunction) {
    console.log(`▶️ Executando etapa: ${stepName}`);
    
    StudioState.processing.currentTask = stepName;
    
    try {
        await stepFunction();
        
        // Marcar como completa
        if (!StudioState.workflow.completed.includes(stepName)) {
            StudioState.workflow.completed.push(stepName);
        }
        
        // Avançar step
        const stepIndex = StudioState.workflow.steps.indexOf(stepName);
        if (stepIndex >= 0) {
            StudioState.workflow.currentStep = Math.max(
                StudioState.workflow.currentStep,
                stepIndex + 1
            );
        }
        
        // Salvar checkpoint
        saveCheckpoint();
        
        console.log(`✅ Etapa ${stepName} completa`);
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('stepComplete', {
            detail: { step: stepName }
        }));
        
    } catch (error) {
        console.error(`❌ Erro na etapa ${stepName}:`, error);
        throw error;
    }
}

// ==================== CONSTRUÇÃO DE PROMPT ====================

/**
 * Constrói o prompt completo para geração
 */
function buildPrompt() {
    const nicho = window.NICHOS?.find(n => n.id === StudioState.selections.nicho);
    const estilo = window.ESTILOS?.find(e => e.id === StudioState.selections.estilo);
    const paleta = window.PALETAS?.find(p => p.id === StudioState.selections.paleta);
    
    let prompt = '';
    
    // 1. Ideia principal
    prompt += StudioState.selections.ideia;
    
    // 2. Estilo
    if (estilo) {
        prompt += ', ' + estilo.promptBase;
    }
    
    // 3. Keywords do nicho
    if (nicho && nicho.keywords) {
        prompt += ', ' + nicho.keywords;
    }
    
    // 4. Paleta de cores
    if (paleta && paleta.keywords && paleta.id !== 'auto') {
        prompt += ', ' + paleta.keywords;
    }
    
    // 5. Sufixos técnicos
    const lang = StudioState.settings.language;
    if (window.PROMPT_SUFFIXES) {
        prompt += ', ' + window.PROMPT_SUFFIXES.common[lang];
        prompt += ', ' + window.PROMPT_SUFFIXES.no_mockup[lang];
    }
    
    console.log('🎨 Prompt construído:', prompt);
    
    return prompt;
}

// ==================== HELPERS ====================

/**
 * Valida seleções do usuário
 */
function validateSelections() {
    const required = ['nicho', 'estilo', 'ideia'];
    
    for (const field of required) {
        if (!StudioState.selections[field]) {
            console.warn(`❌ Campo obrigatório ausente: ${field}`);
            return false;
        }
    }
    
    return true;
}

/**
 * Calcula custo total do workflow
 */
function calculateWorkflowCost(options = {}) {
    let cost = 1; // Design base
    
    if (options.removeBackground !== false && StudioState.settings.removeBackground) {
        cost += 1;
    }
    
    // Mockups são gratuitos
    
    if (options.generateContent !== false && StudioState.settings.generateSocial) {
        cost += 1;
    }
    
    return cost;
}

/**
 * Obtém nome do nicho atual
 */
function getNichoName() {
    const nicho = window.NICHOS?.find(n => n.id === StudioState.selections.nicho);
    if (!nicho) return 'Unknown';
    
    const lang = StudioState.settings.language;
    return window.getLocalizedName ? window.getLocalizedName(nicho, lang) : nicho.name;
}

/**
 * Obtém nome do estilo atual
 */
function getEstiloName() {
    const estilo = window.ESTILOS?.find(e => e.id === StudioState.selections.estilo);
    if (!estilo) return 'Unknown';
    
    const lang = StudioState.settings.language;
    return window.getLocalizedName ? window.getLocalizedName(estilo, lang) : estilo.name;
}

/**
 * Atualiza progresso
 */
function updateProgress(task, percent) {
    StudioState.processing.currentTask = task;
    StudioState.processing.progress = percent;
    
    console.log(`⏳ ${task} - ${percent}%`);
    
    // Disparar evento
    window.dispatchEvent(new CustomEvent('progressUpdate', {
        detail: { task, percent }
    }));
}

/**
 * Atualiza UI
 */
function updateUI() {
    // Disparar evento para UI atualizar
    window.dispatchEvent(new CustomEvent('stateChanged', {
        detail: { state: StudioState }
    }));
}

// ==================== AÇÕES INDIVIDUAIS ====================

/**
 * Define seleção do usuário
 */
function setSelection(field, value) {
    if (!(field in StudioState.selections)) {
        console.warn(`Campo inválido: ${field}`);
        return false;
    }
    
    console.log(`📝 Seleção: ${field} = ${value}`);
    
    StudioState.selections[field] = value;
    
    // Auto-save se habilitado
    if (StudioState.settings.autoSave) {
        saveProject();
    }
    
    updateUI();
    return true;
}

/**
 * Define múltiplas seleções
 */
function setSelections(selections) {
    Object.entries(selections).forEach(([field, value]) => {
        setSelection(field, value);
    });
}

/**
 * Limpa seleções
 */
function clearSelections() {
    Object.keys(StudioState.selections).forEach(key => {
        StudioState.selections[key] = null;
    });
    updateUI();
}

/**
 * Gera apenas a imagem (etapa individual)
 */
async function generateImageOnly() {
    if (!validateSelections()) {
        throw new Error('Seleções incompletas');
    }
    
    await executeStep('generate', async () => {
        const prompt = buildPrompt();
        const result = await window.promptForgeAPI.generateImage(prompt);
        StudioState.results.image = result;
    });
    
    return StudioState.results.image;
}

/**
 * Remove fundo da imagem atual
 */
async function removeBackgroundFromCurrent() {
    if (!StudioState.results.image) {
        throw new Error('Nenhuma imagem disponível');
    }
    
    await executeStep('process', async () => {
        const blob = await window.backgroundRemoval.removeBackground(
            StudioState.results.image.url
        );
        StudioState.results.imageNoBg = blob;
    });
    
    return StudioState.results.imageNoBg;
}

/**
 * Gera mockups da imagem atual
 */
async function generateMockupsFromCurrent(templateIds = null) {
    const imageToUse = StudioState.results.imageNoBg || StudioState.results.image;
    
    if (!imageToUse) {
        throw new Error('Nenhuma imagem disponível');
    }
    
    await executeStep('mockups', async () => {
        const { mockups } = await window.mockupGenerator.generateMultiple(
            imageToUse,
            templateIds
        );
        StudioState.results.mockups = mockups;
    });
    
    return StudioState.results.mockups;
}

/**
 * Download do pacote completo
 */
async function downloadCurrentPackage() {
    if (!StudioState.results.imageNoBg && !StudioState.results.image) {
        throw new Error('Nenhum resultado disponível para download');
    }
    
    const files = {
        design: StudioState.results.imageNoBg || StudioState.results.image.blob,
        mockups: StudioState.results.mockups,
        salesCopy: StudioState.results.salesCopy,
        socialPosts: StudioState.results.socialPosts
    };
    
    const metadata = {
        nicho: getNichoName(),
        estilo: getEstiloName(),
        language: StudioState.settings.language,
        filename: generateFilename()
    };
    
    await window.downloadManager.createAndDownload(files, metadata);
    
    console.log('✅ Download iniciado');
}

/**
 * Gera nome de arquivo
 */
function generateFilename() {
    const nicho = StudioState.selections.nicho || 'design';
    const timestamp = new Date().toISOString().split('T')[0];
    return `promptforge_${nicho}_${timestamp}`;
}

// ==================== PERSISTÊNCIA ====================

/**
 * Salva projeto atual
 */
function saveProject() {
    try {
        const projectData = {
            id: StudioState.project.id || generateProjectId(),
            name: StudioState.project.name,
            modified: new Date().toISOString(),
            selections: StudioState.selections,
            workflow: StudioState.workflow,
            settings: StudioState.settings
        };
        
        localStorage.setItem('promptforge_current_project', JSON.stringify(projectData));
        
        // Adicionar ao histórico
        addToProjectHistory(projectData);
        
        console.log('💾 Projeto salvo:', projectData.id);
        
    } catch (error) {
        console.warn('⚠️ Erro ao salvar projeto:', error);
    }
}

/**
 * Carrega projeto salvo
 */
function loadSavedProject() {
    try {
        const saved = localStorage.getItem('promptforge_current_project');
        if (!saved) return null;
        
        const projectData = JSON.parse(saved);
        
        // Restaurar estado
        StudioState.project = {
            id: projectData.id,
            name: projectData.name,
            created: projectData.created,
            modified: projectData.modified
        };
        
        StudioState.selections = projectData.selections || {};
        StudioState.workflow = projectData.workflow || StudioState.workflow;
        StudioState.settings = { ...StudioState.settings, ...(projectData.settings || {}) };
        
        console.log('📂 Projeto carregado:', projectData.id);
        
        return projectData;
        
    } catch (error) {
        console.warn('⚠️ Erro ao carregar projeto:', error);
        return null;
    }
}

/**
 * Salva checkpoint (para recuperação)
 */
function saveCheckpoint() {
    try {
        const checkpoint = {
            timestamp: Date.now(),
            results: StudioState.results,
            workflow: StudioState.workflow
        };
        
        localStorage.setItem('promptforge_checkpoint', JSON.stringify(checkpoint));
        
    } catch (error) {
        console.warn('⚠️ Erro ao salvar checkpoint:', error);
    }
}

/**
 * Recupera de checkpoint
 */
function recoverFromCheckpoint() {
    try {
        const saved = localStorage.getItem('promptforge_checkpoint');
        if (!saved) return false;
        
        const checkpoint = JSON.parse(saved);
        
        // Verificar se é recente (últimas 24h)
        const age = Date.now() - checkpoint.timestamp;
        if (age > 24 * 60 * 60 * 1000) {
            console.log('⏰ Checkpoint muito antigo, ignorando');
            return false;
        }
        
        // Restaurar
        StudioState.results = checkpoint.results;
        StudioState.workflow = checkpoint.workflow;
        
        console.log('♻️ Recuperado de checkpoint');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Erro ao recuperar checkpoint:', error);
        return false;
    }
}

/**
 * Adiciona ao histórico de projetos
 */
function addToProjectHistory(projectData) {
    try {
        let history = JSON.parse(localStorage.getItem('promptforge_project_history') || '[]');
        
        // Remover duplicata (se existir)
        history = history.filter(p => p.id !== projectData.id);
        
        // Adicionar no início
        history.unshift({
            id: projectData.id,
            name: projectData.name,
            modified: projectData.modified,
            selections: projectData.selections
        });
        
        // Limitar a 50 projetos
        history = history.slice(0, 50);
        
        localStorage.setItem('promptforge_project_history', JSON.stringify(history));
        
    } catch (error) {
        console.warn('⚠️ Erro ao salvar histórico:', error);
    }
}

/**
 * Lista projetos salvos
 */
function listSavedProjects() {
    try {
        const history = localStorage.getItem('promptforge_project_history');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.warn('⚠️ Erro ao listar projetos:', error);
        return [];
    }
}

/**
 * Novo projeto
 */
function newProject(name = null) {
    // Salvar projeto atual se houver
    if (StudioState.project.id && StudioState.selections.nicho) {
        saveProject();
    }
    
    // Resetar estado
    StudioState.project = {
        id: generateProjectId(),
        name: name || `Projeto ${new Date().toLocaleDateString()}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
    };
    
    StudioState.selections = {
        nicho: null,
        categoria: null,
        estilo: null,
        paleta: null,
        ideia: null
    };
    
    StudioState.results = {
        prompt: null,
        image: null,
        imageNoBg: null,
        mockups: null,
        salesCopy: null,
        socialPosts: null
    };
    
    StudioState.workflow = {
        currentStep: 0,
        steps: ['select', 'generate', 'process', 'mockups', 'content', 'download'],
        completed: []
    };
    
    console.log('📄 Novo projeto criado:', StudioState.project.id);
    
    updateUI();
}

/**
 * Gera ID único de projeto
 */
function generateProjectId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ==================== CONFIGURAÇÃO ====================

/**
 * Atualiza configuração
 */
function updateSetting(key, value) {
    if (!(key in StudioState.settings)) {
        console.warn(`Configuração inválida: ${key}`);
        return false;
    }
    
    StudioState.settings[key] = value;
    
    console.log(`⚙️ Configuração atualizada: ${key} = ${value}`);
    
    // Salvar
    saveSetting(key, value);
    
    updateUI();
    return true;
}

/**
 * Salva configuração individual
 */
function saveSetting(key, value) {
    try {
        const settings = JSON.parse(localStorage.getItem('promptforge_settings') || '{}');
        settings[key] = value;
        localStorage.setItem('promptforge_settings', JSON.stringify(settings));
    } catch (error) {
        console.warn('⚠️ Erro ao salvar configuração:', error);
    }
}

/**
 * Carrega configurações salvas
 */
function loadSettings() {
    try {
        const saved = localStorage.getItem('promptforge_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            Object.assign(StudioState.settings, settings);
            console.log('⚙️ Configurações carregadas');
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar configurações:', error);
    }
}

// ==================== API KEYS ====================

/**
 * Carrega API keys salvas
 */
function loadAPIKeys() {
    try {
        // NOTA: API keys não devem ser salvas em localStorage por segurança
        // Este é apenas um placeholder para inicialização
        console.log('🔑 API keys devem ser configuradas pelo usuário');
    } catch (error) {
        console.warn('⚠️ Erro ao carregar API keys:', error);
    }
}

// ==================== EVENTOS ====================

/**
 * Configura listeners de eventos
 */
function setupEventListeners() {
    // Atualizar créditos
    window.addEventListener('creditsUpdated', () => {
        updateUI();
    });
    
    // Mudança de idioma
    window.addEventListener('languageChanged', (e) => {
        StudioState.settings.language = e.detail.language;
        updateUI();
    });
    
    // Antes de sair da página
    window.addEventListener('beforeunload', (e) => {
        if (StudioState.processing.isActive) {
            e.preventDefault();
            e.returnValue = 'Processamento em andamento. Deseja realmente sair?';
        } else if (StudioState.settings.autoSave && hasUnsavedChanges()) {
            saveProject();
        }
    });
}

/**
 * Verifica se há mudanças não salvas
 */
function hasUnsavedChanges() {
    // Simplificado: verificar se há seleções ou resultados
    return StudioState.selections.nicho !== null || 
           StudioState.results.image !== null;
}

// ==================== HELPERS UTILITÁRIOS ====================

/**
 * Converte URL para Blob
 */
async function fetchAsBlob(url) {
    const response = await fetch(url);
    return await response.blob();
}

/**
 * Mostra erro na UI
 */
function showError(message) {
    console.error('❌', message);
    window.dispatchEvent(new CustomEvent('showError', {
        detail: { message }
    }));
}

/**
 * Mostra sucesso na UI
 */
function showSuccess(message) {
    console.log('✅', message);
    window.dispatchEvent(new CustomEvent('showSuccess', {
        detail: { message }
    }));
}

/**
 * Obtém estado atual
 */
function getState() {
    return JSON.parse(JSON.stringify(StudioState));
}

/**
 * Obtém estatísticas do projeto
 */
function getProjectStats() {
    return {
        hasImage: !!StudioState.results.image,
        hasImageNoBg: !!StudioState.results.imageNoBg,
        hasMockups: !!StudioState.results.mockups,
        mockupCount: StudioState.results.mockups ? Object.keys(StudioState.results.mockups).length : 0,
        hasSalesCopy: !!StudioState.results.salesCopy,
        hasSocialPosts: !!StudioState.results.socialPosts,
        socialPostCount: StudioState.results.socialPosts ? StudioState.results.socialPosts.length : 0,
        completedSteps: StudioState.workflow.completed.length,
        totalSteps: StudioState.workflow.steps.length,
        progress: Math.round((StudioState.workflow.completed.length / StudioState.workflow.steps.length) * 100)
    };
}

// ==================== EXPORTAÇÃO ====================
window.PromptForgeStudio = {
    // Inicialização
    init: initializeStudio,
    
    // Workflow
    executeFullWorkflow: executeFullWorkflow,
    
    // Ações individuais
    generateImageOnly: generateImageOnly,
    removeBackgroundFromCurrent: removeBackgroundFromCurrent,
    generateMockupsFromCurrent: generateMockupsFromCurrent,
    downloadCurrentPackage: downloadCurrentPackage,
    
    // Seleções
    setSelection: setSelection,
    setSelections: setSelections,
    clearSelections: clearSelections,
    
    // Projeto
    newProject: newProject,
    saveProject: saveProject,
    loadSavedProject: loadSavedProject,
    listSavedProjects: listSavedProjects,
    recoverFromCheckpoint: recoverFromCheckpoint,
    
    // Configurações
    updateSetting: updateSetting,
    loadSettings: loadSettings,
    
    // Utilidades
    buildPrompt: buildPrompt,
    validateSelections: validateSelections,
    calculateWorkflowCost: calculateWorkflowCost,
    getState: getState,
    getProjectStats: getProjectStats,
    
    // Estado (read-only)
    get state() { return getState(); },
    get isProcessing() { return StudioState.processing.isActive; },
    get currentStep() { return StudioState.workflow.currentStep; }
};

// Auto-inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ studio.js v4.0 carregado');
    });
} else {
    console.log('✅ studio.js v4.0 carregado');
}
