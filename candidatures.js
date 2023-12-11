const dataTabs_section = document.querySelector('main');
let infomessage_p = null;
let saveButton = null;
let offersGatheredFromPage = false;
let infoMessage = '';
async function messageWithDaysSinceLastupdate() {
    let days = await numberOfDaysSinceLastUpdate();
    return `Vous avez sauvegardé vos candidatures pour la dernière fois il y a ${days} jours. Cliquez sur le bouton ci-dessous pour faire une nouvelle sauvegarde.`;
}

window.onload = async () => {
    dataTabs_section.prepend(await createInfo());
}
async function messageWithDaysSinceLastupdate() {
    let days = await numberOfDaysSinceLastUpdate();
    return `Vous avez sauvegardé vos candidatures pour la dernière fois il y a ${days} jours. Cliquez sur le bouton ci-dessous pour faire une nouvelle sauvegarde.`;
}
async function numberOfDaysSinceLastUpdate() {
    let lastUpdate = await new Promise(resolve => {
        chrome.storage.local.get(['date'], (res) => {
            console.log('Value currently is ' + res.date);
            resolve(res.date);
        });
    });
    console.log('lastUpdate: ', lastUpdate);
    return Math.floor((new Date() - new Date(lastUpdate)) / (1000*60*60*24));
}

async function createInfo() {
    const div = document.createElement('div');
    const stylesFordiv = {
        display: 'grid',
        placeItems: 'center',
        backgroundColor: '#0D1F2D',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
    }
    div.style.display = 'grid';
    div.style.placeItems = 'center';
    div.style.backgroundColor = '#0D1F2D';
    div.style.padding = '20px';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    const p = document.createElement('p');
    p.classList.add('extensionTooltip');
    p.innerText = await messageWithDaysSinceLastupdate();
    let styleForPElement = {
        width: "min(800px, 100%)",
        color: '#fff'
    }
    for (let key in styleForPElement) {
        p.style[key] = styleForPElement[key];
    }
    infomessage_p = p;
    div.appendChild(p);
    div.appendChild(createSaveButton());
    return div;
}

function createSaveButton() {
    const button = document.createElement('button');
    button.addEventListener('click', () => {
        handleSaveButtonClick();
    });
    button.classList.add('extensionTooltip');
    button.innerText = 'Sauvegarder';
    let buttonStyles = {
        color: '#fff',
        backgroundColor: 'green',
        padding: '5px 10px',
        margin: '0 20px',
        display: 'block'
    }
    for (let key in buttonStyles) {
        button.style[key] = buttonStyles[key];
    }
    saveButton = button;
    return button;
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

    offersGatheredFromPage = true;

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
    if(!list.length) {
        saveButton.style.display = 'block';
        return;
    }
    

    chrome.runtime.sendMessage({ listOfIds: list, date: new Date().toString() }, response => {
        if (chrome.runtime.lastError) {
            infomessage_p.innerText = "Vos candidatures on bien été sauvegardées ! Elles seront clairement identifiées lors de vos prochaines recherches."
            saveButton.style.display = 'none';
        } else {
            saveButton.style.display = 'block';
        }
    });
};

async function handleSaveButtonClick() {
    console.log('clicked');
    let offersFromPage = await getOffersFromPage();

    if(!offersFromPage.length) {
        infomessage_p.innerText = "Nous n'avons pas trouvé de candidature sur la page. Cliquez pour essayer à nouveau :"
        return;
    }
    let listOfIds = createListOfIds(offersFromPage);
    sendListOfIdToBackgroundScript(listOfIds);
}
