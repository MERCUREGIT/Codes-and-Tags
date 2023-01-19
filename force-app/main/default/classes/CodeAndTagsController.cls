/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 13/01/2023
 * last edited: 17/01/2023
 * Description:  Gets and return tags and codes
 */

public without sharing class CodeAndTagsController {
    public class CodeAndTagsAndRelatedList{
        public Map<Id,CODES_AND_TAGs__c> allCodeAndTags;
        public list<Related_codes_and_tag__c> relatedCodeAndTags;
    }

    @AuraEnabled(cacheable=true)
    public static string  getlistOfAllRelatedCodesAndTags(string recordId){
        id objectId = recordID;
        String sObjName = objectId.getSObjectType().getDescribe().getName();
        Set<String> objectFields = Schema.SObjectType.Related_codes_and_tag__c.fields.getMap().keySet();
        CodeAndTagsAndRelatedList associatedCodeAndTags = new CodeAndTagsAndRelatedList();
        string sObjectFieldName = sObjName+'__c';
        Map<Id,CODES_AND_TAGs__c> grandParentRecords = new Map<Id,CODES_AND_TAGs__c> ();
        
        if(objectFields.contains(sObjectFieldName.toLowerCase())) {
            string dynamicCodeAndTagsQuerry = 'SELECT id, name,allocation__c, Related_codes_and_tag__c.CODES_AND_TAG__r.id, Related_codes_and_tag__c.CODES_AND_TAG__r.name, Related_codes_and_tag__c.CODES_AND_TAG__r.parent_code_and_tag__r.Name, Related_codes_and_tag__c.CODES_AND_TAG__r.parent_code_and_tag__r.id  FROM Related_codes_and_tag__c WHERE '+sObjName+'__c =:objectId';

            list<Related_codes_and_tag__c> relatedCodeAndTags = (List<Related_codes_and_tag__c>)DataBase.query(dynamicCodeAndTagsQuerry);
            Map<Id,CODES_AND_TAGs__c> allCodeAndTags = new map<id,CODES_AND_TAGs__c>([SELECT id, name,parent_code_and_tag__c FROM CODES_AND_TAGs__c  ]);

            associatedCodeAndTags.allCodeAndTags = allCodeAndTags;
            associatedCodeAndTags.relatedCodeAndTags = relatedCodeAndTags;
         }
        return JSON.serialize(associatedCodeAndTags);
    }
    
    @AuraEnabled(cacheable=true)
    public static list<CODES_AND_TAGs__c> getCodeAndTagsChildrenRecordsByParentId(string recordId){
        return [SELECT id, name,parent_code_and_tag__c FROM CODES_AND_TAGs__c WHERE  parent_code_and_tag__c = :recordId ];
    }
}
