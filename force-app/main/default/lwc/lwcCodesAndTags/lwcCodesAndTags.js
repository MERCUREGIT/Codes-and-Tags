/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 13/01/2023
 * last-edited: 15/01/2023
 */
import { LightningElement,wire,api, track} from 'lwc';
import getTagsList from '@salesforce/apex/CodeAndTagsController.getTagsList';
import getCodesAndAssociatedTagsList from '@salesforce/apex/CodeAndTagsController.getCodesAndAssociatedTagsList';

export default class LwcCodesAndTags extends LightningElement {
    @track
     codesAndAssociatedTags = [];

    @track
    tagItems = [];

    @track tagColumns = [
        {
            type: 'text',
            fieldName: 'tag',
            label: 'Tags',
        },
    ];
    @track codeColumns = [
        {
            type: 'text',
            fieldName: 'code',
            label: 'Codes',
        },
    ];
    selectedCodesAndTagsArray;
    selectedCodesAndTags ;

    @api recordId;
    @api objectApiName;

    moveToNext = false;

    fecthError;

    @wire(getTagsList, {
        recordId: '$recordId' 
    })
    getRelatedTagsList({ error, data }) {
        if (data) {
            console.log('related tasg',data)
            let fetchedTagsItemsList = [];
            data.forEach((element,index) => {
                fetchedTagsItemsList.push({
                    tag: element.Name ,
                    name: index,
                    id:element.Id,
                });
            });
            
         this.tagItems = [...fetchedTagsItemsList] ;     
            this.fecthError = undefined;
        } else if (error) {
            this.fecthError = error;
            console.log('data error::::::::::',error); 
        }
    }

    @wire(getCodesAndAssociatedTagsList, {
        recordId: '$recordId' 
    })
    getRelatedCodesAndAssociatedTagsList({ error, data }) {
        if (data) {
             this.codesAndAssociatedTags  = this.parseCodeAndTgasListForTreeGrid(data);
            this.fecthError = undefined;
        } 
        if(error) {
            this.fecthError = error;
            console.log( error)
            this.codesAndAssociatedTags=undefined; 
        }
    }

    parseCodeAndTgasListForTreeGrid(data){
        const mapIdCodeAndTags = new Map();
        const mapCodeToAssociateTags = new Map();
        data.map((val)=>{
            mapIdCodeAndTags.set(val.Id, val);
          })
          for (let instance of mapIdCodeAndTags.values()) {
            if(instance.related_codes_and_tag__c){
                let parentCode= mapIdCodeAndTags.get(instance.related_codes_and_tag__c);
                let parsableCodeInstance ={ };
                if(parentCode){
                    if(mapIdCodeAndTags.get(instance.related_codes_and_tag__c)){
                        if(!mapCodeToAssociateTags.has(parentCode.id)){
                            let subTagP = {
                                Id:instance.Id,
                                parentId: instance.related_codes_and_tag__c,
                                code:instance.Name,
                                name: instance.Id 
                            };
                            parsableCodeInstance.id  = parentCode.Id;
                            parsableCodeInstance.name  = parentCode.Id;
                            parsableCodeInstance.code  = parentCode.Name;
                            parsableCodeInstance._children = [];
                            parsableCodeInstance._children.push(subTagP);
                            mapCodeToAssociateTags.set(instance.related_codes_and_tag__c, parsableCodeInstance);
                            mapIdCodeAndTags.delete(instance.related_codes_and_tag__c);
                            mapIdCodeAndTags.delete(instance.Id);
                        }
                    }
                    continue;
                }
                if(mapCodeToAssociateTags.has(instance.related_codes_and_tag__c)){
                    let subTag = {
                        Id:instance.Id,
                        parentId: instance.related_codes_and_tag__c,
                        code:instance.Name,
                        name: instance.Id 
                    };
                    mapCodeToAssociateTags.get(instance.related_codes_and_tag__c)._children.push(subTag);
                }
            }
          }
          return Array.from(mapCodeToAssociateTags, ([name, value]) => (value));
    }


    handleSelection(event){
        this.selectedCodesAndTags= new Set();
        this.selectedCodesAndTags.add(event.detail.selectedRows);
        console.log(' this.selectedCodesAndTags :: :: ', this.selectedCodesAndTags)
        this.selectedCodesAndTagsArray = this.selectedCodesAndTags;
       
    }

    toggleNext(){
        this.moveToNext = true;
    }
    togglePrevious(){
        this.moveToNext = false;
    }

    get isSelectAndNotNext(){
        return this.selectedCodesAndTags && !this.moveToNext
    }
}