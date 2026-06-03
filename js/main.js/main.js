javascript
/**
 * Variáveis globais da aplicação
 */
let buscaAtual = null;      // Último resultado de busca
let isLoading = false;       // Estado de carregamento

/**
 * Realiza a busca de livros
 * @param {string} query - Termo de busca
 */
async function realizarBusca(query) {
    // Evita múltiplas buscas simultâneas
    if (isLoading) {
        console.log('Busca já em andamento...');
        return;
    }
    
    const maxResults = parseInt(elementos.maxResultsSelect.value);
    
    isLoading = true;
    mostrarLoading();
    limparResultados();
    
    try {
        const resultado = await buscarLivrosAPI(query, maxResults);
        buscaAtual = resultado;
        
        esconderLoading();
        
        if (resultado.temResultados()) {
            mostrarResultados(resultado.livros);
            console.log(resultado.getResumo()); // Log para debug
        } else {
            mostrarVazio();
        }
        
    } catch (error) {
        esconderLoading();
        console.error('Erro na busca:', error);
        
        // Tratamento amigável de erros
        let mensagemErro = '';
        if (error.message.includes('conexão') || error.message.includes('internet')) {
            mensagemErro = '⚠️ Sem conexão com a internet. Verifique sua rede.';
        } else if (error.message.includes('termo')) {
            mensagemErro = '⚠️ ' + error.message;
        } else {
            mensagemErro = '⚠️ Erro ao buscar livros. Tente novamente mais tarde.';
        }
        
        alert(mensagemErro);
        mostrarVazio();
        
    } finally {
        isLoading = false;
    }
}

/**
 * Realiza busca aleatória para descobrir novos livros
 */
async function buscarAleatorio() {
    const termos = ['ficção científica', 'aventura', 'romance', 'biografia', 'história', 'filosofia'];
    const termoAleatorio = termos[Math.floor(Math.random() * termos.length)];
    elementos.searchInput.value = termoAleatorio;
    await realizarBusca(termoAleatorio);
}

/**
 * Inicializa a aplicação
 */
async function init() {
    console.log('🚀 BuscaLivros - Aplicação iniciada');
    
    // Configura eventos da UI
    configurarEventListeners();
    
    // Busca inicial com um termo popular
    mostrarLoading();
    try {
        const resultadosIniciais = await buscarLivrosAPI('programação javascript', 12);
        esconderLoading();
        
        if (resultadosIniciais.temResultados()) {
            mostrarResultados(resultadosIniciais.livros);
            elementos.searchInput.value = 'programação javascript';
            buscaAtual = resultadosIniciais;
        } else {
            mostrarVazio();
        }
    } catch (error) {
        esconderLoading();
        console.error('Erro na busca inicial:', error);
        mostrarVazio();
    }
}

/**
 * Exporta funções para uso global (se necessário)
 */
window.BuscaLivros = {
    realizarBusca,
    buscarAleatorio,
    getBuscaAtual: () => buscaAtual
};

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
