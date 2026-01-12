# 📦 PROMPTFORGE v4.0 - PARTE 6: SISTEMA DE DOWNLOAD

## ✅ O QUE FOI CRIADO

### Arquivo:
**`download.js`** - Sistema completo de empacotamento em ZIP

---

## 🎯 FUNCIONALIDADES

### **Empacotamento Completo**
- ✅ **JSZip** - Criação de arquivos ZIP no navegador
- ✅ **Estrutura organizada** - Pastas lógicas e profissionais
- ✅ **Múltiplos formatos** - PNG, JSON, TXT
- ✅ **Metadados inclusos** - info.json com informações completas
- ✅ **README automático** - Guia de uso em PT/EN
- ✅ **Preview antes do download** - Visualizar conteúdo
- ✅ **Progressão em tempo real** - Callbacks de progresso
- ✅ **Compressão inteligente** - Nível 6 (balanceado)

---

## 📂 ESTRUTURA DO ZIP

```
promptforge_package_2026-01-12.zip
│
├── design/
│   └── design_no_background.png      (Estampa transparente)
│
├── mockups/
│   ├── mockup_tshirt_black.png
│   ├── mockup_tshirt_white.png
│   └── mockup_hoodie_gray.png
│
├── copy/
│   ├── sales_copy.txt                (Formatado)
│   └── sales_copy.json               (Estruturado)
│
├── social/
│   ├── instagram_post_1.txt
│   ├── facebook_post_1.txt
│   └── tiktok_post_1.txt
│
├── info.json                         (Metadados)
└── README.txt                        (Guia de uso)
```

---

## 💡 USO BÁSICO

### 1. Criar e Baixar Pacote

```javascript
// Preparar arquivos
const files = {
    design: designBlob,                    // PNG sem fundo
    mockups: {
        tshirt_black: mockupBlob1,
        tshirt_white: mockupBlob2,
        hoodie_gray: mockupBlob3
    },
    salesCopy: {
        titulo: 'Camiseta Coffee Lover',
        descricao: 'Para quem não vive sem café...',
        tags: ['cafe', 'humor', 'escritorio'],
        bullet_points: ['100% Algodão', 'Estampa durável'],
        cta: 'Compre agora!'
    },
    socialPosts: [
        {
            platform: 'instagram',
            legenda: '☕ Para os viciados em café...',
            hashtags: ['#cafe', '#humor', '#camiseta'],
            cta: '🔥 Link na bio!'
        }
    ]
};

// Metadados opcionais
const metadata = {
    nicho: 'Coffee',
    estilo: 'Minimalist',
    language: 'pt',
    filename: 'coffee_lover_design'
};

// Criar e baixar automaticamente
await downloadManager.createAndDownload(files, metadata);
```

### 2. Criar Pacote (sem baixar)

```javascript
// Apenas criar o ZIP (para processar depois)
const zipBlob = await downloadManager.createPackage(files, metadata);

// Usar depois
downloadManager.download(zipBlob, 'meu_design.zip');
```

### 3. Preview Antes de Baixar

```javascript
// Gerar preview
const preview = downloadManager.generatePreview(files);

console.log(preview);
// {
//   structure: [
//     { path: 'design/design_no_background.png', type: 'image/png', size: 245760 },
//     { path: 'mockups/mockup_tshirt_black.png', type: 'image/png', size: 512000 },
//     ...
//   ],
//   totalSize: 2457600,
//   fileCount: 8
// }

// Criar UI de preview
const previewUI = downloadManager.createPreviewUI(files, metadata);
document.body.appendChild(previewUI);
```

---

## 🎨 EXEMPLO COMPLETO - FLUXO REAL

```javascript
async function fluxoCompletoDownload() {
    try {
        console.log('🚀 Iniciando geração completa...');
        
        // 1. GERAR DESIGN
        showLoading('Gerando design...');
        const imageResult = await promptForgeAPI.generateImage(prompt);
        
        // 2. REMOVER FUNDO
        showLoading('Removendo fundo...');
        const designBlob = await backgroundRemoval.removeBackground(imageResult.url);
        
        // 3. GERAR MOCKUPS
        showLoading('Gerando mockups...');
        const { mockups } = await mockupGenerator.generateMultiple(
            designBlob,
            ['tshirt_black', 'tshirt_white', 'hoodie_gray']
        );
        
        // 4. GERAR COPY
        showLoading('Gerando copy de vendas...');
        const salesCopy = await promptForgeAPI.generateSalesCopy({
            nicho: 'Coffee',
            ideia: 'Coffee lover illustration',
            estilo: 'Minimalist',
            idioma: 'pt'
        });
        
        // 5. GERAR POSTS SOCIAIS
        showLoading('Gerando posts sociais...');
        const instagramPost = await promptForgeAPI.generateSocialPost({
            nicho: 'Coffee',
            ideia: 'Coffee lover',
            plataforma: 'instagram',
            idioma: 'pt'
        });
        
        // 6. PREPARAR ARQUIVOS
        const files = {
            design: designBlob,
            mockups: mockups,
            salesCopy: salesCopy,
            socialPosts: [instagramPost]
        };
        
        // 7. VALIDAR
        const validation = downloadManager.validateFiles(files);
        if (!validation.valid) {
            throw new Error('Arquivos inválidos: ' + validation.errors.join(', '));
        }
        
        // 8. MOSTRAR PREVIEW
        const previewUI = downloadManager.createPreviewUI(files, {
            nicho: 'Coffee',
            estilo: 'Minimalist',
            language: 'pt'
        });
        document.getElementById('preview').appendChild(previewUI);
        
        // 9. CRIAR E BAIXAR
        showLoading('Criando pacote...');
        await downloadManager.createAndDownload(files, {
            nicho: 'coffee',
            estilo: 'minimalist',
            filename: `coffee_lover_${Date.now()}`
        });
        
        // 10. DEDUZIR CRÉDITOS
        await promptForgeCredits.deductCredits(2, 'pacote_completo');
        
        console.log('✅ Pacote baixado com sucesso!');
        showSuccess('Pacote completo baixado! Verifique sua pasta de downloads.');
        
    } catch (error) {
        console.error('❌ Erro:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}
```

---

## 📊 EVENTOS E PROGRESSO

### Eventos Disponíveis

```javascript
// Progresso do empacotamento
window.addEventListener('downloadProgress', (e) => {
    const { stage, progress, current, total } = e.detail;
    
    if (stage === 'packing') {
        console.log(`Empacotando: ${progress}% (${current}/${total} arquivos)`);
        updateProgressBar(progress);
    }
    else if (stage === 'compression') {
        console.log(`Comprimindo: ${progress.toFixed(0)}%`);
        updateProgressBar(progress);
    }
});

// Pacote criado
window.addEventListener('packageCreated', (e) => {
    const { size, files } = e.detail;
    console.log(`Pacote criado: ${files} arquivos, ${(size/1024/1024).toFixed(2)}MB`);
});

// Download iniciado
window.addEventListener('downloadStarted', (e) => {
    const { filename, size } = e.detail;
    console.log(`Download: ${filename} (${(size/1024/1024).toFixed(2)}MB)`);
});
```

### Interface com Progresso

```html
<div class="download-section">
    <h3>Criar Pacote Completo</h3>
    
    <div class="progress-container" id="progressContainer" style="display: none;">
        <div class="progress-bar">
            <div id="progressBar" style="width: 0%; height: 30px; background: #4CAF50;"></div>
        </div>
        <div id="progressText">0%</div>
    </div>
    
    <button onclick="iniciarDownload()">
        💾 Criar e Baixar Pacote
    </button>
    
    <div id="preview"></div>
</div>

<script>
let currentFiles = null;

async function iniciarDownload() {
    // Mostrar progresso
    document.getElementById('progressContainer').style.display = 'block';
    
    // Preparar arquivos (exemplo)
    const files = {
        design: await fetch('design.png').then(r => r.blob()),
        mockups: {
            tshirt_black: await fetch('mockup1.png').then(r => r.blob())
        },
        salesCopy: {
            titulo: 'Camiseta Incrível',
            descricao: 'A melhor camiseta do mundo'
        }
    };
    
    // Criar e baixar
    await downloadManager.createAndDownload(files, {
        nicho: 'Example',
        filename: 'meu_design'
    });
}

// Atualizar progresso
window.addEventListener('downloadProgress', (e) => {
    const percent = Math.round(e.detail.progress);
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressText').textContent = percent + '%';
});

// Esconder progresso quando concluir
window.addEventListener('packageCreated', () => {
    setTimeout(() => {
        document.getElementById('progressContainer').style.display = 'none';
    }, 2000);
});
</script>
```

---

## 📋 CONTEÚDO DOS ARQUIVOS

### info.json

```json
{
  "project": "PromptForge Studio v4.0",
  "generated": "2026-01-12T15:30:45.123Z",
  "version": "4.0.0",
  "nicho": "Coffee",
  "estilo": "Minimalist",
  "files": {
    "design": true,
    "mockups": 3,
    "salesCopy": true,
    "socialPosts": 1
  },
  "stats": {
    "totalFiles": 8
  }
}
```

### sales_copy.txt

```
═══════════════════════════════════════
   COPY DE VENDAS - PROMPTFORGE STUDIO
═══════════════════════════════════════

TÍTULO:
Camiseta Coffee Lover - Para Viciados em Café

───────────────────────────────────────
DESCRIÇÃO:
Para quem não consegue começar o dia sem aquele
cafézinho especial. Esta camiseta é perfeita para
demonstrar seu amor pelo café com estilo e humor.
Estampa minimalista de alta qualidade que não
desbota com as lavagens.

───────────────────────────────────────
PONTOS-CHAVE:
• 100% Algodão macio e respirável
• Estampa de alta durabilidade
• Conforto para o dia inteiro
• Design exclusivo

───────────────────────────────────────
TAGS:
cafe, humor, escritorio, presente, coffee-lover

───────────────────────────────────────
CALL-TO-ACTION:
☕ Compre agora e mostre seu amor por café!

═══════════════════════════════════════
```

### instagram_post_1.txt

```
═══════════════════════════════════════
   POST INSTAGRAM
═══════════════════════════════════════

LEGENDA:
☕ Para os viciados em café, essa é pra você!

Sabe aquela pessoa que não funciona sem café?
Essa camiseta é PERFEITA! 😍

Design minimalista, confortável e estilosa.
Mostre seu amor pelo cafézinho com atitude! ☕✨

───────────────────────────────────────
HASHTAGS:
#cafe #coffeelover #camiseta #moda #humor
#cafeteria #estilo #presente

───────────────────────────────────────
CTA:
🔥 Link na bio para comprar!

═══════════════════════════════════════
```

### README.txt

```
════════════════════════════════════════════════
   PROMPTFORGE STUDIO v4.0 - PACOTE DE DESIGN
════════════════════════════════════════════════

📦 CONTEÚDO DO PACOTE:

/design/
  └─ design_no_background.png    Estampa pronta

/mockups/
  └─ mockup_*.png                Visualizações

/copy/
  ├─ sales_copy.txt              Copy formatada
  └─ sales_copy.json             Copy em JSON

/social/
  └─ *_post_*.txt                Posts sociais

info.json                         Metadados

────────────────────────────────────────────────

🎨 COMO USAR:

1. DESIGN - Upload em plataformas POD
2. MOCKUPS - Marketing e redes sociais
3. COPY - Descrições de produtos
4. SOCIAL - Posts para Instagram/Facebook/TikTok

════════════════════════════════════════════════
```

---

## 🔧 PERSONALIZAÇÃO

### Estrutura Personalizada

```javascript
// Modificar estrutura padrão
const customConfig = {
    structure: {
        design: 'arquivos/estampa/',
        mockups: 'arquivos/visualizacoes/',
        copy: 'textos/',
        social: 'redes-sociais/',
        metadata: 'dados.json'
    }
};

// Usar na criação
const zip = await createCustomPackage(files, customConfig);
```

### Metadados Personalizados

```javascript
const metadata = {
    // Básico
    nicho: 'Coffee',
    estilo: 'Minimalist',
    language: 'pt',
    
    // Projeto
    projectName: 'Coffee Lover Campaign',
    clientName: 'Cafeteria Bella',
    
    // Técnico
    imageResolution: '4096x4096',
    colorProfile: 'sRGB',
    
    // Business
    targetPlatform: 'Printful',
    productType: 'Premium T-Shirt',
    
    // Customizações
    includeReadme: true,
    includeThumbnails: false,
    
    // Dados adicionais
    custom: {
        campaign_id: 'CAMP-2026-001',
        designer: 'John Doe'
    }
};
```

---

## 📊 VALIDAÇÃO E QUALIDADE

### Validar Antes de Empacotar

```javascript
const files = {
    design: designBlob,
    mockups: { tshirt_black: mockupBlob }
};

const validation = downloadManager.validateFiles(files);

if (!validation.valid) {
    console.error('Erros encontrados:');
    validation.errors.forEach(err => {
        console.error('- ' + err);
    });
} else {
    console.log('✅ Arquivos válidos');
    await downloadManager.createAndDownload(files);
}
```

### Verificações Automáticas

- ✅ Design é Blob
- ✅ Mockups são Blobs
- ✅ Pelo menos design está presente
- ✅ Tipos corretos de dados

---

## 💾 TAMANHOS E PERFORMANCE

### Tamanhos Típicos

| Conteúdo | Tamanho Aprox. | Comprimido |
|----------|----------------|------------|
| Design PNG (2K) | 500KB - 2MB | 300KB - 1MB |
| Mockup PNG (2K) | 800KB - 3MB | 500KB - 1.5MB |
| Copy (TXT+JSON) | 3KB | 2KB |
| Social Posts | 1-2KB cada | 1KB |
| **Pacote completo** | **3-10MB** | **2-6MB** |

### Performance

```javascript
// Tempos típicos:
// - Empacotamento: 500ms - 2s
// - Compressão: 1s - 3s
// - Total: ~2-5 segundos

// Otimização: processar em paralelo quando possível
const [design, mockups, copy] = await Promise.all([
    processDesign(),
    processMockups(),
    processCopy()
]);

await downloadManager.createAndDownload({
    design,
    mockups,
    salesCopy: copy
});
```

---

## 🔗 INTEGRAÇÃO COM OUTRAS PARTES

### Com api.js (Parte 3)

```javascript
// 1. Gerar conteúdo
const image = await promptForgeAPI.generateImage(prompt);
const copy = await promptForgeAPI.generateSalesCopy({...});

// 2. Empacotar
await downloadManager.createAndDownload({
    design: image.blob,
    salesCopy: copy
});
```

### Com background.js (Parte 5)

```javascript
// 1. Remover fundo
const noBg = await backgroundRemoval.removeBackground(imageUrl);

// 2. Empacotar
await downloadManager.createAndDownload({
    design: noBg
});
```

### Com mockup.js (Parte 5)

```javascript
// 1. Gerar mockups
const { mockups } = await mockupGenerator.generateMultiple(design);

// 2. Empacotar
await downloadManager.createAndDownload({
    design: design,
    mockups: mockups
});
```

### Com credits.js (Parte 4)

```javascript
// Verificar créditos antes
const cost = promptForgeCredits.checkCredits('complete_package');

if (cost.ok) {
    await downloadManager.createAndDownload(files);
    await promptForgeCredits.deductCredits(2, 'complete_package');
} else {
    alert('Créditos insuficientes');
}
```

---

## 🚨 TROUBLESHOOTING

| Problema | Causa | Solução |
|----------|-------|---------|
| "JSZip não carregou" | CDN offline | Verificar conexão |
| Arquivo muito grande | Imagens não comprimidas | Otimizar antes |
| Download não inicia | Popup blocker | Permitir popups |
| Estrutura incorreta | Arquivos faltando | Validar antes |
| Lento para comprimir | Nível muito alto | Reduzir compression.level |

---

## 📝 EXEMPLO INTERFACE COMPLETA

```html
<!DOCTYPE html>
<html>
<head>
    <title>Download Manager - PromptForge</title>
    <style>
        .download-container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
        }
        .file-item {
            background: #f5f5f5;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
        }
        .progress {
            height: 30px;
            background: #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #45a049);
            transition: width 0.3s;
        }
        .btn {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }
        .btn:hover { background: #45a049; }
        .btn:disabled { background: #ccc; cursor: not-allowed; }
    </style>
</head>
<body>
    <div class="download-container">
        <h1>📦 Gerenciador de Download</h1>
        
        <!-- Arquivos -->
        <div id="filesList"></div>
        
        <!-- Progresso -->
        <div class="progress" id="progressContainer" style="display: none;">
            <div class="progress-bar" id="progressBar" style="width: 0%;">
                <span id="progressText" style="color: white; padding-left: 10px;"></span>
            </div>
        </div>
        
        <!-- Ações -->
        <button class="btn" onclick="gerarPreview()">👀 Preview</button>
        <button class="btn" onclick="baixarPacote()" id="downloadBtn">
            💾 Baixar Pacote Completo
        </button>
        
        <!-- Preview -->
        <div id="preview"></div>
    </div>
    
    <script src="download.js"></script>
    <script>
        let currentFiles = null;
        
        // Simular dados (em produção, vêm das outras partes)
        async function carregarArquivos() {
            currentFiles = {
                design: await fetch('design.png').then(r => r.blob()),
                mockups: {
                    tshirt_black: await fetch('mockup1.png').then(r => r.blob()),
                    tshirt_white: await fetch('mockup2.png').then(r => r.blob())
                },
                salesCopy: {
                    titulo: 'Camiseta Coffee Lover',
                    descricao: 'Para os viciados em café',
                    tags: ['cafe', 'humor'],
                    cta: 'Compre agora!'
                }
            };
            
            mostrarArquivos();
        }
        
        function mostrarArquivos() {
            const lista = document.getElementById('filesList');
            lista.innerHTML = `
                <div class="file-item">✅ Design sem fundo</div>
                <div class="file-item">✅ 2 Mockups</div>
                <div class="file-item">✅ Copy de vendas</div>
            `;
        }
        
        function gerarPreview() {
            const preview = downloadManager.createPreviewUI(currentFiles, {
                nicho: 'Coffee',
                estilo: 'Minimalist'
            });
            
            document.getElementById('preview').innerHTML = '';
            document.getElementById('preview').appendChild(preview);
        }
        
        async function baixarPacote() {
            const btn = document.getElementById('downloadBtn');
            btn.disabled = true;
            btn.textContent = '⏳ Criando pacote...';
            
            document.getElementById('progressContainer').style.display = 'block';
            
            try {
                await downloadManager.createAndDownload(currentFiles, {
                    nicho: 'coffee',
                    estilo: 'minimalist',
                    filename: 'coffee_lover_design'
                });
                
                alert('✅ Pacote baixado com sucesso!');
            } catch (error) {
                alert('❌ Erro: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.textContent = '💾 Baixar Pacote Completo';
                setTimeout(() => {
                    document.getElementById('progressContainer').style.display = 'none';
                }, 2000);
            }
        }
        
        // Eventos
        window.addEventListener('downloadProgress', (e) => {
            const { progress, stage } = e.detail;
            const percent = Math.round(progress);
            
            document.getElementById('progressBar').style.width = percent + '%';
            document.getElementById('progressText').textContent = 
                `${stage === 'compression' ? 'Comprimindo' : 'Empacotando'}: ${percent}%`;
        });
        
        // Carregar ao iniciar
        carregarArquivos();
    </script>
</body>
</html>
```

---

## 📋 PRÓXIMOS PASSOS

Esta é a **PARTE 6 de 8**. Próximos arquivos:
- ✅ PARTE 1: i18n.js (concluído)
- ✅ PARTE 2: data.js expandido (concluído)
- ✅ PARTE 3: api.js (concluído)
- ✅ PARTE 4: credits.js (concluído)
- ✅ PARTE 5: background.js + mockup.js (concluído)
- ✅ PARTE 6: download.js (concluído)
- **PARTE 7**: studio.js (orquestração completa do workflow)
- PARTE 8: app.html + studio.css (interface final)

---

**Status:** ✅ COMPLETO  
**JSZip:** ✅ Integrado via CDN  
**Estrutura:** ✅ Organizada e profissional  
**Formatos:** ✅ PNG, JSON, TXT  
**Metadados:** ✅ Completos  
**Progresso:** ✅ Em tempo real  
**Validação:** ✅ Automática
