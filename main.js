const form = document.querySelector('form');//formulario
const galeriaFotos = document.querySelector('.imagemContainer');//imagens do main
const filtroSelecao = document.getElementById('filtragem');//filtro
const detalhes = document.getElementById('animeDetalhe')//detalhes

document.addEventListener('DOMContentLoaded', () => {//vai ser chamada quando a pág carregar
    jikanApi(); // chama a api
});

form.addEventListener('submit', (e) => { // uma arrowfunction com parametro e q seria o obj do evento de envio do form
    e.preventDefault();//impedindo um comportamento padrão para conseguir manipylar dados
    let query = form.querySelector('input').value;//uma var q vai armazenar o imput do form
    form.querySelector('input').value = '';//estética útilkkk, limpa o campo pra uma nova entrada
    
    if (query === '') {
        query = "nothing";  // se tiver vazio volta o padrão de imagens
    }
    
    jikanApi(query); // inicia uma busca do usuário 
});

async function jikanApi(query = '') {//função assíncrona/ o (query) é o parâmetro pra faze a buscw
    let url = `https://api.jikan.moe/v4/top/anime?type=ona`;  // usando let pra ter mais "clareza"

    if (query) {
        url = `https://api.jikan.moe/v4/anime?q=${query}`;  // o query dx pesquisar valores diretamente, o ${ } é uma sintaxe pra poder por uma variável dentro
    }

    const res = await fetch(url);//fazendo requisição da ulr e esperando a resposta
    const data = await res.json();//aqui ta convertendo para json(json é uma troca de dados, converte o obj)
    let animes = data.data;
   
    const animesFiltrados = filtrarAnimes(animes); //a caceta da filtragem

    galeriaFotos.innerHTML = '';//essa porra limpa a caralha pra pesquisa pra n duplicar ou dar erro

    displayAnimes(animesFiltrados);//mostra dos animes filtrados
}

function filtrarAnimes(animes) {//aplicação do filtro
    const filtro = filtroSelecao.value;

    return animes.filter(anime => {
        if (filtro === 'todo') {
            return true; // ñ aplica filtro se for vrdd
        } else if (filtro === 'altaPontuacao') {
            return anime.score && anime.score > 5; //filtra animes +5
        } else if (filtro === 'baixaPontuacao') {
            return anime.score && anime.score <= 5; //filtra animes -5
        }

        return true;//aplica o filtro se or vrdd
    });
}



function displayAnimes(animes) {
    animes.map(anime => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-item');

        // Exibir imagem do anime
        const img = document.createElement('img');
        img.src = anime.images.jpg.image_url;
        img.alt = anime.title;

        const favoriteBtn = document.createElement('button');//criando botão de fav
        favoriteBtn.innerHTML = '❤️'; //símbolo fav
        favoriteBtn.classList.add('favorite-btn');//add ao css pra estilizar
        favoriteBtn.onclick = () => addFavorite(anime); //evento de click

        const removeBtn = document.createElement('button');//criando botão de removar fav
        removeBtn.innerHTML = '❌'; //símbolo remover fav
        removeBtn.classList.add('remove-btn');//add ao css pra estilizar
        removeBtn.onclick = () => removeFavorite(anime.mal_id); //evento de clique

        imgContainer.appendChild(img);//img é "filho" do container então vai adicionar ele na imagem
        imgContainer.appendChild(favoriteBtn);//o botão fav é "filho" do container então vai adicionar ele na imagem
        imgContainer.appendChild(removeBtn);//o botão de ñ fav é "filho" do container então vai adicionar ele na imagem
        imgContainer.onclick = () => displaydetalhes(anime);
        galeriaFotos.appendChild(imgContainer);//o container é filho da galeria então vai mostrar tudo isso no html

    });
}

function displaydetalhes(anime) {//detalhes de sinopse
    detalhes.innerHTML = `
        <h2>${anime.title}</h2>
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <p><strong>Nota:</strong> ${anime.score}</p>
        <p><strong>Sinopse:</strong> ${anime.synopsis}</p>
    `;
}

function addFavorite(anime) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; //cria um array vazio de fav
    if (!favorites.some(fav => fav.mal_id === anime.mal_id)) { //checa se já ta no fav
        favorites.push(anime); //add no fav
        localStorage.setItem('favorites', JSON.stringify(favorites)); //salva na poha no local storage
    }
    window.alert('Anime adicionado aos Favoritos!'); //notificação
}

function removeFavorite(mal_id) {//mal_id é o identificador da api
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; //let busca, json converte e dps é listado os fav no localstorage
    favorites = favorites.filter(fav => fav.mal_id !== mal_id); //filtra e dps tira o fav de acordo com o mal_id q foi colocado

    localStorage.setItem('favorites', JSON.stringify(favorites)); //atualiza o localstorage com a listage nova/// o JSON.stringify(favorites) é como vai ser convertida de novo para uma string
    alert('Anime removido dos Favoritos!'); //notificação em alert pq sim é lgl
    displayFavorites(); //atualiza o painel de fav
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    galeriaFotos.innerHTML = ''; //busca os fav, caso n tenha nd volta vazio

    if (favorites.length === 0) {
        galeriaFotos.innerHTML = '<p>Nenhum anime favoritado ainda... dê uma olhada de novo, vai gostar de algo! :P</p>'; //se n tem fav retorna uma mensagem
    } else {
        displayAnimes(favorites); //mostra imagens caso tenha um fav
    }
}
