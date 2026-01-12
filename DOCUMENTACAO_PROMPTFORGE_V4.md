# 📦 DOCUMENTAÇÃO OFICIAL - PROMPTFORGE STUDIO v4.0

> **Data:** 11 de Janeiro de 2026  
> **Status:** Aprovado para Desenvolvimento  
> **Versão:** 4.0 (Major Update)

---

## 📑 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Evolução do Produto](#2-evolução-do-produto)
3. [Stack Tecnológica](#3-stack-tecnológica)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Fluxo do Usuário](#5-fluxo-do-usuário)
6. [Funcionalidades Completas](#6-funcionalidades-completas)
7. [Sistema de Idiomas (i18n)](#7-sistema-de-idiomas-i18n)
8. [Banco de Dados de Nichos](#8-banco-de-dados-de-nichos)
9. [Banco de Dados de Estilos](#9-banco-de-dados-de-estilos)
10. [Sistema de APIs](#10-sistema-de-apis)
11. [Sistema de Créditos](#11-sistema-de-créditos)
12. [Estrutura de Arquivos](#12-estrutura-de-arquivos)
13. [Decisões Técnicas](#13-decisões-técnicas)
14. [Roadmap de Implementação](#14-roadmap-de-implementação)
15. [Checklist de Implementação](#15-checklist-de-implementação)
16. [Métricas de Sucesso](#16-métricas-de-sucesso)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. VISÃO GERAL

### 1.1 O que é o PromptForge Studio

**PromptForge Studio** é uma plataforma completa de criação de estampas para Print on Demand (POD) que transforma ideias em produtos prontos para venda em menos de 60 segundos.

### 1.2 Proposta de Valor

| Antes (v3) | Depois (v4) |
|------------|-------------|
| Gera apenas prompts de texto | Gera imagem + mockups + copy + social media |
| Usuário precisa sair do app | Tudo acontece dentro do app |
| Apenas português | 3 idiomas (PT/EN/ES) |
| 26 nichos brasileiros | 61 nichos globais |
| 12 estilos visuais | 30 estilos visuais |
| Mercado BR apenas | Mercado global (BR/US/EU/LATAM) |

### 1.3 Problema que Resolve

> *"I don't see how this would save me time if I need to copy and paste into other tools."*  
> — Yael Fuerst (Feedback Internacional)

**Solução:** Fluxo unificado onde o usuário nunca sai do app.

### 1.4 Público-Alvo

| Segmento | Descrição | Região |
|----------|-----------|--------|
| Designers POD | Criam estampas para vender em plataformas | Global |
| Empreendedores | Donos de lojas Shopee, Mercado Livre, Etsy | BR/LATAM |
| Side Hustlers | Renda extra com camisetas personalizadas | US/EU |
| Agências | Produção em escala para clientes | Global |

---

## 2. EVOLUÇÃO DO PRODUTO

### 2.1 Histórico de Versões

| Versão | Data | Principais Mudanças |
|--------|------|---------------------|
| v1.0 | 2024 | MVP - Gerador de prompts básico |
| v2.0 | 2024 | Autenticação, 26 nichos, 3 IAs |
| v3.0 | Jan/2025 | Supabase, Kiwify, bugs corrigidos |
| **v4.0** | **Jan/2026** | **Studio completo, global, multi-idioma** |

### 2.2 O que muda na v4.0

```
REMOVIDO:
├── Exibição do prompt para o usuário (IP protegido)
├── Necessidade de copiar/colar em outras ferramentas
└── Limitação ao mercado brasileiro

ADICIONADO:
├── Geração de imagem via API (Gemini/FAL.ai)
├── Remoção de fundo automática (browser)
├── Geração de mockups automática (Canvas API)
├── Geração de copy de vendas (Gemini)
├── Geração de posts para social media (Gemini)
├── Sistema de idiomas (PT/EN/ES)
├── 35 novos nichos internacionais
├── 18 novos estilos visuais
├── Download em ZIP de todos os assets
└── Sistema de créditos por funcionalidade
```

---

## 3. STACK TECNOLÓGICA

### 3.1 Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| HTML5 | - | Estrutura |
| CSS3 | - | Estilos + CSS Variables |
| JavaScript | ES6+ | Lógica (Vanilla, sem frameworks) |
| Canvas API | - | Composição de mockups |
| JSZip | 3.10+ | Download de arquivos em ZIP |

### 3.2 Backend/APIs

| Serviço | Uso | Custo |
|---------|-----|-------|
| Supabase | Auth + Database + Edge Functions | Free tier |
| Vercel | Hospedagem + Deploy | Free tier |
| Gemini API | Geração de imagem + texto | Free tier (1.500/dia) |
| FAL.ai | Geração de imagem (escala) | ~$0.003/imagem |

### 3.3 Processamento no Browser (Zero Custo)

| Biblioteca | Uso | Custo |
|------------|-----|-------|
| @imgly/background-removal | Remover fundo de imagens | Grátis |
| Canvas API | Composição de mockups | Grátis |
| JSZip | Empacotamento de downloads | Grátis |

### 3.4 Integrações Externas

| Serviço | Uso |
|---------|-----|
| Kiwify | Pagamentos e assinaturas |
| Google Sheets | Backup de banco de ideias |
| WhatsApp API | Compartilhamento de resultados |

---

## 4. ARQUITETURA DO SISTEMA

### 4.1 Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    INTERFACE (app.html)                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Idioma    │ │   Nicho     │ │   Estilo    │ │   Paleta    │   │
│  │  🇧🇷🇺🇸🇪🇸   │ │  Cerveja ▼  │ │  Vintage ▼  │ │ Terrosos ▼  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 💡 Ideia: "Cachorro bebendo cerveja no bar"                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📦 OPÇÕES DE GERAÇÃO:                                       │   │
│  │ ☑️ Estampa PNG              (1 crédito)                     │   │
│  │ ☑️ Mockups (3x)             (incluso)                       │   │
│  │ ☑️ Copy de Vendas           (incluso)                       │   │
│  │ ☐ Remover Fundo             (+1 crédito)                    │   │
│  │ ☐ Upscale 4K                (+1 crédito)                    │   │
│  │ ☐ Post Social Media         (+1 crédito)                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│              [🚀 GERAR TUDO]  (Total: X créditos)                   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PROCESSAMENTO (studio.js)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1️⃣ MONTAR PROMPT SECRETO                                          │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │ [NICHO_KEYWORDS] + [ESTILO_PARAMS] + [PALETA_COLORS]    │    │
│     │ + [IDEIA_USUARIO] + [SUFIXO_TECNICO]                    │    │
│     │                                                         │    │
│     │ Resultado (invisível ao usuário):                       │    │
│     │ "A vintage style illustration of a dog drinking beer    │    │
│     │ at a bar, warm earthy tones, t-shirt design, vector,    │    │
│     │ white background, high contrast, print ready..."        │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│  2️⃣ GERAR IMAGEM (API Externa)                                     │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │ Fase 1: Gemini Imagen 3 (grátis, 1.500/dia)             │    │
│     │ Fase 2: FAL.ai FLUX Schnell ($0.003/img)                │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│  3️⃣ REMOVER FUNDO (Se selecionado)                                 │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │ @imgly/background-removal (no browser, grátis)          │    │
│     │ Retorna: PNG com canal alpha (transparência)            │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│  4️⃣ GERAR MOCKUPS (Canvas API)                                     │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │ Template PNG + Estampa = Mockup Final                   │    │
│     │                                                         │    │
│     │ Produtos:                                               │    │
│     │ • Camiseta Preta                                        │    │
│     │ • Camiseta Branca                                       │    │
│     │ • Moletom Cinza                                         │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│  5️⃣ GERAR COPY DE VENDAS (Gemini Flash - Grátis)                   │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │ Prompt interno:                                         │    │
│     │ "Crie título, descrição e tags para vender uma          │    │
│     │ camiseta de [NICHO] com estampa [IDEIA] no idioma       │    │
│     │ [IDIOMA_SELECIONADO]..."                                │    │
│     │                                                         │    │
│     │ Retorna JSON:                                           │    │
│     │ { titulo, descricao, tags[], marketplace_tips }         │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│  6️⃣ GERAR POST SOCIAL MEDIA (Se selecionado)                       │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │ Gera posts prontos para:                                │    │
│     │ • Instagram (caption + hashtags)                        │    │
│     │ • Facebook (post + CTA)                                 │    │
│     │ • Pinterest (descrição + keywords)                      │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│  7️⃣ EMPACOTAR DOWNLOAD (JSZip)                                     │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │ estampa_cachorro_cerveja.zip                            │    │
│     │ ├── estampa.png (ou estampa_transparente.png)           │    │
│     │ ├── mockup_camiseta_preta.png                           │    │
│     │ ├── mockup_camiseta_branca.png                          │    │
│     │ ├── mockup_moletom.png                                  │    │
│     │ ├── copy_vendas.txt                                     │    │
│     │ └── posts_social_media.txt (se selecionado)             │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    RESULTADO FINAL                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │          │ │          │ │          │ │          │               │
│  │ ESTAMPA  │ │ MOCKUP   │ │ MOCKUP   │ │ MOCKUP   │               │
│  │   PNG    │ │ PRETA    │ │ BRANCA   │ │ MOLETOM  │               │
│  │          │ │          │ │          │ │          │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                     │
│  📝 COPY DE VENDAS:                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Título: Camiseta Cachorro Cervejeiro - Beer Dog             │   │
│  │ Descrição: Para os amantes de cerveja e cachorros, essa     │   │
│  │ estampa exclusiva combina humor e estilo vintage...         │   │
│  │ Tags: cerveja, cachorro, engraçado, beer, dog, vintage...   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [⬇️ BAIXAR TUDO (.ZIP)]   [📋 COPIAR COPY]   [💾 FAVORITAR]       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Fluxo de Dados

```
ENTRADA (Usuário escolhe):
├── Idioma: PT | EN | ES
├── Nicho: "Cerveja"
├── Estilo: "Vintage"
├── Paleta: "Terrosos"
├── Ideia: "Cachorro bebendo cerveja no bar"
└── Opções: [estampa, mockups, copy, removeBg, social]

PROCESSAMENTO (Invisível):
├── Monta prompt técnico secreto
├── Chama API de imagem
├── Processa no browser (bg removal, mockups)
├── Chama API de texto (copy, social)
└── Empacota arquivos

SAÍDA (Usuário recebe):
├── estampa.png (1024x1024 ou 4K se upscale)
├── estampa_transparente.png (se removeBg)
├── mockup_camiseta_preta.png
├── mockup_camiseta_branca.png
├── mockup_moletom.png
├── copy_vendas.txt
└── posts_social_media.txt (se selecionado)
```

---

## 5. FLUXO DO USUÁRIO

### 5.1 Jornada Completa

```
1. LOGIN
   └── Email validado via Supabase
   
2. DASHBOARD
   ├── Seletor de idioma (🇧🇷 🇺🇸 🇪🇸)
   ├── Contador de créditos
   └── Botão "Nova Criação"

3. CRIAÇÃO
   ├── Passo 1: Selecionar Nicho (61 opções)
   ├── Passo 2: Selecionar Estilo (30 opções)
   ├── Passo 3: Selecionar Paleta (7 opções)
   ├── Passo 4: Descrever Ideia (texto livre ou aleatória)
   └── Passo 5: Selecionar Opções (checkboxes)

4. PROCESSAMENTO
   ├── Barra de progresso visual
   ├── Feedback de cada etapa
   └── Tempo estimado: 15-45 segundos

5. RESULTADO
   ├── Preview de todos os assets
   ├── Copy pronta para copiar
   ├── Download individual ou ZIP
   └── Opção de favoritar

6. HISTÓRICO
   ├── Criações anteriores
   ├── Favoritos
   └── Re-download disponível
```

### 5.2 Estados da Interface

```
IDLE:
└── Formulário vazio, aguardando input

SELECTING:
└── Usuário fazendo escolhas

GENERATING:
├── Botão desabilitado
├── Spinner/loading
├── Barra de progresso
└── Texto: "Gerando estampa... (35%)"

SUCCESS:
├── Assets exibidos
├── Botões de ação ativos
└── Toast de sucesso

ERROR:
├── Mensagem de erro clara
├── Botão "Tentar novamente"
└── Fallback para modo manual (se API falhar)
```

---

## 6. FUNCIONALIDADES COMPLETAS

### 6.1 Funcionalidades Core

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| Geração de Estampa | Imagem via API Gemini/FAL.ai | 🆕 Novo |
| Remoção de Fundo | IA no browser (@imgly) | 🆕 Novo |
| Geração de Mockups | Canvas API (3 produtos) | 🆕 Novo |
| Geração de Copy | Gemini Flash (título, desc, tags) | 🆕 Novo |
| Posts Social Media | Gemini Flash (IG, FB, Pinterest) | 🆕 Novo |
| Download ZIP | Todos os assets empacotados | 🆕 Novo |
| Multi-idioma | PT, EN, ES | 🆕 Novo |

### 6.2 Funcionalidades Herdadas (v3)

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| Autenticação | Email via Supabase | ✅ Mantido |
| Geração de Prompts | 3 IAs (Leonardo, MJ, Gemini) | ✅ Mantido |
| Banco de Ideias | 8.193+ ideias por nicho | ✅ Mantido |
| Modo Surpresa | Gera combinação aleatória | ✅ Mantido |
| Histórico | Últimas 50 criações | ✅ Mantido |
| Favoritos | Salvar criações preferidas | ✅ Mantido |
| Tema Dark/Light | Toggle de tema | ✅ Mantido |
| PWA | Instalável como app | ✅ Mantido |
| Responsivo | Mobile-first | ✅ Mantido |

### 6.3 Funcionalidades Premium (Futuro)

| Funcionalidade | Descrição | Fase |
|----------------|-----------|------|
| Upscale 4K | Imagem em alta resolução | v4.1 |
| Mais mockups | Caneca, bolsa, quadro | v4.2 |
| API própria | White-label para B2B | v5.0 |
| Integração Canva | Plugin direto | v5.0 |

---

## 7. SISTEMA DE IDIOMAS (i18n)

### 7.1 Idiomas Suportados

| Código | Idioma | Bandeira | Mercado |
|--------|--------|----------|---------|
| `pt` | Português | 🇧🇷 | Brasil, Portugal |
| `en` | English | 🇺🇸 | USA, UK, Global |
| `es` | Español | 🇪🇸 | Espanha, LATAM |

### 7.2 Detecção Automática

```javascript
// Ordem de prioridade:
1. localStorage ('promptforge_lang')
2. navigator.language (browser)
3. Fallback: 'pt'
```

### 7.3 Estrutura do Arquivo i18n.js

```javascript
const TRANSLATIONS = {
  pt: {
    // === HEADER ===
    appName: "PromptForge Studio",
    selectLanguage: "Idioma",
    credits: "créditos",
    logout: "Sair",
    
    // === NAVIGATION ===
    tabCreate: "Criar",
    tabHistory: "Histórico",
    tabFavorites: "Favoritos",
    tabSettings: "Configurações",
    
    // === CREATION FORM ===
    selectNiche: "Selecione o Nicho",
    selectStyle: "Selecione o Estilo",
    selectPalette: "Selecione a Paleta",
    describeIdea: "Descreva sua ideia",
    ideaPlaceholder: "Ex: Cachorro bebendo cerveja no bar",
    randomIdea: "💡 Ideia Aleatória",
    
    // === OPTIONS ===
    optionsTitle: "O que gerar:",
    optStamp: "Estampa PNG",
    optMockups: "Mockups (3x)",
    optCopy: "Copy de Vendas",
    optRemoveBg: "Remover Fundo",
    optUpscale: "Upscale 4K",
    optSocial: "Post Social Media",
    included: "incluso",
    
    // === BUTTONS ===
    btnGenerate: "🚀 Gerar Tudo",
    btnDownload: "⬇️ Baixar ZIP",
    btnDownloadSingle: "⬇️ Baixar",
    btnCopy: "📋 Copiar",
    btnFavorite: "💾 Favoritar",
    btnShare: "📤 Compartilhar",
    btnTryAgain: "🔄 Tentar Novamente",
    
    // === PROGRESS ===
    generating: "Gerando...",
    generatingStamp: "Gerando estampa...",
    removingBg: "Removendo fundo...",
    creatingMockups: "Criando mockups...",
    generatingCopy: "Gerando copy...",
    generatingSocial: "Gerando posts...",
    packaging: "Empacotando arquivos...",
    
    // === RESULTS ===
    resultTitle: "Sua Criação",
    stampTitle: "Estampa",
    mockupsTitle: "Mockups",
    copyTitle: "Copy de Vendas",
    socialTitle: "Posts para Redes",
    
    // === COPY LABELS ===
    copyTitleLabel: "Título:",
    copyDescLabel: "Descrição:",
    copyTagsLabel: "Tags:",
    
    // === SOCIAL LABELS ===
    instagramPost: "Instagram",
    facebookPost: "Facebook",
    pinterestPost: "Pinterest",
    
    // === MESSAGES ===
    successGenerated: "Criação concluída com sucesso!",
    errorGeneral: "Ocorreu um erro. Tente novamente.",
    errorCredits: "Créditos insuficientes.",
    errorConnection: "Sem conexão com a internet.",
    copiedToClipboard: "Copiado!",
    addedToFavorites: "Adicionado aos favoritos!",
    
    // === EMPTY STATES ===
    noHistory: "Nenhuma criação ainda",
    noFavorites: "Nenhum favorito ainda",
    
    // === CREDITS ===
    creditsRemaining: "créditos restantes",
    creditsCost: "Custo:",
    creditsTotal: "Total:",
    
    // === NICHO CATEGORIES ===
    categoryUS: "Mercado Americano",
    categoryEU: "Mercado Europeu",
    categoryBR: "Mercado Brasileiro",
    categoryUniversal: "Universal",
    
    // === MISC ===
    loading: "Carregando...",
    close: "Fechar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    yes: "Sim",
    no: "Não"
  },
  
  en: {
    // === HEADER ===
    appName: "PromptForge Studio",
    selectLanguage: "Language",
    credits: "credits",
    logout: "Logout",
    
    // === NAVIGATION ===
    tabCreate: "Create",
    tabHistory: "History",
    tabFavorites: "Favorites",
    tabSettings: "Settings",
    
    // === CREATION FORM ===
    selectNiche: "Select Niche",
    selectStyle: "Select Style",
    selectPalette: "Select Palette",
    describeIdea: "Describe your idea",
    ideaPlaceholder: "E.g.: Dog drinking beer at a bar",
    randomIdea: "💡 Random Idea",
    
    // === OPTIONS ===
    optionsTitle: "What to generate:",
    optStamp: "Design PNG",
    optMockups: "Mockups (3x)",
    optCopy: "Sales Copy",
    optRemoveBg: "Remove Background",
    optUpscale: "Upscale 4K",
    optSocial: "Social Media Post",
    included: "included",
    
    // === BUTTONS ===
    btnGenerate: "🚀 Generate All",
    btnDownload: "⬇️ Download ZIP",
    btnDownloadSingle: "⬇️ Download",
    btnCopy: "📋 Copy",
    btnFavorite: "💾 Save",
    btnShare: "📤 Share",
    btnTryAgain: "🔄 Try Again",
    
    // === PROGRESS ===
    generating: "Generating...",
    generatingStamp: "Creating design...",
    removingBg: "Removing background...",
    creatingMockups: "Creating mockups...",
    generatingCopy: "Writing copy...",
    generatingSocial: "Creating posts...",
    packaging: "Packaging files...",
    
    // === RESULTS ===
    resultTitle: "Your Creation",
    stampTitle: "Design",
    mockupsTitle: "Mockups",
    copyTitle: "Sales Copy",
    socialTitle: "Social Posts",
    
    // === COPY LABELS ===
    copyTitleLabel: "Title:",
    copyDescLabel: "Description:",
    copyTagsLabel: "Tags:",
    
    // === SOCIAL LABELS ===
    instagramPost: "Instagram",
    facebookPost: "Facebook",
    pinterestPost: "Pinterest",
    
    // === MESSAGES ===
    successGenerated: "Creation completed successfully!",
    errorGeneral: "An error occurred. Please try again.",
    errorCredits: "Insufficient credits.",
    errorConnection: "No internet connection.",
    copiedToClipboard: "Copied!",
    addedToFavorites: "Added to favorites!",
    
    // === EMPTY STATES ===
    noHistory: "No creations yet",
    noFavorites: "No favorites yet",
    
    // === CREDITS ===
    creditsRemaining: "credits remaining",
    creditsCost: "Cost:",
    creditsTotal: "Total:",
    
    // === NICHO CATEGORIES ===
    categoryUS: "US Market",
    categoryEU: "EU Market",
    categoryBR: "Brazilian Market",
    categoryUniversal: "Universal",
    
    // === MISC ===
    loading: "Loading...",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    yes: "Yes",
    no: "No"
  },
  
  es: {
    // === HEADER ===
    appName: "PromptForge Studio",
    selectLanguage: "Idioma",
    credits: "créditos",
    logout: "Salir",
    
    // === NAVIGATION ===
    tabCreate: "Crear",
    tabHistory: "Historial",
    tabFavorites: "Favoritos",
    tabSettings: "Ajustes",
    
    // === CREATION FORM ===
    selectNiche: "Selecciona el Nicho",
    selectStyle: "Selecciona el Estilo",
    selectPalette: "Selecciona la Paleta",
    describeIdea: "Describe tu idea",
    ideaPlaceholder: "Ej: Perro bebiendo cerveza en el bar",
    randomIdea: "💡 Idea Aleatoria",
    
    // === OPTIONS ===
    optionsTitle: "Qué generar:",
    optStamp: "Diseño PNG",
    optMockups: "Mockups (3x)",
    optCopy: "Copy de Ventas",
    optRemoveBg: "Quitar Fondo",
    optUpscale: "Upscale 4K",
    optSocial: "Post Redes Sociales",
    included: "incluido",
    
    // === BUTTONS ===
    btnGenerate: "🚀 Generar Todo",
    btnDownload: "⬇️ Descargar ZIP",
    btnDownloadSingle: "⬇️ Descargar",
    btnCopy: "📋 Copiar",
    btnFavorite: "💾 Guardar",
    btnShare: "📤 Compartir",
    btnTryAgain: "🔄 Intentar de Nuevo",
    
    // === PROGRESS ===
    generating: "Generando...",
    generatingStamp: "Creando diseño...",
    removingBg: "Quitando fondo...",
    creatingMockups: "Creando mockups...",
    generatingCopy: "Escribiendo copy...",
    generatingSocial: "Creando posts...",
    packaging: "Empaquetando archivos...",
    
    // === RESULTS ===
    resultTitle: "Tu Creación",
    stampTitle: "Diseño",
    mockupsTitle: "Mockups",
    copyTitle: "Copy de Ventas",
    socialTitle: "Posts Sociales",
    
    // === COPY LABELS ===
    copyTitleLabel: "Título:",
    copyDescLabel: "Descripción:",
    copyTagsLabel: "Tags:",
    
    // === SOCIAL LABELS ===
    instagramPost: "Instagram",
    facebookPost: "Facebook",
    pinterestPost: "Pinterest",
    
    // === MESSAGES ===
    successGenerated: "¡Creación completada con éxito!",
    errorGeneral: "Ocurrió un error. Inténtalo de nuevo.",
    errorCredits: "Créditos insuficientes.",
    errorConnection: "Sin conexión a internet.",
    copiedToClipboard: "¡Copiado!",
    addedToFavorites: "¡Añadido a favoritos!",
    
    // === EMPTY STATES ===
    noHistory: "Ninguna creación todavía",
    noFavorites: "Ningún favorito todavía",
    
    // === CREDITS ===
    creditsRemaining: "créditos restantes",
    creditsCost: "Costo:",
    creditsTotal: "Total:",
    
    // === NICHO CATEGORIES ===
    categoryUS: "Mercado Americano",
    categoryEU: "Mercado Europeo",
    categoryBR: "Mercado Brasileño",
    categoryUniversal: "Universal",
    
    // === MISC ===
    loading: "Cargando...",
    close: "Cerrar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    yes: "Sí",
    no: "No"
  }
};
```

### 7.4 Funções de Tradução

```javascript
let currentLang = 'pt';

// Obter tradução
function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['pt'][key] || key;
}

// Mudar idioma
function setLanguage(lang) {
  if (['pt', 'en', 'es'].includes(lang)) {
    currentLang = lang;
    localStorage.setItem('promptforge_lang', lang);
    updateAllTexts();
    updateNichosForLanguage();
  }
}

// Atualizar todos os textos da interface
function updateAllTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

// Inicialização
function initLanguage() {
  const saved = localStorage.getItem('promptforge_lang');
  const browser = navigator.language?.slice(0, 2);
  currentLang = saved || (['pt', 'en', 'es'].includes(browser) ? browser : 'pt');
  updateAllTexts();
}
```

---

## 8. BANCO DE DADOS DE NICHOS

### 8.1 Estrutura Total: 61 Nichos

#### 8.1.1 Nichos Universais (17)

| ID | Nome PT | Nome EN | Nome ES | Ícone |
|----|---------|---------|---------|-------|
| `gaming` | Games | Gaming | Videojuegos | 🎮 |
| `pets_dog` | Cachorros | Dogs | Perros | 🐕 |
| `pets_cat` | Gatos | Cats | Gatos | 🐱 |
| `music` | Música | Music | Música | 🎵 |
| `coffee` | Café | Coffee | Café | ☕ |
| `fitness` | Fitness | Fitness | Fitness | 💪 |
| `travel` | Viagem | Travel | Viajes | ✈️ |
| `tech` | Tecnologia | Tech | Tecnología | 💻 |
| `family` | Família | Family | Familia | 👨‍👩‍👧 |
| `food` | Comida | Food | Comida | 🍕 |
| `nature` | Natureza | Nature | Naturaleza | 🌿 |
| `astrology` | Signos | Zodiac | Signos | ♈ |
| `professions` | Profissões | Professions | Profesiones | 👔 |
| `motivation` | Motivacional | Motivation | Motivación | 🔥 |
| `humor` | Humor | Humor | Humor | 😂 |
| `vintage` | Retrô/Vintage | Vintage | Vintage | 📻 |
| `couples` | Casais | Couples | Parejas | 💑 |

#### 8.1.2 Nichos Brasil (12)

| ID | Nome PT | Nome EN | Nome ES | Ícone |
|----|---------|---------|---------|-------|
| `cerveja` | Cerveja | Beer | Cerveza | 🍺 |
| `churrasco` | Churrasco | BBQ | Parrilla | 🥩 |
| `futebol_br` | Futebol | Soccer | Fútbol | ⚽ |
| `praia` | Praia | Beach | Playa | 🏖️ |
| `samba` | Samba/Pagode | Samba | Samba | 🎶 |
| `carnaval` | Carnaval | Carnival | Carnaval | 🎭 |
| `nordeste` | Nordeste | Northeast BR | Nordeste | 🌵 |
| `caipira` | Caipira/Country | Country BR | Caipira | 🤠 |
| `surf` | Surf | Surf | Surf | 🏄 |
| `skate` | Skate | Skate | Skate | 🛹 |
| `moto` | Motos | Motorcycles | Motos | 🏍️ |
| `religiao` | Religião | Religion | Religión | ✝️ |

#### 8.1.3 Nichos Estados Unidos (16)

| ID | Nome PT | Nome EN | Nome ES | Ícone |
|----|---------|---------|---------|-------|
| `nfl` | Futebol Americano | NFL/Football | Fútbol Americano | 🏈 |
| `nba` | Basquete | NBA/Basketball | Baloncesto | 🏀 |
| `baseball` | Beisebol | Baseball/MLB | Béisbol | ⚾ |
| `hockey` | Hóquei | Hockey/NHL | Hockey | 🏒 |
| `patriotic` | Patriota USA | Patriotic/USA | Patriota USA | 🇺🇸 |
| `military` | Militar/Veterano | Military/Veteran | Militar | 🎖️ |
| `firefighter` | Bombeiro | Firefighter | Bombero | 👨‍🚒 |
| `police` | Polícia | Police | Policía | 👮 |
| `nurse` | Enfermagem | Nursing | Enfermería | 👩‍⚕️ |
| `trucker` | Caminhoneiro | Trucker | Camionero | 🚛 |
| `guns` | Armas/2A | 2nd Amendment | Armas | 🔫 |
| `country_us` | Country Music | Country Music | Country | 🎸 |
| `hunting` | Caça | Hunting | Caza | 🦌 |
| `fishing` | Pesca | Fishing | Pesca | 🎣 |
| `farming` | Fazenda | Farming | Granja | 🚜 |
| `pickleball` | Pickleball | Pickleball | Pickleball | 🏓 |

#### 8.1.4 Nichos Europa (10)

| ID | Nome PT | Nome EN | Nome ES | Ícone |
|----|---------|---------|---------|-------|
| `soccer_eu` | Futebol Europeu | European Football | Fútbol Europeo | ⚽ |
| `cycling` | Ciclismo | Cycling | Ciclismo | 🚴 |
| `f1` | Fórmula 1 | F1/Racing | Fórmula 1 | 🏎️ |
| `rugby` | Rugby | Rugby | Rugby | 🏉 |
| `ski` | Ski/Snowboard | Ski/Snowboard | Esquí | ⛷️ |
| `oktoberfest` | Oktoberfest | Oktoberfest | Oktoberfest | 🍻 |
| `british` | Humor Britânico | British Humor | Humor Británico | 🇬🇧 |
| `sustainability` | Sustentabilidade | Sustainability | Sostenibilidad | ♻️ |
| `wine` | Vinho | Wine | Vino | 🍷 |
| `mediterranean` | Mediterrâneo | Mediterranean | Mediterráneo | 🫒 |

#### 8.1.5 Nichos LATAM (6)

| ID | Nome PT | Nome EN | Nome ES | Ícone |
|----|---------|---------|---------|-------|
| `reggaeton` | Reggaeton | Reggaeton | Reggaeton | 🎤 |
| `dia_muertos` | Dia dos Mortos | Day of the Dead | Día de Muertos | 💀 |
| `lucha_libre` | Luta Livre | Lucha Libre | Lucha Libre | 🤼 |
| `tequila` | Tequila | Tequila | Tequila | 🥃 |
| `futbol_latam` | Futebol LATAM | LATAM Football | Fútbol LATAM | ⚽ |
| `latina_pride` | Orgulho Latino | Latin Pride | Orgullo Latino | 🌎 |

### 8.2 Estrutura de Dados JavaScript

```javascript
const NICHOS = {
  // === UNIVERSAIS ===
  gaming: {
    id: 'gaming',
    icon: '🎮',
    names: { pt: 'Games', en: 'Gaming', es: 'Videojuegos' },
    keywords: {
      pt: ['videogame', 'gamer', 'joystick', 'console', 'rpg', 'fps'],
      en: ['video game', 'gamer', 'controller', 'console', 'rpg', 'esports'],
      es: ['videojuego', 'gamer', 'mando', 'consola', 'rpg', 'esports']
    },
    region: 'universal',
    trending: true
  },
  // ... (todos os outros 60 nichos)
};

// Função para obter nichos por região
function getNichosByRegion(region) {
  return Object.values(NICHOS).filter(n => n.region === region);
}

// Função para obter nome do nicho no idioma atual
function getNichoName(nichoId) {
  return NICHOS[nichoId]?.names[currentLang] || NICHOS[nichoId]?.names.pt;
}
```

### 8.3 Subnichos (Profissões)

```javascript
const PROFISSOES = {
  // Saúde
  doctor: { names: { pt: 'Médico', en: 'Doctor', es: 'Médico' }, icon: '👨‍⚕️' },
  nurse: { names: { pt: 'Enfermeiro', en: 'Nurse', es: 'Enfermero' }, icon: '👩‍⚕️' },
  dentist: { names: { pt: 'Dentista', en: 'Dentist', es: 'Dentista' }, icon: '🦷' },
  
  // Tecnologia
  developer: { names: { pt: 'Desenvolvedor', en: 'Developer', es: 'Desarrollador' }, icon: '💻' },
  designer: { names: { pt: 'Designer', en: 'Designer', es: 'Diseñador' }, icon: '🎨' },
  
  // Educação
  teacher: { names: { pt: 'Professor', en: 'Teacher', es: 'Profesor' }, icon: '👩‍🏫' },
  
  // Serviços
  chef: { names: { pt: 'Chef', en: 'Chef', es: 'Chef' }, icon: '👨‍🍳' },
  mechanic: { names: { pt: 'Mecânico', en: 'Mechanic', es: 'Mecánico' }, icon: '🔧' },
  electrician: { names: { pt: 'Eletricista', en: 'Electrician', es: 'Electricista' }, icon: '⚡' },
  plumber: { names: { pt: 'Encanador', en: 'Plumber', es: 'Plomero' }, icon: '🔩' },
  carpenter: { names: { pt: 'Carpinteiro', en: 'Carpenter', es: 'Carpintero' }, icon: '🪚' },
  
  // Outros
  lawyer: { names: { pt: 'Advogado', en: 'Lawyer', es: 'Abogado' }, icon: '⚖️' },
  accountant: { names: { pt: 'Contador', en: 'Accountant', es: 'Contador' }, icon: '📊' },
  engineer: { names: { pt: 'Engenheiro', en: 'Engineer', es: 'Ingeniero' }, icon: '🏗️' },
  pilot: { names: { pt: 'Piloto', en: 'Pilot', es: 'Piloto' }, icon: '✈️' },
  photographer: { names: { pt: 'Fotógrafo', en: 'Photographer', es: 'Fotógrafo' }, icon: '📷' }
};
```

### 8.4 Subnichos (Signos)

```javascript
const SIGNOS = {
  aries: { names: { pt: 'Áries', en: 'Aries', es: 'Aries' }, icon: '♈', element: 'fire' },
  taurus: { names: { pt: 'Touro', en: 'Taurus', es: 'Tauro' }, icon: '♉', element: 'earth' },
  gemini: { names: { pt: 'Gêmeos', en: 'Gemini', es: 'Géminis' }, icon: '♊', element: 'air' },
  cancer: { names: { pt: 'Câncer', en: 'Cancer', es: 'Cáncer' }, icon: '♋', element: 'water' },
  leo: { names: { pt: 'Leão', en: 'Leo', es: 'Leo' }, icon: '♌', element: 'fire' },
  virgo: { names: { pt: 'Virgem', en: 'Virgo', es: 'Virgo' }, icon: '♍', element: 'earth' },
  libra: { names: { pt: 'Libra', en: 'Libra', es: 'Libra' }, icon: '♎', element: 'air' },
  scorpio: { names: { pt: 'Escorpião', en: 'Scorpio', es: 'Escorpio' }, icon: '♏', element: 'water' },
  sagittarius: { names: { pt: 'Sagitário', en: 'Sagittarius', es: 'Sagitario' }, icon: '♐', element: 'fire' },
  capricorn: { names: { pt: 'Capricórnio', en: 'Capricorn', es: 'Capricornio' }, icon: '♑', element: 'earth' },
  aquarius: { names: { pt: 'Aquário', en: 'Aquarius', es: 'Acuario' }, icon: '♒', element: 'air' },
  pisces: { names: { pt: 'Peixes', en: 'Pisces', es: 'Piscis' }, icon: '♓', element: 'water' }
};
```

---

## 9. BANCO DE DADOS DE ESTILOS

### 9.1 Estrutura Total: 30 Estilos

#### 9.1.1 Estilos Clássicos (12 - Herdados)

| ID | Nome | Descrição | Prompt Keywords |
|----|------|-----------|-----------------|
| `vintage` | Vintage/Retrô | Anos 50-70, desgastado, nostálgico | vintage, retro, distressed, worn, classic |
| `minimalist` | Minimalista | Linhas simples, poucos elementos | minimal, simple, clean lines, negative space |
| `cartoon` | Cartoon | Estilo animação, divertido | cartoon style, animated, fun, playful |
| `realistic` | Realista | Fotorrealista, detalhado | realistic, photorealistic, detailed, lifelike |
| `neon` | Neon | Cores vibrantes, brilho | neon colors, glowing, vibrant, electric |
| `watercolor` | Aquarela | Pintura com água, suave | watercolor, soft edges, painted, artistic |
| `pixel_art` | Pixel Art | 8-bit, retrô games | pixel art, 8-bit, retro gaming, pixelated |
| `tribal` | Tribal | Padrões tribais, étnico | tribal pattern, ethnic, indigenous, bold lines |
| `graffiti` | Graffiti | Street art, urbano | graffiti style, street art, urban, spray paint |
| `japanese` | Japonês | Anime, mangá, ukiyo-e | japanese style, anime, manga, oriental |
| `geometric` | Geométrico | Formas geométricas, abstrato | geometric shapes, abstract, polygonal |
| `hand_drawn` | Hand Drawn | Desenho à mão, sketch | hand drawn, sketchy, illustrated, doodle |

#### 9.1.2 Estilos Novos (18)

| ID | Nome | Descrição | Prompt Keywords | Mercado |
|----|------|-----------|-----------------|---------|
| `y2k` | Y2K/2000s | Brilho, chrome, futurista | y2k aesthetic, chrome, butterfly, 2000s | 🌍 Global |
| `vaporwave` | Vaporwave | 80s/90s, neon rosa/azul | vaporwave, synthwave, retro 80s, pink blue neon | 🌍 Global |
| `cottagecore` | Cottagecore | Rural, flores, romântico | cottagecore, pastoral, floral, romantic, countryside | 🇪🇺🇺🇸 |
| `dark_academia` | Dark Academia | Clássico, tons escuros | dark academia, scholarly, classical, moody | 🇪🇺🇺🇸 |
| `streetwear` | Streetwear | Urbano, bold, hype | streetwear, urban, bold, hypebeast, oversized | 🌍 Global |
| `anime` | Anime/Manga | Estilo japonês moderno | anime style, manga, japanese animation | 🌍 Global |
| `tattoo` | Tattoo Style | Old school americano | american traditional tattoo, old school, bold | 🇺🇸 |
| `psychedelic` | Psicodélico | 70s, trippy, colorido | psychedelic, trippy, 70s, colorful, groovy | 🌍 Global |
| `line_art` | Line Art | Linhas contínuas, elegante | line art, continuous line, elegant, simple | 🌍 Global |
| `retro_sports` | Retro Sports | Vintage esportivo 70s/80s | retro sports, vintage athletic, 70s 80s sports | 🇺🇸 |
| `gothic` | Gótico | Dark, medieval, caveiras | gothic, dark, medieval, skulls, macabre | 🇪🇺🇺🇸 |
| `kawaii` | Kawaii | Fofo japonês, pastel | kawaii, cute, pastel colors, chibi, adorable | 🌍 Global |
| `distressed` | Distressed/Grunge | Desgastado, textura suja | distressed, grunge, worn, dirty texture | 🌍 Global |
| `pop_art` | Pop Art | Andy Warhol, vibrante | pop art, warhol style, bold colors, halftone | 🌍 Global |
| `flat_design` | Flat Design | Vetorial, cores sólidas | flat design, vector, solid colors, no shadows | 🌍 Global |
| `illustrative` | Illustrative | Ilustração detalhada | detailed illustration, artistic, elaborate | 🌍 Global |
| `embroidery` | Embroidery Look | Visual de bordado | embroidery style, stitched, textile, thread | 🇪🇺 |
| `woodcut` | Woodcut/Linocut | Xilogravura, artesanal | woodcut, linocut, block print, handcrafted | 🇧🇷🇪🇺 |

### 9.2 Estrutura de Dados JavaScript

```javascript
const ESTILOS = {
  vintage: {
    id: 'vintage',
    names: { pt: 'Vintage/Retrô', en: 'Vintage/Retro', es: 'Vintage/Retro' },
    description: {
      pt: 'Anos 50-70, desgastado, nostálgico',
      en: '50s-70s, distressed, nostalgic',
      es: 'Años 50-70, desgastado, nostálgico'
    },
    promptKeywords: 'vintage style, retro, distressed, worn texture, classic, nostalgic, faded colors',
    category: 'classic',
    recommendedFor: ['cerveja', 'music', 'travel', 'americana'],
    aiRecommendation: 'midjourney' // Qual IA funciona melhor
  },
  
  y2k: {
    id: 'y2k',
    names: { pt: 'Y2K/2000s', en: 'Y2K/2000s', es: 'Y2K/2000s' },
    description: {
      pt: 'Estética anos 2000, brilho, chrome, futurista',
      en: '2000s aesthetic, glossy, chrome, futuristic',
      es: 'Estética años 2000, brillante, chrome, futurista'
    },
    promptKeywords: 'y2k aesthetic, glossy, chrome effect, butterfly, 2000s style, iridescent, futuristic',
    category: 'trending',
    recommendedFor: ['music', 'fashion', 'tech'],
    aiRecommendation: 'leonardo'
  },
  
  // ... (todos os outros 28 estilos)
};

// Agrupar por categoria para UI
const ESTILOS_CATEGORIAS = {
  classic: {
    names: { pt: 'Clássicos', en: 'Classic', es: 'Clásicos' },
    styles: ['vintage', 'minimalist', 'cartoon', 'realistic', 'watercolor', 'hand_drawn']
  },
  modern: {
    names: { pt: 'Modernos', en: 'Modern', es: 'Modernos' },
    styles: ['neon', 'geometric', 'flat_design', 'line_art', 'streetwear']
  },
  cultural: {
    names: { pt: 'Culturais', en: 'Cultural', es: 'Culturales' },
    styles: ['japanese', 'anime', 'kawaii', 'tribal', 'woodcut']
  },
  trending: {
    names: { pt: 'Tendências', en: 'Trending', es: 'Tendencias' },
    styles: ['y2k', 'vaporwave', 'cottagecore', 'dark_academia', 'psychedelic']
  },
  artistic: {
    names: { pt: 'Artísticos', en: 'Artistic', es: 'Artísticos' },
    styles: ['graffiti', 'tattoo', 'pop_art', 'illustrative', 'embroidery']
  },
  edgy: {
    names: { pt: 'Alternativos', en: 'Alternative', es: 'Alternativos' },
    styles: ['gothic', 'distressed', 'pixel_art', 'retro_sports']
  }
};
```

---

## 10. SISTEMA DE APIs

### 10.1 Estratégia de APIs

```
FASE 1 (Lançamento - Custo Zero):
├── Imagem: Gemini Imagen 3 (free tier)
│   └── Limite: 1.500 imagens/dia
├── Texto: Gemini Flash (free tier)
│   └── Limite: 1.500 requests/dia
├── Remove BG: @imgly (browser)
│   └── Limite: Ilimitado
└── Mockups: Canvas API (browser)
    └── Limite: Ilimitado

FASE 2 (Escala - Após 1.500/dia):
├── Imagem: FAL.ai FLUX Schnell
│   └── Custo: $0.003/imagem (~R$0.018)
├── Texto: Gemini Flash (continua grátis)
└── Resto: Continua no browser
```

### 10.2 Configuração Gemini API

```javascript
// config/api.js

const GEMINI_CONFIG = {
  // Geração de Imagem
  imagen: {
    model: 'imagen-3.0-generate-002',
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-002:generateImages',
    maxImages: 1,
    aspectRatio: '1:1', // Quadrado para estampas
    outputFormat: 'png'
  },
  
  // Geração de Texto (Copy, Social)
  flash: {
    model: 'gemini-2.0-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
    maxTokens: 1024,
    temperature: 0.7
  }
};

// Chamada para gerar imagem
async function generateImage(prompt) {
  const response = await fetch(
    `${GEMINI_CONFIG.imagen.endpoint}?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        number_of_images: 1,
        aspect_ratio: '1:1',
        safety_filter_level: 'block_few'
      })
    }
  );
  
  const data = await response.json();
  return data.generated_images[0].image.image_bytes;
}

// Chamada para gerar copy
async function generateCopy(nicho, ideia, idioma) {
  const systemPrompt = getCopySystemPrompt(idioma);
  const userPrompt = `Nicho: ${nicho}\nIdeia da estampa: ${ideia}`;
  
  const response = await fetch(
    `${GEMINI_CONFIG.flash.endpoint}?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    }
  );
  
  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}
```

### 10.3 Configuração FAL.ai (Fase 2)

```javascript
// config/fal.js

const FAL_CONFIG = {
  model: 'fal-ai/flux/schnell',
  endpoint: 'https://fal.run/fal-ai/flux/schnell',
  costPerImage: 0.003 // USD
};

async function generateImageFal(prompt) {
  const response = await fetch(FAL_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt,
      image_size: 'square_hd', // 1024x1024
      num_inference_steps: 4,
      num_images: 1
    })
  });
  
  const data = await response.json();
  return data.images[0].url;
}
```

### 10.4 Prompts Internos (Secretos)

```javascript
// prompts/image-prompts.js

function buildImagePrompt(nicho, estilo, paleta, ideia) {
  const nichoData = NICHOS[nicho];
  const estiloData = ESTILOS[estilo];
  const paletaData = PALETAS[paleta];
  
  // Prompt invisível ao usuário
  const prompt = `
    ${estiloData.promptKeywords},
    ${ideia},
    ${nichoData.keywords[currentLang].join(', ')},
    ${paletaData.colors.join(', ')} color palette,
    t-shirt design,
    centered composition,
    white background,
    high contrast,
    vector art ready for print,
    no text unless specified,
    professional quality,
    clean edges,
    isolated design
  `.trim().replace(/\s+/g, ' ');
  
  return prompt;
}

// prompts/copy-prompts.js

function getCopySystemPrompt(idioma) {
  const prompts = {
    pt: `Você é um copywriter especialista em e-commerce de camisetas.
Gere copy de vendas para marketplaces brasileiros (Shopee, Mercado Livre).
Responda APENAS em JSON válido com a estrutura:
{
  "titulo": "Título chamativo com até 80 caracteres",
  "descricao": "Descrição persuasiva com 150-200 palavras",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
  "dicas": "Uma dica de venda para este nicho"
}`,
    
    en: `You are an expert e-commerce copywriter for t-shirts.
Generate sales copy for US/UK marketplaces (Amazon, Etsy).
Respond ONLY in valid JSON with this structure:
{
  "titulo": "Catchy title up to 80 characters",
  "descricao": "Persuasive description with 150-200 words",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
  "dicas": "One selling tip for this niche"
}`,
    
    es: `Eres un copywriter experto en e-commerce de camisetas.
Genera copy de ventas para marketplaces hispanohablantes.
Responde SOLO en JSON válido con esta estructura:
{
  "titulo": "Título llamativo de hasta 80 caracteres",
  "descricao": "Descripción persuasiva de 150-200 palabras",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
  "dicas": "Un consejo de venta para este nicho"
}`
  };
  
  return prompts[idioma] || prompts.pt;
}

// prompts/social-prompts.js

function getSocialSystemPrompt(idioma) {
  const prompts = {
    pt: `Você é um social media manager especialista em moda e e-commerce.
Crie posts para redes sociais vendendo uma camiseta.
Responda APENAS em JSON válido:
{
  "instagram": {
    "caption": "Caption envolvente com emojis",
    "hashtags": "#tag1 #tag2 #tag3 (10-15 hashtags)"
  },
  "facebook": {
    "post": "Post mais longo e persuasivo",
    "cta": "Call to action"
  },
  "pinterest": {
    "title": "Título otimizado para busca",
    "description": "Descrição rica em keywords"
  }
}`,
    // ... en e es similares
  };
  
  return prompts[idioma] || prompts.pt;
}
```

---

## 11. SISTEMA DE CRÉDITOS

### 11.1 Estrutura de Créditos

| Ação | Custo em Créditos |
|------|-------------------|
| Gerar estampa | 1 crédito |
| Mockups (3x) | Incluso |
| Copy de vendas | Incluso |
| Remover fundo | +1 crédito |
| Upscale 4K | +1 crédito |
| Post social media | +1 crédito |

### 11.2 Planos

| Plano | Créditos/Mês | Preço | Custo/Crédito |
|-------|--------------|-------|---------------|
| Free (Trial) | 5 | R$ 0 | - |
| Starter | 30 | R$ 29,90 | R$ 1,00 |
| Pro | 100 | R$ 79,90 | R$ 0,80 |
| Unlimited* | ∞ | R$ 149,90 | - |

*Unlimited = Fair use, ~500/mês

### 11.3 Implementação Supabase

```sql
-- Tabela de créditos
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL UNIQUE,
  credits_remaining INTEGER DEFAULT 5,
  credits_used_total INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free',
  plan_started_at TIMESTAMP DEFAULT NOW(),
  plan_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de uso (analytics)
CREATE TABLE credit_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'generate', 'remove_bg', 'upscale', 'social'
  credits_spent INTEGER NOT NULL,
  nicho TEXT,
  estilo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "System can update credits"
  ON user_credits FOR UPDATE
  USING (true);
```

### 11.4 Funções JavaScript

```javascript
// credits.js

async function checkCredits(requiredCredits) {
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('user_email', currentUser.email)
    .single();
  
  if (error || !data) return false;
  return data.credits_remaining >= requiredCredits;
}

async function deductCredits(amount, action, metadata = {}) {
  // Deduzir créditos
  const { error: updateError } = await supabase
    .from('user_credits')
    .update({ 
      credits_remaining: supabase.raw(`credits_remaining - ${amount}`),
      credits_used_total: supabase.raw(`credits_used_total + ${amount}`),
      updated_at: new Date().toISOString()
    })
    .eq('user_email', currentUser.email);
  
  // Registrar uso
  await supabase.from('credit_usage').insert({
    user_email: currentUser.email,
    action: action,
    credits_spent: amount,
    ...metadata
  });
  
  return !updateError;
}

function calculateTotalCredits(options) {
  let total = 1; // Estampa base
  if (options.removeBg) total += 1;
  if (options.upscale) total += 1;
  if (options.social) total += 1;
  return total;
}
```

---

## 12. ESTRUTURA DE ARQUIVOS

### 12.1 Árvore Completa do Projeto

```
PromptForge/
├── index.html              # Tela de login
├── app.html                # Aplicação principal (atualizado)
├── admin.html              # Painel administrativo
│
├── css/
│   ├── styles.css          # Estilos principais (atualizado)
│   ├── studio.css          # Estilos do Studio (novo)
│   └── themes.css          # Variáveis de tema
│
├── js/
│   ├── app.js              # Lógica principal (atualizado)
│   ├── studio.js           # Lógica do Studio (novo)
│   ├── auth.js             # Autenticação
│   ├── data.js             # Dados estáticos (atualizado)
│   ├── i18n.js             # Sistema de idiomas (novo)
│   ├── api.js              # Chamadas de API (novo)
│   ├── credits.js          # Sistema de créditos (novo)
│   ├── mockup.js           # Gerador de mockups (novo)
│   ├── background.js       # Remoção de fundo (novo)
│   └── download.js         # Gerador de ZIP (novo)
│
├── assets/
│   ├── mockup-templates/
│   │   ├── tshirt-black.png
│   │   ├── tshirt-white.png
│   │   ├── hoodie-gray.png
│   │   └── templates.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── images/
│       └── logo.svg
│
├── config/
│   ├── supabase.js         # Config Supabase
│   └── api-keys.js         # (gitignore) Chaves de API
│
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── robots.txt
└── README.md
```

### 12.2 Arquivos Novos a Criar

| Arquivo | Descrição | Prioridade |
|---------|-----------|------------|
| `js/i18n.js` | Sistema de traduções | 🔴 Alta |
| `js/studio.js` | Lógica do fluxo completo | 🔴 Alta |
| `js/api.js` | Chamadas Gemini/FAL.ai | 🔴 Alta |
| `js/mockup.js` | Composição Canvas | 🔴 Alta |
| `js/background.js` | Integração @imgly | 🟡 Média |
| `js/credits.js` | Controle de créditos | 🟡 Média |
| `js/download.js` | Empacotamento ZIP | 🟡 Média |
| `css/studio.css` | Estilos do Studio | 🟡 Média |
| `assets/mockup-templates/*` | Templates de mockup | 🔴 Alta |

### 12.3 Arquivos a Atualizar

| Arquivo | Mudanças | Prioridade |
|---------|----------|------------|
| `app.html` | Adicionar seção Studio, seletor de idioma | 🔴 Alta |
| `js/app.js` | Integrar Studio, i18n | 🔴 Alta |
| `js/data.js` | Novos nichos e estilos | 🔴 Alta |
| `css/styles.css` | Estilos do seletor de idioma | 🟡 Média |
| `sw.js` | Cachear novos assets | 🟢 Baixa |

---

## 13. DECISÕES TÉCNICAS

### 13.1 Decisões Tomadas

| Decisão | Opções Consideradas | Escolha | Motivo |
|---------|---------------------|---------|--------|
| API de Imagem (Fase 1) | Gemini, FAL.ai, Replicate | **Gemini** | 1.500/dia grátis |
| API de Imagem (Fase 2) | Gemini Pago, FAL.ai | **FAL.ai** | 10x mais barato |
| Remoção de Fundo | API remove.bg, @imgly browser | **@imgly** | Grátis, no browser |
| Mockups | API Placeit, Canvas API | **Canvas API** | Grátis, customizável |
| Framework JS | React, Vue, Vanilla | **Vanilla** | Simplicidade, já existente |
| Download | Links individuais, ZIP | **ZIP** | Melhor UX |
| Idiomas | PT apenas, Multi-idioma | **PT/EN/ES** | Mercado global |
| Prompt visível | Sim, Não | **Não (oculto)** | Proteção de IP |

### 13.2 Trade-offs Aceitos

| Trade-off | Impacto Negativo | Impacto Positivo |
|-----------|------------------|------------------|
| Gemini free tier | Limite 1.500/dia | Zero custo inicial |
| Processamento no browser | Lento em celulares fracos | Zero custo de servidor |
| Vanilla JS | Menos features prontas | Sem dependências, leve |
| 3 mockups fixos | Menos opções | Simplicidade, rapidez |

### 13.3 Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Gemini API fora do ar | Baixa | Alto | Fallback para FAL.ai |
| Limite 1.500 estourado | Média | Médio | Migrar para FAL.ai |
| @imgly qualidade ruim | Baixa | Médio | Opção de API paga |
| Celulares travam | Média | Médio | Loading states, timeout |

---

## 14. ROADMAP DE IMPLEMENTAÇÃO

### 14.1 Fase 1: Core (Semana 1)

| Dia | Tarefa | Arquivos |
|-----|--------|----------|
| Dia 1 | Sistema de idiomas (i18n) | `i18n.js`, `data.js` |
| Dia 2 | Novos nichos e estilos | `data.js` |
| Dia 3 | Integração Gemini API | `api.js` |
| Dia 4 | Sistema de mockups (Canvas) | `mockup.js`, templates |
| Dia 5 | UI do Studio | `app.html`, `studio.css` |
| Dia 6 | Integração fluxo completo | `studio.js` |
| Dia 7 | Testes e correções | - |

### 14.2 Fase 2: Polish (Semana 2)

| Dia | Tarefa | Arquivos |
|-----|--------|----------|
| Dia 8 | Remoção de fundo (@imgly) | `background.js` |
| Dia 9 | Sistema de créditos | `credits.js`, Supabase |
| Dia 10 | Download ZIP | `download.js` |
| Dia 11 | Copy de vendas | `api.js` |
| Dia 12 | Posts social media | `api.js` |
| Dia 13 | Testes end-to-end | - |
| Dia 14 | Deploy e monitoramento | Vercel |

### 14.3 Fase 3: Escala (Semana 3-4)

| Semana | Tarefa |
|--------|--------|
| Semana 3 | Integração FAL.ai (backup/escala) |
| Semana 3 | Sistema de analytics |
| Semana 4 | Mais templates de mockup |
| Semana 4 | Otimizações de performance |

### 14.4 Fase 4: Expansão (Mês 2+)

| Mês | Tarefa |
|-----|--------|
| Mês 2 | Upscale integrado |
| Mês 2 | Mais nichos e estilos |
| Mês 3 | API para terceiros |
| Mês 3 | White-label B2B |

---

## 15. CHECKLIST DE IMPLEMENTAÇÃO

### 15.1 Pré-Implementação

```
□ Criar conta Google AI Studio
□ Gerar API Key Gemini
□ Configurar variáveis de ambiente
□ Baixar/criar templates de mockup (PNG)
□ Fazer backup dos arquivos atuais
□ Criar branch de desenvolvimento
```

### 15.2 Sistema de Idiomas

```
□ Criar arquivo i18n.js com todas as traduções
□ Adicionar função t() para tradução
□ Adicionar função setLanguage()
□ Adicionar atributos data-i18n no HTML
□ Implementar detecção automática de idioma
□ Testar todos os textos em PT/EN/ES
```

### 15.3 Banco de Dados

```
□ Adicionar novos nichos em data.js (61 total)
□ Adicionar traduções de nichos
□ Adicionar novos estilos (30 total)
□ Adicionar traduções de estilos
□ Adicionar keywords por idioma
□ Testar seleção de nichos/estilos
```

### 15.4 Integração de APIs

```
□ Criar arquivo api.js
□ Implementar generateImage() com Gemini
□ Implementar generateCopy() com Gemini Flash
□ Implementar generateSocialPosts()
□ Criar prompts secretos otimizados
□ Testar geração de imagem
□ Testar geração de texto
□ Implementar tratamento de erros
□ Implementar retry automático
```

### 15.5 Sistema de Mockups

```
□ Criar/obter templates PNG de alta qualidade
□ Criar arquivo mockup.js
□ Implementar composição com Canvas API
□ Ajustar posicionamento e escala
□ Testar com diferentes tamanhos de estampa
□ Otimizar performance
```

### 15.6 Remoção de Fundo

```
□ Instalar @imgly/background-removal via CDN
□ Criar arquivo background.js
□ Implementar função removeBackground()
□ Adicionar loading state durante processamento
□ Testar com diferentes tipos de imagem
□ Implementar fallback se falhar
```

### 15.7 Sistema de Créditos

```
□ Criar tabelas no Supabase
□ Configurar RLS policies
□ Criar arquivo credits.js
□ Implementar checkCredits()
□ Implementar deductCredits()
□ Implementar calculateTotalCredits()
□ Adicionar UI de créditos restantes
□ Testar fluxo de dedução
```

### 15.8 Download e Empacotamento

```
□ Instalar JSZip via CDN
□ Criar arquivo download.js
□ Implementar createZip()
□ Adicionar todos os assets ao ZIP
□ Testar download em diferentes browsers
□ Testar em mobile
```

### 15.9 Interface do Studio

```
□ Adicionar seção Studio no app.html
□ Criar seletor de idioma no header
□ Criar checkboxes de opções
□ Criar barra de progresso
□ Criar área de resultados
□ Criar botões de ação
□ Estilizar com studio.css
□ Testar responsividade
```

### 15.10 Testes Finais

```
□ Testar fluxo completo (PT)
□ Testar fluxo completo (EN)
□ Testar fluxo completo (ES)
□ Testar em Chrome
□ Testar em Firefox
□ Testar em Safari
□ Testar em mobile Android
□ Testar em mobile iOS
□ Testar com diferentes nichos
□ Testar com diferentes estilos
□ Testar limite de créditos
□ Testar erros de API
□ Testar sem conexão
```

### 15.11 Deploy

```
□ Atualizar CACHE_NAME no sw.js
□ Commit e push para branch principal
□ Deploy no Vercel
□ Testar em produção
□ Monitorar erros
□ Monitorar uso de API
```

---

## 16. MÉTRICAS DE SUCESSO

### 16.1 KPIs Técnicos

| Métrica | Meta | Ferramenta |
|---------|------|------------|
| Tempo de geração | < 30 segundos | Console timing |
| Taxa de erro API | < 5% | Supabase logs |
| Lighthouse Score | > 80 | Chrome DevTools |
| Tamanho do bundle | < 500KB | Build analysis |

### 16.2 KPIs de Produto

| Métrica | Meta | Ferramenta |
|---------|------|------------|
| Conversão trial→pago | > 10% | Supabase analytics |
| Criações/usuário/mês | > 5 | credit_usage table |
| Retenção 30 dias | > 40% | Supabase analytics |
| NPS | > 40 | Formulário in-app |

### 16.3 KPIs de Negócio

| Métrica | Meta Mês 1 | Meta Mês 3 |
|---------|------------|------------|
| Usuários ativos | 100 | 500 |
| Receita MRR | R$ 1.000 | R$ 5.000 |
| Custo de API | R$ 0* | R$ 200 |
| Lucro | R$ 1.000 | R$ 4.800 |

*Fase 1 com Gemini grátis

---

## 17. TROUBLESHOOTING

### 17.1 Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "API rate limit exceeded" | Passou 1.500/dia | Migrar para FAL.ai ou aguardar reset |
| "Failed to remove background" | Imagem muito grande | Reduzir tamanho antes do upload |
| "Canvas tainted" | CORS na imagem | Usar proxy ou base64 |
| "Credits insuficientes" | Acabaram créditos | Mostrar modal de upgrade |
| "Network error" | Sem conexão | Mostrar toast de erro |

### 17.2 Fallbacks

```javascript
// Se Gemini falhar, tentar FAL.ai
async function generateImageWithFallback(prompt) {
  try {
    return await generateImageGemini(prompt);
  } catch (error) {
    console.warn('Gemini failed, trying FAL.ai:', error);
    try {
      return await generateImageFal(prompt);
    } catch (falError) {
      console.error('All image APIs failed:', falError);
      throw new Error('Não foi possível gerar a imagem. Tente novamente.');
    }
  }
}
```

### 17.3 Contatos de Suporte

| Serviço | Documentação | Suporte |
|---------|--------------|---------|
| Gemini API | ai.google.dev/docs | Google Cloud Support |
| FAL.ai | docs.fal.ai | Discord FAL.ai |
| Supabase | supabase.com/docs | GitHub Issues |
| Vercel | vercel.com/docs | vercel.com/support |

---

## 18. CONCLUSÃO

### 18.1 Resumo Executivo

O **PromptForge Studio v4.0** representa uma evolução completa do produto, transformando-o de um simples gerador de prompts em uma **plataforma completa de criação de estampas para POD**.

**Principais entregas:**
- ✅ Fluxo unificado (sem sair do app)
- ✅ 3 idiomas (PT/EN/ES)
- ✅ 61 nichos globais
- ✅ 30 estilos visuais
- ✅ Custo zero inicial (Gemini free tier)
- ✅ Escalável para milhares de usuários

### 18.2 Próximos Passos Imediatos

1. **Enviar arquivos atuais** (app.html, app.js, styles.css, data.js)
2. **Criar conta Google AI Studio** e gerar API Key
3. **Criar/obter templates de mockup** (3 PNGs)
4. **Iniciar implementação** seguindo o checklist

### 18.3 Compromisso

Este documento serve como contrato técnico do projeto. Todas as decisões aqui documentadas foram aprovadas e devem ser seguidas durante a implementação.

---

**FIM DA DOCUMENTAÇÃO OFICIAL - PROMPTFORGE STUDIO v4.0**

*Documento gerado em: 11 de Janeiro de 2026*  
*Próxima revisão: Após conclusão da Fase 1*

---

## 📎 ANEXOS

### Anexo A: Links Úteis

- Google AI Studio: https://aistudio.google.com
- FAL.ai: https://fal.ai
- Supabase: https://supabase.com
- Vercel: https://vercel.com
- @imgly Background Removal: https://img.ly/background-removal

### Anexo B: Referências de Design

- Mockup Templates: Buscar em Freepik, Placeit, ou criar próprios
- Ícones: Lucide Icons, Heroicons
- Cores: Manter design system atual (CSS Variables)

### Anexo C: Histórico de Versões deste Documento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 11/01/2026 | Claude + Saulo | Documento inicial completo |
