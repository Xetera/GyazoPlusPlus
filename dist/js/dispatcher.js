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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __webpack_require__(0);
var TabStatus;
(function (TabStatus) {
    TabStatus["LOADING"] = "loading";
    TabStatus["COMPLETE"] = "complete";
})(TabStatus || (TabStatus = {}));
function setScreenshot(data) {
    const thumbnail = data.grid_thumbs.medium_url;
    database_1.checkDuplicate(thumbnail).then(() => {
        return chrome.storage.local.set({ [thumbnail]: data.permalink_path }, function () {
            console.log('Picture saved!');
        });
    }).then(() => {
    }).catch(err => {
        console.log(err);
        chrome.storage.local.get(thumbnail, function (resp) {
            console.log(resp);
        });
    });
}
function getSelected(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0]);
        callback(tabs[0]);
    });
}
// quite a bit of a hack but it's a
function waitUntilLoaded() {
    let status;
    let tab;
    let tries = 0;
    const id = setInterval(function () {
        if (status === TabStatus.COMPLETE) {
            fetchCurrent(tab);
            clearInterval(id);
        }
        else if (tries > 20) {
            console.log('Gyazo request times out.');
            clearInterval(id);
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (result) {
            console.log(result ? 'DOM loaded' : 'waiting for DOM to load...');
            status = result[0].status;
            tab = result[0];
        });
    }, 400);
}
function fetchCurrent(tab) {
    if (!tab.url || tab.status != TabStatus.COMPLETE || !tab.id)
        return;
    console.log('tab is ready');
    console.log(tab);
    if (tab.url === 'https://gyazo.com/captures') {
    }
    else if (/https:\/\/(www\.)?gyazo.com\/\w+/.test(tab.url)) {
        console.log('sending fetch request');
        chrome.tabs.sendMessage(tab.id, { text: 'fetch_preload' }, function (response) {
            console.log(response);
            const data = JSON.parse(response);
            // we're not actually using the actual Id as the identifier as that's not reflected
            // back on the gallery page, alias Id however is and we can use that to identify saves
            console.log(data);
            setScreenshot(data);
        });
    }
}
function editGallery(tab) {
    console.log(tab.url);
    chrome.tabs.sendMessage(tab.id, { text: 'capture' });
}
chrome.tabs.onCreated.addListener((tab) => {
    // gyazo attaches a token to the url at creation when snipped but not when clicked
    // possibly a hash of user info and all that jazz
    if (tab.url !== 'https://gyazo.com/captures' && !(/https:\/\/(www\.)?gyazo.com\/\w+\?token=\w+/.test(tab.url)))
        return;
    console.log('is gyazo tab');
    waitUntilLoaded();
    fetchCurrent(tab);
});
// although this is pretty good for saving all pictures
// but the DOM (where the refleceted thumbnail URL is stored)
// doesn't reliably refresh when tabs are updated as opposed to new pics
// so we're only using it to update the gallery / captures
chrome.tabs.onUpdated.addListener((id, info, tab) => {
    if (tab.url !== 'https://gyazo.com/captures')
        return;
    if (tab.status !== TabStatus.COMPLETE)
        return;
    console.log(tab);
    editGallery(tab);
});


/***/ })
/******/ ]);