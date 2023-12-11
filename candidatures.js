window.onload = () => {
    dataTabs_section.append(createInfo());
}

if(window.location.hash.includes('candidatures')) {
    (async () => {
        let bookmarksArray = await getOffersFromPage();
        let listOfIds = createListOfIds(bookmarksArray);
        sendListOfIdToBackgroundScript(listOfIds);
    })();
}
function createInfo() {
    const p = document.createElement('p');
    p.classList.add('extensionTooltip');
    p.innerText = 'En visitant cette page, Helo work + sauvegarde vos candidatures pour les identifier dans les résultats de recherche.';
    for (let key in styleForPElement) {
        p.style[key] = styleForPElement[key];
    }
    return p;
}

async function getOffersFromPage(list = [], counter = 0) {
    list = [...document.querySelectorAll('h3 > a')];
    
    if(!list.length && counter < 10) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getOffersFromPage(list, counter + 1));
            }, 500);
        });
    }
    console.log('list of bookmarks: ', list);

    return list;
}

function createListOfIds(listOfAnchorTags) {
    
    let listOfIds = listOfAnchorTags.map((tag) => {
        let urlAsArray = tag.href.split('/');
        return urlAsArray[urlAsArray.length - 1].split('.')[0];
    })

    return listOfIds
}

function sendListOfIdToBackgroundScript(list) {
    chrome.runtime.sendMessage({ listOfIds: list, date: new Date().toString() });
    console.log('list of ids sent to background script');
};
    
const dataTabs_section = document.querySelector('[data-tabs]');

let styleForPElement = {
    backgroundColor: '#0D1F2D',
    color: '#fff',
    padding: '20px',
    marginBottom: '20px'
}





