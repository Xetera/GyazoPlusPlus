import Tab = chrome.tabs.Tab;
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import {Gyazo} from "./index";
import PreloadData = Gyazo.PreloadData;
import {checkDuplicate, getAllPictures} from "./database";
import query = chrome.tabs.query;

enum TabStatus {
    LOADING = 'loading',
    COMPLETE = 'complete'
}

function setScreenshot(data : PreloadData){
    const thumbnail = data.grid_thumbs.medium_url;

    checkDuplicate(thumbnail).then(()=> {
        return chrome.storage.local.set({[thumbnail]: data.permalink_path}, function(){
            console.log('Picture saved!');
        });
    }).then(() => {
    }).catch(err => {
        console.log(err);
        chrome.storage.local.get(thumbnail, function(resp){
            console.log(resp);
        });
    })
}


function getSelected(callback){
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0]);
        callback(tabs[0]);
    });
}
// quite a bit of a hack but it's a
function waitUntilLoaded(){
    let status;
    let tab;
    let tries = 0;
    const id = setInterval(function () {
        if (status === TabStatus.COMPLETE){
            fetchCurrent(tab);
            clearInterval(id);
        }
        else if (tries > 20){
            console.log('Gyazo request times out.');
            clearInterval(id);
        }
        chrome.tabs.query({active: true, currentWindow: true}, function (result) {
            console.log(result ? 'DOM loaded' : 'waiting for DOM to load...');
            status = result[0].status;
            tab = result[0];
        });

    }, 400);
}
function fetchCurrent(tab : Tab){
    if (!tab.url || tab.status != TabStatus.COMPLETE || !tab.id) return;
    console.log('tab is ready');
    console.log(tab);

    if (tab.url === 'https://gyazo.com/captures'){

    }
    else if (/https:\/\/(www\.)?gyazo.com\/\w+/.test(tab.url)) {
        console.log('sending fetch request');

        chrome.tabs.sendMessage(tab.id, {text: 'fetch_preload'}, function(response : string){
            console.log(response);
            const data : Gyazo.PreloadData = JSON.parse(response);
            // we're not actually using the actual Id as the identifier as that's not reflected
            // back on the gallery page, alias Id however is and we can use that to identify saves
            console.log(data);
            setScreenshot(data);
        });

    }
}

function editGallery(tab : Tab){
    console.log(tab.url);
    chrome.tabs.sendMessage(tab.id, {text: 'capture'});
}

chrome.tabs.onCreated.addListener((tab : Tab)=> {

    // gyazo attaches a token to the url at creation when snipped but not when clicked
    // possibly a hash of user info and all that jazz
    if (tab.url !== 'https://gyazo.com/captures' && !(/https:\/\/(www\.)?gyazo.com\/\w+\?token=\w+/.test(tab.url))) return;
    console.log('is gyazo tab');
    waitUntilLoaded();
    fetchCurrent(tab);
});


// although this is pretty good for saving all pictures
// but the DOM (where the refleceted thumbnail URL is stored)
// doesn't reliably refresh when tabs are updated as opposed to new pics
// so we're only using it to update the gallery / captures
chrome.tabs.onUpdated.addListener((id : number, info : TabChangeInfo, tab : Tab)=> {
    if (tab.url !== 'https://gyazo.com/captures') return;
    if (tab.status !== TabStatus.COMPLETE) return;
    console.log(tab);
    editGallery(tab);
});