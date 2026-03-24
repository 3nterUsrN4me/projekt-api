let limit = 10;
let skip = 0;
let currentPage = 1;
let searchQuery = "";
let totalProducts = 0;

const btnPrev = document.getElementById('prev-btn');
const btnNext = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

async function pobierzProdukty() {

    const kontener = document.getElementById('products-container');
    const ladowanie = document.getElementById('loading-message');

    ladowanie.style.display = 'block';

    // finalnie dodana obsluga bledu polaczenia z serwerem z uzyciem try catch
    // offline w zakladce network zeby przetestowac

    try {

        // sciagniecie produktow na parametrach wyszukiwania ilosci i przeskoku
        const response = await fetch(`https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`);

        if (!response.ok) {
            throw new Error("Błąd serwera");

        }

        // parsowanie json na js
        const data = await response.json();

        // wgranie danych do konsoli - sprawdzenie czy dziala
        console.log(data);

        totalProducts = data.total;

        // strona x 'z' y 
        let totalPages = Math.ceil(totalProducts / limit) || 1;
        pageInfo.innerText = `Strona ${currentPage} z ${totalPages}`;

        ladowanie.style.display = 'none';

        const listaProdoktow = data.products;

        // czyszczenie strony przy zmianie na kolejna/poprzednia
        kontener.innerHTML = '';

        // obsluga bledu i sanityzacja innerTextem
        if (listaProdoktow.length == 0) {
            kontener.innerText = `Brak wynikow dla hasla: ${searchQuery}.`;
            return;
        }

        // petla dodajaca produkty na strone
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
    } catch (error) {

        ladowanie.style.display = 'none';

        //  wyczyszczenie strony zeby wsadzic komunikat
        kontener.innerHTML = '';

        // blad polaczenia z serwerem
        kontener.innerHTML = `<h3 style="color: red; text-align: center;">
             Wystąpił błąd z połączeniem z serwerem. Sprawdź połączenie internetowe.
        </h3>`;

        
        // w konsoli widzimy co sie dokladnie stalo
        console.error("Szczegoly: ", error);
    }


}

pobierzProdukty();



// kolejna strona
btnNext.addEventListener('click', () => {
    if (skip + limit < totalProducts) {
        currentPage++;
        skip = skip + limit;


        window.scrollTo({ top: 0, behavior: 'smooth' });
        pobierzProdukty();
    }
});

// poprzednia strona
btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        skip = skip - limit;


        window.scrollTo({ top: 0, behavior: 'smooth' });
        pobierzProdukty();

    }
});

// pole wyszukiwania
const searchInput = document.getElementById('search-input');
let delay;

searchInput.addEventListener('input', (event) => {
    clearTimeout(delay);

    // debouncing, timeout na 500ms
    delay = setTimeout(() => {

        searchQuery = event.target.value;
        skip = 0;
        currentPage = 1;

        pobierzProdukty();
    }, 500);

});