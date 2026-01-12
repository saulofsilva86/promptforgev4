# 📦 PROMPTFORGE v4.0 - PARTE 3: SISTEMA DE APIs

## ✅ O QUE FOI CRIADO

### Arquivo: `api.js`

Sistema completo de integração com APIs de geração de imagens e texto:
- 🤖 **Gemini Imagen 3** (Free tier - 1.500/dia)
- ⚡ **FAL.ai Flux Schnell** (Fallback pago - $0.003/imagem)
- ✍️ **Gemini Flash 2.0** (Geração de texto - grátis)

---

## 🎯 FUNCIONALIDADES PRINCIPAIS

### 1. **GERAÇÃO DE IMAGENS**

#### Função: `generateImage(prompt, options)`
Gera imagem usando o melhor serviço disponível (Gemini → FAL.ai)

```javascript
// Uso básico
const result = await promptForgeAPI.generateImage(
    'A vintage style dog drinking beer at a bar, warm colors',
    {
        aspectRatio: '1:1',
        negativePrompt: 'blurry, mockup, person wearing shirt'
    }
);

console.log(result);
// {
//   url: 'blob:...', 
//   source: 'gemini',
//   cost: 0,
//   model: 'imagen-3.0-generate-001'
// }
```

**Opções disponíveis:**
```javascript
{
    aspectRatio: '1:1' | '16:9' | '9:16',  // Proporção
    negativePrompt: string,                 // O que evitar
    safetyLevel: 'BLOCK_ONLY_HIGH',        // Nível de segurança
}
```

**Retorno:**
```javascript
{
    url: string,      // URL da imagem (blob ou https)
    source: string,   // 'gemini' ou 'fal'
    cost: number,     // Custo em USD (0 para Gemini)
    model: string     // Modelo usado
}
```

---

### 2. **GERAÇÃO DE COPY DE VENDAS**

#### Função: `generateSalesCopy(params)`
Gera título, descrição, tags e CTA para vender a estampa

```javascript
const copy = await promptForgeAPI.generateSalesCopy({
    nicho: 'Coffee',
    ideia: 'Coffee addict cartoon character',
    estilo: 'Minimalist',
    idioma: 'pt'  // ou 'en', 'es'
});

console.log(copy);
// {
//   titulo: "Viciado em Café - Camiseta Divertida",
//   descricao: "Para quem não vive sem aquele cafézinho...",
//   tags: ["cafe", "humor", "escritorio", "presente", "cafeteria"],
//   bullet_points: ["100% Algodão", "Estampa durável", "Conforto garantido"],
//   cta: "Compre agora e mostre seu amor por café!"
// }
```

**Parâmetros:**
- `nicho`: Nome do nicho
- `ideia`: Descrição da estampa
- `estilo`: Estilo visual usado
- `idioma`: 'pt', 'en' ou 'es'

---

### 3. **GERAÇÃO DE POST SOCIAL MEDIA**

#### Função: `generateSocialPost(params)`
Gera legenda e hashtags para Instagram, Facebook ou TikTok

```javascript
const post = await promptForgeAPI.generateSocialPost({
    nicho: 'Fitness',
    ideia: 'Motivational gym quote with weights',
    plataforma: 'instagram',  // ou 'facebook', 'tiktok'
    idioma: 'pt'
});

console.log(post);
// {
//   legenda: "💪 Transforme suor em sucesso!\n\nEsta camiseta é...",
//   hashtags: ["#fitness", "#motivacao", "#gym", "#treino"],
//   cta: "🔥 Link na bio para comprar!"
// }
```

---

### 4. **GERAÇÃO DE TEXTO GENÉRICO**

#### Função: `generateText(prompt, options)`
Gera qualquer texto usando Gemini Flash

```javascript
const text = await promptForgeAPI.generateText(
    'Escreva 5 frases motivacionais sobre fitness',
    {
        temperature: 0.9,      // Criatividade (0-1)
        maxTokens: 500,        // Tamanho máximo
        systemInstruction: 'Seja inspirador e direto'
    }
);
```

---

## 🔧 CONFIGURAÇÃO

### 1. **Inicialização**

```javascript
// Auto-inicializa ao carregar a página
// OU inicializar manualmente:
promptForgeAPI.init({
    geminiApiKey: 'sua-key-aqui',
    falApiKey: 'sua-key-aqui'  // opcional
});
```

### 2. **Definir API Keys**

```javascript
// Definir keys depois
promptForgeAPI.setAPIKeys(
    'AIzaSy...', // Gemini key
    'fal_key...' // FAL.ai key (opcional)
);
```

### 3. **Obter do usuário**

```html
<!-- No app.html -->
<div id="apiSettings">
    <h3>Configuração de APIs</h3>
    <label>
        Gemini API Key:
        <input type="password" id="geminiKey">
    </label>
    <label>
        FAL.ai API Key (opcional):
        <input type="password" id="falKey">
    </label>
    <button onclick="saveAPIKeys()">Salvar</button>
</div>

<script>
function saveAPIKeys() {
    const geminiKey = document.getElementById('geminiKey').value;
    const falKey = document.getElementById('falKey').value;
    
    promptForgeAPI.setAPIKeys(geminiKey, falKey);
    alert('API keys salvas!');
}
</script>
```

---

## 📊 MONITORAMENTO

### Estatísticas de Uso

```javascript
const stats = promptForgeAPI.getStats();

console.log(stats);
// {
//   gemini: {
//     available: true,
//     callsToday: 150,
//     dailyLimit: 1500,
//     percentage: '10.0'
//   },
//   fal: {
//     available: true,
//     enabled: true
//   },
//   total: {
//     images: 823,
//     cost: '2.4690'  // USD
//   }
// }
```

### Exibir na UI

```html
<div class="api-stats">
    <div class="stat">
        <span>Gemini hoje:</span>
        <span id="geminiUsage">0/1500</span>
    </div>
    <div class="stat">
        <span>Custo total:</span>
        <span id="totalCost">$0.00</span>
    </div>
</div>

<script>
function updateStats() {
    const stats = promptForgeAPI.getStats();
    
    document.getElementById('geminiUsage').textContent = 
        `${stats.gemini.callsToday}/${stats.gemini.dailyLimit}`;
    
    document.getElementById('totalCost').textContent = 
        `$${stats.total.cost}`;
}

// Atualizar a cada 30 segundos
setInterval(updateStats, 30000);
</script>
```

---

## 🛡️ SISTEMA DE FALLBACK

### Fluxo Automático

```
1. Tentar Gemini (grátis)
   ↓
2. Gemini falhou?
   ↓
3. Tentar FAL.ai (pago)
   ↓
4. Ambos falharam?
   ↓
5. Mostrar erro ao usuário
```

### Condições para Usar Gemini

- ✅ API key configurada
- ✅ Não atingiu limite diário (1.500)
- ✅ Menos de 5 erros consecutivos
- ✅ Ainda não passou da meia-noite UTC

### Condições para Usar FAL.ai

- ✅ API key configurada
- ✅ FAL.ai habilitado
- ✅ Gemini falhou OU desabilitado

---

## ⚡ RETRY AUTOMÁTICO

### Configuração

```javascript
const API_CONFIG = {
    gemini: {
        retryAttempts: 3,    // 3 tentativas
        retryDelay: 2000     // 2 segundos entre tentativas
    },
    fal: {
        retryAttempts: 2,    // 2 tentativas
        retryDelay: 3000     // 3 segundos
    }
};
```

### Como Funciona

```
Tentativa 1 → Falhou
   ↓ (aguarda 2s)
Tentativa 2 → Falhou
   ↓ (aguarda 4s)
Tentativa 3 → Sucesso!
```

O delay aumenta exponencialmente: 2s → 4s → 6s

---

## 🔒 SEGURANÇA

### 1. **API Keys NÃO são salvas no localStorage**
```javascript
// Apenas em memória durante a sessão
API_CONFIG.gemini.apiKey = 'key...';

// Usuário precisa reconfigurar ao recarregar
```

### 2. **Filtros de Segurança**
```javascript
// Gemini bloqueia conteúdo adulto automaticamente
{
    safetyFilterLevel: 'BLOCK_ONLY_HIGH',
    personGeneration: 'DONT_ALLOW'  // Não gera pessoas
}
```

### 3. **Negative Prompt Padrão**
```javascript
const negativePrompt = 'blurry, low quality, distorted, mockup, person wearing shirt, model, photograph';
```

---

## 💰 CUSTOS

### Gemini Imagen 3 (Free Tier)
- **Preço:** GRÁTIS
- **Limite:** 1.500 imagens/dia
- **Reset:** Meia-noite UTC
- **Qualidade:** Alta

### FAL.ai Flux Schnell
- **Preço:** ~$0.003/imagem
- **Limite:** Depende do crédito
- **Velocidade:** ~4 segundos
- **Qualidade:** Excelente

### Gemini Flash 2.0 (Texto)
- **Preço:** GRÁTIS
- **Limite:** Muito alto (não documentado)
- **Tokens:** Até 2.000 por request

---

## 🚨 TRATAMENTO DE ERROS

### Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "Nenhuma API key configurada" | Keys não definidas | Configurar nas settings |
| "Limite diário atingido" | Passou de 1.500/dia | Aguardar reset ou usar FAL.ai |
| "Prompt bloqueado" | Filtro de segurança | Reformular prompt |
| "Timeout" | Demora excessiva | Retry automático |
| "Network error" | Sem conexão | Verificar internet |

### Exemplo de Tratamento

```javascript
try {
    const result = await promptForgeAPI.generateImage(prompt);
    mostrarImagem(result.url);
    
} catch (error) {
    console.error('Erro:', error.message);
    
    if (error.message.includes('API key')) {
        mostrarModal('Configure suas API keys nas configurações');
    }
    else if (error.message.includes('limite')) {
        mostrarModal('Limite diário atingido. Tente amanhã ou configure FAL.ai.');
    }
    else {
        mostrarModal('Erro ao gerar imagem. Tente novamente.');
    }
}
```

---

## 🔄 RESET DIÁRIO

### Automático
```javascript
// Verifica a cada chamada
checkDailyReset();

// Reset automático à meia-noite UTC
if (passou_da_meia_noite) {
    geminiCallsToday = 0;
    geminiAvailable = true;
}
```

### Manual
```javascript
// Forçar reset (útil para testes)
promptForgeAPI.checkDailyReset();
```

---

## 📋 EXEMPLO COMPLETO

```javascript
// 1. Configurar (uma vez)
promptForgeAPI.setAPIKeys('AIzaSy...', 'fal_key...');

// 2. Montar prompt
const prompt = `
A minimalist coffee lover illustration,
vintage style,
warm earthy tones,
t-shirt design,
vector art,
white background,
centered composition
`.trim();

// 3. Gerar imagem
try {
    const image = await promptForgeAPI.generateImage(prompt, {
        aspectRatio: '1:1',
        negativePrompt: 'mockup, person, blurry'
    });
    
    console.log(`✅ Imagem gerada com ${image.source}`);
    console.log(`💰 Custo: $${image.cost}`);
    
    // 4. Exibir na UI
    document.getElementById('result').innerHTML = `
        <img src="${image.url}" alt="Design">
        <p>Gerado com ${image.model}</p>
    `;
    
    // 5. Gerar copy
    const copy = await promptForgeAPI.generateSalesCopy({
        nicho: 'Coffee',
        ideia: 'Coffee lover vintage illustration',
        estilo: 'Minimalist',
        idioma: 'pt'
    });
    
    document.getElementById('copy').innerHTML = `
        <h3>${copy.titulo}</h3>
        <p>${copy.descricao}</p>
        <div class="tags">${copy.tags.join(', ')}</div>
    `;
    
    // 6. Atualizar stats
    const stats = promptForgeAPI.getStats();
    console.log(`📊 Total gerado: ${stats.total.images} imagens`);
    
} catch (error) {
    alert('Erro: ' + error.message);
}
```

---

## 📝 INTEGRAÇÃO COM OUTRAS PARTES

### Com i18n.js (Parte 1)
```javascript
const lang = i18n.getCurrentLanguage();

const copy = await promptForgeAPI.generateSalesCopy({
    nicho: 'Coffee',
    ideia: 'Coffee lover',
    estilo: 'Minimalist',
    idioma: lang  // Usa idioma atual
});
```

### Com data.js (Parte 2)
```javascript
const nicho = getNichoById('coffee');
const nichoName = getLocalizedName(nicho, 'en');

const image = await promptForgeAPI.generateImage(
    `${nichoName} themed design, ${nicho.keywords}, t-shirt design`
);
```

---

## 🎨 PRÓXIMOS PASSOS

Esta é a **PARTE 3 de 8**. Próximos arquivos:
- ✅ PARTE 1: i18n.js (concluído)
- ✅ PARTE 2: data.js expandido (concluído)
- ✅ PARTE 3: api.js (concluído)
- **PARTE 4**: credits.js (sistema de créditos)
- PARTE 5: background.js + mockup.js
- PARTE 6: download.js (ZIP)
- PARTE 7: studio.js (orquestração)
- PARTE 8: app.html + studio.css

---

## ⚙️ OBTER API KEYS

### Gemini (Google AI Studio)
1. Acesse: https://aistudio.google.com/apikey
2. Faça login com conta Google
3. Clique em "Get API Key"
4. Copie a key gerada

### FAL.ai
1. Acesse: https://fal.ai
2. Crie conta
3. Vá em Dashboard > API Keys
4. Gere nova key
5. Adicione créditos ($5-10 recomendado)

---

**Status:** ✅ COMPLETO  
**Testado:** ✅ Gemini Imagen 3, FAL.ai Flux, Gemini Flash  
**Retry:** ✅ 3 tentativas com backoff exponencial  
**Fallback:** ✅ Gemini → FAL.ai automático  
**Custo:** ✅ $0 até 1.500/dia, depois $0.003/imagem
