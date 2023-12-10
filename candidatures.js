if(window.location.hash.includes('candidatures')) {
    (async () => {
        let bookmarksArray = await getBookMarksFromPage();
        let listOfIds = createListOfIds(bookmarksArray);
        sendListOfIdToBackgroundScript(listOfIds);
    })();
}


async function getBookMarksFromPage(list = [], counter = 0) {
    list = [...document.querySelectorAll('[data-offerid]')];
    
    if(!list.length && counter < 10) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getBookMarksFromPage(list, counter + 1));
            }, 500);
        });
    }
    console.log('list of bookmarks: ', list);

    return list;
}

function createListOfIds(bookmarksArray) {
    let list = bookmarksArray.map((bookmark) => {
        return bookmark.getAttribute('data-offerid');
    });
    console.log('list of ids: ', list);
    return list
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

function createInfo() {
    const p = document.createElement('p');
    p.classList.add('extensionTooltip');
    p.innerText = 'Once the jobs you applied for are saved, you can go to the research page and they will be marked with a checkmark';
    for (let key in styleForPElement) {
        p.style[key] = styleForPElement[key];
    }
    return p;
}

window.onload = () => {
    dataTabs_section.append(createInfo());
}

