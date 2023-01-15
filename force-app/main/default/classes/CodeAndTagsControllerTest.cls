/**
 * author: Ngum Buka Fon Nyuydze
 * organisation: Hi Corp
 * email: ngumbukafon@gmail.com
 * created-on: 15/01/2023
 */

@isTest
public without sharing class CodeAndTagsControllerTest {

    @isTest public static void getTagsListTest(){
        Date currentDate = Date.today();
        currentDate.addDays(2);
        Opportunity ops =  new Opportunity(CloseDate=currentDate,name='Test', StageName='Propsecting');
        insert ops;

        Account act = new Account(name='account test');
        insert act;

        CODES_AND_TAGs__c code= new CODES_AND_TAGs__c(name='test tags without parents', Account__c=act.id, Opportunity__c=ops.id);

        insert code;

        list<CODES_AND_TAGs__c> newTagsWithoutParent = new list<CODES_AND_TAGs__c>();
        for(Integer i = 0; i < 10; i++) {
            newTagsWithoutParent.add(new CODES_AND_TAGs__c(name='test tags without parents'+i, Account__c=act.id, Opportunity__c=ops.id));
        }
        insert newTagsWithoutParent;

        list<CODES_AND_TAGs__c> newTagsWithParentCode = new list<CODES_AND_TAGs__c>();
        for(Integer i = 0; i < 10; i++) {
            newTagsWithParentCode.add(new CODES_AND_TAGs__c(name='test tags with parents'+i, Account__c=act.id, Opportunity__c=ops.id, related_codes_and_tag__c =code.id ));
        }
        insert newTagsWithParentCode;

        List<CODES_AND_TAGs__c> tags =  CodeAndTagsController.getTagsList(act.id);
        List<CODES_AND_TAGs__c> allCodesAndTags =  [SELECT id,name FROM CODES_AND_TAGs__c];

        System.assertEquals(20, tags.Size());
        System.assertEquals(21, allCodesAndTags.Size());

    }

    @isTest public static void getCodesAndAssociatedTagsListTest(){
        Date currentDate = Date.today();
        currentDate.addDays(2);
        Opportunity ops =  new Opportunity(CloseDate=currentDate,name='Test', StageName='Propsecting');
        insert ops;

        Account act = new Account(name='account test');
        insert act;

        CODES_AND_TAGs__c code= new CODES_AND_TAGs__c(name='test tags without parents', Account__c=act.id, Opportunity__c=ops.id);

        insert code;

        list<CODES_AND_TAGs__c> newTagsWithoutParent = new list<CODES_AND_TAGs__c>();
        for(Integer i = 0; i < 10; i++) {
            newTagsWithoutParent.add(new CODES_AND_TAGs__c(name='test tags without parents'+i, Account__c=act.id, Opportunity__c=ops.id));
        }
        insert newTagsWithoutParent;

        list<CODES_AND_TAGs__c> newTagsWithParentCode = new list<CODES_AND_TAGs__c>();
        for(Integer i = 0; i < 10; i++) {
            newTagsWithParentCode.add(new CODES_AND_TAGs__c(name='test tags with parents'+i, Account__c=act.id, Opportunity__c=ops.id, related_codes_and_tag__c =code.id ));
        }
        insert newTagsWithParentCode;

        List<CODES_AND_TAGs__c> codesAndtags =  CodeAndTagsController.getCodesAndAssociatedTagsList(act.id);
        List<CODES_AND_TAGs__c> allCodesAndTags =  [SELECT id,name FROM CODES_AND_TAGs__c];

        System.assertEquals(allCodesAndTags.Size(), codesAndtags.Size());
    }
}
