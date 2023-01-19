/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 15/01/2023
 */
import { api, LightningElement } from 'lwc';
export default class LwcCodesAndTagsPercent extends LightningElement {
    @api parentandchildrenobj;
    parentCount =0;
    childCount =0;

    @api objectname ='';

    countParentAndChildrenRecord(){
        try {
            for (const key in this.parentandchildrenobj) {
                this.childCount = this.childCount  + this.parentandchildrenobj[key]._children.length;
            }
            this.parentCount = Object.keys(this.parentandchildrenobj).length;
        } catch (error) {
            console.log('Error :: :: ', error.message)
        }
    }

    connectedCallback(){
        this.countParentAndChildrenRecord();
    }
}