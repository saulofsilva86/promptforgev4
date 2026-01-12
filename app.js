// =============================================
// PROMPTFORGE STUDIO v4.0 - UI CONTROLLER
// Conecta interface HTML com studio.js
// ✅ Janeiro 2026
// =============================================

(function() {
    'use strict';
    
    // ==================== INICIALIZAÇÃO ====================
    
    async function init() {
        console.log('🎨 Inicializando interface...');
        
        try {
            // Inicializar Studio
            await PromptForgeStudio.init();
            
            // Carregar dados na UI
            populateSelects();
            
            // Configurar eventos
            setupEventListeners();
            
            // Esconder loading
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'flex';
            
            // Atualizar UI
            updateCreditsDisplay();
            
            console.log('✅ Interface pronta');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar:', error);
            showToast('Erro ao inicializar: ' + error.message, 'error');
        }
    }
    
    // ==================== POPULAR SELECTS ====================
    
    function populateSelects() {
        // Nichos
        const selectNicho = document.getElementById('selectNicho');
        window.NICHOS.forEach(nicho => {
            const option = document.createElement('option');
            option.value = nicho.id;
            option.textContent = `${nicho.icon} ${nicho.name}`;
            selectNicho.appendChild(option);
        });
        
        // Estilos
        const selectEstilo = document.getElementById('selectEstilo');
        window.ESTILOS.forEach(estilo => {
            const option = document.createElement('option');
            option.value = estilo.id;
            option.textContent = `${estilo.emoji} ${estilo.name}`;
            selectEstilo.appendChild(option);
        });
        
        // Paletas
        const selectPaleta = document.getElementById('selectPaleta');
        window.PALETAS.forEach(paleta => {
            const option = document.createElement('option');
            option.value = paleta.id;
            option.textContent = paleta.name;
            selectPaleta.appendChild(option);
        });
    }
    
    // ==================== EVENTOS ====================
    
    function setupEventListeners() {
        // Seleções
        document.getElementById('selectNicho').addEventListener('change', (e) => {
            PromptForgeStudio.setSelection('nicho', e.target.value);
            updateCostPreview();
        });
        
        document.getElementById('selectCategoria').addEventListener('change', (e) => {
            PromptForgeStudio.setSelection('categoria', e.target.value);
        });
        
        document.getElementById('selectEstilo').addEventListener('change', (e) => {
            PromptForgeStudio.setSelection('estilo', e.target.value);
            updateCostPreview();
        });
        
        document.getElementById('selectPaleta').addEventListener('change', (e) => {
            PromptForgeStudio.setSelection('paleta', e.target.value);
        });
        
        document.getElementById('textIdeia').addEventListener('input', (e) => {
            PromptForgeStudio.setSelection('ideia', e.target.value);
            document.getElementById('ideaCharCount').textContent = e.target.value.length;
        });
        
        // Botões principais
        document.getElementById('btnStartWorkflow').addEventListener('click', startFullWorkflow);
        document.getElementById('btnGenerateOnly').addEventListener('click', generateImageOnly);
        document.getElementById('btnDownloadPackage').addEventListener('click', downloadPackage);
        document.getElementById('btnNewProject').addEventListener('click', newProject);
        document.getElementById('btnStartNew').addEventListener('click', newProject);
        
        // Navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const step = item.dataset.step;
                showStep(step);
            });
        });
        
        // Tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                switchTab(tab);
            });
        });
        
        // Modais
        document.getElementById('btnSettings').addEventListener('click', () => openModal('settingsModal'));
        document.getElementById('btnHistory').addEventListener('click', () => openModal('historyModal'));
        
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                closeModal(modalId);
            });
        });
        
        // Configurações
        document.getElementById('settingRemoveBg').addEventListener('change', (e) => {
            PromptForgeStudio.updateSetting('removeBackground', e.target.checked);
        });
        
        document.getElementById('settingGenerateMockups').addEventListener('change', (e) => {
            PromptForgeStudio.updateSetting('generateMockups', e.target.checked);
        });
        
        document.getElementById('settingGenerateCopy').addEventListener('change', (e) => {
            PromptForgeStudio.updateSetting('generateCopy', e.target.checked);
        });
        
        document.getElementById('settingGenerateSocial').addEventListener('change', (e) => {
            PromptForgeStudio.updateSetting('generateSocial', e.target.checked);
        });
        
        document.getElementById('settingAutoSave').addEventListener('change', (e) => {
            PromptForgeStudio.updateSetting('autoSave', e.target.checked);
        });
        
        // Eventos do Studio
        window.addEventListener('progressUpdate', handleProgressUpdate);
        window.addEventListener('stepComplete', handleStepComplete);
        window.addEventListener('workflowComplete', handleWorkflowComplete);
        window.addEventListener('workflowError', handleWorkflowError);
        window.addEventListener('creditsUpdated', updateCreditsDisplay);
    }
    
    // ==================== WORKFLOW ====================
    
    async function startFullWorkflow() {
        // Validar
        if (!PromptForgeStudio.validateSelections()) {
            showToast('Por favor, preencha todos os campos obrigatórios', 'warning');
            return;
        }
        
        // Verificar créditos
        const cost = PromptForgeStudio.calculateWorkflowCost();
        if (!promptForgeCredits.hasEnoughCredits(cost)) {
            showToast(`Créditos insuficientes. Necessário: ${cost}`, 'error');
            return;
        }
        
        // Mostrar painel de progresso
        showProgressPanel();
        
        try {
            // Executar
            await PromptForgeStudio.executeFullWorkflow();
            
        } catch (error) {
            console.error('Erro no workflow:', error);
            showToast('Erro: ' + error.message, 'error');
        }
    }
    
    async function generateImageOnly() {
        if (!PromptForgeStudio.validateSelections()) {
            showToast('Preencha todos os campos', 'warning');
            return;
        }
        
        showProgressPanel();
        
        try {
            await PromptForgeStudio.generateImageOnly();
            showStep('generate');
            showToast('Design gerado!', 'success');
        } catch (error) {
            showToast('Erro: ' + error.message, 'error');
        }
    }
    
    async function downloadPackage() {
        try {
            await PromptForgeStudio.downloadCurrentPackage();
            showToast('Download iniciado!', 'success');
        } catch (error) {
            showToast('Erro: ' + error.message, 'error');
        }
    }
    
    function newProject() {
        if (confirm('Deseja criar um novo projeto? As alterações não salvas serão perdidas.')) {
            PromptForgeStudio.newProject();
            
            // Limpar form
            document.getElementById('selectNicho').value = '';
            document.getElementById('selectEstilo').value = '';
            document.getElementById('selectPaleta').value = 'auto';
            document.getElementById('textIdeia').value = '';
            document.getElementById('ideaCharCount').textContent = '0';
            
            showStep('select');
            showToast('Novo projeto criado', 'success');
        }
    }
    
    // ==================== PROGRESS ====================
    
    function showProgressPanel() {
        document.getElementById('progressPanel').style.display = 'block';
    }
    
    function hideProgressPanel() {
        document.getElementById('progressPanel').style.display = 'none';
    }
    
    function handleProgressUpdate(e) {
        const { task, percent } = e.detail;
        
        document.getElementById('progressBar').style.width = percent + '%';
        document.getElementById('progressText').textContent = task;
        document.getElementById('progressPercent').textContent = Math.round(percent) + '%';
    }
    
    function handleStepComplete(e) {
        const step = e.detail.step;
        
        // Marcar navegação
        const navItem = document.querySelector(`.nav-item[data-step="${step}"]`);
        if (navItem) {
            navItem.classList.add('completed');
        }
        
        // Atualizar passo do progresso
        const progressStep = document.querySelector(`.progress-step[data-step="${step}"]`);
        if (progressStep) {
            progressStep.classList.add('completed');
            progressStep.querySelector('.step-status').textContent = '✓';
        }
    }
    
    function handleWorkflowComplete(e) {
        hideProgressPanel();
        showStep('download');
        updateDownloadPreview();
        showToast('Workflow completo! 🎉', 'success');
    }
    
    function handleWorkflowError(e) {
        hideProgressPanel();
        showToast('Erro: ' + e.detail.error, 'error');
    }
    
    // ==================== UI UPDATES ====================
    
    function showStep(step) {
        // Atualizar navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.step === step);
        });
        
        // Atualizar conteúdo
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.toggle('active', content.dataset.step === step);
        });
    }
    
    function switchTab(tab) {
        // Atualizar botões
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        // Atualizar conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tab);
        });
    }
    
    function updateCreditsDisplay() {
        const balance = promptForgeCredits.getBalance();
        document.getElementById('creditsBalance').textContent = balance;
        
        // Atualizar classe de alerta
        const display = document.querySelector('.credits-display');
        if (balance < 5) {
            display.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        } else {
            display.style.background = 'linear-gradient(135deg, #818cf8, #6366f1)';
        }
    }
    
    function updateCostPreview() {
        const cost = PromptForgeStudio.calculateWorkflowCost();
        document.getElementById('costAmount').textContent = cost;
    }
    
    function updateDownloadPreview() {
        const stats = PromptForgeStudio.getProjectStats();
        
        document.getElementById('statDesign').textContent = stats.hasImage ? '1' : '0';
        document.getElementById('statMockups').textContent = stats.mockupCount;
        document.getElementById('statCopy').textContent = stats.hasSalesCopy ? '1' : '0';
        document.getElementById('statPosts').textContent = stats.socialPostCount;
        
        // Atualizar lista de arquivos
        const fileList = document.getElementById('packageFileList');
        fileList.innerHTML = '';
        
        if (stats.hasImage) {
            fileList.innerHTML += '<li>📸 design_no_background.png</li>';
        }
        
        for (let i = 0; i < stats.mockupCount; i++) {
            fileList.innerHTML += `<li>👕 mockup_${i + 1}.png</li>`;
        }
        
        if (stats.hasSalesCopy) {
            fileList.innerHTML += '<li>📝 sales_copy.txt</li>';
            fileList.innerHTML += '<li>📋 sales_copy.json</li>';
        }
        
        for (let i = 0; i < stats.socialPostCount; i++) {
            fileList.innerHTML += `<li>📱 social_post_${i + 1}.txt</li>`;
        }
        
        fileList.innerHTML += '<li>📋 info.json</li>';
        fileList.innerHTML += '<li>📄 README.txt</li>';
    }
    
    // ==================== MODALS ====================
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            
            // Carregar conteúdo específico
            if (modalId === 'historyModal') {
                loadProjectHistory();
            }
        }
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    function loadProjectHistory() {
        const projects = PromptForgeStudio.listSavedProjects();
        const container = document.getElementById('projectHistory');
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <p>Nenhum projeto salvo ainda</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = projects.map(project => `
            <div class="project-card">
                <h4>${project.name}</h4>
                <p>Modificado: ${new Date(project.modified).toLocaleString('pt-BR')}</p>
            </div>
        `).join('');
    }
    
    // ==================== TOAST ====================
    
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInLeft 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ==================== INICIAR ====================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
