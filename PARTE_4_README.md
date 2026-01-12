# 📦 PROMPTFORGE v4.0 - PARTE 4: SISTEMA DE CRÉDITOS

## ✅ O QUE FOI CRIADO

### Arquivos:
1. **`credits.js`** - Sistema completo de gerenciamento de créditos
2. **`supabase_schema.sql`** - Schema SQL para Supabase

---

## 🎯 FUNCIONALIDADES

### 1. **GERENCIAMENTO DE SALDO**

```javascript
// Inicializar
await promptForgeCredits.init();

// Obter saldo atual
const balance = promptForgeCredits.getBalance();
console.log(`Saldo: ${balance} créditos`);

// Obter informações completas
const info = promptForgeCredits.getInfo();
console.log(info);
// {
//   balance: 30,
//   totalUsed: 45,
//   plan: 'mensal',
//   planCredits: 30,
//   lastUpdate: '2026-01-12T...',
//   email: 'user@email.com',
//   costs: {...}
// }
```

---

### 2. **VERIFICAÇÃO DE CRÉDITOS**

```javascript
// Verificar ação específica
const check = promptForgeCredits.checkCredits('design_png');
console.log(check);
// {
//   ok: true,
//   cost: 1,
//   balance: 30,
//   message: '✅ Você tem 30 créditos'
// }

// Verificar quantidade
if (promptForgeCredits.hasEnoughCredits(5)) {
    console.log('✅ Pode prosseguir');
}

// Calcular custo total
const actions = ['design_png', 'remove_background', 'upscale_4k'];
const total = promptForgeCredits.calculateTotalCost(actions);
console.log(total);
// {
//   total: 3,
//   breakdown: {
//     design_png: 1,
//     remove_background: 1,
//     upscale_4k: 1
//   },
//   hasEnough: true,
//   balance: 30,
//   remaining: 27
// }
```

---

### 3. **DEDUÇÃO DE CRÉDITOS**

```javascript
// Deduzir créditos
const success = await promptForgeCredits.deductCredits(
    2, 
    'design_png + remove_background'
);

if (success) {
    console.log('✅ Créditos deduzidos');
    // Continuar com a operação
} else {
    alert('❌ Créditos insuficientes');
}
```

---

### 4. **HISTÓRICO DE USO**

```javascript
// Buscar histórico
const history = await promptForgeCredits.getHistory(50);
console.log(history);
// [
//   {
//     id: '...',
//     email: 'user@email.com',
//     credits_used: 2,
//     action: 'design_png + remove_background',
//     balance_after: 28,
//     created_at: '2026-01-12T...'
//   },
//   ...
// ]

// Estatísticas
const stats = await promptForgeCredits.getStats();
console.log(stats);
// {
//   totalUsed: 45,
//   currentBalance: 28,
//   thisMonth: 12,
//   thisWeek: 5,
//   today: 2,
//   byAction: {
//     'design_png': 8,
//     'remove_background': 4
//   },
//   avgPerDay: '1.5'
// }
```

---

## 💳 CUSTOS POR FUNCIONALIDADE

| Funcionalidade | Créditos | Incluso? |
|----------------|----------|----------|
| **Estampa PNG** | 1 | ✅ Sempre |
| **Mockups (3x)** | 0 | ✅ Inclusos |
| **Copy de Vendas** | 0 | ✅ Incluso |
| **Remover Fundo** | 1 | ❌ Opcional |
| **Upscale 4K** | 1 | ❌ Opcional |
| **Post Social Media** | 1 | ❌ Opcional |
| **Pacote Completo** | 2 | ❌ Combo |

---

## 📊 PLANOS E CRÉDITOS

| Plano | Créditos/Mês | Preço | Reset |
|-------|--------------|-------|-------|
| **Free** | 5 | R$ 0 | Sem reset |
| **Mensal** | 30 | R$ 47,90 | Mensal |
| **Anual** | 100 | R$ 397/ano | Mensal* |

*Plano anual recebe 100 créditos por mês (4 meses grátis)

---

## 🗄️ CONFIGURAÇÃO DO SUPABASE

### 1. **Executar SQL**

No Supabase Dashboard:
1. Vá em `SQL Editor`
2. Cole o conteúdo de `supabase_schema.sql`
3. Clique em `Run`

### 2. **Verificar Tabelas**

```sql
-- Verificar se tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_credits', 'credit_usage');

-- Ver registros
SELECT * FROM user_credits LIMIT 10;
SELECT * FROM credit_usage LIMIT 10;
```

### 3. **Estrutura das Tabelas**

#### `user_credits`
```sql
{
  id: UUID,
  email: TEXT,
  credits_remaining: INTEGER,    -- Saldo atual
  credits_used_total: INTEGER,   -- Total histórico
  plan: TEXT,                    -- 'free', 'mensal', 'anual'
  last_reset: TIMESTAMP,         -- Último reset mensal
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### `credit_usage`
```sql
{
  id: UUID,
  email: TEXT,
  credits_used: INTEGER,         -- Quantidade usada
  action: TEXT,                  -- 'design_png', 'remove_background', etc
  balance_after: INTEGER,        -- Saldo após dedução
  metadata: JSONB,               -- Dados adicionais
  created_at: TIMESTAMP
}
```

---

## 🔒 SEGURANÇA (RLS)

Row Level Security já configurado:
- ✅ Usuários só veem seus próprios dados
- ✅ Não podem editar dados de outros
- ✅ Políticas aplicadas automaticamente

```sql
-- Exemplo de policy
CREATE POLICY "Users can view own credits"
    ON user_credits FOR SELECT
    USING (email = current_user_email());
```

---

## 🎮 INTEGRAÇÃO NO APP

### 1. **Carregar no HTML**

```html
<!-- Ordem correta -->
<script src="auth.js"></script>
<script src="i18n.js"></script>
<script src="data.js"></script>
<script src="api.js"></script>
<script src="credits.js"></script>  <!-- NOVO -->
<script src="studio.js"></script>
```

### 2. **Inicializar**

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth primeiro
    if (!window.auth.verificarAutenticacao()) {
        return;
    }
    
    // 2. Inicializar créditos
    await promptForgeCredits.init();
    
    // 3. Atualizar UI
    updateCreditsUI();
});
```

### 3. **Exibir Saldo na UI**

```html
<div class="credits-display">
    <span class="credits-icon">💳</span>
    <span id="creditsBalance">0</span>
    <span class="credits-label">créditos</span>
</div>

<script>
function updateCreditsUI() {
    const balance = promptForgeCredits.getBalance();
    document.getElementById('creditsBalance').textContent = balance;
    
    // Mudar cor se baixo
    const display = document.querySelector('.credits-display');
    if (balance < 5) {
        display.classList.add('low-credits');
    }
}

// Atualizar ao deduzir
window.addEventListener('creditsUpdated', (e) => {
    updateCreditsUI();
    console.log(`Saldo atualizado: ${e.detail.balance}`);
});
</script>
```

### 4. **Verificar Antes de Gerar**

```javascript
async function gerarEstampa() {
    // 1. Calcular custo
    const options = ['design_png'];
    if (removeBackground) options.push('remove_background');
    if (upscale) options.push('upscale_4k');
    
    const cost = promptForgeCredits.calculateTotalCost(options);
    
    // 2. Verificar saldo
    if (!cost.hasEnough) {
        alert(`Créditos insuficientes! Você tem ${cost.balance}, precisa de ${cost.total}`);
        mostrarModalUpgrade();
        return;
    }
    
    // 3. Mostrar confirmação
    if (confirm(`Esta operação custará ${cost.total} crédito(s). Continuar?`)) {
        // 4. Gerar
        const result = await generateDesign();
        
        // 5. Deduzir créditos
        await promptForgeCredits.deductCredits(cost.total, options.join(' + '));
        
        // 6. Mostrar resultado
        displayResult(result);
    }
}
```

---

## 📱 EXEMPLO DE UI COMPLETA

```html
<!-- Área de Créditos -->
<div class="credits-section">
    <div class="credits-header">
        <h3>💳 Seus Créditos</h3>
        <button onclick="mostrarHistorico()">📊 Histórico</button>
    </div>
    
    <div class="credits-card">
        <div class="balance">
            <span class="amount" id="creditsBalance">0</span>
            <span class="label">créditos disponíveis</span>
        </div>
        
        <div class="stats">
            <div class="stat">
                <span class="label">Usados hoje:</span>
                <span class="value" id="usedToday">0</span>
            </div>
            <div class="stat">
                <span class="label">Usados este mês:</span>
                <span class="value" id="usedThisMonth">0</span>
            </div>
        </div>
        
        <div class="plan-info">
            <span>Plano: <strong id="planName">Mensal</strong></span>
            <span>Próximo reset: <span id="nextReset">-</span></span>
        </div>
        
        <button class="btn-upgrade" onclick="window.location.href='planos.html'">
            ⬆️ Fazer Upgrade
        </button>
    </div>
</div>

<script>
async function updateCreditsUI() {
    const info = promptForgeCredits.getInfo();
    const stats = await promptForgeCredits.getStats();
    
    // Saldo
    document.getElementById('creditsBalance').textContent = info.balance;
    
    // Stats
    document.getElementById('usedToday').textContent = stats.today;
    document.getElementById('usedThisMonth').textContent = stats.thisMonth;
    
    // Plano
    const planNames = { free: 'Gratuito', mensal: 'Mensal', anual: 'Anual' };
    document.getElementById('planName').textContent = planNames[info.plan];
    
    // Próximo reset (se mensal/anual)
    if (info.plan !== 'free') {
        const nextReset = new Date(info.lastUpdate);
        nextReset.setMonth(nextReset.getMonth() + 1);
        document.getElementById('nextReset').textContent = nextReset.toLocaleDateString('pt-BR');
    }
}

async function mostrarHistorico() {
    const history = await promptForgeCredits.getHistory(20);
    
    let html = '<div class="history-modal"><h3>📊 Histórico de Uso</h3><ul>';
    
    history.forEach(record => {
        const date = new Date(record.created_at).toLocaleString('pt-BR');
        html += `
            <li>
                <span class="date">${date}</span>
                <span class="action">${record.action}</span>
                <span class="credits">-${record.credits_used}</span>
                <span class="balance">Saldo: ${record.balance_after}</span>
            </li>
        `;
    });
    
    html += '</ul><button onclick="fecharModal()">Fechar</button></div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
}
</script>
```

---

## 🔔 EVENTOS

O sistema dispara eventos customizados:

```javascript
// Quando créditos são atualizados
window.addEventListener('creditsUpdated', (e) => {
    console.log('Créditos atualizados:', e.detail);
    // { balance: 28, used: 2, reason: 'design_png' }
});

// Quando créditos são insuficientes
window.addEventListener('creditsInsufficient', (e) => {
    console.log('Créditos insuficientes:', e.detail);
    // { required: 5, balance: 2 }
    mostrarModalUpgrade();
});

// Quando créditos são resetados (mensal)
window.addEventListener('creditsReset', (e) => {
    console.log('Créditos resetados:', e.detail);
    // { newBalance: 30 }
    mostrarNotificacao('🎉 Seus créditos foram renovados!');
});

// Quando créditos são adicionados
window.addEventListener('creditsAdded', (e) => {
    console.log('Créditos adicionados:', e.detail);
    // { balance: 50, added: 20, reason: 'purchase' }
});
```

---

## 🔄 RESET AUTOMÁTICO

### Como Funciona:
1. **Plano Free:** Sem reset (5 créditos únicos)
2. **Planos Pagos:** Reset mensal automático

```javascript
// Verifica a cada inicialização
checkMonthlyReset();

// Se passou 1 mês desde last_reset:
if (monthsPassed >= 1) {
    // Reseta para créditos do plano
    credits = PLAN_CREDITS[plan];  // 30 ou 100
    last_reset = now();
}
```

### Exemplo:
```
Usuário: Plano Mensal (30 créditos/mês)
12/Jan: 30 créditos
15/Jan: Usa 10 → Resta 20
01/Fev: RESET AUTOMÁTICO → Volta para 30
```

---

## 💰 ADICIONAR CRÉDITOS (Admin)

```javascript
// Para adicionar créditos manualmente (admin)
await promptForgeCredits.addCredits(50, 'bonus');

// Ou via SQL no Supabase
UPDATE user_credits 
SET credits_remaining = credits_remaining + 50
WHERE email = 'user@email.com';
```

---

## 📊 MANUTENÇÃO

### Limpar Histórico Antigo
```sql
-- Executar mensalmente no Supabase
SELECT cleanup_old_credit_usage();
-- Remove registros com mais de 6 meses
```

### Backup
```sql
-- Fazer backup das tabelas
COPY user_credits TO '/backup/user_credits.csv' CSV HEADER;
COPY credit_usage TO '/backup/credit_usage.csv' CSV HEADER;
```

### Verificar Integridade
```sql
-- Total de créditos vs histórico
SELECT 
    SUM(credits_remaining) as total_available,
    (SELECT SUM(credits_used) FROM credit_usage) as total_used_history
FROM user_credits;
```

---

## 🚨 TROUBLESHOOTING

| Problema | Causa | Solução |
|----------|-------|---------|
| "Erro ao carregar créditos" | Supabase offline | Usa fallback localStorage |
| Saldo incorreto | Sync falhou | Recarregar página |
| Reset não aconteceu | Data incorreta | Verificar last_reset |
| Dedução não salva | Erro de rede | Usa fallback local |

---

## 📝 EXEMPLO COMPLETO

```javascript
// ===== FLUXO COMPLETO =====

// 1. Usuário clica em "Gerar"
async function handleGenerate() {
    // 2. Verificar opções selecionadas
    const options = getSelectedOptions();
    // ['design_png', 'remove_background']
    
    // 3. Calcular custo
    const cost = promptForgeCredits.calculateTotalCost(options);
    console.log(`Custo: ${cost.total} créditos`);
    
    // 4. Verificar saldo
    if (!cost.hasEnough) {
        showError(`Você tem ${cost.balance} créditos, precisa de ${cost.total}`);
        showUpgradeModal();
        return;
    }
    
    // 5. Confirmar com usuário
    if (!confirm(`Custo: ${cost.total} crédito(s). Continuar?`)) {
        return;
    }
    
    // 6. Mostrar loading
    showLoading('Gerando...');
    
    try {
        // 7. Gerar imagem
        const image = await promptForgeAPI.generateImage(prompt);
        
        // 8. Remover fundo (se selecionado)
        if (options.includes('remove_background')) {
            image.url = await removeBackground(image.url);
        }
        
        // 9. Criar mockups
        const mockups = await createMockups(image.url);
        
        // 10. Gerar copy
        const copy = await promptForgeAPI.generateSalesCopy({...});
        
        // 11. DEDUZIR CRÉDITOS
        const deducted = await promptForgeCredits.deductCredits(
            cost.total,
            options.join(' + ')
        );
        
        if (!deducted) {
            throw new Error('Erro ao deduzir créditos');
        }
        
        // 12. Mostrar resultado
        displayResults({ image, mockups, copy });
        
        // 13. Atualizar UI de créditos
        updateCreditsUI();
        
        console.log('✅ Geração completa!');
        
    } catch (error) {
        console.error('Erro:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}
```

---

## 🎨 INTEGRAÇÃO COM OUTRAS PARTES

### Com i18n.js (Parte 1)
```javascript
const lang = i18n.getCurrentLanguage();
const creditsText = promptForgeCredits.formatText(5, lang);
// => '5 créditos' (pt) / '5 credits' (en) / '5 créditos' (es)
```

### Com data.js (Parte 2)
```javascript
// Calcular custo baseado nas opções
const selectedOptions = [];
if (nichoSelecionado) selectedOptions.push('design_png');
if (removerFundo) selectedOptions.push('remove_background');

const cost = promptForgeCredits.calculateTotalCost(selectedOptions);
```

### Com api.js (Parte 3)
```javascript
// Gerar apenas se tiver créditos
if (promptForgeCredits.hasEnoughCredits(1)) {
    const image = await promptForgeAPI.generateImage(prompt);
    await promptForgeCredits.deductCredits(1, 'design_png');
}
```

---

## 📋 PRÓXIMOS PASSOS

Esta é a **PARTE 4 de 8**. Próximos arquivos:
- ✅ PARTE 1: i18n.js (concluído)
- ✅ PARTE 2: data.js expandido (concluído)
- ✅ PARTE 3: api.js (concluído)
- ✅ PARTE 4: credits.js (concluído)
- **PARTE 5**: background.js + mockup.js
- PARTE 6: download.js (ZIP)
- PARTE 7: studio.js (orquestração)
- PARTE 8: app.html + studio.css

---

**Status:** ✅ COMPLETO  
**Banco de dados:** ✅ Schema SQL pronto  
**Integração:** ✅ Supabase + localStorage  
**Reset automático:** ✅ Mensal  
**Histórico:** ✅ Completo  
**RLS:** ✅ Segurança configurada
