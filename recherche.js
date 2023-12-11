console.log('recherche.js loaded');

let tooltTip_p = null;
let infoMessage = 'Vos candidatures sont marquées par un fond vert.';
let listOfIds = [];

window.onload = async () => {
    
    await setDestinationForTooltip();
    createAndPrependTootip();
    
    addCheckMarksToOffers()
}

// Adding the tooltip element to the page
let main_main = null;
function createAndPrependTootip() {
    let styleForPElement = {
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
    tooltTip_p = p;
}
function setDestinationForTooltip(counter = 0) {
    console.log('looking for destination');
    main_main = document.querySelector('main');
    console.log('main_main: ', main_main);
    if(!main_main && counter < 10) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(setDestinationForTooltip(counter + 1));
            }, 500);
        });
    } else {
        return;
    }
}



async function getOffersFromPage(list = [], counter = 0) {
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

async function getListOfIdsFromLocalStorage() {
    return new Promise(resolve => {
        chrome.storage.local.get(['listOfIds'], (res) => {
            console.log('Value currently is :', res.listOfIds);
            resolve(res.listOfIds);
        });
    });
}

async function addCheckMarksToOffers() {
    let listOfOffers = await getOffersFromPage();
    let savedIds = await getListOfIdsFromLocalStorage();

    if(!savedIds.length || !listOfOffers.length) {
        console.log('no saved ids or no ids on page');
        return;
    }

    for(let i = 0; i < listOfOffers.length; i++) {
        let bookmark = listOfOffers[i].querySelector('.bookmark');
            
        if(savedIds.includes(listOfOffers[i].dataset.offerid)) {
            listOfOffers[i].style.backgroundColor = '#ccfcd9';
            let bookmark = listOfOffers[i].querySelector('span.bookmark');
            let destination = bookmark.parentElement;
            destination.style.display = 'flex';
            destination.style.gap = '10px';
            let div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'flex-end';
            let img = document.createElement('img');
            div.appendChild(img);
            img.style.width = '20px';
            img.style.height = '20px';
            img.src = chrome.runtime.getURL('images/check.png');
            destination.prepend(img);
        }
    }
}
