import {Gyazo} from "./index";
import GyazoStorage = Gyazo.GyazoStorage;
import {getAllPictures} from "./database";
import EntryMetadata = chrome.fileSystemProvider.EntryMetadata;


function* getElements(collection : HTMLCollectionOf<Element>){
    for (let i = 0 ; i < collection.length; ++i){
        yield collection[i];
    }
}

function getFromCollectionByClass(elem : HTMLCollection , className : string) : Element {
    const elements = Array.from(elem);
    for (let i in elements){
        console.log('current element');
        console.log(elements[i]);
        if (elements[i].classList.contains(className)){
            return elements[i];
        }
    }
}

function getCardMetadata(card : Element){
    const lowerCard = card.parentNode.parentNode.childNodes[1];
    if (lowerCard instanceof HTMLElement){
        return lowerCard;
    }
}

function getParentCard(thumb : Element){
    return thumb.parentElement.parentElement;
}

function getNoEntrySign(parent : Element) : Element {
    console.log('getting entry signs');
    return parent.children[3];
}

function getHref(parent : Element){
    console.log('href');
    console.log(parent.children[2].children[0]);
    return parent.children[2];
}

function getHoverLayer(parent : Element){
    const arr = Array.from(parent.children);
    for (let elem of arr ){
        if (elem.classList.contains('hover-layer'))
            return elem;
    }
}

function getDisabledOverlay(parent  : Element){
    const arr = Array.from(parent.children);
    for (let elem of arr){
        if (elem.classList.contains('disabled-overlay')){
            return elem;
        }
    }
}

function removeElementClass(element: Element, className : string){
    const classes = element.classList;
    if (classes.contains(className)){
        classes.remove(className)
    }
}

export function editCaptures(thumbs : NodeListOf<Element>){
    console.log(thumbs.length);
    let storage : GyazoStorage;

    getAllPictures().then(response => {
        storage = response;
        console.log('response gotten');
        console.log(response);
        return response;
    }).then((response : GyazoStorage )=>{
        const thumbnails = Array.from(thumbs);
        console.log(thumbnails);

        const savedIds : string[] = Object.keys(response);
        console.log(savedIds);
        thumbnails.forEach(function (thumb) {
            if (thumb instanceof HTMLElement){
                console.log(thumb.classList);
                const lowerCard = getCardMetadata(thumb);
                const parent = getParentCard(thumb);
                const sign = getNoEntrySign(parent);
                const hover = getHoverLayer(parent);
                const disabled = getDisabledOverlay(parent);
                console.log('metadata');
                console.log(lowerCard);
                //console.log(href);
                if (sign)
                    sign.remove();
                if (hover)
                    hover.remove();
                if (disabled){
                    thumb.style.backgroundColor = '#a9a2a7';
                    lowerCard.style.backgroundColor = '#a9a2a7';
                }
                else {
                    thumb.style.backgroundColor = '#db2e42';
                    lowerCard.style.backgroundColor = '#db2e42';
                }
                removeElementClass(parent,'disabled');
                const thumbId = thumb.getAttribute('src');
                thumb.style.zIndex = '1000';
                if (savedIds.indexOf(thumbId) > -1){
                    thumb.style.backgroundColor = '#00ffad';
                    lowerCard.style.backgroundColor = '#00ffad';

                    const layer = document.createElement(`div`);
                    layer.setAttribute('title', response[thumbId]);
                    layer.classList.add('separation-layer');

                    layer.style.position = 'relative';
                    layer.style.pointerEvents = 'none';

                    layer.style.width = 'inherit';
                    layer.style.height = 'inherit';

                    layer.style.zIndex = '999';
                    parent.insertBefore(layer, parent.children.item(1));
                    //alert('hello');
                }
                //href.setAttribute('href', 'pricing')
            }
        });
        return Array.from(document.getElementsByClassName('card'));
    }).then(layers => {
        layers.forEach(function(layer, index, array){
            layer.addEventListener('click', function(event){
                const children : Element[]= Array.from(this.children);
                for (let child of children){
                    if (child.classList.contains('separation-layer')){
                        location.href = child.getAttribute('title');
                    }
                }
            });
        })
    })
}

