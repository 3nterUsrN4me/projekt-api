let limit = 10;
let skip = 0;
let currentPage = 1;
let searchQuery = "";
let totalProducts = 0;


async function pobierzProdukty() {

    const response = await fetch(`https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`);

    const data = await response.json();



    console.log(data);

    totalProducts = data.total;

    let totalPages = Math.ceil(totalProducts / limit) || 1;

    pageInfo.innerText = `Strona ${currentPage} z ${totalPages}`;

    const kontener = document.getElementById('products-container');
    const ladowanie = document.getElementById('loading-message');

    ladowanie.style.display = 'none';

    const listaProdoktow = data.products;

    kontener.innerHTML = '';

    if (listaProdoktow.length == 0) {
        kontener.innerText = `Brak wynikow dla hasla: ${searchQuery}.`;
        return;
    }

    
    for (let product of listaProdoktow) {

        let kafelek = document.createElement('div');

        kafelek.innerHTML = `
        <h3>${product.title}</h3>
        <img src="${product.thumbnail}" width="150">
        <p>Cena: ${product.price} USD</p>
        <hr>
        `;

        kontener.append(kafelek);

    }

}

pobierzProdukty();


const btnPrev = document.getElementById('prev-btn');
const btnNext = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');


btnNext.addEventListener('click', () => {
    if (skip + limit < totalProducts) {
        currentPage++;
        skip = skip + limit;


        window.scrollTo({ top: 0, behavior: 'smooth' });
        pobierzProdukty();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        skip = skip - limit;


        window.scrollTo({ top: 0, behavior: 'smooth' });
        pobierzProdukty();

    }
});

const searchInput = document.getElementById('search-input');
let delay;

searchInput.addEventListener('input', (event) => {
    clearTimeout(delay);
    delay = setTimeout(() => {


        searchQuery = event.target.value;

        skip = 0;
        currentPage = 1;


        pobierzProdukty();
    }, 500);

});