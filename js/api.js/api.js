javascript
/**
 * Configuração da API Google Books
 */
const API_CONFIG = {
    BASE_URL: 'https://www.googleapis.com/books/v1/volumes',
    MAX_RESULTS: 20,
    LANG_RESTRICT: 'pt-BR',
    ORDER_BY: 'relevance'
};

/**
 * Busca livros na API do Google Books
 * @param {string} query - Termo de busca
 * @param {number} maxResults - Máximo de resultados (padrão: 20)
 * @returns {Promise<ResultadoBusca>}
 */
async function buscarLivrosAPI(query, maxResults = 20) {
    // Validação da entrada
    if (!query || query.trim() === '') {
        throw new Error('Por favor, digite um termo para busca');
    }

    try {
        // Construção da URL com parâmetros
        const url = `${API_CONFIG.BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&langRestrict=${API_CONFIG.LANG_RESTRICT}&orderBy=${API_CONFIG.ORDER_BY}`;
        
        console.log(`Buscando: ${url}`); // Log para debug
        
        const response = await fetch(url);
        
        // Verifica se a requisição foi bem sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Processa os resultados
        let livros = [];
        if (data.items && data.items.length > 0) {
            livros = data.items.map(item => Livro.fromApiData(item));
        }
        
        const totalItems = data.totalItems || 0;
        
        return new ResultadoBusca(totalItems, livros, query);
        
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        
        // Tratamento específico para erros de rede
        if (error.message.includes('fetch') || error.message.includes('network')) {
            throw new Error('Erro de conexão. Verifique sua internet.');
        }
        
        throw error;
    }
}

/**
 * Busca um livro específico por ID
 * @param {string} id - ID do livro no Google Books
 * @returns {Promise<Livro>}
 */
async function buscarLivroPorId(id) {
    if (!id || id.trim() === '') {
        throw new Error('ID do livro não fornecido');
    }
    
    try {
        const url = `${API_CONFIG.BASE_URL}/${id}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        return Livro.fromApiData(data);
        
    } catch (error) {
        console.error('Erro ao buscar livro por ID:', error);
        throw new Error('Não foi possível carregar os detalhes do livro');
    }
}

/**
 * Busca sugestões de livros (para autocomplete)
 * @param {string} query - Termo parcial
 * @returns {Promise<Array>}
 */
async function buscarSugestoes(query) {
    if (!query || query.length < 2) return [];
    
    try {
        const resultado = await buscarLivrosAPI(query, 5);
        return resultado.livros;
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        return [];
    }
}
