import {Gyazo} from "./index";
import aliasId = Gyazo.aliasId;
import GyazoStorage = Gyazo.GyazoStorage;

export function checkDuplicate(alias :aliasId) : Promise<void> {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(alias, function (items : GyazoStorage) {
            console.log('checking dupe');
            console.log(Object.keys(items).length ? 'dupe' : 'not dupe');
            Object.keys(items).length ? reject('duplicate picture') : resolve();
        });
    });
}

export function getAllPictures() : Promise<GyazoStorage>{
    return new Promise<GyazoStorage>(function (resolve) {
        chrome.storage.local.get(null, function(items : GyazoStorage){
            console.log('Got all items from storage!');
            console.log(items);
            resolve(items);
        });
    });
}

export function getPicture(alias : aliasId)  {
    chrome.storage.local.get(null, function(items){
        console.log(items);
        return items;
    });
}
