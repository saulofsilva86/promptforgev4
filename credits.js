// =============================================
// PROMPTFORGE STUDIO v4.0 - SISTEMA DE CRÉDITOS
// Gerenciamento completo com Supabase
// ✅ Janeiro 2026 - VERSÃO CORRIGIDA
// =============================================

// ==================== CONFIGURAÇÃO ====================

// Supabase (opcional - funciona sem ele)
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
    currentBalance: 100,  // Começar com 100 créditos de teste
    totalUsed: 0,
    lastUpdate: null,
    plan: 'free',
    email: 'teste@promptforge.com',  // Email padrão para teste
    isLoading: false,
    useSupabase: false  // Desabilitado por padrão (fallback para localStorage)
};

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa o sistema de créditos
 * Tenta Supabase primeiro, depois localStorage
 */
async function initCredits() {
    console.log('💳 Inicializando sistema de créditos...');
    
    try {
        // Tentar obter email do auth.js
        let userEmail = 'teste@promptforge.com';
        
        if (window.auth && typeof window.auth.getEmail === 'function') {
            try {
                userEmail = window.auth.getEmail();
                console.log('📧 Email do auth.js:', userEmail);
            } catch (e) {
                console.warn('⚠️ Não foi possível obter email do auth.js');
            }
        }
        
        // Tentar localStorage de sessão
        try {
            const session = localStorage.getItem('promptforge_session');
            if (session) {
                const user = JSON.parse(session);
                if (user.email) {
                    userEmail = user.email;
                    console.log('📧 Email da sessão:', userEmail);
                }
            }
        } catch (e) {
            console.warn('⚠️ Não foi possível ler sessão do localStorage');
        }
        
        creditsState.email = userEmail;
        creditsState.plan = 'free';
        
        // Tentar carregar do Supabase
        let supabaseWorked = false;
        try {
            await loadCreditsFromDatabase();
            supabaseWorked = true;
            creditsState.useSupabase = true;
            console.log('✅ Créditos carregados do Supabase');
        } catch (error) {
            console.warn('⚠️ Supabase não disponível, usando localStorage');
            creditsState.useSupabase = false;
        }
        
        // Se Supabase não funcionou, usar localStorage
        if (!supabaseWorked) {
            loadCreditsFromLocalStorage();
        }
        
        console.log('✅ Sistema de créditos inicializado');
        console.log(`   Saldo: ${creditsState.currentBalance} créditos`);
        console.log(`   Plano: ${creditsState.plan}`);
        console.log(`   Email: ${creditsState.email}`);
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('creditsUpdated', {
            detail: {
                balance: creditsState.currentBalance,
                used: creditsState.totalUsed,
                reason: 'init'
            }
        }));
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao inicializar créditos:', error);
        // Garantir que sempre funcione
        creditsState.currentBalance = 100;
        creditsState.email = 'teste@promptforge.com';
        saveCreditsToLocalStorage();
        return true;
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
            console.log('📝 Criando registro de créditos no Supabase...');
            await createCreditsRecord();
            return;
        }
        
        // Atualizar estado
        const record = data[0];
        creditsState.currentBalance = record.credits_remaining || 0;
        creditsState.totalUsed = record.credits_used_total || 0;
        creditsState.lastUpdate = record.updated_at || record.created_at;
        
        // Salvar no localStorage também (backup)
        saveCreditsToLocalStorage();
        
        // Verificar se precisa resetar (mensal)
        await checkMonthlyReset();
        
    } catch (error) {
        console.error('❌ Erro ao carregar créditos do Supabase:', error);
        throw error; // Propagar para usar localStorage
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
            plan_credits: initialCredits,
            last_reset: new Date().toISOString()
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
        
        if (data && data.length > 0) {
            creditsState.currentBalance = data[0].credits_remaining;
            console.log('✅ Registro criado com sucesso');
        }
        
    } catch (error) {
        console.error('❌ Erro ao criar registro:', error);
        throw error;
    }
}

/**
 * Carrega créditos do localStorage (fallback)
 */
function loadCreditsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('promptforge_credits');
        
        if (saved) {
            const data = JSON.parse(saved);
            creditsState.currentBalance = data.balance || 100;
            creditsState.totalUsed = data.used || 0;
            creditsState.lastUpdate = data.lastUpdate;
            console.log('✅ Créditos carregados do localStorage:', creditsState.currentBalance);
        } else {
            // Primeira vez, criar com 100 créditos
            creditsState.currentBalance = 100;
            creditsState.totalUsed = 0;
            saveCreditsToLocalStorage();
            console.log('✅ Créditos inicializados com 100 (localStorage)');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar do localStorage:', error);
        creditsState.currentBalance = 100;
    }
}

/**
 * Salva créditos no localStorage (backup/fallback)
 */
function saveCreditsToLocalStorage() {
    try {
        const data = {
            balance: creditsState.currentBalance,
            used: creditsState.totalUsed,
            plan: creditsState.plan,
            email: creditsState.email,
            lastUpdate: new Date().toISOString()
        };
        
        localStorage.setItem('promptforge_credits', JSON.stringify(data));
    } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
    }
}

/**
 * Verifica e realiza reset mensal se necessário
 */
async function checkMonthlyReset() {
    // Só fazer reset se não for plano free
    if (creditsState.plan === 'free') {
        return;
    }
    
    if (!creditsState.lastUpdate) {
        return;
    }
    
    const lastUpdate = new Date(creditsState.lastUpdate);
    const now = new Date();
    
    // Verificar se passou 1 mês
    const monthsDiff = (now.getFullYear() - lastUpdate.getFullYear()) * 12 + 
                       (now.getMonth() - lastUpdate.getMonth());
    
    if (monthsDiff >= 1) {
        console.log('🔄 Realizando reset mensal de créditos...');
        
        const newBalance = PLAN_CREDITS[creditsState.plan];
        creditsState.currentBalance = newBalance;
        creditsState.lastUpdate = now.toISOString();
        
        // Atualizar no Supabase se disponível
        if (creditsState.useSupabase) {
            try {
                await updateCreditsInDatabase();
            } catch (error) {
                console.warn('⚠️ Erro ao atualizar no Supabase:', error);
            }
        }
        
        // Sempre salvar no localStorage
        saveCreditsToLocalStorage();
        
        console.log(`✅ Reset realizado: ${newBalance} créditos`);
    }
}

// ==================== VERIFICAÇÃO ====================

/**
 * Verifica se usuário tem créditos suficientes
 * @param {string} action - Ação a ser realizada
 * @returns {Object} Resultado da verificação
 */
function checkCredits(action) {
    const cost = CREDIT_COSTS[action];
    
    if (cost === undefined) {
        console.warn(`⚠️ Ação desconhecida: ${action}`);
        return {
            ok: false,
            error: 'Ação desconhecida',
            balance: creditsState.currentBalance,
            required: 0
        };
    }
    
    const hasEnough = creditsState.currentBalance >= cost;
    
    return {
        ok: hasEnough,
        balance: creditsState.currentBalance,
        required: cost,
        remaining: creditsState.currentBalance - cost
    };
}

/**
 * Verifica se tem créditos suficientes (simples)
 * @param {number} amount - Quantidade necessária
 * @returns {boolean}
 */
function hasEnoughCredits(amount) {
    return creditsState.currentBalance >= amount;
}

/**
 * Calcula custo total de múltiplas ações
 * @param {Array<string>} actions - Lista de ações
 * @returns {number} Custo total
 */
function calculateTotalCost(actions) {
    if (!Array.isArray(actions)) {
        return 0;
    }
    
    return actions.reduce((total, action) => {
        const cost = CREDIT_COSTS[action] || 0;
        return total + cost;
    }, 0);
}

// ==================== DEDUÇÃO ====================

/**
 * Deduz créditos e registra uso
 * @param {number} amount - Quantidade a deduzir
 * @param {string} reason - Motivo (action)
 * @returns {Promise<Object>} Resultado
 */
async function deductCredits(amount, reason = 'unknown') {
    console.log(`💳 Deduzindo ${amount} créditos (${reason})...`);
    
    // Verificar se tem créditos
    if (creditsState.currentBalance < amount) {
        console.error('❌ Créditos insuficientes');
        
        window.dispatchEvent(new CustomEvent('creditsInsufficient', {
            detail: {
                required: amount,
                balance: creditsState.currentBalance
            }
        }));
        
        throw new Error(`Créditos insuficientes. Necessário: ${amount}, Disponível: ${creditsState.currentBalance}`);
    }
    
    // Deduzir
    const previousBalance = creditsState.currentBalance;
    creditsState.currentBalance -= amount;
    creditsState.totalUsed += amount;
    
    console.log(`   ${previousBalance} → ${creditsState.currentBalance} créditos`);
    
    // Salvar no localStorage
    saveCreditsToLocalStorage();
    
    // Tentar salvar no Supabase se disponível
    if (creditsState.useSupabase) {
        try {
            await updateCreditsInDatabase();
            await logUsageToDatabase(amount, reason);
        } catch (error) {
            console.warn('⚠️ Não foi possível atualizar Supabase:', error);
            // Continuar mesmo assim - localStorage já foi salvo
        }
    }
    
    // Disparar evento
    window.dispatchEvent(new CustomEvent('creditsUpdated', {
        detail: {
            balance: creditsState.currentBalance,
            used: amount,
            reason: reason
        }
    }));
    
    console.log('✅ Créditos deduzidos com sucesso');
    
    return {
        success: true,
        balance: creditsState.currentBalance,
        used: amount,
        reason: reason
    };
}

/**
 * Atualiza créditos no Supabase
 */
async function updateCreditsInDatabase() {
    const url = `${SUPABASE_URL}/rest/v1/user_credits?email=eq.${encodeURIComponent(creditsState.email)}`;
    
    const payload = {
        credits_remaining: creditsState.currentBalance,
        credits_used_total: creditsState.totalUsed,
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
        throw new Error(`Erro ao atualizar: ${response.status}`);
    }
}

/**
 * Registra uso no histórico (Supabase)
 */
async function logUsageToDatabase(amount, action) {
    const url = `${SUPABASE_URL}/rest/v1/credit_usage`;
    
    const payload = {
        email: creditsState.email,
        credits_used: amount,
        action: action,
        balance_after: creditsState.currentBalance,
        metadata: {
            timestamp: new Date().toISOString(),
            source: 'web'
        }
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Erro ao registrar uso: ${response.status}`);
    }
}

// ==================== ADIÇÃO ====================

/**
 * Adiciona créditos (compra, bônus, etc)
 * @param {number} amount - Quantidade a adicionar
 * @param {string} reason - Motivo
 * @returns {Promise<Object>} Resultado
 */
async function addCredits(amount, reason = 'manual') {
    console.log(`💳 Adicionando ${amount} créditos (${reason})...`);
    
    const previousBalance = creditsState.currentBalance;
    creditsState.currentBalance += amount;
    
    console.log(`   ${previousBalance} → ${creditsState.currentBalance} créditos`);
    
    // Salvar
    saveCreditsToLocalStorage();
    
    if (creditsState.useSupabase) {
        try {
            await updateCreditsInDatabase();
            await logUsageToDatabase(amount, reason);
        } catch (error) {
            console.warn('⚠️ Não foi possível atualizar Supabase:', error);
        }
    }
    
    // Evento
    window.dispatchEvent(new CustomEvent('creditsAdded', {
        detail: {
            balance: creditsState.currentBalance,
            added: amount,
            reason: reason
        }
    }));
    
    console.log('✅ Créditos adicionados');
    
    return {
        success: true,
        balance: creditsState.currentBalance,
        added: amount
    };
}

// ==================== GETTERS ====================

/**
 * Obtém saldo atual
 * @returns {number} Saldo
 */
function getBalance() {
    return creditsState.currentBalance;
}

/**
 * Obtém plano atual
 * @returns {string} Plano
 */
function getPlan() {
    return creditsState.plan;
}

/**
 * Obtém informações completas
 * @returns {Object} Estado completo
 */
function getInfo() {
    return {
        balance: creditsState.currentBalance,
        used: creditsState.totalUsed,
        plan: creditsState.plan,
        email: creditsState.email,
        lastUpdate: creditsState.lastUpdate,
        useSupabase: creditsState.useSupabase
    };
}

/**
 * Obtém histórico de uso (do localStorage)
 * @param {number} limit - Limite de registros
 * @returns {Array} Histórico
 */
function getHistory(limit = 50) {
    try {
        const history = localStorage.getItem('promptforge_credits_history');
        if (!history) return [];
        
        const data = JSON.parse(history);
        return data.slice(0, limit);
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
        return [];
    }
}

/**
 * Obtém estatísticas de uso
 * @returns {Object} Estatísticas
 */
function getStats() {
    return {
        balance: creditsState.currentBalance,
        used: creditsState.totalUsed,
        plan: creditsState.plan,
        percentUsed: creditsState.totalUsed > 0 ? 
            Math.round((creditsState.totalUsed / (creditsState.totalUsed + creditsState.currentBalance)) * 100) : 0
    };
}

/**
 * Formata texto com valores
 */
function formatText(key, values = {}) {
    const texts = {
        pt: {
            insufficient: `Créditos insuficientes. Necessário: ${values.required}, Disponível: ${values.balance}`,
            deducted: `${values.amount} créditos deduzidos. Saldo: ${values.balance}`,
            added: `${values.amount} créditos adicionados. Saldo: ${values.balance}`
        },
        en: {
            insufficient: `Insufficient credits. Required: ${values.required}, Available: ${values.balance}`,
            deducted: `${values.amount} credits deducted. Balance: ${values.balance}`,
            added: `${values.amount} credits added. Balance: ${values.balance}`
        }
    };
    
    const lang = localStorage.getItem('promptforge_language') || 'pt';
    return texts[lang][key] || key;
}

// ==================== EXPORTAÇÃO ====================

window.promptForgeCredits = {
    // Inicialização
    init: initCredits,
    
    // Verificação
    checkCredits: checkCredits,
    hasEnoughCredits: hasEnoughCredits,
    calculateTotalCost: calculateTotalCost,
    
    // Dedução e adição
    deductCredits: deductCredits,
    addCredits: addCredits,
    
    // Getters
    getBalance: getBalance,
    getPlan: getPlan,
    getInfo: getInfo,
    getHistory: getHistory,
    getStats: getStats,
    
    // Utilidades
    formatText: formatText,
    
    // Constantes
    COSTS: CREDIT_COSTS,
    PLAN_CREDITS: PLAN_CREDITS,
    
    // Estado (read-only)
    get state() {
        return {
            balance: creditsState.currentBalance,
            used: creditsState.totalUsed,
            plan: creditsState.plan,
            email: creditsState.email
        };
    }
};

console.log('✅ credits.js v4.0 carregado (VERSÃO CORRIGIDA)');
