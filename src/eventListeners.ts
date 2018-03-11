import {editCaptures} from "./captures";

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log('received fetch request');
    /* If the received message has the expected format... */
    if (msg.text && (msg.text == "fetch_preload")) {
        /* Call the specified callback, passing
           the web-pages DOM content as argument */
        console.log('fetching dom info');
        console.log(msg);
        console.log(sender);
        console.log(window.location.href);
        let objects;
        objects = document.querySelector(`.preload-data[data-key="image"]`);
        sendResponse(objects ? objects.getAttribute('data-value') : {});

    }






    // editing gallery
    else if (msg.text && (msg.text == "capture")) {
        /* Call the specified callback, passing
           the web-pages DOM content as argument */
        console.log('fetching pictures');

        let objects;
        let tries = 0;

        if (window.location.href !== 'https://gyazo.com/captures') {
            return;
        }

        // chrome calls this function when the tab has loaded but not necessarily when
        // all the dom elements have loaded so this is a pretty ok way of checking
        const id = setInterval(function () {

            if (tries > 100){
                console.log('Timed out while waiting for gallery to load.');
                clearInterval(id);
            }
            if (!objects || objects.length == 0){
                objects = document.querySelectorAll(`.thumb`);
                tries++;
            }
            else {
                editCaptures(objects);
                clearInterval(id);
            }
            console.log(objects);
        }, 100);

    }

});

