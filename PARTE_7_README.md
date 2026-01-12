# 📦 PROMPTFORGE v4.0 - PARTE 7: ORQUESTRAÇÃO COMPLETA

## ✅ O QUE FOI CRIADO

### Arquivo:
**`studio.js`** - Sistema de orquestração que integra todas as partes anteriores

---

## 🎯 FUNCIONALIDADES

### **Orquestração Completa**
- ✅ **Integração total** das Partes 1-6
- ✅ **Estado global** do projeto
- ✅ **Workflow automático** em 6 etapas
- ✅ **Gerenciamento de progresso** em tempo real
- ✅ **Auto-save** e recuperação
- ✅ **Histórico de projetos**
- ✅ **Undo/Redo** (preparado)
- ✅ **Validação automática**
- ✅ **Sistema de eventos** centralizado

---

## 🎬 WORKFLOW COMPLETO

### 6 Etapas Automáticas

```
1. SELECT    → Seleção de nicho, estilo, ideia
2. GENERATE  → Geração de imagem com IA
3. PROCESS   → Remoção de fundo
4. MOCKUPS   → Criação de mockups
5. CONTENT   → Copy de vendas + posts sociais
6. DOWNLOAD  → Empacotamento em ZIP
```

---

## 💡 USO SUPER SIMPLES

### Workflow Completo (1 função!)

```javascript
// 1. Definir seleções
PromptForgeStudio.setSelections({
    nicho: 'coffee',
    categoria: 'humor',
    estilo: 'minimalist',
    paleta: 'vibrant',
    ideia: 'Coffee lover illustration with funny quote'
});

// 2. Executar TUDO automaticamente
const results = await PromptForgeStudio.executeFullWorkflow({
    removeBackground: true,      // Remover fundo
    generateMockups: true,       // Criar mockups
    generateContent: true,       // Gerar copy e posts
    templates: ['tshirt_black', 'tshirt_white', 'hoodie_gray'],
    socialPlatforms: ['instagram', 'facebook']
});

// 3. PRONTO! 🎉
// results contém:
// - image (gerada)
// - imageNoBg (sem fundo)
// - mockups (3 mockups)
// - salesCopy (título, descrição, tags, CTA)
// - socialPosts (posts para Instagram e Facebook)

// 4. Download
await PromptForgeStudio.downloadCurrentPackage();
```

**Isso é TUDO que você precisa fazer!** O sistema cuida do resto automaticamente.

---

## 🎨 FLUXO REAL DETALHADO

### Passo a Passo

```javascript
async function exemploCompleto() {
    // ====== INICIALIZAÇÃO ======
    
    // 1. Inicializar Studio
    await PromptForgeStudio.init();
    
    // 2. Novo projeto
    PromptForgeStudio.newProject('Coffee Lover Campaign');
    
    // ====== SELEÇÕES ======
    
    // 3. Definir seleções
    PromptForgeStudio.setSelections({
        nicho: 'coffee',
        categoria: 'humor',
        estilo: 'minimalist',
        paleta: 'vibrant',
        ideia: 'Cartoon coffee cup with funny face and steam'
    });
    
    // ====== VALIDAÇÃO ======
    
    // 4. Validar antes de executar
    if (!PromptForgeStudio.validateSelections()) {
        alert('Preencha todos os campos!');
        return;
    }
    
    // 5. Calcular custo
    const cost = PromptForgeStudio.calculateWorkflowCost({
        removeBackground: true,
        generateContent: true
    });
    
    console.log(`Custo total: ${cost} créditos`);
    
    // 6. Verificar créditos
    if (!promptForgeCredits.hasEnoughCredits(cost)) {
        alert('Créditos insuficientes!');
        return;
    }
    
    // ====== EXECUÇÃO ======
    
    // 7. Executar workflow completo
    try {
        const results = await PromptForgeStudio.executeFullWorkflow({
            removeBackground: true,
            generateMockups: true,
            generateContent: true,
            templates: ['tshirt_black', 'tshirt_white', 'hoodie_gray'],
            socialPlatforms: ['instagram']
        });
        
        console.log('✅ Workflow completo!', results);
        
        // 8. Mostrar estatísticas
        const stats = PromptForgeStudio.getProjectStats();
        console.log('Estatísticas:', stats);
        // {
        //   hasImage: true,
        //   hasMockups: true,
        //   mockupCount: 3,
        //   hasSalesCopy: true,
        //   completedSteps: 6,
        //   progress: 100
        // }
        
        // 9. Download
        await PromptForgeStudio.downloadCurrentPackage();
        
        alert('🎉 Pacote completo baixado!');
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro: ' + error.message);
    }
}
```

---

## 🔧 AÇÕES INDIVIDUAIS

Se quiser executar etapas separadamente:

### Gerar Apenas Imagem

```javascript
// Definir seleções
PromptForgeStudio.setSelections({
    nicho: 'coffee',
    estilo: 'minimalist',
    ideia: 'Coffee lover illustration'
});

// Gerar apenas a imagem
const image = await PromptForgeStudio.generateImageOnly();
console.log('Imagem gerada:', image.url);
```

### Remover Fundo da Imagem Atual

```javascript
// (após ter gerado imagem)
const noBg = await PromptForgeStudio.removeBackgroundFromCurrent();
console.log('Fundo removido');
```

### Gerar Mockups da Imagem Atual

```javascript
// (após ter imagem sem fundo)
const mockups = await PromptForgeStudio.generateMockupsFromCurrent([
    'tshirt_black',
    'tshirt_white'
]);
console.log('Mockups criados:', Object.keys(mockups));
```

### Download do Pacote

```javascript
// Baixa tudo que foi gerado até agora
await PromptForgeStudio.downloadCurrentPackage();
```

---

## 📊 ESTADO GLOBAL

### Acessar Estado Atual

```javascript
const state = PromptForgeStudio.state;

console.log(state);
// {
//   project: { id, name, created, modified },
//   selections: { nicho, estilo, ideia, ... },
//   results: { image, imageNoBg, mockups, ... },
//   workflow: { currentStep, completed, ... },
//   processing: { isActive, currentTask, progress },
//   settings: { autoSave, language, ... }
// }
```

### Verificar Progresso

```javascript
const stats = PromptForgeStudio.getProjectStats();

console.log(stats);
// {
//   hasImage: true,
//   hasImageNoBg: true,
//   hasMockups: true,
//   mockupCount: 3,
//   hasSalesCopy: true,
//   hasSocialPosts: true,
//   socialPostCount: 1,
//   completedSteps: 5,
//   totalSteps: 6,
//   progress: 83
// }
```

---

## 🔔 EVENTOS CENTRALIZADOS

### Eventos do Sistema

```javascript
// Studio pronto
window.addEventListener('studioReady', () => {
    console.log('✅ Studio inicializado');
    mostrarInterface();
});

// Workflow completo
window.addEventListener('workflowComplete', (e) => {
    console.log('✅ Workflow completo!', e.detail.results);
    mostrarResultados(e.detail.results);
});

// Erro no workflow
window.addEventListener('workflowError', (e) => {
    console.error('❌ Erro:', e.detail.error);
    mostrarErro(e.detail.error);
});

// Etapa completada
window.addEventListener('stepComplete', (e) => {
    console.log(`✅ Etapa ${e.detail.step} completa`);
    atualizarProgressoUI();
});

// Progresso atualizado
window.addEventListener('progressUpdate', (e) => {
    const { task, percent } = e.detail;
    console.log(`⏳ ${task} - ${percent}%`);
    atualizarBarraProgresso(percent);
});

// Estado mudou
window.addEventListener('stateChanged', (e) => {
    console.log('Estado atualizado');
    renderizarUI(e.detail.state);
});
```

### Interface com Progresso

```html
<div class="studio-container">
    <!-- Seleções -->
    <div class="selections">
        <select id="nicho"></select>
        <select id="estilo"></select>
        <input id="ideia" placeholder="Descreva sua ideia...">
    </div>
    
    <!-- Progresso -->
    <div class="progress-section" id="progressSection" style="display: none;">
        <div class="progress-bar">
            <div id="progressBar" style="width: 0%"></div>
        </div>
        <div id="progressText">Aguardando...</div>
    </div>
    
    <!-- Ações -->
    <button onclick="executarWorkflow()">🚀 Gerar Tudo</button>
</div>

<script>
async function executarWorkflow() {
    // Mostrar progresso
    document.getElementById('progressSection').style.display = 'block';
    
    // Definir seleções
    PromptForgeStudio.setSelections({
        nicho: document.getElementById('nicho').value,
        estilo: document.getElementById('estilo').value,
        ideia: document.getElementById('ideia').value
    });
    
    // Executar
    try {
        await PromptForgeStudio.executeFullWorkflow();
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// Atualizar progresso
window.addEventListener('progressUpdate', (e) => {
    const { task, percent } = e.detail;
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressText').textContent = `${task} - ${percent}%`;
});

// Workflow completo
window.addEventListener('workflowComplete', () => {
    document.getElementById('progressSection').style.display = 'none';
    alert('✅ Pronto! Baixando pacote...');
    PromptForgeStudio.downloadCurrentPackage();
});
</script>
```

---

## 💾 PERSISTÊNCIA

### Auto-Save

```javascript
// Auto-save está habilitado por padrão
PromptForgeStudio.state.settings.autoSave; // true

// O projeto salva automaticamente após cada seleção e etapa
```

### Salvar Manualmente

```javascript
// Salvar projeto atual
PromptForgeStudio.saveProject();

// Novo projeto
PromptForgeStudio.newProject('Meu Projeto Legal');
```

### Listar Projetos

```javascript
const projects = PromptForgeStudio.listSavedProjects();

console.log(projects);
// [
//   {
//     id: 'proj_1234567890_abc',
//     name: 'Coffee Campaign',
//     modified: '2026-01-12T15:30:00.000Z',
//     selections: { nicho: 'coffee', ... }
//   },
//   ...
// ]
```

### Recuperar de Checkpoint

```javascript
// Se o navegador fechou durante processamento
const recovered = PromptForgeStudio.recoverFromCheckpoint();

if (recovered) {
    console.log('♻️ Projeto recuperado!');
    // Continuar de onde parou
}
```

---

## ⚙️ CONFIGURAÇÕES

### Atualizar Configuração

```javascript
// Desabilitar remoção automática de fundo
PromptForgeStudio.updateSetting('removeBackground', false);

// Desabilitar geração de copy
PromptForgeStudio.updateSetting('generateCopy', false);

// Mudar idioma
PromptForgeStudio.updateSetting('language', 'en');

// Desabilitar auto-save
PromptForgeStudio.updateSetting('autoSave', false);
```

### Configurações Disponíveis

```javascript
{
    autoSave: true,              // Salvar automaticamente
    language: 'pt',              // Idioma (pt/en/es)
    removeBackground: true,       // Remover fundo automático
    generateMockups: true,        // Gerar mockups automático
    generateCopy: true,           // Gerar copy automático
    generateSocial: true          // Gerar posts automático
}
```

---

## 🏗️ CONSTRUÇÃO DE PROMPT

### Como o Prompt é Montado

```javascript
const prompt = PromptForgeStudio.buildPrompt();

// Estrutura:
// [ideia] + [estilo.promptBase] + [nicho.keywords] + 
// [paleta.keywords] + [sufixos técnicos]

// Exemplo:
// "Cartoon coffee cup with funny face and steam, 
//  flat minimalist illustration, faceless figures, 
//  coffee, espresso, beans, cafe, barista,
//  vibrant bold saturated colors, high contrast,
//  t-shirt design, vector art, white background, 
//  centered composition, print ready, no mockup"
```

### Ver Prompt Gerado

```javascript
// Após definir seleções
PromptForgeStudio.setSelections({...});

// Ver prompt que será usado
const prompt = PromptForgeStudio.buildPrompt();
console.log('Prompt:', prompt);
```

---

## 📊 VALIDAÇÃO E CUSTO

### Validar Seleções

```javascript
const isValid = PromptForgeStudio.validateSelections();

if (!isValid) {
    alert('Preencha: nicho, estilo e ideia');
}
```

### Calcular Custo

```javascript
const cost = PromptForgeStudio.calculateWorkflowCost({
    removeBackground: true,   // +1 crédito
    generateContent: true     // +1 crédito
});

console.log(`Custo total: ${cost} créditos`);
// Custo total: 3 créditos
// (1 design + 1 remover fundo + 1 post social)
```

---

## 🔗 INTEGRAÇÃO COMPLETA

### Todas as Partes Integradas

```javascript
// O Studio usa automaticamente:

// Parte 1 - i18n.js
const lang = PromptForgeStudio.state.settings.language;

// Parte 2 - data.js
const nicho = getNichoById('coffee');
const estilo = getEstiloById('minimalist');

// Parte 3 - api.js
const image = await promptForgeAPI.generateImage(prompt);
const copy = await promptForgeAPI.generateSalesCopy({...});

// Parte 4 - credits.js
await promptForgeCredits.deductCredits(cost, 'workflow');

// Parte 5 - background.js + mockup.js
const noBg = await backgroundRemoval.removeBackground(image);
const mockups = await mockupGenerator.generateMultiple(noBg);

// Parte 6 - download.js
await downloadManager.createAndDownload(files, metadata);
```

---

## 🎯 EXEMPLO INTERFACE COMPLETA

```html
<!DOCTYPE html>
<html>
<head>
    <title>PromptForge Studio v4.0</title>
</head>
<body>
    <div id="app">
        <!-- Loading inicial -->
        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Carregando PromptForge Studio...</p>
        </div>
        
        <!-- App principal -->
        <div id="mainApp" style="display: none;">
            <!-- Header com créditos -->
            <header>
                <h1>PromptForge Studio v4.0</h1>
                <div class="credits">
                    💳 <span id="creditsBalance">0</span> créditos
                </div>
            </header>
            
            <!-- Seleções -->
            <section class="selections">
                <h2>1. Configure seu Design</h2>
                
                <label>Nicho:</label>
                <select id="nicho"></select>
                
                <label>Estilo:</label>
                <select id="estilo"></select>
                
                <label>Paleta:</label>
                <select id="paleta"></select>
                
                <label>Sua Ideia:</label>
                <textarea id="ideia" rows="3"></textarea>
                
                <div class="cost-preview">
                    Custo estimado: <span id="costPreview">3</span> créditos
                </div>
            </section>
            
            <!-- Progresso -->
            <section class="progress" id="progressSection" style="display: none;">
                <h3>Gerando...</h3>
                <div class="progress-bar">
                    <div id="progressBar"></div>
                </div>
                <p id="progressText">Aguardando...</p>
            </section>
            
            <!-- Ações -->
            <section class="actions">
                <button id="btnGenerate" class="btn-primary">
                    🚀 Gerar Tudo
                </button>
                <button id="btnSave" class="btn-secondary">
                    💾 Salvar Projeto
                </button>
            </section>
            
            <!-- Resultados -->
            <section id="results" style="display: none;">
                <h2>Resultados</h2>
                <div id="resultsContent"></div>
                <button id="btnDownload" class="btn-primary">
                    📦 Baixar Pacote Completo
                </button>
            </section>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="auth.js"></script>
    <script src="i18n.js"></script>
    <script src="data.js"></script>
    <script src="api.js"></script>
    <script src="credits.js"></script>
    <script src="background.js"></script>
    <script src="mockup.js"></script>
    <script src="download.js"></script>
    <script src="studio.js"></script>
    
    <script>
        // ====== INICIALIZAÇÃO ======
        
        async function init() {
            try {
                // Inicializar Studio
                await PromptForgeStudio.init();
                
                // Esconder loading, mostrar app
                document.getElementById('loading').style.display = 'none';
                document.getElementById('mainApp').style.display = 'block';
                
                // Carregar dados na UI
                carregarNichos();
                carregarEstilos();
                carregarPaletas();
                atualizarCreditos();
                
            } catch (error) {
                alert('Erro ao inicializar: ' + error.message);
            }
        }
        
        // ====== POPULAR SELECTS ======
        
        function carregarNichos() {
            const select = document.getElementById('nicho');
            NICHOS.forEach(nicho => {
                const option = document.createElement('option');
                option.value = nicho.id;
                option.textContent = nicho.icon + ' ' + getLocalizedName(nicho, 'pt');
                select.appendChild(option);
            });
        }
        
        function carregarEstilos() {
            const select = document.getElementById('estilo');
            ESTILOS.forEach(estilo => {
                const option = document.createElement('option');
                option.value = estilo.id;
                option.textContent = estilo.emoji + ' ' + getLocalizedName(estilo, 'pt');
                select.appendChild(option);
            });
        }
        
        function carregarPaletas() {
            const select = document.getElementById('paleta');
            PALETAS.forEach(paleta => {
                const option = document.createElement('option');
                option.value = paleta.id;
                option.textContent = getLocalizedName(paleta, 'pt');
                select.appendChild(option);
            });
        }
        
        function atualizarCreditos() {
            const balance = promptForgeCredits.getBalance();
            document.getElementById('creditsBalance').textContent = balance;
        }
        
        // ====== EVENTOS UI ======
        
        // Atualizar seleções
        document.getElementById('nicho').addEventListener('change', (e) => {
            PromptForgeStudio.setSelection('nicho', e.target.value);
            atualizarCustoPreview();
        });
        
        document.getElementById('estilo').addEventListener('change', (e) => {
            PromptForgeStudio.setSelection('estilo', e.target.value);
        });
        
        document.getElementById('paleta').addEventListener('change', (e) => {
            PromptForgeStudio.setSelection('paleta', e.target.value);
        });
        
        document.getElementById('ideia').addEventListener('input', (e) => {
            PromptForgeStudio.setSelection('ideia', e.target.value);
        });
        
        function atualizarCustoPreview() {
            const cost = PromptForgeStudio.calculateWorkflowCost();
            document.getElementById('costPreview').textContent = cost;
        }
        
        // ====== AÇÕES ======
        
        document.getElementById('btnGenerate').addEventListener('click', async () => {
            const btn = document.getElementById('btnGenerate');
            btn.disabled = true;
            
            document.getElementById('progressSection').style.display = 'block';
            
            try {
                await PromptForgeStudio.executeFullWorkflow();
            } catch (error) {
                alert('Erro: ' + error.message);
            } finally {
                btn.disabled = false;
            }
        });
        
        document.getElementById('btnSave').addEventListener('click', () => {
            PromptForgeStudio.saveProject();
            alert('✅ Projeto salvo!');
        });
        
        document.getElementById('btnDownload').addEventListener('click', async () => {
            await PromptForgeStudio.downloadCurrentPackage();
        });
        
        // ====== EVENTOS DO STUDIO ======
        
        window.addEventListener('progressUpdate', (e) => {
            const { task, percent } = e.detail;
            document.getElementById('progressBar').style.width = percent + '%';
            document.getElementById('progressText').textContent = `${task} - ${percent}%`;
        });
        
        window.addEventListener('workflowComplete', (e) => {
            document.getElementById('progressSection').style.display = 'none';
            document.getElementById('results').style.display = 'block';
            
            const stats = PromptForgeStudio.getProjectStats();
            document.getElementById('resultsContent').innerHTML = `
                <p>✅ ${stats.mockupCount} mockups criados</p>
                <p>✅ Copy de vendas gerada</p>
                <p>✅ ${stats.socialPostCount} posts sociais</p>
            `;
            
            atualizarCreditos();
        });
        
        window.addEventListener('creditsUpdated', () => {
            atualizarCreditos();
        });
        
        // ====== INICIAR ======
        init();
    </script>
</body>
</html>
```

---

## 📋 PRÓXIMOS PASSOS

Esta é a **PARTE 7 de 8**. Último arquivo:
- ✅ PARTE 1: i18n.js (concluído)
- ✅ PARTE 2: data.js expandido (concluído)
- ✅ PARTE 3: api.js (concluído)
- ✅ PARTE 4: credits.js (concluído)
- ✅ PARTE 5: background.js + mockup.js (concluído)
- ✅ PARTE 6: download.js (concluído)
- ✅ PARTE 7: studio.js (concluído)
- **PARTE 8**: app.html + studio.css (interface final completa)

---

**Status:** ✅ COMPLETO  
**Integração:** ✅ Todas as 6 partes anteriores  
**Workflow:** ✅ 6 etapas automáticas  
**Estado:** ✅ Global e persistente  
**Eventos:** ✅ Centralizados  
**Auto-save:** ✅ Implementado  
**Recuperação:** ✅ Checkpoints automáticos
