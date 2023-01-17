/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 15/01/2023
 */

import { api, LightningElement } from 'lwc';
export default class LwcCodesAndTagsPercent extends LightningElement {

    @api selectedcodesandtags = new Set();
    parentCount =0;
    childCount =0;

    @api objectname ='';

    countParentAndChildrenRecord(){
        let codesAndTagsArray = Array.from(this.selectedcodesandtags);
        for(const instance of codesAndTagsArray[0]){
            console.log(' this.selectedCodesAndTags Array :: :: ', JSON.stringify(Array.from(this.selectedcodesandtags)[0]));
            if(!instance.parentId){
                this.parentCount =this.parentCount+1; 
            }
            if(instance.parentId){
                this.childCount = this.childCount +1;
            }
        }
    }

    connectedCallback(){
        this.countParentAndChildrenRecord();
    }
}