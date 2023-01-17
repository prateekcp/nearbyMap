public class NearbyMapData {
    public static string Name;
   public static loactionWrapper sourcelw;
    public static object sourceName;
    @AuraEnabled(cacheable=true)  
    public static List<String> getSourceObjectList() { 
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();    
        List<String> masterObjects = new List<String>();
        for(Schema.SObjectType f : gd.values()){
            Schema.DescribeSObjectResult  anObject = f.getDescribe();
            if (anObject.isAccessible() && anObject.isCreateable() && anObject.isUpdateable() && anObject.getKeyPrefix() != null) {
                masterObjects.add(String.valueOf(f));
            }
        }
        masterObjects.sort();
        return masterObjects;
    }
    @AuraEnabled(cacheable=true)  
    public static List<String> getSourceObjectFields(String seletedObject) { 
        List<String> referenceFields = new List<String>();
        
        Map<String,Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.DescribeSObjectResult[] genericObj = Schema.describeSObjects(new String[]{seletedObject});
        Schema.SObjectType obj = genericObj[0].getSObjectType();
        Schema.SObjectType objectType = schemaMap.get(String.valueOf(obj));
        Schema.DescribeSObjectResult objDescribe = objectType.getDescribe();
        
        for(Schema.SObjectField fieldName : objDescribe.fields.getMap().values()) {
            if(fieldName.getDescribe().getType() == Schema.DisplayType.ADDRESS) {
                referenceFields.add(String.valueOf(fieldName));       
            }                    
        }
        return referenceFields;
    }
    
    @AuraEnabled(cacheable=true)  
    public static List<String> getTargetObjectFields(String seletedObject) { 
        List<String> referenceFields = new List<String>();
        
        Map<String,Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.DescribeSObjectResult[] genericObj = Schema.describeSObjects(new String[]{seletedObject});
        Schema.SObjectType obj = genericObj[0].getSObjectType();
        Schema.SObjectType objectType = schemaMap.get(String.valueOf(obj));
        Schema.DescribeSObjectResult objDescribe = objectType.getDescribe();
        
        for(Schema.SObjectField fieldName : objDescribe.fields.getMap().values()) {
            
            referenceFields.add(String.valueOf(fieldName));       
            
        }
        return referenceFields;
    }
    @AuraEnabled
    public static void getFilterData(
                                     string name, 
                                     string sourceObject,
                                     string sourceAddress,
                                     string targetObject, 
                                     string tagetAddress,
                                     String distanceValue,
                                     String distanceUnit, 
                                     string filters, 
                                     integer limits,
                                     boolean status,
        							boolean showlistViews
                                     
                                    ){
                                        System.debug('showlistViews ++' + showlistViews);
       
       
        try{
            System.debug('filters '+filters);
            BRDH_Nearby_Map_Filters__c newMapFilter = new BRDH_Nearby_Map_Filters__c();
            newMapFilter.Name = name;
            newMapFilter.Source_Object__c = sourceObject;
            newMapFilter.Source_Address__c = sourceAddress;
            newMapFilter.Target_Object__c = targetObject;
            newMapFilter.Target_Address__c = tagetAddress;
            newMapFilter.Distance_and_Unit__c = distanceUnit;
            newMapFilter.Distance_Value__c = Decimal.valueOf(distanceValue);
            newMapFilter.Filters__c =  filters  ;
            newMapFilter.Limits__c = limits;
            newMapFilter.Status__c =status;
            newMapFilter.sdfcdev__showListView__c  = showlistViews;
            System.debug('newMapFilter '+newMapFilter);
            Insert newMapFilter;
            system.debug('@@@@' + newMapFilter.Id);
        }
        catch(Exception ex){
            System.debug('An Exception: '+ex);
            System.debug('Line number' + ex.getLineNumber() +'message'+ ex.getMessage());
        }
    }
    @AuraEnabled
    public static void saveFilterData(string name, string sourceObject,string sourceAddress,string targetObject, string tagetAddress,String distanceValue,String distanceUnit, string filters, integer limits,boolean status,String brdhRecordId,boolean editShowlistViews){
       
        try{
            System.debug('filters '+filters);
            BRDH_Nearby_Map_Filters__c newMapFilter = new BRDH_Nearby_Map_Filters__c();
            newMapFilter.Id = brdhRecordId ;
            newMapFilter.Name = name;
            newMapFilter.Source_Object__c = sourceObject;
            newMapFilter.Source_Address__c = sourceAddress;
            newMapFilter.Target_Object__c = targetObject;
            newMapFilter.Target_Address__c = tagetAddress;
            newMapFilter.Distance_and_Unit__c = distanceUnit;
            newMapFilter.Distance_Value__c = Decimal.valueOf(distanceValue);
            newMapFilter.Filters__c = (filters != 'undefined') ? filters : '' ;
            newMapFilter.Limits__c = limits;
            newMapFilter.Status__c =status;
            newMapFilter.sdfcdev__showListView__c = editShowlistViews;
            System.debug('newMapFilter '+newMapFilter);
            Update newMapFilter;
            system.debug('@@@@' + newMapFilter.Distance_and_Unit__c);
        }
        catch(Exception ex){
            System.debug('An Exception: '+ex);
        }
    }
    
    public static void getLocation(){
        // Instantiate new Location objects and compute the distance between them in different ways.
        System.Location loc1 = System.Location.newInstance(28.635308,77.22496);
        System.Location loc2 = System.Location.newInstance(37.7749295,-122.4194155);
        Double dist = System.Location.getDistance(loc1, loc2, 'mi');
        Double dist2 = loc1.getDistance(loc2, 'km');
        System.debug('dist '+dist);
        System.debug('dist2 '+dist2);
    }
    
    
    
    @AuraEnabled
    public static finalWrapper getSearchData(String BRDHRecordId, String ParnetId){
        try{
            System.debug('ParnetId '+ParnetId);
            system.debug('BRDHRecordId '+BRDHRecordId);
            List<wrapperClass>  wcList = new List<wrapperClass>();
             finalWrapper fc = new finalWrapper();
            String streetName;
            String lat;
            String longtitute;
            string newSoql;
            // String sourceObject;
            BRDH_Nearby_Map_Filters__c BRDH = [SELECT Name,Source_Object__c,Source_Address__c,Target_Object__c,Distance_Value__c,Target_Address__c,Distance_and_Unit__c,Filters__c,Limits__c,Status__c, sdfcdev__showListView__c  FROM BRDH_Nearby_Map_Filters__c WHERE Id = :BRDHRecordId LIMIT 1];
            String SOQL = string.isNotBlank(BRDH.Filters__c) ? 'SELECT ' + BRDH.Source_Address__c + ' FROM '+ BRDH.Source_Object__c + ' Where ' + BRDH.Filters__c : 'SELECT ' + BRDH.Source_Address__c + ' FROM ' + BRDH.Source_Object__c;
            // String sourceQuery = 'SELECT ' + BRDH.Source_Address__c + ' FROM '+ BRDH.Source_Object__c + ' Where Id=:ParnetId';
            // List<Object> sourceAddressQuery = database.query(sourceQuery);
            switch on BRDH.Source_Address__c {
                when 'BillingAddress' {	
                    streetName = 'BillingStreet';
                    lat =  'BillingLatitude';
                    longtitute = 'BillingLongitude';
                }	
                when 'ShippingAddress' {
                    streetName = 'ShippingStreet';
                    lat =  'ShippingLatitude';
                    longtitute = 'ShippingLongitude';
                }
                when 'OtherAddress' {		
                    streetName = 'MailingStreet';
                    lat =  'MailingLatitude';
                    longtitute = 'MailingLongitude';
                }
                when 'MailingAddress' {
                    streetName = 'MailingStreet';
                    lat =  'MailingLatitude';
                    longtitute = 'MailingLongitude';
                }
                when 'Address' { 
                    streetName = 'Street';
                    lat =  'Latitude';
                    longtitute = 'Longitude';
                }
                
            }
              String listViewValue ='';
            if(BRDH.sdfcdev__showListView__c == true){
                listViewValue = 'visible';
            }else{
                listViewValue = 'hidden';
            }
            
            String unit = '\'' + BRDH.Distance_and_Unit__c + '\'';
            String pId = '\'' + ParnetId + '\'';
            String sourceLatitude;
            String sourceLongtitute;
            String sourceQuery = 'SELECT name,' +lat +','+ longtitute + ' FROM ' + BRDH.Source_Object__c +' Where Id = '+ pId  ;
            System.debug('sourceQuery '+sourceQuery);
            List<Object> sourceObjectQuery = database.query(sourceQuery);
            System.debug('sourceObjectQuery '+sourceObjectQuery);
            for(Object ObjMarkup:sourceObjectQuery){
                String data = (String)JSON.serialize(ObjMarkup);
                Map<String,Object> rowMapData = (Map<String,Object>)JSON.deserializeUntyped(data);
                system.debug('ROw MAp data :- ' +rowMapData);
                System.debug('Latitude '+rowMapData.get(lat));
                System.debug('Latitude '+rowMapData.get(longtitute));
                sourceLatitude = String.valueOf(rowMapData.get(lat));
                sourceLongtitute = String.valueOf(rowMapData.get(longtitute));
                sourcelw=new loactionWrapper();
                sourcelw.Latitude =sourceLatitude;
                sourcelw.Longitude = sourceLongtitute;
                sourceName = rowMapData.get('Name');
                System.debug('sourceName' + sourceName);
                //System.debug('sourceName1' + sourceName.Name);
                wrapperClass wc = new wrapperClass();
                loactionWrapper lw = new loactionWrapper();
                lw.Latitude = sourceLatitude;
                lw.Longitude = sourceLongtitute;
                wc.title = String.valueOf(sourceName);
                wc.location = lw;
                string street = string.isNotBlank((String)rowMapData.get('street')) ? (String)rowMapData.get('street') : '';
                string city = string.isNotBlank((String)rowMapData.get('city')) ? (String)rowMapData.get('city') : '';
                string state = string.isNotBlank((String)rowMapData.get('state')) ? (String)rowMapData.get('state') : '';
                string zip = string.isNotBlank((String)rowMapData.get('state')) ? (String)rowMapData.get('state') : '';
                wc.description = street + city + state + zip ;
               anchors a = new anchors();
                a.x=122.5;
                a.y=115;
                mapIcon mi = new mapIcon();
                mi.path='M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z';
                mi.fillColor ='#3453cf';
                mi.fillOpacity =0.8;
                mi.strokeWeight =0;
                mi.scale =0.10;
                mi.anchor= a;
                
                wc.mapIcon=mi;
                
                 wcList.add(wc);
                System.debug('wcList' + wcList);
                
                
                
            }
            newSoql =  string.isNotBlank(BRDH.Filters__c) ? 'SELECT name,'  +  BRDH.Target_Address__c + ' FROM '+ BRDH.Target_Object__c  + 
                ' Where ' + 'DISTANCE(' + BRDH.Target_Address__c + ',' + ' GEOLOCATION('+sourceLatitude+','+sourceLongtitute+'),' + unit +')' +' < ' + BRDH.Distance_Value__c +
                ' AND '+BRDH.Filters__c +
                ' ORDER ' + 'BY ' + 'DISTANCE(' + BRDH.Target_Address__c + ',' + ' GEOLOCATION('+sourceLatitude+','+sourceLongtitute+'),' + unit +')' + ' LIMIT ' + BRDH.Limits__c :
            
            'SELECT name,'  + BRDH.Target_Address__c + ' FROM '+ BRDH.Target_Object__c  + 
                ' Where ' + 'DISTANCE(' + BRDH.Target_Address__c + ',' + ' GEOLOCATION('+sourceLatitude+','+sourceLongtitute+'),' + unit +')' +' < ' + BRDH.Distance_Value__c +
                ' ORDER ' + 'BY ' + 'DISTANCE(' + BRDH.Target_Address__c + ',' + ' GEOLOCATION('+sourceLatitude+','+sourceLongtitute+'),' + unit +')' + ' LIMIT ' + BRDH.Limits__c ;
            
            System.debug('newSoql ==> ' +newSoql);
            
            List<Object> targetAddressQuery = database.query(newSoql);
            System.debug('AddressQuery '+targetAddressQuery);
           
            for(Object ObjMarkup:targetAddressQuery){
               
                wrapperClass wc = new wrapperClass();
                String data = (String)JSON.serialize(ObjMarkup);
                Map<String,Object> rowMapData = (Map<String,Object>)JSON.deserializeUntyped(data);
                system.debug('ROw MAp data :- ' +rowMapData);
                Name = String.valueOf(rowMapData.get('Name')); 
                Map<String,Object> addressMap = (Map<String,Object>)rowMapData.get(BRDH.Target_Address__c);
                
                //system.debug('Targetaddress' + JSON.serialize(o) BRDH.Target_Address__c );
             

                
                /* if(BRDH.Source_Object__c == 'Account')
addressMap = (Map<String,Object>)rowMapData.get(BRDH.Target_Address__c);
else if(BRDH.Source_Object__c == 'Lead' )
addressMap = (Map<String,Object>)rowMapData.get('Address');
else 
addressMap = (Map<String,Object>)rowMapData.get(BRDH.Source_Address__c);
*/
                
                system.debug('Address :- '+addressMap);
                
                loactionWrapper lw = new loactionWrapper();
                lw.Latitude = addressMap.get('latitude') != null ? String.valueOf(addressMap.get('latitude')) : null;
                lw.Longitude = addressMap.get('longitude') != null ? String.valueOf(addressMap.get('longitude')) : null;
                wc.title = Name;
                wc.location = lw;
                
                //wc.icon = 'standard:account';
                string street = string.isNotBlank((String)addressMap.get('street')) ? (String)addressMap.get('street') : '';
                string city = string.isNotBlank((String)addressMap.get('city')) ? (String)addressMap.get('city') : '';
                string state = string.isNotBlank((String)addressMap.get('state')) ? (String)addressMap.get('state') : '';
                string zip = string.isNotBlank((String)addressMap.get('state')) ? (String)addressMap.get('state') : '';
                wc.description = street + city + state + zip ;
               
                System.debug('lw.latitude  '+lw.latitude);
                System.debug('lw.longitude  '+lw.longitude);
                System.debug('wc.title  '+wc.title);
                //System.debug('wc.wc.center' + JSONwc.center);
               
                wcList.add(wc);
                
                
                
            }
            fc.mapmarker =wcList;
             fc.listView = listViewValue;
            fc.center = sourcelw;
            fc.zoomLevel =15;
            
            system.debug('WCList   ' +wcList);
            return fc;
        }
        catch(Exception ex){
            System.debug('An Exception: '+ex);
        }
        return null;
        
    }
    @AuraEnabled(cacheable=true)  
    public static List<BRDH_Nearby_Map_Filters__c> getBRDHNearby(){
        List<BRDH_Nearby_Map_Filters__c> BRDHLists = new List<BRDH_Nearby_Map_Filters__c>([SELECT Id,Name,Source_Object__c,Source_Address__c,Target_Object__c,Target_Address__c,Distance_and_Unit__c,Filters__c,Limits__c,Status__c FROM BRDH_Nearby_Map_Filters__c ORDER BY Id ASC]);
        return BRDHLists;
    }
    @AuraEnabled(cacheable=true)  
    public static BRDH_Nearby_Map_Filters__c getBRDHNearbyRecord(String brdhrecordId){
        BRDH_Nearby_Map_Filters__c BRDHLists = [SELECT Id,Name,Source_Object__c,Source_Address__c,Target_Object__c,Target_Address__c,Distance_Value__c,Distance_and_Unit__c,Filters__c,Limits__c,Status__c,showListView__c  FROM BRDH_Nearby_Map_Filters__c Where Id =:brdhrecordId];
        return BRDHLists;
    }
    @AuraEnabled
    public static boolean updaterecord(List<BRDH_Nearby_Map_Filters__c> BRDHlist){
        try {
            update BRDHlist;
            return true;
        } catch(Exception e) {
            System.debug('Line no. ' +e.getLineNumber() + ' message  '+e.getMessage());
            return false;
        }
    }
    
    public class wrapperClass {
        @AuraEnabled
        public string title {get;set;}
        
        @AuraEnabled
        public string icon;
        
         @AuraEnabled
        public string description;  
        
       
        @AuraEnabled
        public loactionWrapper location;  
        
        @AuraEnabled
        public mapIcon mapIcon;  

        
    }
    public class loactionWrapper { 
        @AuraEnabled
        public String Latitude {get;set;}
        @AuraEnabled
        public String Longitude {get;set;} 
    }
    
    public class mapIcon { 
        @AuraEnabled
        public String path  {get;set;}
        @AuraEnabled
        public String fillColor{get;set;} 
        @AuraEnabled
        public Decimal fillOpacity{get;set;} 
        @AuraEnabled
        public Decimal scale{get;set;} 
         @AuraEnabled
        public integer strokeWeight{get;set;}
        @AuraEnabled
        public anchors anchor{get;set;} 
    }
    
    public class anchors {
        @AuraEnabled
        public Decimal x  {get;set;}
        @AuraEnabled
        public Decimal y  {get;set;}
    }
     
    
    public class finalWrapper{
        @AuraEnabled
      public List<wrapperClass> mapmarker{get;set;}
        @AuraEnabled
        public string listView;
        
          @AuraEnabled
        public object center; 
        
         @AuraEnabled
        public Integer zoomLevel ; 
         
    }    
    
}