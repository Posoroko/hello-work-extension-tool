chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        if(message.listOfIds) {

            chrome.storage.local.set({ 'listOfIds': message.listOfIds, date :  message.date}, function() {
                console.log('List and date saved to local storage.');
            });
        }
    }
);

