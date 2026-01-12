# 🔗 INTEGRAÇÕES EXISTENTES - PRESERVAÇÃO OBRIGATÓRIA

> **ATENÇÃO:** Este documento complementa a documentação principal (v4.0).  
> **REGRA DE OURO:** Nenhuma recodificação pode quebrar as integrações listadas aqui.

---

## 📋 ÍNDICE

1. [Google Sheets - Banco de Ideias](#1-google-sheets---banco-de-ideias)
2. [Supabase - Auth e Database](#2-supabase---auth-e-database)
3. [Vercel - Hospedagem](#3-vercel---hospedagem)
4. [GitHub - Versionamento](#4-github---versionamento)
5. [Kiwify - Pagamentos](#5-kiwify---pagamentos)
6. [Checklist de Validação](#6-checklist-de-validação)
7. [Testes de Integração](#7-testes-de-integração)

---

## 1. GOOGLE SHEETS - BANCO DE IDEIAS

### 1.1 O que faz
- Armazena o banco de ideias (8.193+ ideias)
- Fornece ideias aleatórias por nicho e categoria
- Fallback para `BANCO_IDEIAS` local se offline

### 1.2 Endpoint Atual
```
https://script.google.com/macros/s/AKfycbwdQRWNtAydhEjuGlBB_-p0jd3qWbl8FbjBVSvKFI15EnRDTLjIsENGHaSTD3mdVTPp/exec
```

### 1.3 Função no Código (data.js)
```javascript
async function carregarDadosExternos() {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    const data = await response.json();
    // Processa e retorna ideias
    return data;
  } catch (error) {
    console.warn('Google Sheets offline, usando fallback local');
    return BANCO_IDEIAS; // Fallback
  }
}
```

### 1.4 Estrutura da Planilha
```
| Coluna A | Coluna B   | Coluna C  | Coluna D |
|----------|------------|-----------|----------|
| nicho    | categoria  | ideia_pt  | ideia_en |
| cerveja  | acao       | Brinde... | Toast... |
| cerveja  | humor      | Ressaca...| Hangover.|
```

### 1.5 O que PRESERVAR na v4.0
```javascript
// ❌ NÃO ALTERAR:
- URL do endpoint
- Estrutura da função carregarDadosExternos()
- Fallback para BANCO_IDEIAS
- Formato de retorno dos dados

// ✅ PODE ADICIONAR:
- Novas colunas (ideia_es para espanhol)
- Novos nichos
- Cache local para performance
```

### 1.6 Teste de Validação
```javascript
// Executar no console do browser
async function testarGoogleSheets() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwdQRWNtAydhEjuGlBB_-p0jd3qWbl8FbjBVSvKFI15EnRDTLjIsENGHaSTD3mdVTPp/exec');
    const data = await response.json();
    console.log('✅ Google Sheets OK:', data.length, 'ideias carregadas');
    return true;
  } catch (error) {
    console.error('❌ Google Sheets FALHOU:', error);
    return false;
  }
}
testarGoogleSheets();
```

---

## 2. SUPABASE - AUTH E DATABASE

### 2.1 O que faz
- Autenticação de usuários por email
- Armazena perfis de usuários
- Armazena assinaturas/planos
- Armazena métricas de uso (usage_logs)
- Webhook para Kiwify

### 2.2 Configuração Atual
```javascript
// config/supabase.js ou auth.js
const SUPABASE_URL = 'https://[SEU_PROJECT_ID].supabase.co';
const SUPABASE_ANON_KEY = '[SUA_ANON_KEY]';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 2.3 Tabelas Existentes

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'inactive', -- active, cancelled, expired
  plan TEXT DEFAULT 'free',       -- free, mensal, anual
  credits INTEGER DEFAULT 5,
  kiwify_order_id TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### usage_logs (se existir)
```sql
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.4 Funções no Código (auth.js)
```javascript
// Validar sessão
async function verificarAutenticacao() {
  const session = localStorage.getItem('promptforge_session');
  if (!session) {
    window.location.href = 'index.html';
    return false;
  }
  
  // Revalidar no servidor
  const { data, error } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('email', JSON.parse(session).email)
    .single();
  
  if (error || data.status !== 'active') {
    localStorage.removeItem('promptforge_session');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Login
async function fazerLogin(email) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('email', email)
    .eq('status', 'active')
    .single();
  
  if (data) {
    localStorage.setItem('promptforge_session', JSON.stringify(data));
    return true;
  }
  return false;
}
```

### 2.5 O que PRESERVAR na v4.0
```javascript
// ❌ NÃO ALTERAR:
- SUPABASE_URL e SUPABASE_ANON_KEY
- Estrutura das tabelas profiles e subscriptions
- Função verificarAutenticacao()
- Função fazerLogin()
- Lógica de sessão no localStorage
- Chave 'promptforge_session'

// ✅ PODE ADICIONAR:
- Nova tabela user_credits (para sistema de créditos v4)
- Nova tabela credit_usage (para analytics v4)
- Novas colunas em subscriptions (se necessário)
- Novas funções de créditos
```

### 2.6 Nova Tabela para v4.0 (ADICIONAR, não substituir)
```sql
-- Adicionar ao Supabase (não remove nada existente)
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  credits_remaining INTEGER DEFAULT 5,
  credits_used_total INTEGER DEFAULT 0,
  last_reset TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sincronizar com subscriptions existente
INSERT INTO user_credits (email, credits_remaining)
SELECT email, 
  CASE 
    WHEN plan = 'anual' THEN 100
    WHEN plan = 'mensal' THEN 30
    ELSE 5
  END
FROM subscriptions
WHERE status = 'active'
ON CONFLICT (email) DO NOTHING;
```

### 2.7 Teste de Validação
```javascript
// Executar no console do browser
async function testarSupabase() {
  try {
    // Testar conexão
    const { data, error } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Supabase OK: Conexão estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Supabase FALHOU:', error);
    return false;
  }
}
testarSupabase();
```

---

## 3. VERCEL - HOSPEDAGEM

### 3.1 O que faz
- Hospeda os arquivos estáticos (HTML, CSS, JS)
- Deploy automático via GitHub
- CDN global para performance
- SSL automático

### 3.2 Configuração Atual
```
Projeto: promptforgev2
URL: https://promptforgev2.vercel.app
Branch de deploy: main (ou master)
```

### 3.3 Arquivos de Configuração

#### vercel.json (se existir)
```json
{
  "version": 2,
  "builds": [
    { "src": "**/*", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

### 3.4 Variáveis de Ambiente (se usar)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
GEMINI_API_KEY=xxx (nova para v4)
FAL_API_KEY=xxx (nova para v4)
```

### 3.5 O que PRESERVAR na v4.0
```
// ❌ NÃO ALTERAR:
- Nome do projeto no Vercel
- URL de produção
- Conexão com GitHub
- Branch de deploy

// ✅ PODE ADICIONAR:
- Novas variáveis de ambiente
- Novos arquivos
- Atualizar vercel.json se necessário
```

### 3.6 Processo de Deploy Seguro
```bash
# 1. Criar branch de desenvolvimento
git checkout -b feature/v4-studio

# 2. Fazer todas as alterações na branch
git add .
git commit -m "feat: PromptForge Studio v4.0"

# 3. Testar localmente
# Abrir index.html no browser e testar tudo

# 4. Fazer merge apenas quando tudo funcionar
git checkout main
git merge feature/v4-studio

# 5. Push para deploy automático
git push origin main
```

---

## 4. GITHUB - VERSIONAMENTO

### 4.1 O que faz
- Versionamento do código
- Backup do projeto
- Trigger de deploy no Vercel

### 4.2 Repositório Atual
```
Repositório: [seu-usuario]/promptforge (ou similar)
Branch principal: main
Visibilidade: Privado (recomendado)
```

### 4.3 Estrutura de Branches
```
main (ou master)     → Produção (deploy automático)
├── feature/v4-*     → Novas features v4
├── fix/*            → Correções de bugs
└── hotfix/*         → Correções urgentes
```

### 4.4 O que PRESERVAR na v4.0
```
// ❌ NÃO ALTERAR:
- Nome do repositório
- Branch principal
- Conexão com Vercel
- .gitignore existente

// ✅ PODE ADICIONAR:
- Novas branches de feature
- Novos arquivos
- Atualizar .gitignore se necessário
```

### 4.5 .gitignore Recomendado
```gitignore
# Dependências
node_modules/

# Ambiente
.env
.env.local
*.env

# API Keys (NUNCA commitar)
config/api-keys.js
secrets.js

# Build
dist/
build/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
```

### 4.6 Workflow de Desenvolvimento Seguro
```bash
# ANTES de qualquer alteração:
git status
git pull origin main

# CRIAR branch para a feature:
git checkout -b feature/v4-studio

# COMMITAR frequentemente:
git add .
git commit -m "feat(studio): adiciona sistema de idiomas"

# PUSH para backup:
git push origin feature/v4-studio

# SOMENTE após testes completos:
git checkout main
git merge feature/v4-studio
git push origin main  # Dispara deploy no Vercel
```

---

## 5. KIWIFY - PAGAMENTOS

### 5.1 O que faz
- Processa pagamentos de assinaturas
- Envia webhook para ativar usuários
- Gerencia planos (mensal, anual)

### 5.2 Webhook Configurado
```
URL do Webhook: https://[SEU_PROJECT_ID].supabase.co/functions/v1/kiwify-webhook
Eventos: Compra aprovada, Reembolso, Cancelamento
```

### 5.3 Estrutura do Webhook (Edge Function no Supabase)
```javascript
// supabase/functions/kiwify-webhook/index.ts
export async function handler(req) {
  const body = await req.json();
  
  // Verificar assinatura do webhook
  // ...
  
  // Processar evento
  if (body.event === 'purchase_approved') {
    await supabase
      .from('subscriptions')
      .upsert({
        email: body.customer.email,
        status: 'active',
        plan: body.product.name.includes('Anual') ? 'anual' : 'mensal',
        kiwify_order_id: body.order_id,
        started_at: new Date().toISOString(),
        expires_at: calculateExpiry(body.product.name)
      });
  }
  
  return new Response('OK', { status: 200 });
}
```

### 5.4 O que PRESERVAR na v4.0
```
// ❌ NÃO ALTERAR:
- URL do webhook
- Lógica de processamento de eventos
- Mapeamento de planos
- Estrutura de dados enviada para subscriptions

// ✅ PODE ADICIONAR:
- Sincronização com nova tabela user_credits
- Logs adicionais
- Novos planos (se necessário)
```

### 5.5 Atualização do Webhook para v4.0
```javascript
// Adicionar ao webhook existente (não substituir)
if (body.event === 'purchase_approved') {
  // Código existente...
  
  // NOVO: Sincronizar créditos
  const credits = body.product.name.includes('Anual') ? 100 : 30;
  await supabase
    .from('user_credits')
    .upsert({
      email: body.customer.email,
      credits_remaining: credits,
      credits_used_total: 0,
      last_reset: new Date().toISOString()
    });
}
```

---

## 6. CHECKLIST DE VALIDAÇÃO

### 6.1 Antes de Cada Deploy

```
GOOGLE SHEETS:
□ Endpoint ainda responde?
□ Ideias carregam corretamente?
□ Fallback funciona se offline?

SUPABASE:
□ Login funciona?
□ Sessão persiste?
□ Verificação de status funciona?
□ Tabelas existentes intactas?

VERCEL:
□ Build passa sem erros?
□ Assets carregam (CSS, JS)?
□ Rotas funcionam?

GITHUB:
□ Código commitado?
□ Branch correta?
□ .gitignore protegendo secrets?

KIWIFY:
□ Webhook ainda configurado?
□ Teste de compra passa?
```

### 6.2 Após Cada Deploy

```
TESTE FUNCIONAL COMPLETO:
□ Abrir https://promptforgev2.vercel.app
□ Fazer login com email válido
□ Selecionar nicho
□ Selecionar estilo
□ Gerar prompt/estampa
□ Verificar se salva no histórico
□ Verificar se créditos deduzem
□ Testar logout
□ Testar em mobile
```

---

## 7. TESTES DE INTEGRAÇÃO

### 7.1 Script de Teste Completo

```javascript
// Colar no console do browser após deploy

async function testarTodasIntegracoes() {
  console.log('🧪 INICIANDO TESTES DE INTEGRAÇÃO...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Teste 1: Google Sheets
  console.log('1️⃣ Testando Google Sheets...');
  try {
    const gsResponse = await fetch('https://script.google.com/macros/s/AKfycbwdQRWNtAydhEjuGlBB_-p0jd3qWbl8FbjBVSvKFI15EnRDTLjIsENGHaSTD3mdVTPp/exec');
    if (gsResponse.ok) {
      const data = await gsResponse.json();
      console.log(`   ✅ Google Sheets OK (${Array.isArray(data) ? data.length : 'N/A'} registros)`);
      passed++;
    } else {
      throw new Error('Response not OK');
    }
  } catch (e) {
    console.log('   ❌ Google Sheets FALHOU:', e.message);
    failed++;
  }
  
  // Teste 2: Supabase
  console.log('2️⃣ Testando Supabase...');
  try {
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase.from('subscriptions').select('count').limit(1);
      if (!error) {
        console.log('   ✅ Supabase OK');
        passed++;
      } else {
        throw error;
      }
    } else {
      console.log('   ⚠️ Supabase não carregado (verificar manualmente)');
    }
  } catch (e) {
    console.log('   ❌ Supabase FALHOU:', e.message);
    failed++;
  }
  
  // Teste 3: LocalStorage (Sessão)
  console.log('3️⃣ Testando LocalStorage...');
  try {
    const session = localStorage.getItem('promptforge_session');
    if (session) {
      const parsed = JSON.parse(session);
      console.log(`   ✅ Sessão OK (${parsed.email})`);
      passed++;
    } else {
      console.log('   ⚠️ Sem sessão ativa (fazer login para testar)');
    }
  } catch (e) {
    console.log('   ❌ LocalStorage FALHOU:', e.message);
    failed++;
  }
  
  // Teste 4: Service Worker
  console.log('4️⃣ Testando Service Worker...');
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('   ✅ Service Worker OK');
        passed++;
      } else {
        console.log('   ⚠️ Service Worker não registrado');
      }
    }
  } catch (e) {
    console.log('   ❌ Service Worker FALHOU:', e.message);
    failed++;
  }
  
  // Teste 5: Variáveis Globais
  console.log('5️⃣ Testando Variáveis Globais...');
  const globals = ['NICHOS', 'ESTILOS', 'PALETAS', 'state'];
  let globalsOk = true;
  for (const g of globals) {
    if (typeof window[g] === 'undefined') {
      console.log(`   ⚠️ ${g} não definido`);
      globalsOk = false;
    }
  }
  if (globalsOk) {
    console.log('   ✅ Variáveis Globais OK');
    passed++;
  } else {
    failed++;
  }
  
  // Resultado
  console.log('\n' + '='.repeat(40));
  console.log(`📊 RESULTADO: ${passed} passou, ${failed} falhou`);
  console.log('='.repeat(40));
  
  if (failed === 0) {
    console.log('🎉 TODAS AS INTEGRAÇÕES FUNCIONANDO!');
  } else {
    console.log('⚠️ VERIFICAR INTEGRAÇÕES COM FALHA');
  }
  
  return { passed, failed };
}

// Executar
testarTodasIntegracoes();
```

### 7.2 Teste Manual Obrigatório

Após cada deploy, executar manualmente:

```
1. FLUXO DE LOGIN:
   □ Acessar index.html
   □ Inserir email válido
   □ Clicar em "Entrar"
   □ Verificar redirecionamento para app.html

2. FLUXO DE CRIAÇÃO:
   □ Selecionar nicho
   □ Selecionar estilo
   □ Selecionar paleta
   □ Inserir ideia ou clicar "Aleatória"
   □ Clicar "Gerar"
   □ Verificar resultado

3. FLUXO DE PERSISTÊNCIA:
   □ Verificar histórico salvo
   □ Favoritar um item
   □ Fechar e reabrir o app
   □ Verificar se histórico e favoritos persistem

4. FLUXO MOBILE:
   □ Abrir em celular
   □ Repetir testes 1-3
   □ Verificar responsividade
```

---

## 📋 RESUMO: REGRAS DE OURO

```
🔴 NUNCA ALTERAR:
├── URLs de endpoints (Google Sheets, Supabase, Kiwify)
├── Nomes de tabelas existentes no Supabase
├── Estrutura de funções de autenticação
├── Chaves de localStorage existentes
└── Conexão GitHub ↔ Vercel

🟡 ALTERAR COM CUIDADO:
├── Adicionar novas colunas em tabelas
├── Adicionar novas funções
├── Modificar UI existente
└── Atualizar Service Worker

🟢 PODE ADICIONAR LIVREMENTE:
├── Novos arquivos
├── Novas tabelas no Supabase
├── Novas variáveis de ambiente
├── Novos endpoints de API
└── Novas features que não afetam o existente
```

---

**FIM DO DOCUMENTO DE INTEGRAÇÕES**

*Última atualização: 11 de Janeiro de 2026*
