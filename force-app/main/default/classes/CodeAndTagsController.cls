/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 13/01/2023
 * last edited: 14/01/2023
 * Description:  Gets and return tags and codes
 */

public without sharing class CodeAndTagsController {

    @AuraEnabled(cacheable=true)
    public static List<CODES_AND_TAGs__c> getTagsList(string recordId){
        return CodeAndTagsController.filterTagsByParentId(recordId);  
    } 

    @AuraEnabled(cacheable=true)
    public static list<CODES_AND_TAGs__c> getCodesAndAssociatedTagsList(string recordId){
        return CodeAndTagsController.getlistOfAllCodesAndTags();
    }


    public static List<CODES_AND_TAGs__c>  getlistOfAllCodesAndTags(){
        return [SELECT id,name,related_codes_and_tag__c FROM CODES_AND_TAGs__c];
    }
    
    private static list<CODES_AND_TAGs__c> filterTagsByParentId(string recordID){
        id objectId = recordID;
        String sObjName = objectId.getSObjectType().getDescribe().getName();
        Set<String> objectFields = Schema.SObjectType.CODES_AND_TAGs__c.fields.getMap().keySet();
        Map<Id,CODES_AND_TAGs__c> codeAndTagsMap = new Map<Id,CODES_AND_TAGs__c>();
        string sObjectFieldName = sObjName+'__c';
        if(objectFields.contains(sObjectFieldName.toLowerCase())) {
            string dynamicCodeAndTagsQuerry = 'SELECT id,name,related_codes_and_tag__c FROM CODES_AND_TAGs__c WHERE '+sObjName+'__c =:objectId';
            list<CODES_AND_TAGs__c> codeAndTagsList = (List<CODES_AND_TAGs__c>)DataBase.query(dynamicCodeAndTagsQuerry);

            codeAndTagsMap = new map<id,CODES_AND_TAGs__c>(codeAndTagsList);
            for(CODES_AND_TAGs__c instance : codeAndTagsMap.values()){
                codeAndTagsMap.remove(instance.related_codes_and_tag__c);
            }
        }
        return codeAndTagsMap.values();
    }
}
