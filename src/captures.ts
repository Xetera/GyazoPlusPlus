
chrome.runtime.onMessage.addListener(function(msg) {
    console.log('received fetch request');
    /* If the received message has the expected format... */
    if (msg.text && (msg.text == "capture")) {
        /* Call the specified callback, passing
           the web-pages DOM content as argument */
        console.log('fetching pictures');
        let objects = document.querySelectorAll(`.thumb`);
        console.log(objects);
        editCaptures(objects);
    }
});

function* getElements(collection : HTMLCollectionOf<Element>){
    for (let i = 0 ; i < collection.length; ++i){
        yield collection[i];
    }
}

export function editCaptures(cards : NodeListOf<Element>){
    cards.forEach(function (value, index, listObj) {
        console.log(value);
    });
}
