/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 13/01/2023
 * last edited: 17/01/2023
 * Description:  Gets and return tags and codes
 */

public without sharing class CodeAndTagsController {
    @AuraEnabled(cacheable=true)
    public static  Map<Id,CODES_AND_TAGs__c>  getlistOfAllCodesAndTags(){
        return new map<id,CODES_AND_TAGs__c>([SELECT id, name,parent_code_and_tag__c FROM CODES_AND_TAGs__c ]);
    }
    
    @AuraEnabled(cacheable=true)
    public static list<CODES_AND_TAGs__c> getCodeAndTagsChildrenRecordsByParentId(string recordId){
        return [SELECT id, name,parent_code_and_tag__c FROM CODES_AND_TAGs__c WHERE  parent_code_and_tag__c = :recordId ];
    }
    @AuraEnabled(cacheable=true)
    public static list<Related_codes_and_tag__c> getRelatedCodeAndTagsByLookUpId(string recordId){
        id objectId = recordID;
        String sObjName = objectId.getSObjectType().getDescribe().getName();
        Set<String> objectFields = Schema.SObjectType.Related_codes_and_tag__c.fields.getMap().keySet();
        string sObjectFieldName = sObjName+'__c';
        list<Related_codes_and_tag__c> relatedCodeAndTags = new List<Related_codes_and_tag__c>() ;
        if(objectFields.contains(sObjectFieldName.toLowerCase())) {
            string dynamicCodeAndTagsQuerry = 'SELECT id, name,allocation__c, Related_codes_and_tag__c.CODES_AND_TAG__r.id, Related_codes_and_tag__c.CODES_AND_TAG__r.name, Related_codes_and_tag__c.CODES_AND_TAG__r.parent_code_and_tag__r.Name, Related_codes_and_tag__c.CODES_AND_TAG__r.parent_code_and_tag__r.id  FROM Related_codes_and_tag__c WHERE '+sObjectFieldName+' =:objectId';
            relatedCodeAndTags = (List<Related_codes_and_tag__c>)DataBase.query(dynamicCodeAndTagsQuerry);
        }
        return relatedCodeAndTags;
    }

    @AuraEnabled
    public static List<Related_codes_and_tag__c> createRelatedCodeAndTags(string recordId, string relatedcodeandtagmap){
        id objectId = recordID;
        Object parsedJSON = (Object)JSON.deserializeUntyped(relatedcodeandtagmap);
        String sObjName = objectId.getSObjectType().getDescribe().getName();
        Set<String> objectFields = Schema.SObjectType.Related_codes_and_tag__c.fields.getMap().keySet();
        string sObjectFieldName = sObjName+'__c';
        List<Related_codes_and_tag__c> relatedCodeAndTagsToCreate = new List<Related_codes_and_tag__c> ();
        
        if(objectFields.contains(sObjectFieldName.toLowerCase())) {
            if(parsedJSON instanceOf Map<String, Object>){
                Map<String, Object> newTagsForRelatedCandT = (Map<String, Object>) parsedJSON;
                for(String key: newTagsForRelatedCandT.keySet()) {
                    Object subValue = newTagsForRelatedCandT.get(key);
                    if(subValue instanceOf Map<String, Object>) {
                        Map<String, Object> parsedSubValue = (Map<String, Object>) subValue;
                        List<Object> codeAndTaglist  = (List<Object>) parsedSubValue.get('_children');
                        for(Object codeAndTagInstance : codeAndTaglist){
                            Map<string,Object> parsedInstance = (Map<string,Object>)codeAndTagInstance;
                            Integer allocation = (Integer)parsedInstance.get('allocation');
                            id relatedCodeAndTag = (Id)parsedInstance.get('id');
                            Related_codes_and_tag__c newInstanceRelatedCandT = new Related_codes_and_tag__c(
                                allocation__c = allocation,
                                CODES_AND_TAG__c = relatedCodeAndTag
                            );
                            newInstanceRelatedCandT.put(sObjectFieldName, objectId);
                            relatedCodeAndTagsToCreate.add(newInstanceRelatedCandT);  
                        }
                    } 
                }
                upsert relatedCodeAndTagsToCreate;
            }
         }
         return relatedCodeAndTagsToCreate;
    } 
}
