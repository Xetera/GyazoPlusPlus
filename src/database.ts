import {Gyazo} from "./index";
import aliasId = Gyazo.aliasId;
import GyazoStorage = Gyazo.GyazoStorage;

export function checkDuplicate(alias :aliasId) : Promise<void> {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(alias, function (items : GyazoStorage) {
            Boolean(items) ? reject('duplicate picture') : resolve();
        })
    })
}

export function getAllPictures() : Promise<GyazoStorage>{
    return new Promise<GyazoStorage>(function (resolve) {
        chrome.storage.local.get(null, function(items : GyazoStorage){
            resolve(items);
        });
    });
}

export function getPicture(alias : aliasId)  {
    chrome.storage.local.get(null, function(items){
        console.log(items);
        return <Cache> items;
    });
}
