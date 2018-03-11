/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function checkDuplicate(alias) {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(alias, function (items) {
            console.log('checking dupe');
            console.log(Object.keys(items).length ? 'dupe' : 'not dupe');
            Object.keys(items).length ? reject('duplicate picture') : resolve();
        });
    });
}
exports.checkDuplicate = checkDuplicate;
function getAllPictures() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(null, function (items) {
            console.log('Got all items from storage!');
            console.log(items);
            resolve(items);
        });
    });
}
exports.getAllPictures = getAllPictures;
function getPicture(alias) {
    chrome.storage.local.get(null, function (items) {
        console.log(items);
        return items;
    });
}
exports.getPicture = getPicture;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __webpack_require__(0);
function* getElements(collection) {
    for (let i = 0; i < collection.length; ++i) {
        yield collection[i];
    }
}
function getFromCollectionByClass(elem, className) {
    const elements = Array.from(elem);
    for (let i in elements) {
        console.log('current element');
        console.log(elements[i]);
        if (elements[i].classList.contains(className)) {
            return elements[i];
        }
    }
}
function getCardMetadata(card) {
    const lowerCard = card.parentNode.parentNode.childNodes[1];
    if (lowerCard instanceof HTMLElement) {
        return lowerCard;
    }
}
function getParentCard(thumb) {
    return thumb.parentElement.parentElement;
}
function getNoEntrySign(parent) {
    console.log('getting entry signs');
    return parent.children[3];
}
function getHref(parent) {
    console.log('href');
    console.log(parent.children[2].children[0]);
    return parent.children[2];
}
function getHoverLayer(parent) {
    const arr = Array.from(parent.children);
    for (let elem of arr) {
        if (elem.classList.contains('hover-layer'))
            return elem;
    }
}
function getDisabledOverlay(parent) {
    const arr = Array.from(parent.children);
    for (let elem of arr) {
        if (elem.classList.contains('disabled-overlay')) {
            return elem;
        }
    }
}
function removeElementClass(element, className) {
    const classes = element.classList;
    if (classes.contains(className)) {
        classes.remove(className);
    }
}
function editCaptures(thumbs) {
    console.log(thumbs.length);
    let storage;
    database_1.getAllPictures().then(response => {
        storage = response;
        console.log('response gotten');
        console.log(response);
        return response;
    }).then((response) => {
        const thumbnails = Array.from(thumbs);
        console.log(thumbnails);
        const savedIds = Object.keys(response);
        console.log(savedIds);
        thumbnails.forEach(function (thumb) {
            if (thumb instanceof HTMLElement) {
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
                if (disabled) {
                    thumb.style.backgroundColor = '#a9a2a7';
                    lowerCard.style.backgroundColor = '#a9a2a7';
                }
                else {
                    thumb.style.backgroundColor = '#db2e42';
                    lowerCard.style.backgroundColor = '#db2e42';
                }
                removeElementClass(parent, 'disabled');
                const thumbId = thumb.getAttribute('src');
                thumb.style.zIndex = '1000';
                if (savedIds.indexOf(thumbId) > -1) {
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
        layers.forEach(function (layer, index, array) {
            layer.addEventListener('click', function (event) {
                const children = Array.from(this.children);
                for (let child of children) {
                    if (child.classList.contains('separation-layer')) {
                        location.href = child.getAttribute('title');
                    }
                }
            });
        });
    });
}
exports.editCaptures = editCaptures;


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const captures_1 = __webpack_require__(1);
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
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
            if (tries > 100) {
                console.log('Timed out while waiting for gallery to load.');
                clearInterval(id);
            }
            if (!objects || objects.length == 0) {
                objects = document.querySelectorAll(`.thumb`);
                tries++;
            }
            else {
                captures_1.editCaptures(objects);
                clearInterval(id);
            }
            console.log(objects);
        }, 100);
    }
});


/***/ })
/******/ ]);