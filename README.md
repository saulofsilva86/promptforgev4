# 🎨 PROMPTFORGE STUDIO v4.0

> **Plataforma completa para criação de designs POD (Print on Demand) com Inteligência Artificial**

[![Status](https://img.shields.io/badge/status-complete-success)](https://github.com)
[![Version](https://img.shields.io/badge/version-4.0-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com)

---

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura](#estrutura)
- [Configuração](#configuração)
- [Deploy](#deploy)
- [Créditos](#créditos)

---

## 🎯 Sobre

**PromptForge Studio v4.0** é uma plataforma web completa que automatiza todo o processo de criação de designs para produtos Print on Demand (POD).

### O que faz?

1. **Gera designs** usando IA (Gemini Imagen 3)
2. **Remove fundos** automaticamente (no navegador, zero custo)
3. **Cria mockups** em produtos (camisetas, moletons)
4. **Gera textos de venda** otimizados
5. **Cria posts sociais** prontos para uso
6. **Empacota tudo em ZIP** organizado

### Workflow Automático (20-40 segundos)

```
Selecionar → Gerar → Processar → Mockups → Conteúdo → Download
   🎯         🤖        ✨          👕          ✍️         📦
```

---

## ✨ Funcionalidades

### 🌍 **Multi-idioma**
- Português (BR)
- English (US)
- Español (ES)

### 🎨 **Base de Dados Global**
- **61 nichos** (Coffee, Fitness, Gaming, Pets, etc.)
- **30 estilos** visuais (Minimalist, Vintage, Cartoon, etc.)
- **9 paletas** de cores
- **6 mercados** (BR, US, EU, LATAM, AU, Global)

### 🤖 **Integração com IAs**
- **Gemini Imagen 3** (FREE - 1500/dia)
- **FAL.ai Flux** (Fallback pago - $0.003/imagem)
- **Gemini Flash 2.0** (Textos - FREE)

### 💳 **Sistema de Créditos**
- Gerenciamento com Supabase
- Auto-reset mensal (planos pagos)
- Histórico completo de uso
- 3 planos: Free (5), Mensal (30), Anual (100)

### 🖼️ **Processamento de Imagens**
- Remoção de fundo (100% navegador - zero custo)
- Geração de mockups (Canvas API)
- Cache inteligente
- Batch processing

### 📦 **Download Organizado**
- ZIP estruturado profissionalmente
- Design PNG transparente
- 3 mockups (camiseta preta, branca, moletom)
- Copy de vendas (TXT + JSON)
- Posts sociais
- Metadados + README

### 🎨 **Interface Moderna**
- Design profissional
- Responsiva (mobile-first)
- Dark mode ready
- Animações suaves
- Progress tracking em tempo real

---

## 🛠️ Tecnologias

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animações)
- JavaScript ES6+

### APIs & Serviços
- Google Gemini AI
- FAL.ai
- Supabase (PostgreSQL)

### Bibliotecas
- JSZip (empacotamento)
- @imgly/background-removal (remoção de fundo)

### Ferramentas
- Canvas API (mockups)
- localStorage (cache local)
- Fetch API (requisições)

---

## 📦 Instalação

### 1. Download dos Arquivos

```bash
# Clone ou baixe os 11 arquivos:
i18n.js
data.js
api.js
credits.js
background.js
mockup.js
download.js
studio.js
app.html
studio.css
app.js
```

### 2. Estrutura de Pastas

```
promptforge-v4/
├── app.html              ← Abrir este arquivo
├── studio.css
├── app.js
├── studio.js
├── download.js
├── background.js
├── mockup.js
├── credits.js
├── api.js
├── data.js
├── i18n.js
├── auth.js               ← Já existente
└── templates/            ← Criar pasta
    ├── tshirt_black.png
    ├── tshirt_white.png
    └── hoodie_gray.png
```

### 3. Templates de Mockups (Opcional)

Baixe templates PNG transparentes de:
- [Placeit](https://placeit.net)
- [Freepik](https://freepik.com)
- [Mockup World](https://mockupworld.co)

Ou use os placeholders incluídos.

---

## ⚙️ Configuração

### 1. API Keys

#### Gemini AI (Grátis - 1500/dia)
1. Acesse: https://aistudio.google.com/apikey
2. Crie uma API key
3. Configure no código:

```javascript
// Em api.js ou na interface
promptForgeAPI.setAPIKeys('SUA_GEMINI_KEY_AQUI');
```

#### FAL.ai (Opcional - Fallback Pago)
1. Acesse: https://fal.ai
2. Adicione crédito ($5-10)
3. Configure:

```javascript
promptForgeAPI.setAPIKeys('SUA_GEMINI_KEY', 'SUA_FAL_KEY');
```

### 2. Supabase (Sistema de Créditos)

1. Crie conta em: https://supabase.com
2. Crie novo projeto
3. Execute o SQL em `supabase_schema.sql`
4. Configure credenciais em `credits.js`:

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-anon-key';
```

---

## 🚀 Uso

### Método 1: Abrir Direto

```bash
# Simplesmente abra app.html no navegador
# Chrome, Firefox, Safari, Edge
```

### Método 2: Servidor Local

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000

# Depois acesse:
http://localhost:8000/app.html
```

### Workflow Básico

1. **Abrir** `app.html` no navegador
2. **Login** (se configurado)
3. **Selecionar:**
   - Nicho (ex: Coffee)
   - Estilo (ex: Minimalist)
   - Ideia (ex: "Coffee lover cartoon")
4. **Clicar** "🚀 Gerar Tudo Automaticamente"
5. **Aguardar** 20-40 segundos
6. **Baixar** pacote ZIP completo
7. **Pronto!** Use os arquivos em plataformas POD

---

## 📂 Estrutura do Código

### Partes do Sistema

| Parte | Arquivo | Descrição |
|-------|---------|-----------|
| 1 | `i18n.js` | Sistema de idiomas (PT/EN/ES) |
| 2 | `data.js` | 61 nichos + 30 estilos + dados globais |
| 3 | `api.js` | Integração Gemini + FAL.ai + textos |
| 4 | `credits.js` | Sistema de créditos Supabase |
| 5 | `background.js` | Remoção de fundo (browser) |
| 5 | `mockup.js` | Geração de mockups (Canvas) |
| 6 | `download.js` | Empacotamento ZIP |
| 7 | `studio.js` | Orquestração completa |
| 8 | `app.html` | Interface HTML |
| 8 | `studio.css` | Estilos CSS |
| 8 | `app.js` | Controller UI |

### Fluxo de Dados

```
┌─────────┐
│  User   │
└────┬────┘
     │ (seleção)
     ▼
┌─────────────┐     ┌──────────┐     ┌────────────┐
│   app.js    │────▶│studio.js │────▶│   api.js   │
│ (UI Control)│     │(Orquest) │     │(IA APIs)   │
└─────────────┘     └────┬─────┘     └────────────┘
                         │
                         ├──▶ background.js (processar)
                         ├──▶ mockup.js (mockups)
                         ├──▶ credits.js (deduzir)
                         └──▶ download.js (empacotar)
```

---

## 🎨 Customização

### Cores da Interface

```css
/* Em studio.css */
:root {
    --primary: #6366f1;      /* Azul padrão */
    --secondary: #8b5cf6;    /* Roxo */
    
    /* Alterar para outras cores: */
    --primary: #ec4899;      /* Rosa */
    --primary: #10b981;      /* Verde */
    --primary: #f59e0b;      /* Laranja */
}
```

### Adicionar Novos Nichos

```javascript
// Em data.js
const NICHOS = [
    // ... nichos existentes
    {
        id: 'meu_nicho',
        name: { pt: 'Meu Nicho', en: 'My Niche', es: 'Mi Nicho' },
        icon: '🎯',
        categoria: 'hobby',
        keywords: 'palavras-chave, relevantes',
        markets: ['global']
    }
];
```

### Adicionar Novos Estilos

```javascript
// Em data.js
const ESTILOS = [
    // ... estilos existentes
    {
        id: 'meu_estilo',
        name: { pt: 'Meu Estilo', en: 'My Style', es: 'Mi Estilo' },
        emoji: '🎨',
        promptBase: 'descrição do estilo para IA',
        grupo: 'modernos'
    }
];
```

---

## 🚀 Deploy

### GitHub Pages (Grátis)

```bash
git init
git add .
git commit -m "PromptForge v4.0"
git remote add origin https://github.com/usuario/promptforge-v4.git
git push -u origin main

# Ativar no GitHub:
# Settings → Pages → Source: main branch
```

### Vercel (Grátis)

```bash
npm i -g vercel
vercel
```

### Netlify (Grátis)

```bash
# Arrastar pasta para: netlify.com/drop
# Ou usar CLI:
npm i -g netlify-cli
netlify deploy
```

---

## 💰 Custos

### Opção 1: 100% Grátis

- ✅ **Gemini Imagen 3:** FREE (1500 imagens/dia)
- ✅ **Gemini Flash 2.0:** FREE (textos ilimitados)
- ✅ **Remoção de fundo:** FREE (browser-based)
- ✅ **Mockups:** FREE (Canvas API)
- ✅ **Hospedagem:** FREE (GitHub Pages, Vercel, Netlify)

**Custo total:** R$ 0,00/mês 🎉

### Opção 2: Com Fallback (Recomendado)

- ✅ Tudo acima GRÁTIS
- ➕ **FAL.ai:** $0.003/imagem (apenas se Gemini falhar)
- ➕ **Supabase:** FREE (até 500MB)

**Custo:** ~R$ 10-20/mês (se usar fallback)

### Opção 3: Produção

- ✅ Tudo acima
- ➕ **Domínio:** ~R$ 40/ano
- ➕ **Supabase Pro:** $25/mês (opcional)

**Custo:** ~R$ 150/mês

---

## 📊 Estatísticas

### Código
- **11 arquivos** JavaScript/HTML/CSS
- **~8.000 linhas** de código
- **8 partes** sequenciais
- **100% funcional**

### Funcionalidades
- **61 nichos** globais
- **30 estilos** visuais
- **9 paletas** de cores
- **3 idiomas** completos
- **6 etapas** automáticas
- **1 workflow** integrado

### Performance
- ⚡ Carregamento: < 2s
- 🎨 Geração: 3-5s
- ✨ Processamento: 5-15s
- 📦 Empacotamento: 2-5s
- **Total:** 20-40s (workflow completo)

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### v4.1 (Próxima)
- [ ] Dark mode toggle
- [ ] Mais templates de mockups
- [ ] Export para Canva
- [ ] Integração com Printful API

### v4.2 (Futuro)
- [ ] Editor de imagens integrado
- [ ] Biblioteca de designs salvos
- [ ] Colaboração em tempo real
- [ ] App mobile (React Native)

### v5.0 (Longo Prazo)
- [ ] IA generativa própria
- [ ] Marketplace de designs
- [ ] Sistema de afiliados
- [ ] White label

---

## ❓ FAQ

### Como funciona o sistema de créditos?
Cada operação consome créditos. Geração de design = 1 crédito, remoção de fundo = 1 crédito, etc.

### Preciso pagar para usar?
Não! A versão gratuita tem 5 créditos e usa apenas APIs grátis.

### Quanto tempo demora para gerar tudo?
Entre 20-40 segundos para o workflow completo (design + mockups + textos).

### Os designs têm copyright?
Imagens geradas por IA podem ter restrições. Verifique termos do Gemini/FAL.ai.

### Posso vender os designs?
Sim, mas verifique termos de uso das APIs de IA utilizadas.

### Funciona offline?
Não, precisa de internet para APIs de IA. Mas processamento de imagens é local.

### Onde ficam meus dados?
Seleções no localStorage. Créditos no Supabase. API keys na memória (não salvos).

---

## 📄 Licença

MIT License - veja arquivo LICENSE para detalhes.

---

## 🙏 Agradecimentos

- **Google Gemini** pela API de geração de imagens
- **FAL.ai** pelo fallback confiável
- **Supabase** pelo backend gratuito
- **@imgly** pela lib de remoção de fundo
- **Você** por usar o PromptForge! 🎉

---

## 📧 Contato

- **Email:** contato@promptforge.com
- **Website:** https://promptforgev2.vercel.app
- **GitHub:** https://github.com/usuario/promptforge-v4

---

## 🎉 Status do Projeto

```
✅ PARTE 1: i18n.js ........................... COMPLETO
✅ PARTE 2: data.js ........................... COMPLETO
✅ PARTE 3: api.js ............................ COMPLETO
✅ PARTE 4: credits.js ........................ COMPLETO
✅ PARTE 5: background.js + mockup.js ......... COMPLETO
✅ PARTE 6: download.js ....................... COMPLETO
✅ PARTE 7: studio.js ......................... COMPLETO
✅ PARTE 8: app.html + studio.css + app.js .... COMPLETO

🎊 PROJETO 100% CONCLUÍDO 🎊
```

---

<div align="center">

**PromptForge Studio v4.0**

*Transformando ideias em designs profissionais com IA*

[![Website](https://img.shields.io/badge/website-promptforge.com-blue)](https://promptforgev2.vercel.app)
[![GitHub](https://img.shields.io/badge/github-promptforge--v4-black)](https://github.com)

Made with ❤️ and ☕

</div>
