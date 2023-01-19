/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 13/01/2023
 * last-edited: 15/01/2023
 */
import { LightningElement,wire,api, track} from 'lwc';
import getCodeAndTagsList from '@salesforce/apex/CodeAndTagsController.getlistOfAllRelatedCodesAndTags';
import getCodeAndTagsChildByParentId from '@salesforce/apex/CodeAndTagsController.getCodeAndTagsChildrenRecordsByParentId';
import {getNewDataWithChildren,extractParents} from './helper';
export default class LwcCodesAndTags extends LightningElement {
    @track codesAndAssociatedTags = [];

    @track tagItems = [];
    @track data;
    @track grandParentsCodeAndTag =[];
    parentandchildrenobj ={};
    @track codeColumns = [
        {
            type: 'text',
            fieldName: 'code',
            label: 'Codes',
        },
    ];
    
    selectedCodesAndTags ;

    @api recordId;
    @api objectApiName;

    moveToNext = false;

    fecthError;

    @wire(getCodeAndTagsList, {
        recordId: '$recordId' 
    })
    getRelatedCodesAndAssociatedTagsList({ error, data }) {
        if (data) {
             this.data = data
             this.codesAndAssociatedTags  = this.parseCodeAndTgasListForTreeGrid(data);
            this.fecthError = undefined;
        } 
        if(error) {
            this.fecthError = error;
            console.log( 'Error :: ::',error.message)
            this.codesAndAssociatedTags=undefined; 
        }
    }

    parseCodeAndTgasListForTreeGrid(idata){
        let data  = JSON.parse(idata)
        let allCodeAndTags = new Map(Object.entries(data.allCodeAndTags));
            let grandParentRecords =  {};
            for(const instanceOfRelatedCodeAndTags of data.relatedCodeAndTags){
                if(instanceOfRelatedCodeAndTags.CODES_AND_TAG__r.parent_code_and_tag__c === undefined){
                    let currentParent = allCodeAndTags.get(instanceOfRelatedCodeAndTags.CODES_AND_TAG__c);
                    grandParentRecords[currentParent.Id] =  {code: currentParent.Name, id: currentParent.Id, _children:[]  };
                }
                if(instanceOfRelatedCodeAndTags.CODES_AND_TAG__r.parent_code_and_tag__r != undefined){
                    let currentParent = allCodeAndTags.get(instanceOfRelatedCodeAndTags.CODES_AND_TAG__r.parent_code_and_tag__c);
                    let isRoot = false;
                    while(!isRoot){
                        if(currentParent != undefined && currentParent.parent_code_and_tag__c == undefined){
                            grandParentRecords[currentParent.Id] =  {code: currentParent.Name, id: currentParent.Id, _children:[]  };
                            isRoot = true;
                        }
                        else{
                            currentParent = allCodeAndTags.get(currentParent.parent_code_and_tag__c);
                        }
                    }
                }
            }    
            this.grandParentsCodeAndTag =Object.values(grandParentRecords);
    }

    handleSelection(event){
       this.parentandchildrenobj = extractParents(event.detail.selectedRows, JSON.parse(this.data));
    }

    toggleNext(){
        this.moveToNext = true;
    }
    togglePrevious(){
        this.moveToNext = false;
    }
    handleRowToggle(event) {
        let newChildren = [];
        getCodeAndTagsChildByParentId({ recordId: event.detail.row.id })
            .then(data=>{
                newChildren =  data.map(instance =>{
                    return {code: instance.Name, id: instance.Id, _children:[], parentId: instance.parent_code_and_tag__c }
                });
                const rowId = event.detail.row.id;
                const hasChildrenContent = event.detail.hasChildrenContent;
         
                if (!hasChildrenContent) {
                    this.grandParentsCodeAndTag = getNewDataWithChildren(rowId, this.grandParentsCodeAndTag, newChildren);
                }
            })
            .catch(err=>console.log('Error :: ::',JSON.stringify(err.message)))

           
    }

    get isSelectAndNotNext(){
        return Object.keys(this.parentandchildrenobj).length>0 && !this.moveToNext
    }
} 