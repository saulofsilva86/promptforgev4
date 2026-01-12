// =============================================
// AUTH.JS - MOCK PARA TESTE (SEM AUTENTICAÇÃO)
// =============================================

window.auth = {
    // Simula usuário autenticado
    verificarAutenticacao() {
        console.log('✅ Autenticação simulada (modo teste)');
        return true;
    },
    
    // Retorna email de teste
    getUser() {
        return {
            email: 'teste@promptforge.com',
            name: 'Usuário Teste'
        };
    },
    
    // Retorna email
    getEmail() {
        return 'teste@promptforge.com';
    },
    
    // Simula estar logado
    isAuthenticated() {
        return true;
    }
};

console.log('✅ auth.js (mock) carregado');