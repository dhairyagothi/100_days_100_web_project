let cryptoData = [];
let watchlist = JSON.parse(localStorage.getItem('cryptoWatchlist')) || [];
let showWatchlistOnly = false;
let chart;

const API_URL =
'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

const cryptoTableBody = document.getElementById('crypto-table-body');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const loadingSpinner = document.getElementById('loading-spinner');
const watchlistCountEl = document.getElementById('watchlist-count');

document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();
    setupEventListeners();
    updateWatchlistCount();

    setInterval(fetchCryptoData, 60000);
});

async function fetchCryptoData() {

    try {

        loadingSpinner.style.display = 'block';

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        cryptoData = await response.json();

        renderDashboard();

    } catch (err) {

        cryptoTableBody.innerHTML =
        `
        <tr>
            <td colspan="8" style="text-align:center;">
                Unable to fetch market data.
            </td>
        </tr>
        `;
    }
    finally {
        loadingSpinner.style.display = 'none';
    }
}

function renderDashboard() {

    let data = [...cryptoData];

    if(showWatchlistOnly){
        data = data.filter(
            coin => watchlist.includes(coin.id)
        );
    }

    const searchTerm =
    searchInput.value.toLowerCase().trim();

    if(searchTerm){

        data = data.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm)
            ||
            coin.symbol.toLowerCase().includes(searchTerm)
        );
    }

    switch(sortSelect.value){

        case 'price_desc':
            data.sort(
                (a,b)=>
                b.current_price-a.current_price
            );
            break;

        case 'price_asc':
            data.sort(
                (a,b)=>
                a.current_price-b.current_price
            );
            break;

        case 'change_desc':
            data.sort(
                (a,b)=>
                b.price_change_percentage_24h-
                a.price_change_percentage_24h
            );
            break;

        case 'change_asc':
            data.sort(
                (a,b)=>
                a.price_change_percentage_24h-
                b.price_change_percentage_24h
            );
            break;

        default:
            data.sort(
                (a,b)=>
                b.market_cap-a.market_cap
            );
    }

    renderTable(data);
    updateStats();
}

function renderTable(coins){

    cryptoTableBody.innerHTML = '';

    if(!coins.length){

        cryptoTableBody.innerHTML =
        `
        <tr>
            <td colspan="8">
                No matching assets found.
            </td>
        </tr>
        `;
        return;
    }

    coins.forEach(coin => {

        const isStarred =
        watchlist.includes(coin.id);

        const change =
        coin.price_change_percentage_24h || 0;

        const row =
        document.createElement('tr');

        row.innerHTML = `
        <td>
            <i
            class="fa-star star-icon
            ${isStarred ? 'fa-solid active':'fa-regular'}"
            data-id="${coin.id}">
            </i>
        </td>

        <td>${coin.market_cap_rank}</td>

        <td>
            <div class="coin-info">

                <img src="${coin.image}">

                <div>
                    <strong>${coin.name}</strong>
                    <br>
                    <span class="coin-sym">
                    ${coin.symbol}
                    </span>
                </div>

            </div>
        </td>

        <td>
            $${coin.current_price.toLocaleString()}
        </td>

        <td class="${change >= 0 ? 'green':'red'}">

            <i class="fa-solid
            ${change >=0 ?
            'fa-caret-up' :
            'fa-caret-down'}">
            </i>

            ${change.toFixed(2)}%

        </td>

        <td>
            $${coin.market_cap.toLocaleString()}
        </td>

        <td>
            $${coin.total_volume.toLocaleString()}
        </td>

        <td>
            <button
            class="btn details-btn"
            data-id="${coin.id}">
            Details
            </button>
        </td>
        `;

        cryptoTableBody.appendChild(row);
    });
}
function updateStats(){

    if(!cryptoData.length) return;

    document.getElementById('top-coin').textContent =
    cryptoData[0].name;

    const gainer =
    [...cryptoData].sort(
        (a,b)=>
        b.price_change_percentage_24h -
        a.price_change_percentage_24h
    )[0];

    document.getElementById('top-gainer').textContent =
    `${gainer.name} (${gainer.price_change_percentage_24h.toFixed(2)}%)`;

    document.getElementById('total-assets').textContent =
    cryptoData.length;
}

function updateWatchlistCount(){

    watchlistCountEl.textContent =
    `${watchlist.length} Assets`;
}

function toggleWatchlist(id){

    if(watchlist.includes(id)){

        watchlist =
        watchlist.filter(
            coinId => coinId !== id
        );

    } else {

        watchlist.push(id);
    }

    localStorage.setItem(
        'cryptoWatchlist',
        JSON.stringify(watchlist)
    );

    updateWatchlistCount();
    renderDashboard();
}

function setupEventListeners(){

    searchInput.addEventListener(
        'input',
        renderDashboard
    );

    sortSelect.addEventListener(
        'change',
        renderDashboard
    );

    document
    .getElementById('toggle-watchlist-btn')
    .addEventListener('click', () => {

        showWatchlistOnly =
        !showWatchlistOnly;

        renderDashboard();
    });

    cryptoTableBody.addEventListener(
        'click',
        (e)=>{

            const id =
            e.target.dataset.id;

            if(
                e.target.classList.contains(
                'star-icon'
                )
            ){
                toggleWatchlist(id);
            }

            if(
                e.target.classList.contains(
                'details-btn'
                )
            ){
                openModal(id);
            }
        }
    );

    document
    .getElementById('close-modal-btn')
    .addEventListener('click',()=>{

        document
        .getElementById('detail-modal')
        .classList.add('hidden');
    });

    window.addEventListener(
        'click',
        (e)=>{

            const modal =
            document.getElementById(
            'detail-modal'
            );

            if(e.target === modal){
                modal.classList.add(
                'hidden'
                );
            }
        }
    );

    document
    .getElementById('theme-toggle')
    .addEventListener('click',()=>{

        document.body.classList.toggle(
            'light-theme'
        );
    });
}

async function openModal(id){

    const coin =
    cryptoData.find(
        c => c.id === id
    );

    if(!coin) return;

    document
    .getElementById('modal-coin-img')
    .src = coin.image;

    document
    .getElementById('modal-coin-name')
    .textContent = coin.name;

    document
    .getElementById('modal-coin-symbol')
    .textContent =
    coin.symbol.toUpperCase();

    document
    .getElementById('modal-price')
    .textContent =
    '$' +
    coin.current_price.toLocaleString();

    document
    .getElementById('modal-high-low')
    .textContent =
    '$' +
    coin.high_24h.toLocaleString()
    +
    ' / $'
    +
    coin.low_24h.toLocaleString();

    document
    .getElementById('modal-ath')
    .textContent =
    '$' +
    coin.ath.toLocaleString();

    document
    .getElementById('modal-supply')
    .textContent =
    coin.circulating_supply
    .toLocaleString();

    document
    .getElementById('modal-volume')
    .textContent =
    '$' +
    coin.total_volume
    .toLocaleString();

    document
    .getElementById('modal-marketcap')
    .textContent =
    '$' +
    coin.market_cap
    .toLocaleString();

    document
    .getElementById('detail-modal')
    .classList.remove('hidden');

    loadChart(id);
}
async function loadChart(id){

    try{

        const response =
        await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );

        const data =
        await response.json();

        const prices =
        data.prices;

        const labels =
        prices.map(price => {

            const date =
            new Date(price[0]);

            return (
                date.getMonth()+1
            )
            +
            '/'
            +
            date.getDate();
        });

        const values =
        prices.map(
            price => price[1]
        );

        const ctx =
        document
        .getElementById(
        'coinChart'
        )
        .getContext('2d');

        if(chart){
            chart.destroy();
        }

        chart =
        new Chart(ctx,{

            type:'line',

            data:{

                labels,

                datasets:[{

                    label:'Price (USD)',

                    data:values,

                    borderColor:'#00f5d4',

                    backgroundColor:
                    'rgba(0,245,212,.15)',

                    fill:true,

                    tension:.4
                }]
            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{
                    legend:{
                        labels:{
                            color:'white'
                        }
                    }
                },

                scales:{

                    x:{
                        ticks:{
                            color:'white'
                        }
                    },

                    y:{
                        ticks:{
                            color:'white'
                        }
                    }
                }
            }
        });

    }catch(error){

        console.error(
        'Chart Error',
        error
        );
    }
}