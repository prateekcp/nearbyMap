global class MyCustomPickList extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        List<BRDH_Nearby_Map_Filters__c> BRDHLists = new List<BRDH_Nearby_Map_Filters__c>([SELECT Id,Name FROM BRDH_Nearby_Map_Filters__c WHERE Status__c = true ORDER BY Id ASC]);
        VisualEditor.DataRow defaultValue;
        if(BRDHLists.size() >0){
            defaultValue = new VisualEditor.DataRow(string.valueOf(BRDHLists[0].Name), string.valueOf(BRDHLists[0].Id));
        }else{
            defaultValue = new VisualEditor.DataRow('No filter found','No filter found');   
        }
        
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        List<BRDH_Nearby_Map_Filters__c> BRDHList = new List<BRDH_Nearby_Map_Filters__c>([SELECT Id,Name FROM BRDH_Nearby_Map_Filters__c WHERE Status__c = true ORDER BY Id ASC]);
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        for(BRDH_Nearby_Map_Filters__c bnmf:BRDHList){
            VisualEditor.DataRow value1 = new VisualEditor.DataRow(string.valueOf(bnmf.Name),string.valueOf(bnmf.Id));
            myValues.addRow(value1);
        }
        return myValues;
    }
}