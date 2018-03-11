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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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
            Boolean(items) ? reject('duplicate picture') : resolve();
        });
    });
}
exports.checkDuplicate = checkDuplicate;
function getAllPictures() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(null, function (items) {
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __webpack_require__(0);
var tabStatus;
(function (tabStatus) {
    tabStatus["LOADING"] = "loading";
    tabStatus["COMPLETE"] = "complete";
})(tabStatus || (tabStatus = {}));
function setScreenshot(data) {
    const thumbnail = data.thumb_url;
    database_1.checkDuplicate(thumbnail).then(() => {
        return chrome.storage.local.set({ [thumbnail]: data.permalink_url });
    }).then(() => {
        console.log('Picture saved!');
    }).catch(err => {
        console.log(err);
    });
}
function fetchCurrent(tab) {
    if (!tab.url)
        return;
    if (tab.status !== tabStatus.COMPLETE)
        return;
    if (!tab.id)
        return;
    if (tab.url === 'https://gyazo.com/captures') {
        chrome.tabs.sendMessage(tab.id, { text: 'capture' });
    }
    else if (/https:\/\/(www\.)?gyazo.com\/\w+/.test(tab.url)) {
        console.log('sending fetch request');
        chrome.tabs.sendMessage(tab.id, { text: 'fetch_preload' }, function (response) {
            const data = JSON.parse(response);
            // we're not actually using the actual Id as the identifier as that's not reflected
            // back on the gallery page, alias Id however is and we can use that to identify saves
            console.log(data);
            setScreenshot(data);
        });
    }
}
chrome.tabs.onCreated.addListener((tab) => {
    fetchCurrent(tab);
});
chrome.tabs.onUpdated.addListener((id, info, tab) => {
    fetchCurrent(tab);
});


/***/ })
/******/ ]);