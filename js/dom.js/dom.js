javascript
/**
 * Mapeamento de elementos DOM
 */
const elementos = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    maxResultsSelect: document.getElementById('maxResultsSelect'),
    loading: document.getElementById('loading'),
    resultados: document.getElementById('resultados'),
    vazio: document.getElementById('vazio'),
    modal: document.getElementById('modal'),
    modalCorpo: document.getElementById('modalCorpo'),
    fecharModal: document.querySelector('.fechar')
};

/**
 * Controla exibição do loading
 */
function mostrarLoading() {
    elementos.loading.classList.remove('hidden');
    elementos.resultados.classList.add('hidden');
    elementos.vazio.classList.add('hidden');
}

function esconderLoading() {
    elementos.loading.classList.add('hidden');
}

/**
 * Exibe os resultados na tela
 * @param {Array<Livro>} livros - Array de livros para exibir
 */
function mostrarResultados(livros) {
    if (!livros || livros.length === 0) {
        mostrarVazio();
        return;
    }
    
    // Limpa e recria os cards
    elementos.resultados.innerHTML = '';
    
    livros.forEach(livro => {
        const card = criarCardLivro(livro);
        elementos.resultados.appendChild(card);
    });
    
    elementos.resultados.classList.remove('hidden');
    elementos.vazio.classList.add('hidden');
}

/**
 * Exibe mensagem quando não há resultados
 */
function mostrarVazio() {
    elementos.resultados.classList.add('hidden');
    elementos.resultados.innerHTML = '';
    elementos.vazio.classList.remove('hidden');
}

/**
 * Cria um card para o livro (SEM IMAGEM, SEM DATA, SEM CATEGORIA)
 * @param {Livro} livro - Objeto Livro
 * @returns {HTMLElement} Card do livro
 */
function criarCardLivro(livro) {
    const card = document.createElement('div');
    card.className = 'card-livro';
    card.addEventListener('click', () => mostrarDetalhesLivro(livro.id));
    
    // Container de informações (sem imagem)
    const infoDiv = document.createElement('div');
    infoDiv.className = 'card-info';
    
    // Título do livro
    const titulo = document.createElement('h3');
    const tituloTexto = livro.titulo;
    titulo.textContent = tituloTexto.length > 65 ? 
        tituloTexto.substring(0, 65) + '...' : 
        tituloTexto;
    titulo.title = livro.titulo; // Tooltip com título completo
    
    // Autor(es)
    const autor = document.createElement('div');
    autor.className = 'card-autor';
    autor.innerHTML = `<i class="fas fa-user"></i> ${livro.getAutoresFormatados()}`;
    
    infoDiv.appendChild(titulo);
    infoDiv.appendChild(autor);
    
    card.appendChild(infoDiv);
    
    return card;
}

/**
 * Exibe modal com detalhes do livro (SEM IMAGEM)
 * @param {string} id - ID do livro
 */
async function mostrarDetalhesLivro(id) {
    try {
        mostrarLoading();
        const livro = await buscarLivroPorId(id);
        esconderLoading();
        
        // Monta HTML do modal (sem imagem)
        const modalHTML = `
            <div class="modal-detalhes">
                <h2>${escapeHtml(livro.titulo)}</h2>
                <div class="modal-autores">
                    <i class="fas fa-user"></i> ${escapeHtml(livro.getAutoresFormatados())}
                </div>
                <h3><i class="fas fa-align-left"></i> Sobre o Livro</h3>
                <p>${escapeHtml(livro.descricao)}</p>
                <div class="modal-links">
                    ${livro.previewLink !== '#' ? `
                        <a href="${livro.previewLink}" target="_blank" class="btn-link">
                            <i class="fas fa-eye"></i> Visualizar Prévia
                        </a>
                    ` : ''}
                    ${livro.infoLink !== '#' ? `
                        <a href="${livro.infoLink}" target="_blank" class="btn-link">
                            <i class="fas fa-info-circle"></i> Mais Informações
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        elementos.modalCorpo.innerHTML = modalHTML;
        abrirModal();
        
    } catch (error) {
        esconderLoading();
        console.error('Erro ao carregar detalhes:', error);
        alert('Erro ao carregar detalhes do livro. Tente novamente.');
    }
}

/**
 * Função auxiliar para evitar XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string}
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Abre o modal
 */
function abrirModal() {
    elementos.modal.classList.add('visible');
    elementos.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evita scroll do body
}

/**
 * Fecha o modal
 */
function fecharModal() {
    elementos.modal.classList.remove('visible');
    elementos.modal.style.display = 'none';
    document.body.style.overflow = ''; // Restaura scroll
}

/**
 * Limpa os resultados da tela
 */
function limparResultados() {
    elementos.resultados.innerHTML = '';
}

/**
 * Configura todos os event listeners da UI
 */
function configurarEventListeners() {
    // Botão de busca
    elementos.searchBtn.addEventListener('click', () => {
        const query = elementos.searchInput.value.trim();
        if (query) {
            realizarBusca(query);
        } else {
            alert('Por favor, digite um termo para buscar');
        }
    });
    
    // Tecla Enter no campo de busca
    elementos.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = elementos.searchInput.value.trim();
            if (query) {
                realizarBusca(query);
            }
        }
    });
    
    // Botão fechar do modal
    elementos.fecharModal.addEventListener('click', fecharModal);
    
    // Clique fora do modal para fechar
    elementos.modal.addEventListener('click', (e) => {
        if (e.target === elementos.modal) {
            fecharModal();
        }
    });
    
    // Tecla ESC para fechar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elementos.modal.classList.contains('visible')) {
            fecharModal();
        }
    });
}
