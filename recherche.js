console.log('recherche.js loaded');
let main_main = null;
let tooltTip_p = null;
let infoMessage = 'You have not saved any offers yet';
let listOfIds = [];


function createAndPrependInfo() {
    let styleForPElement = {
        backgroundColor: '#0D1F2D',
        color: '#fff',
        padding: '20px',
        marginBottom: '20px',
        textAlign: "center"
    }

    const p = document.createElement('p');
    p.classList.add('extensionTooltip');
    p.innerText = infoMessage;
    for (let key in styleForPElement) {
        p.style[key] = styleForPElement[key];
    }
    main_main.prepend(p);
    tooltTip_p = p;
}
window.onload = async () => {
    console.log("loading !!!");
    await setDestinationUl();
    createAndPrependInfo();
    addCheckMarksToOffers()
}

function setDestinationUl(counter = 0) {
    console.log('looking for destination');
    main_main = document.querySelector('main');
    console.log('main_main: ', main_main);
    if(!main_main && counter < 10) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(setDestinationUl(counter + 1));
            }, 500);
        });
    } else {
        return;
    }
}



async function getIdsFromPage(list = [], counter = 0) {
    list = [...document.querySelectorAll('[data-offerid]')];
    
    if(!list.length && counter < 10) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getIdsFromPage(list, counter + 1));
            }, 500);
        });
    }
    console.log('list of ids on page: ', list);
    return list;
}

async function getListOfIdsFromLocalStorage() {
    return new Promise(resolve => {
        chrome.storage.local.get(['listOfIds'], (res) => {
            console.log('Value currently is ' + JSON.parse(res.listOfIds));
            resolve(JSON.parse(res.listOfIds));
        });
    });
}

async function addCheckMarksToOffers() {
    let listofIdsOnPage = await getIdsFromPage();
    let savedIds = await getListOfIdsFromLocalStorage();

    if(!savedIds.length || !listofIdsOnPage.length) {
        console.log('no saved ids or no ids on page');
        return;
    }

    listofIdsOnPage.forEach((el) => {
        if(savedIds.includes(el.getAttribute('data-offerid'))) {
            let img = document.createElement('img');
            img.src = chrome.runtime.getURL('images/check.png');
            el.appendChild(img);
        }
    });
}
