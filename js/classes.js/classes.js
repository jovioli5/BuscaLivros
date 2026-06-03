javascript
/**
 * Classe Livro - Modelo de dados
 * Versão sem imagem, data e categoria nos cards
 */
class Livro {
    constructor(id, titulo, autores, descricao, previewLink, infoLink) {
        this.id = id;                           // Identificador único do Google Books
        this.titulo = titulo;                   // Título do livro
        this.autores = autores || ['Autor não informado'];  // Array de autores
        this.descricao = descricao || 'Descrição não disponível';  // Descrição completa
        this.previewLink = previewLink || '#';  // Link para pré-visualização
        this.infoLink = infoLink || '#';        // Link com mais informações
    }

    /**
     * Formata os autores para exibição
     * @returns {string} Autores formatados como string
     */
    getAutoresFormatados() {
        if (Array.isArray(this.autores)) {
            return this.autores.join(', ');
        }
        return this.autores;
    }

    /**
     * Verifica se o livro tem descrição
     * @returns {boolean}
     */
    temDescricao() {
        return this.descricao && this.descricao !== 'Descrição não disponível';
    }

    /**
     * Obtém resumo da descrição (primeiros 300 caracteres)
     * @returns {string}
     */
    getResumoDescricao() {
        if (!this.temDescricao()) return this.descricao;
        if (this.descricao.length <= 300) return this.descricao;
        return this.descricao.substring(0, 300) + '...';
    }

    /**
     * Factory method para criar Livro a partir dos dados da API
     * @param {Object} item - Item da resposta da API do Google Books
     * @returns {Livro}
     */
    static fromApiData(item) {
        const volumeInfo = item.volumeInfo || {};
        const id = item.id;
        const titulo = volumeInfo.title || 'Título não disponível';
        const autores = volumeInfo.authors || ['Autor não informado'];
        const descricao = volumeInfo.description || 'Descrição não disponível';
        const previewLink = volumeInfo.previewLink || '#';
        const infoLink = volumeInfo.infoLink || '#';
        
        return new Livro(id, titulo, autores, descricao, previewLink, infoLink);
    }
}

/**
 * Classe ResultadoBusca - Gerencia resultados de busca
 */
class ResultadoBusca {
    constructor(totalItems, livros, query) {
        this.totalItems = totalItems;    // Total encontrado na API
        this.livros = livros;            // Array de objetos Livro
        this.query = query;              // Termo pesquisado
        this.timestamp = new Date();     // Data/hora da busca
    }

    /**
     * Retorna total de itens encontrados
     * @returns {number}
     */
    getTotalEncontrado() {
        return this.totalItems;
    }

    /**
     * Retorna quantidade de livros neste resultado
     * @returns {number}
     */
    getQuantidadeLivros() {
        return this.livros.length;
    }

    /**
     * Verifica se há resultados
     * @returns {boolean}
     */
    temResultados() {
        return this.livros.length > 0;
    }

    /**
     * Obtém mensagem de resumo da busca
     * @returns {string}
     */
    getResumo() {
        if (!this.temResultados()) {
            return `Nenhum livro encontrado para "${this.query}"`;
        }
        return `Encontrados ${this.totalItems} livros para "${this.query}" (exibindo ${this.getQuantidadeLivros()})`;
    }
}
