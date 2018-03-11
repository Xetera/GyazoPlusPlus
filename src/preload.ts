chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log('received fetch request');
    /* If the received message has the expected format... */
    if (msg.text && (msg.text == "fetch_preload")) {
        /* Call the specified callback, passing
           the web-pages DOM content as argument */
        console.log('fetching dom info');
        let objects = document.querySelector(`.preload-data[data-key="image"]`);
        sendResponse(objects ? objects.getAttribute('data-value') : {});
    }
});