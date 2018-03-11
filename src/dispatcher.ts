import Tab = chrome.tabs.Tab;
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import {Gyazo} from "./index";
import PreloadData = Gyazo.PreloadData;
import {checkDuplicate} from "./database";

enum tabStatus {
    LOADING = 'loading',
    COMPLETE = 'complete'
}

function setScreenshot(data : PreloadData){
    const thumbnail = data.thumb_url;

    checkDuplicate(thumbnail).then(()=> {
        return chrome.storage.local.set({[thumbnail]: data.permalink_url});
    }).then(() => {
        console.log('Picture saved!');
    }).catch(err => {
        console.log(err);
    })
}

function fetchCurrent(tab : Tab){

    if (!tab.url) return;
    if (tab.status !== tabStatus.COMPLETE) return;
    if (!tab.id) return;
    if (tab.url === 'https://gyazo.com/captures'){
        chrome.tabs.sendMessage(tab.id, {text: 'capture'});
    }
    else if (/https:\/\/(www\.)?gyazo.com\/\w+/.test(tab.url)) {
        console.log('sending fetch request');
        chrome.tabs.sendMessage(tab.id, {text: 'fetch_preload'}, function(response : string){
            const data : Gyazo.PreloadData = JSON.parse(response);
            // we're not actually using the actual Id as the identifier as that's not reflected
            // back on the gallery page, alias Id however is and we can use that to identify saves
            console.log(data);
            setScreenshot(data);
        });
    }


}

chrome.tabs.onCreated.addListener((tab : Tab)=> {
    fetchCurrent(tab);
});

chrome.tabs.onUpdated.addListener((id : number, info : TabChangeInfo, tab : Tab)=> {
    fetchCurrent(tab);
});