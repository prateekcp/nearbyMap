@isTest
public class NearbyMapData_Test {
    @testSetup
    static Void createData(){
        
        List<BRDH_Nearby_Map_Filters__c> brdhObjList = new List<BRDH_Nearby_Map_Filters__c>();
        BRDH_Nearby_Map_Filters__c brdhObj = new BRDH_Nearby_Map_Filters__c();
        brdhObj.Name = 'Test Brdh Account';
        brdhObj.Source_Address__c = 'BillingAddress';
        brdhObj.Source_Object__c = 'Account';
        brdhObj.Target_Object__c = 'Contact';
        brdhObj.Target_Address__c = 'MailingAddress' ;
        brdhObj.Distance_Value__c =  20;
        brdhObj.Distance_and_Unit__c = 'mi';
        brdhObjList.add(brdhObj) ;
        
        BRDH_Nearby_Map_Filters__c brdhObjacc = new BRDH_Nearby_Map_Filters__c();
        brdhObjacc.Name = 'Test Brdh Account filter';
        brdhObjacc.Source_Address__c = 'BillingAddress';
        brdhObjacc.Source_Object__c = 'Account';
        brdhObjacc.Target_Object__c = 'Contact';
        brdhObjacc.Target_Address__c = 'MailingAddress' ;
        brdhObjacc.Distance_Value__c =  20;
        brdhObjacc.Filters__c = 'LastName = ' + '\'' + 'Day' + '\'' ;
        brdhObjacc.Distance_and_Unit__c = 'mi';
        brdhObjList.add(brdhObjacc) ;
        
        
        BRDH_Nearby_Map_Filters__c brdhObj1 = new BRDH_Nearby_Map_Filters__c();
        brdhObj1.Name = 'Test Brdh Lead';
        brdhObj1.Source_Address__c = 'Address';
        brdhObj1.Source_Object__c = 'Lead';
        brdhObj1.Distance_Value__c =  20;
        brdhObj1.Distance_and_Unit__c = 'mi';
        brdhObjList.add(brdhObj1);
        
        BRDH_Nearby_Map_Filters__c brdhObj2 = new BRDH_Nearby_Map_Filters__c();
        brdhObj2.Name = 'Test Brdh Contact';
        brdhObj2.Source_Address__c = 'MailingAddress';
        brdhObj2.Source_Object__c = 'Contact';
        brdhObj2.Distance_Value__c =  20;
        
        brdhObj2.Distance_and_Unit__c = 'mi';
        brdhObjList.add(brdhObj2);
        
        BRDH_Nearby_Map_Filters__c brdhObjConFilter = new BRDH_Nearby_Map_Filters__c();
        brdhObjConFilter.Name = 'Test Brdh Contact Filter';
        brdhObjConFilter.Source_Address__c = 'MailingAddress';
        brdhObjConFilter.Source_Object__c = 'Contact';
        brdhObjConFilter.Distance_Value__c =  20;
        brdhObjConFilter.Filters__c = 'LastName = ' + '\'' + 'Day' + '\'' ;
        brdhObjConFilter.Distance_and_Unit__c = 'mi';
        brdhObjList.add(brdhObjConFilter);
        
        insert brdhObjList;
        
        Account acct = new Account();
        acct.Name = 'Test Acc';
        acct.BillingStreet = '3022  Strother Street';
        acct.BillingCity = 'Into';
        acct.BillingState = 'Alabama';
        acct.BillingPostalCode = '35222';
        acct.BillingCountry = 'US';
        acct.BillingLatitude = 	42.328674 ;
        acct.BillingLongitude = -72.664658 ;
        insert acct;
        
        Contact con = new Contact();
        con.AccountId = acct.Id;
        con.LastName = 'Test Con';
        con.MailingStreet = '3022  Strother Street';
        con.MailingCity = 'Into';
        con.MailingCountry = 'US';
        con.MailingState = 'Alabama';
        con.MailingPostalCode = '35222';
        con.MailingLatitude =  42.536457;
        con.MailingLongitude =  -70.985786;
        insert con;
        
        
        Lead leadObj = new Lead();
        leadObj.LastName = 'Test Lead';
        leadObj.Company ='Test lead Comp'; 
        leadObj.City = 'Mangaung Metropolitan Municipality';
        leadObj.State = 'Free State';
        leadObj.Country = 'South Africa';
        leadObj.Latitude = -29.1;
        leadObj.Longitude = 26.2167;
        insert leadObj;
        
        
    } 
    
    @isTest
    public static void getSourceObjectList_test(){
        Test.startTest();
        NearbyMapData.getSourceObjectList();
        NearbyMapData.getSourceObjectFields('Account');
        NearbyMapData.getTargetObjectFields('Contact');
        Test.stopTest();
    }
    
    @isTest
    public Static void getFilterData_test(){
        BRDH_Nearby_Map_Filters__c brdhObj = [SELECT Id, Name, Distance_Value__c, Distance_and_Unit__c, Status__c, Limits__c, Filters__c, Target_Address__c, Target_Object__c, Source_Address__c, Source_Object__c FROM BRDH_Nearby_Map_Filters__c Where Name = 'Test Brdh Account' LIMIT 1];
        Test.startTest();
        NearbyMapData.getFilterData('test ak','Account','BillingAddress','Contact','MailingAddress','20','mi','',10,true,true);
        NearbyMapData.saveFilterData('test ak','Account','BillingAddress','Contact','MailingAddress','20','mi','',10,true,brdhObj.Id,true);
        NearbyMapData.getBRDHNearby();
        NearbyMapData.getBRDHNearbyRecord(brdhObj.Id);
        NearbyMapData.updaterecord(new List<BRDH_Nearby_Map_Filters__c>{brdhObj});
        Test.stopTest();
    }
    
    
    @isTest
    public static void  getSearchData_testAccount(){
        BRDH_Nearby_Map_Filters__c brdhObj = [SELECT Id, Name, Distance_Value__c, Distance_and_Unit__c, Status__c, Limits__c, Filters__c, Target_Address__c, Target_Object__c, Source_Address__c, Source_Object__c FROM BRDH_Nearby_Map_Filters__c Where Name = 'Test Brdh Account' LIMIT 1];
        BRDH_Nearby_Map_Filters__c brdhObjFil = [SELECT Id, Name, Distance_Value__c, Distance_and_Unit__c, Status__c, Limits__c, Filters__c, Target_Address__c, Target_Object__c, Source_Address__c, Source_Object__c FROM BRDH_Nearby_Map_Filters__c Where Name = 'Test Brdh Account filter' LIMIT 1];
        Account acc = [SELECT Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, BillingLatitude, BillingLongitude FROM Account Where Name = 'Test Acc' LIMIT 1 ];
        Test.startTest();
        NearbyMapData.getSearchData(brdhObj.Id, acc.Id);
        NearbyMapData.getSearchData(brdhObjFil.Id, acc.Id);
        Test.stopTest();
    }  
    @isTest
    public static void  getSearchData_testCon(){
        BRDH_Nearby_Map_Filters__c brdhObj = [SELECT Id, Name, Distance_Value__c, Distance_and_Unit__c, Status__c, Limits__c, Filters__c, Target_Address__c, Target_Object__c, Source_Address__c, Source_Object__c FROM BRDH_Nearby_Map_Filters__c Where Name = 'Test Brdh Contact' LIMIT 1];
        BRDH_Nearby_Map_Filters__c brdhObjFil = [SELECT Id, Name, Distance_Value__c, Distance_and_Unit__c, Status__c, Limits__c, Filters__c, Target_Address__c, Target_Object__c, Source_Address__c, Source_Object__c FROM BRDH_Nearby_Map_Filters__c Where Name = 'Test Brdh Contact Filter' LIMIT 1];
        Account acc = [SELECT Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, BillingLatitude, BillingLongitude FROM Account Where Name = 'Test Acc' LIMIT 1 ];
        Contact con = [SELECT Id, AccountId, LastName, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, MailingLatitude, MailingLongitude FROM Contact Where Name = 'Test Con' LIMIT 1];
        Test.startTest();
        NearbyMapData.getSearchData(brdhObj.Id, con.Id);
        NearbyMapData.getSearchData(brdhObjFil.Id, con.Id);
        Test.stopTest();
    } 
    @isTest
    public static void  getSearchData_testLead(){
        BRDH_Nearby_Map_Filters__c brdhObj = [SELECT Id, Name, Distance_Value__c, Distance_and_Unit__c, Status__c, Limits__c, Filters__c, Target_Address__c, Target_Object__c, Source_Address__c, Source_Object__c FROM BRDH_Nearby_Map_Filters__c Where Name = 'Test Brdh Lead' LIMIT 1];
        Lead lead = [SELECT Id, Name, Street, State, City, PostalCode, Country, Latitude, Longitude, Address FROM Lead Where Name ='Test Lead'];
        Test.startTest();
        NearbyMapData.getSearchData(brdhObj.Id, lead.Id);
        Test.stopTest();
    }  
}