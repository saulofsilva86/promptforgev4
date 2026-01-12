// =============================================
// PROMPTFORGE STUDIO v4.0 - SISTEMA DE CRÉDITOS
// Gerenciamento completo com Supabase
// ✅ Janeiro 2026
// =============================================

// ==================== CONFIGURAÇÃO ====================

// Importar do auth.js (já carregado)
const SUPABASE_URL = 'https://hefjslaecdytmsinvoek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2aW5lcXNqYm5vYnJicHpnZ3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMjcxMjIsImV4cCI6MjA4MzgwMzEyMn0.vwxK1EEqXTNVvNupEGo0d9dJ7-XTMs-48--BzVfp7p0';

// Custos por funcionalidade (em créditos)
const CREDIT_COSTS = {
    design_png: 1,           // Estampa PNG
    mockups: 0,              // Mockups (inclusos)
    sales_copy: 0,           // Copy de vendas (incluso)
    remove_background: 1,    // Remover fundo
    upscale_4k: 1,          // Upscale para 4K
    social_post: 1,         // Post social media
    
    // Pacotes
    complete_package: 2     // Design + Remove BG + Upscale + Social
};

// Planos e créditos
const PLAN_CREDITS = {
    free: 5,           // 5 créditos de teste
    mensal: 30,        // 30 créditos/mês
    anual: 100         // 100 créditos/mês (4 meses grátis)
};

// ==================== ESTADO GLOBAL ====================
let creditsState = {
    currentBalance: 0,
    totalUsed: 0,
    lastUpdate: null,
    plan: 'free',
    email: null,
    isLoading: false
};

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa o sistema de créditos
 * Carrega saldo do usuário do Supabase
 */
async function initCredits() {
    console.log('💳 Inicializando sistema de créditos...');
    
    try {
        // Obter usuário logado
        const session = localStorage.getItem('promptforge_session');
        if (!session) {
            console.warn('⚠️ Usuário não autenticado');
            return false;
        }
        
        const user = JSON.parse(session);
        creditsState.email = user.email;
        creditsState.plan = user.plan || 'free';
        
        // Carregar saldo do Supabase
        await loadCreditsFromDatabase();
        
        console.log('✅ Sistema de créditos inicializado');
        console.log(`   Saldo: ${creditsState.currentBalance} créditos`);
        console.log(`   Plano: ${creditsState.plan}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao inicializar créditos:', error);
        return false;
    }
}

/**
 * Carrega saldo de créditos do Supabase
 */
async function loadCreditsFromDatabase() {
    creditsState.isLoading = true;
    
    try {
        // Buscar na tabela user_credits
        const url = `${SUPABASE_URL}/rest/v1/user_credits?email=eq.${encodeURIComponent(creditsState.email)}&select=*`;
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Supabase erro ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            // Usuário não tem registro ainda, criar
            console.log('📝 Criando registro de créditos...');
            await createCreditsRecord();
            return;
        }
        
        // Atualizar estado
        const record = data[0];
        creditsState.currentBalance = record.credits_remaining || 0;
        creditsState.totalUsed = record.credits_used_total || 0;
        creditsState.lastUpdate = record.updated_at || record.created_at;
        
        // Verificar se precisa resetar (mensal)
        await checkMonthlyReset();
        
    } catch (error) {
        console.error('❌ Erro ao carregar créditos:', error);
        // Fallback: usar localStorage
        loadCreditsFromLocalStorage();
    } finally {
        creditsState.isLoading = false;
    }
}

/**
 * Cria registro inicial de créditos no Supabase
 */
async function createCreditsRecord() {
    try {
        const initialCredits = PLAN_CREDITS[creditsState.plan] || PLAN_CREDITS.free;
        
        const url = `${SUPABASE_URL}/rest/v1/user_credits`;
        
        const payload = {
            email: creditsState.email,
            credits_remaining: initialCredits,
            credits_used_total: 0,
            plan: creditsState.plan,
            last_reset: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao criar registro: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Registro de créditos criado:', data);
        
        // Atualizar estado
        creditsState.currentBalance = initialCredits;
        creditsState.totalUsed = 0;
        
    } catch (error) {
        console.error('❌ Erro ao criar registro:', error);
        throw error;
    }
}

/**
 * Verifica se precisa resetar créditos mensais
 */
async function checkMonthlyReset() {
    try {
        // Apenas para planos pagos
        if (creditsState.plan === 'free') return;
        
        // Buscar data do último reset
        const url = `${SUPABASE_URL}/rest/v1/user_credits?email=eq.${encodeURIComponent(creditsState.email)}&select=last_reset`;
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        if (data.length === 0) return;
        
        const lastReset = new Date(data[0].last_reset);
        const now = new Date();
        
        // Passou 1 mês?
        const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 
                         + (now.getMonth() - lastReset.getMonth());
        
        if (monthsDiff >= 1) {
            console.log('🔄 Resetando créditos mensais...');
            await resetMonthlyCredits();
        }
        
    } catch (error) {
        console.warn('⚠️ Erro ao verificar reset mensal:', error);
    }
}

/**
 * Reseta créditos mensais
 */
async function resetMonthlyCredits() {
    try {
        const newCredits = PLAN_CREDITS[creditsState.plan] || 30;
        
        const url = `${SUPABASE_URL}/rest/v1/user_credits?email=eq.${encodeURIComponent(creditsState.email)}`;
        
        const payload = {
            credits_remaining: newCredits,
            last_reset: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            creditsState.currentBalance = newCredits;
            console.log(`✅ Créditos resetados: ${newCredits}`);
            
            // Disparar evento
            window.dispatchEvent(new CustomEvent('creditsReset', {
                detail: { newBalance: newCredits }
            }));
        }
        
    } catch (error) {
        console.error('❌ Erro ao resetar créditos:', error);
    }
}

// ==================== VERIFICAÇÃO DE CRÉDITOS ====================

/**
 * Verifica se o usuário tem créditos suficientes
 * @param {number} amount - Quantidade de créditos necessária
 * @returns {boolean} Se tem créditos suficientes
 */
function hasEnoughCredits(amount) {
    return creditsState.currentBalance >= amount;
}

/**
 * Verifica créditos para uma ação específica
 * @param {string} action - Nome da ação (ex: 'design_png', 'remove_background')
 * @returns {Object} {ok, cost, balance, message}
 */
function checkCredits(action) {
    const cost = CREDIT_COSTS[action] || 0;
    const ok = hasEnoughCredits(cost);
    
    return {
        ok: ok,
        cost: cost,
        balance: creditsState.currentBalance,
        message: ok 
            ? `✅ Você tem ${creditsState.currentBalance} créditos` 
            : `❌ Créditos insuficientes. Você tem ${creditsState.currentBalance}, precisa de ${cost}`
    };
}

/**
 * Calcula custo total de múltiplas ações
 * @param {string[]} actions - Array de ações
 * @returns {Object} {total, breakdown, hasEnough}
 */
function calculateTotalCost(actions) {
    let total = 0;
    const breakdown = {};
    
    actions.forEach(action => {
        const cost = CREDIT_COSTS[action] || 0;
        breakdown[action] = cost;
        total += cost;
    });
    
    return {
        total: total,
        breakdown: breakdown,
        hasEnough: hasEnoughCredits(total),
        balance: creditsState.currentBalance,
        remaining: creditsState.currentBalance - total
    };
}

// ==================== DEDUÇÃO DE CRÉDITOS ====================

/**
 * Deduz créditos do saldo
 * @param {number} amount - Quantidade a deduzir
 * @param {string} reason - Motivo da dedução
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function deductCredits(amount, reason = '') {
    console.log(`💸 Deduzindo ${amount} crédito(s)...`);
    
    // Validar
    if (amount <= 0) {
        console.warn('⚠️ Quantidade inválida:', amount);
        return false;
    }
    
    if (!hasEnoughCredits(amount)) {
        console.error('❌ Créditos insuficientes');
        
        // Disparar evento de erro
        window.dispatchEvent(new CustomEvent('creditsInsufficient', {
            detail: { 
                required: amount, 
                balance: creditsState.currentBalance 
            }
        }));
        
        return false;
    }
    
    try {
        // Atualizar no Supabase
        const newBalance = creditsState.currentBalance - amount;
        const newTotalUsed = creditsState.totalUsed + amount;
        
        const url = `${SUPABASE_URL}/rest/v1/user_credits?email=eq.${encodeURIComponent(creditsState.email)}`;
        
        const payload = {
            credits_remaining: newBalance,
            credits_used_total: newTotalUsed,
            updated_at: new Date().toISOString()
        };
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao deduzir: ${response.status}`);
        }
        
        // Atualizar estado local
        creditsState.currentBalance = newBalance;
        creditsState.totalUsed = newTotalUsed;
        creditsState.lastUpdate = new Date().toISOString();
        
        // Salvar também no localStorage (backup)
        saveCreditsToLocalStorage();
        
        // Registrar no histórico
        await logCreditUsage(amount, reason);
        
        // Disparar evento de atualização
        window.dispatchEvent(new CustomEvent('creditsUpdated', {
            detail: { 
                balance: newBalance, 
                used: amount,
                reason: reason
            }
        }));
        
        console.log(`✅ ${amount} crédito(s) deduzido(s). Novo saldo: ${newBalance}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao deduzir créditos:', error);
        
        // Fallback: deduzir apenas localmente
        deductCreditsLocally(amount);
        
        return false;
    }
}

/**
 * Deduz créditos apenas localmente (fallback)
 */
function deductCreditsLocally(amount) {
    creditsState.currentBalance -= amount;
    creditsState.totalUsed += amount;
    saveCreditsToLocalStorage();
    
    console.warn('⚠️ Créditos deduzidos apenas localmente');
}

/**
 * Registra uso no histórico
 */
async function logCreditUsage(amount, reason) {
    try {
        const url = `${SUPABASE_URL}/rest/v1/credit_usage`;
        
        const payload = {
            email: creditsState.email,
            credits_used: amount,
            action: reason,
            balance_after: creditsState.currentBalance,
            created_at: new Date().toISOString()
        };
        
        // Fire and forget (não bloqueia)
        fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        }).catch(err => console.warn('⚠️ Erro ao registrar histórico:', err));
        
    } catch (error) {
        console.warn('⚠️ Erro ao registrar no histórico:', error);
    }
}

// ==================== ADIÇÃO DE CRÉDITOS ====================

/**
 * Adiciona créditos ao saldo (admin/compra)
 * @param {number} amount - Quantidade a adicionar
 * @param {string} reason - Motivo (ex: 'purchase', 'bonus', 'refund')
 */
async function addCredits(amount, reason = 'manual') {
    console.log(`💰 Adicionando ${amount} crédito(s)...`);
    
    if (amount <= 0) return false;
    
    try {
        const newBalance = creditsState.currentBalance + amount;
        
        const url = `${SUPABASE_URL}/rest/v1/user_credits?email=eq.${encodeURIComponent(creditsState.email)}`;
        
        const payload = {
            credits_remaining: newBalance,
            updated_at: new Date().toISOString()
        };
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            creditsState.currentBalance = newBalance;
            saveCreditsToLocalStorage();
            
            console.log(`✅ ${amount} crédito(s) adicionado(s). Novo saldo: ${newBalance}`);
            
            // Disparar evento
            window.dispatchEvent(new CustomEvent('creditsAdded', {
                detail: { balance: newBalance, added: amount, reason: reason }
            }));
            
            return true;
        }
        
    } catch (error) {
        console.error('❌ Erro ao adicionar créditos:', error);
    }
    
    return false;
}

// ==================== HISTÓRICO ====================

/**
 * Busca histórico de uso de créditos
 * @param {number} limit - Quantidade de registros
 * @returns {Promise<Array>} Array de registros
 */
async function getCreditHistory(limit = 50) {
    try {
        const url = `${SUPABASE_URL}/rest/v1/credit_usage?email=eq.${encodeURIComponent(creditsState.email)}&order=created_at.desc&limit=${limit}`;
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar histórico: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('❌ Erro ao buscar histórico:', error);
        return [];
    }
}

/**
 * Obtém estatísticas de uso
 */
async function getCreditStats() {
    try {
        const history = await getCreditHistory(1000); // Último mês
        
        const stats = {
            totalUsed: creditsState.totalUsed,
            currentBalance: creditsState.currentBalance,
            thisMonth: 0,
            thisWeek: 0,
            today: 0,
            byAction: {},
            avgPerDay: 0
        };
        
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        history.forEach(record => {
            const date = new Date(record.created_at);
            
            if (date >= monthStart) stats.thisMonth += record.credits_used;
            if (date >= weekStart) stats.thisWeek += record.credits_used;
            if (date >= dayStart) stats.today += record.credits_used;
            
            // Por ação
            const action = record.action || 'unknown';
            stats.byAction[action] = (stats.byAction[action] || 0) + record.credits_used;
        });
        
        // Média por dia no mês
        const daysInMonth = now.getDate();
        stats.avgPerDay = (stats.thisMonth / daysInMonth).toFixed(1);
        
        return stats;
        
    } catch (error) {
        console.error('❌ Erro ao calcular estatísticas:', error);
        return null;
    }
}

// ==================== FALLBACK LOCAL STORAGE ====================

function saveCreditsToLocalStorage() {
    try {
        localStorage.setItem('promptforge_credits', JSON.stringify({
            balance: creditsState.currentBalance,
            used: creditsState.totalUsed,
            plan: creditsState.plan,
            lastUpdate: creditsState.lastUpdate
        }));
    } catch (error) {
        console.warn('⚠️ Erro ao salvar no localStorage:', error);
    }
}

function loadCreditsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('promptforge_credits');
        if (saved) {
            const data = JSON.parse(saved);
            creditsState.currentBalance = data.balance || 0;
            creditsState.totalUsed = data.used || 0;
            creditsState.plan = data.plan || 'free';
            creditsState.lastUpdate = data.lastUpdate;
            
            console.log('📦 Créditos carregados do localStorage (fallback)');
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar do localStorage:', error);
    }
}

// ==================== HELPERS ====================

/**
 * Obtém saldo atual
 */
function getBalance() {
    return creditsState.currentBalance;
}

/**
 * Obtém plano atual
 */
function getPlan() {
    return creditsState.plan;
}

/**
 * Obtém informação completa do estado
 */
function getCreditsInfo() {
    return {
        balance: creditsState.currentBalance,
        totalUsed: creditsState.totalUsed,
        plan: creditsState.plan,
        planCredits: PLAN_CREDITS[creditsState.plan],
        lastUpdate: creditsState.lastUpdate,
        email: creditsState.email,
        costs: CREDIT_COSTS
    };
}

/**
 * Formata texto de créditos com tradução
 */
function formatCreditsText(amount, lang = 'pt') {
    const texts = {
        pt: amount === 1 ? 'crédito' : 'créditos',
        en: amount === 1 ? 'credit' : 'credits',
        es: amount === 1 ? 'crédito' : 'créditos'
    };
    
    return `${amount} ${texts[lang] || texts.pt}`;
}

// ==================== EXPORTAÇÃO ====================
window.promptForgeCredits = {
    // Inicialização
    init: initCredits,
    
    // Verificação
    checkCredits: checkCredits,
    hasEnoughCredits: hasEnoughCredits,
    calculateTotalCost: calculateTotalCost,
    
    // Operações
    deductCredits: deductCredits,
    addCredits: addCredits,
    
    // Consultas
    getBalance: getBalance,
    getPlan: getPlan,
    getInfo: getCreditsInfo,
    getHistory: getCreditHistory,
    getStats: getCreditStats,
    
    // Helpers
    formatText: formatCreditsText,
    
    // Constantes
    COSTS: CREDIT_COSTS,
    PLAN_CREDITS: PLAN_CREDITS,
    
    // Estado (read-only)
    get state() { return { ...creditsState }; }
};

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Aguardar auth carregar primeiro
        setTimeout(() => {
            initCredits();
            console.log('✅ credits.js v4.0 carregado');
        }, 500);
    });
} else {
    setTimeout(() => {
        initCredits();
        console.log('✅ credits.js v4.0 carregado');
    }, 500);
}
