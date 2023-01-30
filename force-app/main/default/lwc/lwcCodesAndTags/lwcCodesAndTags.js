/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 13/01/2023
 * last-edited: 15/01/2023
 */
import { LightningElement,wire,api, track} from 'lwc';
import getCodeAndTagsList from '@salesforce/apex/CodeAndTagsController.getlistOfAllCodesAndTags';
import createRelatedCodeAndTags from '@salesforce/apex/CodeAndTagsController.createRelatedCodeAndTags';
import getRelatedCodeAndTagsByLookUpId from '@salesforce/apex/CodeAndTagsController.getRelatedCodeAndTagsByLookUpId';
import {extractParents,generateGenialogicalBranch,extractAndParseSavedParentsAndChildren} from './helper';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LwcCodesAndTags extends LightningElement {
    @track codesAndAssociatedTags = [];
    @track tagItems = [];
    @track data;
    @api recordId;
    objectId ='';
    @track listOfCodeAndTags =[]
    @track savedParentAndChildren={};
    @api objectApiName;
    @track grandParentsCodeAndTag =[];
    @track parentandchildrenobj ={};
    showSaved = true;
    @track codeColumns = [
        {
            type: 'text',
            fieldName: 'code',
            label: 'Codes',
        },
    ];
    isEditSave = false;
    renderFieldNotEditable = false;
    moveToNext = false;
    fecthError;
    isSaveRelatedCodeAndTagValid = false;
    validRelatedCodeAndTagToSave = {};

    @wire(getCodeAndTagsList)
    getRelatedCodesAndAssociatedTagsList({ error, data }) {
        if (data) {
             this.data = data
             this.codesAndAssociatedTags  = this.parseMapCodeAndTgasListForTreeGrid(data);
            this.fecthError = undefined;
        } 
        if(error) {
            this.fecthError = error;
            console.log( 'Error :: ::',error.message)
            this.codesAndAssociatedTags=undefined; 
        }
    }

    parseMapCodeAndTgasListForTreeGrid(data){
        try {
            let allCodeAndTags = data;
                let grandParentRecords =  {};
                for(const key in allCodeAndTags){
                    if(allCodeAndTags[key]['parent_code_and_tag__c'] === undefined){
                        let currentParent = allCodeAndTags[key];
                        grandParentRecords[allCodeAndTags[key]['Id']] =  {code: currentParent['Name'], id: currentParent['Id']};
                    }
                }    
                this.grandParentsCodeAndTag =Object.values(grandParentRecords);
                generateGenialogicalBranch(this.grandParentsCodeAndTag ,allCodeAndTags )
        } catch (error) {
            console.log('Error :: ',error.message);
        }
    }

    handleSelection(event){
       this.parentandchildrenobj = extractParents(event.detail.selectedRows, this.data);
    }

    toggleNext(){
        this.moveToNext = true;
    }

    togglePrevious(){
        this.moveToNext = false;
        // this.parentandchildrenobj ={};
        this.isSaveRelatedCodeAndTagValid = false;
        this.validRelatedCodeAndTagToSave = {}
    }

    get isSelectAndNotNext(){
        return Object.keys(this.parentandchildrenobj).length>0 && !this.moveToNext
    }
    handledEditSaved(){
        this.savedParentAndChildren ={};
        this.showSaved = false;
    }
    handleSave(){
        createRelatedCodeAndTags({recordId:this.objectId, relatedcodeandtagmap: JSON.stringify(this.validRelatedCodeAndTagToSave)})
        .then(res=>{

            console.log(this.validRelatedCodeAndTagToSave);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Records saved with success',
                    message: 'Success',
                    variant: 'success'
                })
            );
            this.renderFieldNotEditable = true;
        })
        .catch(err=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Saving new investments',
                    message: err.message,
                    variant: 'error'
                })
            )
        })        
    }

    validateForSave(event){
        this.isSaveRelatedCodeAndTagValid = event.detail.isSavable;
        this.validRelatedCodeAndTagToSave = event.detail.codeandtags;
        console.log(JSON.stringify(this.validRelatedCodeAndTagToSave));
    }
    get recordIsSavable(){
        return !this.renderFieldNotEditable && this.isSaveRelatedCodeAndTagValid;
    }
    get hasSavedCodeAndTags(){
        return  Object.keys(this.savedParentAndChildren).length>0 ? this.showSaved : false;
    }

    getsavedCodeAndTagsMapped(){
        getRelatedCodeAndTagsByLookUpId({recordId:this.recordId})
        .then(data=>{
            let parents ={}
            let savedCodeAndTagsList = [...data];
            savedCodeAndTagsList.forEach(savedInstance=>{
                let extractedParent = extractAndParseSavedParentsAndChildren(savedInstance,this.data);
                if (extractedParent['Id']) {
                    let savedInstanceID = savedInstance['CODES_AND_TAG__r']['Id'];
                    parents[extractedParent['Id']] = { ...parents[extractedParent['Id']], id: extractedParent['Id']+'-parent', code: extractedParent['Name'] }
                    if(extractedParent['Id'] === savedInstanceID){
                        parents[extractedParent['Id']]['_children'] = [{...parents[extractedParent['Id']], allocation: savedInstance['allocation__c']}] 
                    }
                    if (extractedParent['Id'] != savedInstanceID && savedInstanceID != undefined) {
                        let newSavedInstance = { parentId: extractedParent['Id'], id: savedInstanceID, code: savedInstance['CODES_AND_TAG__r']['Name'],allocation: savedInstance['allocation__c'] };
                        let _children =[];
                        if(parents[extractedParent['Id']]['_children']){
                            _children = JSON.parse(JSON.stringify(parents[extractedParent['Id']]['_children']));
                        }
                        _children.push({ ...newSavedInstance });
                        parents[extractedParent['Id']]['_children'] = [..._children];
                    }
                }
            })
          
            this.savedParentAndChildren = parents;
            this.initializeValuesAndRefreshForRendrer()
        })
        .catch(err=>{
            console.log(err.message);
        })
    }

    initializeValuesAndRefreshForRendrer(){
        this.listOfCodeAndTags =[]
        
        let newparentandchildrenobj = this.savedParentAndChildren;
        try {
            for (const key in newparentandchildrenobj) {
                this.listOfCodeAndTags.push(newparentandchildrenobj[key]);
            }
           console.log(JSON.stringify(this.listOfCodeAndTags));
        } catch (error) {
            console.log('Error :: :: ', error.message);
        }
    }

    connectedCallback(){
        this.objectId = this.recordId;
        this.getsavedCodeAndTagsMapped();
    }
} 