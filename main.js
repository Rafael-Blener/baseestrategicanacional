// --- [NOVO] Cria o objeto de áudio para o som do botão ---
const clickSound = new Audio('audio/urna-sound.mp3'); // Ajuste o caminho se necessário

// --- JS para o menu hamburger ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) { // Verifica se os elementos existem
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}
    
// --- Geração dinâmica dos cartões e Ticker (Apenas na Index) ---

// 1. Defina a lista de cidades em UM SÓ LUGAR
const cidades = [
    "Apiaí", "Barra do Chapéu", "Barra do Turvo", "Bertioga", "Cajati", "Cananéia",
    "Caraguatatuba", "Cubatão", "Eldorado", "Guarujá", "Iguape", "Ilhabela",
    "Ilha Comprida", "Iporanga", "Itaóca", "Itanhaém", "Itapirapuã Paulista", "Itariri",
    "Jacupiranga", "Juquiá", "Juquitiba", "Miracatu", "Mongaguá", "Pariquera-Açu",
    "Pedro de Toledo", "Peruíbe", "Pilar do Sul", "Praia Grande", "Registro", "Ribeira",
    "Santos", "São Lourenço da Serra", "São Sebastião", "São Vicente", "Sete Barras",
    "Tapiraí", "Ubatuba"
];
 
// Função Slugify (Corrigida)
function slugify(text) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrssssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Substitui espaços por -
        .replace(p, c => b.charAt(a.indexOf(c))) // Substitui caracteres especiais
        .replace(/&/g, '-e-') // Substitui & por '-e-'
        .replace(/[^\w\-]+/g, '') // Remove todos os caracteres não-alfanuméricos
        .replace(/\-\-+/g, '-') // Substitui múltiplos - por um único -
        .replace(/^-+/, '') // Remove hífens do início
        .replace(/-+$/, '') // Remove hífens do fim
}

// 2. Selecione o container onde os cartões entrarão (APENAS NA INDEX)
const gridContainer = document.querySelector('.grid-candidatos');

// Verifica se o container existe antes de tentar modificá-lo (só roda na index)
if (gridContainer) {
    gridContainer.innerHTML = ''; // Limpa qualquer conteúdo estático

    // 3. Crie os cartões dinamicamente
    cidades.forEach(nomeDaCidade => {
        const cidadeSlug = slugify(nomeDaCidade);
        
        // Caminho da imagem (SEM / inicial para teste local)
        const imagePath = `img/cidades/${cidadeSlug}.jpg`; 
        const altText = `Escolha ${nomeDaCidade} para votar na premiação Vozes que Governam`;

        // HTML do Card (Com Braille)
        const cardHTML = `
            <div class="caixa-candidato" data-nome="${nomeDaCidade}">
                <img class="foto" src="${imagePath}" alt="${altText}" loading="lazy">
                <div class="caixa-candidato-conteudo">
                    <div class="nome">${nomeDaCidade}</div>
                    <button class="btn-escolher">
                        <span class="btn-text">CONFIRMA</span>
                        <span class="btn-braille">⠉⠕⠝⠋⠊⠗⠍⠁</span>
                    </button>
                </div>
            </div>
        `;
        
        gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });


    // 4. Adicione os eventos de clique para REDIRECIONAR e TOCAR SOM
    const todosOsBotoes = document.querySelectorAll('.btn-escolher');

    todosOsBotoes.forEach(botao => {
        botao.addEventListener('click', () => {
            const caixaPai = botao.closest('.caixa-candidato');
            const nomeDaCidade = caixaPai.dataset.nome;
            const cidadeSlug = slugify(nomeDaCidade);
            
            // Constrói a URL de destino (sem .html, para funcionar com .htaccess depois)
            // Usando caminho relativo para teste local, LEMBRAR DE COLOCAR "/" ao publicar
            const urlDestino = `${cidadeSlug}.html`; // Temporário para teste local
            // const urlDestino = `/${cidadeSlug}`; // CORRETO para produção com .htaccess
            
            // Toca o som ANTES de redirecionar
            clickSound.currentTime = 0; // Reinicia o som
            clickSound.play();

            // Pequeno delay para permitir que o som comece
            setTimeout(() => {
                window.location.href = urlDestino;
            }, 150); // Ajuste se necessário
        });
    });
}
 
// 5. JS para a FAIXA DE NOTÍCIAS (TICKER) [ALEATÓRIO] - Roda em todas as páginas
const cityTicker = document.getElementById('cityTicker');

if (cityTicker && cidades.length > 0) {
    let lastCityIndex = -1; 

    function updateTicker() {
        if (!document.hidden) { // Otimização: Não atualiza se a aba estiver inativa
            cityTicker.style.opacity = 0;

            setTimeout(() => {
                let randomIndex;
                
                do {
                    randomIndex = Math.floor(Math.random() * cidades.length);
                } while (cidades.length > 1 && randomIndex === lastCityIndex);
                
                lastCityIndex = randomIndex; 
                
                cityTicker.textContent = `UM VOTO REGISTRADO PARA ${cidades[randomIndex].toUpperCase()}!`;
                cityTicker.style.opacity = 1;
            }, 400); 
        }
    }

    // Inicializa o ticker imediatamente
    const firstRandomIndex = Math.floor(Math.random() * cidades.length);
    lastCityIndex = firstRandomIndex;
    cityTicker.textContent = `UM VOTO REGISTRADO PARA ${cidades[firstRandomIndex].toUpperCase()}!`;
    
    // Define o intervalo para atualizações futuras
    setInterval(updateTicker, 5000); 
}

// --- [NOVO] Adiciona som ao botão "Vote Agora" nas páginas de cidade ---
const voteButtonExternal = document.querySelector('.btn-vote-external');

if (voteButtonExternal) {
    voteButtonExternal.addEventListener('click', (event) => {
        // Toca o som
        clickSound.currentTime = 0; 
        clickSound.play();

        // Não precisamos de delay aqui, pois o link abre em nova aba (target="_blank")
    });
}