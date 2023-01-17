@isTest
public class MyCustomPickListtest {
    
 @testSetup
     public static void CreateData(){
      BRDH_Nearby_Map_Filters__c brdhObj = new BRDH_Nearby_Map_Filters__c();
        brdhObj.Name = 'Test Brdh Account';
        brdhObj.Source_Address__c = 'BillingAddress';
         brdhObj.Source_Object__c = 'Account';
        brdhObj.Target_Object__c = 'Contact';
        brdhObj.Target_Address__c = 'MailingAddress' ;
        brdhObj.Distance_Value__c =  20;
        brdhObj.Distance_and_Unit__c = 'mi';
        insert brdhObj;
}
@isTest
    public static void TestMethod1(){
        Test.startTest();
        MyCustomPickList maplist = new MyCustomPickList();
        maplist.getDefaultValue(); 
        Test.stopTest();
    }
    @isTest
    public static void TestMethod2(){
        Test.startTest();
        MyCustomPickList maplist = new MyCustomPickList();
        maplist.getValues(); 
        Test.stopTest();
    }
}