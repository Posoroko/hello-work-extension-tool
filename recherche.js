const infoMessage = 'Vos candidatures sont marquées par un fond vert.';
let listOfIds = [];

window.onload = async () => {
    await setDestinationForTooltip();
    createAndPrependTootip();
    addCheckMarksToOffers();
}

let main_main = null;
const createAndPrependTootip = () => {
    const styleForPElement = {
        backgroundColor: '#0D1F2D',
        color: '#fff',
        padding: '20px',
        margin: '20px',
        textAlign: "center",
        borderRadius: '8px'
    }
    const div = document.createElement('div');
    div.style.display = 'grid';
    div.style.placeItems = 'center';
    const p = document.createElement('p');
    p.classList.add('extensionTooltip');
    p.innerText = infoMessage;
    for (let key in styleForPElement) {
        p.style[key] = styleForPElement[key];
    }
    div.appendChild(p);
    main_main.prepend(div);
}

const setDestinationForTooltip = async (counter = 0) => {
    console.log('looking for destination');
    main_main = document.querySelector('main');
    console.log('main_main: ', main_main);
    if(!main_main && counter < 10) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(setDestinationForTooltip(counter + 1));
            }, 500);
        });
    }
}

const getOffersFromPage = async (list = [], counter = 0) => {
    list = [...document.querySelectorAll('[data-offerid]')];
    
    if(!list.length && counter < 10) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getOffersFromPage(list, counter + 1));
            }, 500);
        });
    }
    console.log('list of ids on page: ', list);
    return list;
}

const getListOfIdsFromLocalStorage = () => {
    return new Promise(resolve => {
        chrome.storage.local.get(['listOfIds'], (res) => {
            console.log('Value currently is :', res.listOfIds);
            resolve(res.listOfIds);
        });
    });
}

const addCheckMarksToOffers = async () => {
    const listOfOffers = await getOffersFromPage();
    const savedIds = await getListOfIdsFromLocalStorage();

    if(!savedIds.length || !listOfOffers.length) {
        console.log('no saved ids or no ids on page');
        return;
    }

    for(let offer of listOfOffers) {
        if(savedIds.includes(offer.dataset.offerid)) {
            offer.style.backgroundColor = '#ccfcd9';
            const bookmark = offer.querySelector('span.bookmark');
            const destination = bookmark.parentElement;
            destination.style.display = 'flex';
            destination.style.gap = '10px';
            const img = document.createElement('img');
            img.style.width = '20px';
            img.style.height = '20px';
            img.src = chrome.runtime.getURL('images/check.png');
            destination.prepend(img);
        }
    }
}