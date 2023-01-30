/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 15/01/2023
 */
import { api, LightningElement } from 'lwc';


export default class LwcCodesAndTagsPercent extends LightningElement {
    @api parentandchildrenobj ={};
    listOfCodeAndTags = []
    parentCount =0;
    childCount =0;
    @api objectname ='';
    @api issaved ='';


    initializeValuesAndRefreshForRendrer(){
        this.listOfCodeAndTags =[]
        let newparentandchildrenobj = JSON.parse(JSON.stringify(this.parentandchildrenobj));
        try {
            for (const key in newparentandchildrenobj) {
                if(newparentandchildrenobj[key]._children.length === 1){
                    newparentandchildrenobj[key]._children[0].allocation = 100;
                    newparentandchildrenobj[key].count = 100;
                    newparentandchildrenobj[key]._children[0].readonly = true;
                }
                if(newparentandchildrenobj[key]._children.length > 1){
                    for (const instance of newparentandchildrenobj[key]._children) {
                        if(instance['allocation'] === null || instance['allocation'] === undefined)
                        instance['allocation'] =  0;
                    }
                }
                if(newparentandchildrenobj[key].count === 100){
                    newparentandchildrenobj[key].isCorrectAllocation = true;
                }else{
                    newparentandchildrenobj[key].isCorrectAllocation = false;
                }
                this.listOfCodeAndTags.push(newparentandchildrenobj[key]);
            }
            this.parentandchildrenobj = newparentandchildrenobj;
            this.emitsave(newparentandchildrenobj);
        } catch (error) {
            console.log('Error :: :: ', error.message);
        }
    }

    handleChange(event){
        try {
            const childCodeAndTagID = event.target.getAttribute('data-instanceid');
            const parentCodeAndTagID = event.target.getAttribute('data-parentcodeandtag');
            const newValue = parseInt(event.target.value);
            
            let newparentandchildrenobj = JSON.parse(JSON.stringify(this.parentandchildrenobj));
            newparentandchildrenobj[parentCodeAndTagID].count = 0;
            let updatedChildren = newparentandchildrenobj[parentCodeAndTagID]['_children'].map((instance) => {
                let instanceId = instance.id != undefined ? instance.id : instance.Id;
                if(instanceId ===childCodeAndTagID ){
                    instance = {...instance};
                    instance['allocation'] = newValue != null && newValue != undefined  ? newValue : 0;
                }
                newparentandchildrenobj[parentCodeAndTagID].count =  newparentandchildrenobj[parentCodeAndTagID].count + instance.allocation;
                return instance;
            });
            newparentandchildrenobj[parentCodeAndTagID]._children = updatedChildren;
            this.parentandchildrenobj = newparentandchildrenobj;
            this.initializeValuesAndRefreshForRendrer();
        } catch (error) {
            console.log(error.message);
        }
    }

    get makeFieldUneditable(){
        return 
    }

    emitsave(newparentandchildrenobj){
        let size = Object.keys(newparentandchildrenobj).length;
        let finalValidity = true;
        for (const key in newparentandchildrenobj) {
            finalValidity = finalValidity && newparentandchildrenobj[key].isCorrectAllocation;
          }
        this.dispatchEvent(new CustomEvent('savecodeandtags',{detail:{codeandtags:{...newparentandchildrenobj}, isSavable:finalValidity, size}}));
    }

    connectedCallback(){
        this.initializeValuesAndRefreshForRendrer();
        this.objectname = this.objectname;
    }
}