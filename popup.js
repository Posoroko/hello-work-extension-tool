const numberOfDays_span = document.getElementById("numberOfDaysSinceLastUpdate");


chrome.storage.local.get(['listOfIds', 'date'], (res) => {
    console.log('Value currently is ' + res.listOfIds);

    numberOfDays_span.innerText = numberOfDaysSinceLastUpdate(new Date(res.date));
});

function numberOfDaysSinceLastUpdate(dateOfLastUpdate) {
    return Math.floor((new Date() - dateOfLastUpdate) / (1000*60*60*24));
}