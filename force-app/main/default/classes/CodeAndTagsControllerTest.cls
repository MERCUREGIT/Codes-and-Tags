/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 15/01/2023
 * last-edited: 19/01/2023
 */

@isTest
public without sharing class CodeAndTagsControllerTest {



    @isTest public static void createRelatedCodeAndTagsTest(){
        Date currentDate = Date.today();
        currentDate.addDays(2);
        Opportunity ops =  new Opportunity(CloseDate=currentDate,name='Test', StageName='Propsecting');
        insert ops;

        Account act = new Account(name='account test');
        insert act;

        CODES_AND_TAGs__c sampleCodeAndTag1 = new CODES_AND_TAGs__c(name='Account Type To Pending');
        CODES_AND_TAGs__c sampleCodeAndTag2 = new CODES_AND_TAGs__c(name='test code & tags 2');
        CODES_AND_TAGs__c sampleCodeAndTag3 = new CODES_AND_TAGs__c(name='test code & tags 3');

        insert new list<CODES_AND_TAGs__c>{ sampleCodeAndTag1,sampleCodeAndTag2,sampleCodeAndTag3 };

        string jsonString = '{"a03Dn000002e8SXIAY": {"code": "bunker child","id": "a03Dn000002e8SXIAY","_children": [{"code": "Account Type To Pending","id": "'+sampleCodeAndTag1.id+'","parentId": "a03Dn000002e8SXIAY","level": 2,"posInSet": 1,"setSize": 1,"isExpanded": false,"allocation": 100,"readonly": true} ], "count": 100, "isCorrectAllocation": true },"a03Dn000002e8SSIAY": {"code": "Bunker test","id": "a03Dn000002e8SSIAY","_children": [{"code": "Account Type To Customer sub",    "id": "'+sampleCodeAndTag2.id+'","parentId": "a03Dn000002e9kpIAA","level": 3,"posInSet": 1,"setSize": 1,"isExpanded": false,"allocation": 60},{    "code": "child",    "id": "'+sampleCodeAndTag3.id+'",    "parentId": "a03Dn000002e2KWIAY","level": 5,"posInSet": 1,"setSize": 1,"isExpanded": false,    "allocation": 40}],"isCorrectAllocation": true,"count": 100}}';
        list<Related_codes_and_tag__c> newRelatedtestCodeAndTags = CodeAndTagsController.createRelatedCodeAndTags(act.id, jsonString);
        System.debug(newRelatedtestCodeAndTags);
        list<CODES_AND_TAGs__c> codeAndTags = [SELECT id, name FROM CODES_AND_TAGs__c];


        System.assertEquals(3, codeAndTags.Size());
        System.assertEquals(3, newRelatedtestCodeAndTags.Size());
    }

    @isTest public static void getlistOfAllCodesAndTagsTest(){
        list<CODES_AND_TAGs__c> testCodeAndTags = new list<CODES_AND_TAGs__c>();
        for(Integer i = 0; i < 20; i++) {
            testCodeAndTags.add(new CODES_AND_TAGs__c(name='test code & tags '+i));
        }
        insert testCodeAndTags;
        Map<Id,CODES_AND_TAGs__c> codeandtagmap = CodeAndTagsController.getlistOfAllCodesAndTags();

        System.assertEquals(20, codeandtagmap.Size());
    }

    @isTest public static void getCodeAndTagsChildrenRecordsByParentIdTest(){

        CODES_AND_TAGs__c descreteCodeAndTag = new CODES_AND_TAGs__c(name='test code & tags 1');
        insert descreteCodeAndTag;

        list<CODES_AND_TAGs__c> testCodeAndTags = new list<CODES_AND_TAGs__c>();
        for(Integer i = 0; i < 20; i++) {
            testCodeAndTags.add(new CODES_AND_TAGs__c(name='test code & tags '+i,parent_code_and_tag__c=descreteCodeAndTag.id));
        }

        insert testCodeAndTags;
        list<CODES_AND_TAGs__c> relatedCodesAndTags = CodeAndTagsController.getCodeAndTagsChildrenRecordsByParentId( String.valueOf(descreteCodeAndTag.id));
        System.assertEquals(20, relatedCodesAndTags.Size());
    }
}
