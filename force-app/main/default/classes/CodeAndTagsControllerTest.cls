/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 15/01/2023
 * last-edited: 19/01/2023
 */

@isTest
public without sharing class CodeAndTagsControllerTest {
    public class CodeAndTagsAndRelatedList{
        public Map<Id,CODES_AND_TAGs__c> allCodeAndTags;
        public list<Related_codes_and_tag__c> relatedCodeAndTags;
    }

    @isTest public static void getlistOfAllRelatedCodesAndTagsTest(){
        Date currentDate = Date.today();
        currentDate.addDays(2);
        Opportunity ops =  new Opportunity(CloseDate=currentDate,name='Test', StageName='Propsecting');
        insert ops;

        Account act = new Account(name='account test');
        insert act;

        list<CODES_AND_TAGs__c> testCodeAndTags = new list<CODES_AND_TAGs__c>();
        for(Integer i = 0; i < 20; i++) {
            testCodeAndTags.add(new CODES_AND_TAGs__c(name='test code & tags '+i));
        }
        insert testCodeAndTags;

        CODES_AND_TAGs__c descreteCodeAndTag = new CODES_AND_TAGs__c(name='test code & tags 1');
        insert descreteCodeAndTag;
        list<Related_codes_and_tag__c> newRelatedtestCodeAndTags = new list<Related_codes_and_tag__c>();
        for(Integer i = 0; i < 10; i++) {
            newRelatedtestCodeAndTags.add(new Related_codes_and_tag__c( Account__c=act.id, Opportunity__c=ops.id, CODES_AND_TAG__c =descreteCodeAndTag.id ));
        }
        insert newRelatedtestCodeAndTags;

        string jsonString = CodeAndTagsController.getlistOfAllRelatedCodesAndTags(act.id);
        CodeAndTagsAndRelatedList newCollection = (CodeAndTagsAndRelatedList)JSON.deserialize(jsonString, CodeAndTagsAndRelatedList.class);
        System.assertEquals(10, newCollection.relatedCodeAndTags.Size());
        System.assertEquals(21, newCollection.allCodeAndTags.Size());
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
