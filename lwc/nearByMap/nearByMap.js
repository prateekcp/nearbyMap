import { LightningElement, wire, track, api } from 'lwc';
import getSourceObjectList from '@salesforce/apex/NearbyMapData.getSourceObjectList';
import getSourceObjectFields from '@salesforce/apex/NearbyMapData.getSourceObjectFields';
import getTargetObjectFields from '@salesforce/apex/NearbyMapData.getTargetObjectFields';
import getFilterData from '@salesforce/apex/NearbyMapData.getFilterData';
import saveFilterData from '@salesforce/apex/NearbyMapData.saveFilterData';
import getBRDHNearby from '@salesforce/apex/NearbyMapData.getBRDHNearby';
import getBRDHNearbyRecord from '@salesforce/apex/NearbyMapData.getBRDHNearbyRecord';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updatelist from '@salesforce/apex/NearbyMapData.updaterecord';
import { deleteRecord } from 'lightning/uiRecordApi';


const actions = [
                  { label: 'Edit', name: 'edit'},
                  { label: 'Delete', name: 'delete' }
];


let h = 30;
export default class NearByMap extends LightningElement {
    @track height = 'height:';
    @track isModalOpen = false;
    @track isEditForm = false;
    @track bShowModal = false;
    @track editnameValue = '' ;
    @track editobjectValue = '';
    @track editfieldName = '';
    @track editDistanceName = '' ;
    @track editOperatorValue = '';
 
    @track IsORInEdit = false;
    @track editDistanceValue = '' ;
    @track editFilterValue = '' ;
    @track targetEditObjectValue = '' ;
    @track tagretEditfieldName = '' ;
    @track editLimitsValue = '';
    @track editLogicValue = '';
    @track editActive_Incative = false;
    @track rowIdInForEdit = '';
    @track nameValue;
    @track filterValue;
    @track limitsValue;
    @track fieldName;
    @track distanceName;
    @track objectValue = '';
    @track targetObjectValue = '';
    @track tagretfieldName = '';
    @track logicValue = '';
    @track operatorValue = '';
    @track checkboxVal = false;
    @track editCheckboxVal = false;
    @track fieldList = [];
    @track miltiplerFilter = [];
    @track trgetfieldList = [];
    @track trgetAddressfieldList = [];
    @track areDetailsVisible = false;
    @track areEditDetailsVisible = false;
    @track Datatable;
    @track itemList = [];
    @track itemListInEdit = [];
    @track i =0;
    @track IsORInEditValue = 'AND';
    @track IsORValue = 'AND';
    @track addHeight = 120;
     @track imgHeight = 0;
     @track editImgHeight = 0;
     @track showlistView =false;
     @track editShowlistView =false;

    
  
    
    DistanceValue;
    draftValues
    _datatableresp

    @track columns = [
        { label: 'Filter Name', fieldName: 'Name', type: 'text'},
        { label: 'Source Object', fieldName: 'sdfcdev__Source_Object__c', type: 'text'},
        { label: 'Source Address', fieldName: 'sdfcdev__Source_Address__c', type: 'text'},
        { label: 'Targrt Object', fieldName: 'sdfcdev__Target_Object__c', type: 'text'},
        { label: 'Target Address', fieldName: 'sdfcdev__Target_Address__c', type: 'text'},
        { label: 'Distance Unit', fieldName: 'sdfcdev__Distance_and_Unit__c', type: 'text'},
        { label: 'Limits', fieldName: 'sdfcdev__Limits__c', type: 'text'},
        { label: 'Status', fieldName: 'sdfcdev__Status__c', type: 'Boolean'},
        { type: 'action', typeAttributes: { rowActions: actions }}
    ];


    @wire(getBRDHNearby)
    wiredBRDH(result) {
        this._datatableresp = result
        if (result.data) {
            this.Datatable = result.data
        } else {
            console.log('error while pulling data');
        }
    }


    get andOroptions() {
        return [
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' },
        ];
    }
 get limitOptions(){
    return [
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '30', value: '30' },
        { label: '40', value: '40' },
        { label: '50', value: '50' },
        { label: '60', value: '60' },
        { label: '70', value: '70' },
        { label: '80', value: '80' },
        { label: '90', value: '90' },
        { label: '100', value: '100' }

    ];
 }
    get objectOptions() {
        return [
            { label: 'Account', value: 'Account' },
            { label: 'Contact', value: 'Contact' },
            { label: 'Lead', value: 'Lead' },
        ];
    }
    get targetobjectOptions() {
        return [

            { label: 'Account', value: 'Account' },
            { label: 'Contact', value: 'Contact' },
            { label: 'Lead', value: 'Lead' }

        ];
    }
    get logicOptions() {
        return [
            { label: 'State', value: 'State' },
            { label: 'Company Size', value: 'Company Size' },
            { label: 'Industry', value: 'Industry' },
        ];
    }
    get operatorsOptions() {
        return [
            { label: 'contains', value: 'Like' },
            { label: 'less than', value: '<' },
            { label: 'greater than', value: '>' },
            { label: 'equals', value: '=' },
            { label: 'not equals to', value: '!=' },
            { label: 'less or equal', value: '<=' },
            { label: 'greater or equal', value: '>=' },
        ];
    }
    getoperatorsOptionsLable(opratorValue){
         let opeatorLabel;
        switch(opratorValue){
            case 'Like': 
            opeatorLabel = 'contains';
            break;
            case '<': 
            opeatorLabel = 'less than';
            break;
            case '>': 
            opeatorLabel = 'greater than';
            break;
            case '=': 
            opeatorLabel = 'equals';
            break;
            case '!=': 
            opeatorLabel = 'less or equal';
            break;
            case '<=': 
            opeatorLabel = 'contains';
            break;

            case '>=': 
            opeatorLabel = 'greater or equal';
            break;
        }

        return opeatorLabel;

    }
    get distanceList() {
        return [
            { label: 'mile', value: 'mi' },
            { label: 'km', value: 'km' }
        ]
    }

    handleIsOrChange(event){
        this.IsORValue = event.detail.value;
        console.log('IsOr' + this.IsORValue);
    }
    handleIsOrChangeInEdit(event){
    this.IsORInEditValue = event.detail.value;
    console.log('IsORInEdit' + this.IsORInEditValue);
    }
    
    handleObjectChange(event) {
        this.objectValue = event.detail.value;
        console.log('this.objectValue ' + this.objectValue);
        // if (this.objectValue === 'Account') {
        //     this.areDetailsVisible = true;
        // } else{
        //     this.areDetailsVisible = false;
        // }
        this.objectChangeHelper(this.objectValue);
    }

    objectChangeHelper(tempObjName){
           let objName = tempObjName;
            // if(tempObjName === 'Account'){
            //     objName = 'Contact';
            // }else{
            //     objName = tempObjName;
            // }
            // getTargetObjectFields({ seletedObject: objName })
            // .then((result) => {
            //     var tempDatas = [];
            //     for (var str in result) {
            //         tempDatas.push({ label: result[str], value: result[str] });
            //     }
            //     this.trgetfieldList = tempDatas;
            // })
            // .catch((error) => {
            //     console.log(error)
            // });
        
        getSourceObjectFields({ seletedObject: tempObjName })
            .then((result) => {
                var tempDatas = [];
                for (var str in result) {
                    tempDatas.push({ label: result[str], value: result[str] });
                }
                this.fieldList = tempDatas;
            })
            .catch((error) => {
                console.log(error)
            });
    }

    handleTagetObjectChange(event) {
        this.targetObjectValue = event.detail.value;
        console.log('this.targetObjectValue ' + this.targetObjectValue);
        this.targetObjectChangeHelper(this.targetObjectValue);
        
    }
    targetObjectChangeHelper(tempTargetObject){
        getSourceObjectFields({ seletedObject: tempTargetObject })
            .then((result) => {
                var tempDatas = [];
                for (var str in result) {
                    tempDatas.push({ label: result[str], value: result[str] });
                }
                this.trgetAddressfieldList = tempDatas;
            })
            .catch((error) => {
                console.log(error)
            });

            getTargetObjectFields({ seletedObject: tempTargetObject })
        .then((result) => {
            var tempDatas = [];
            for (var str in result) {
                tempDatas.push({ label: result[str], value: result[str] });
            }
            this.trgetfieldList = tempDatas;
        })
        .catch((error) => {
            console.log(error)
        });
    }
    handleFieldChange(event) {
        this.fieldName = event.detail.value;
    }
    handleTargetFieldChange(event) {
        this.tagretfieldName = event.detail.value;
        this.targetFieldChnageHelper(this.tagretfieldName);
    }

    targetFieldChnageHelper(tempTargetObjName){
        getTargetObjectFields({ seletedObject: tempTargetObjName })
        .then((result) => {
            var tempDatas = [];
            for (var str in result) {
                tempDatas.push({ label: result[str], value: result[str] });
            }
            this.trgetfieldList = tempDatas;
        })
        .catch((error) => {
            console.log(error)
        });

    }
    handleDistanceValueChange(event){
      this.DistanceValue = event.detail.value;

    }
    handleDistanceChange(event) {
        this.distanceName = event.detail.value;
        console.log('distance   :- ' + this.distanceName)
    }
    saveHandleFilter(event) {
        console.log('this.nameValue ' + this.nameValue);
        console.log('this.objectValue ' + this.objectValue);
        console.log('this.targetObjectValue ' + this.targetObjectValue);
        console.log('this.tagretfieldName ' + this.tagretfieldName);
        console.log('this.distanceName ' + this.distanceName);
        console.log('this.distanceValue ' + this.DistanceValue);
        console.log('this.logicValue   this.operatorValue this.filterValue ' + this.logicValue + ' ' + this.operatorValue + ' ' + this.filterValue);
        console.log('this.limitsValue' + this.limitsValue);
        console.log('this.checkboxVal' + this.checkboxVal);
        console.log('this.itemList'+JSON.stringify(this.itemList));
        let allFilter='';
        let arr=["TRUE","FALSE","YESTERDAY","TODAY","TOMORROW","LAST_WEEK","THIS_WEEK","NEXT_WEEK","LAST_MONTH","THIS_MONTH","NEXT_MONTH","LAST_90_DAYS","NEXT_90_DAYS","THIS_QUARTER","LAST_QUARTER","NEXT_QUARTER","THIS_YEAR","LAST_YEAR","NEXT_YEAR","THIS_FISCAL_QUARTER","LAST_FISCAL_QUARTER","NEXT_FISCAL_QUARTER","THIS_FISCAL_YEAR","LAST_FISCAL_YEAR","NEXT_FISCAL_YEAR"];
        let filterValueSet = new Set();
        arr.forEach(element => {
        filterValueSet.add(element);
        });
        console.log('filterValueSet' + filterValueSet);
        console.log('this.limitsValue'+this.limitsValue);
        for(var Index in this.itemList){
            let filterVal = '';
            console.log(JSON.stringify(this.itemList[Index]));
            let isEqual =false ;
            let isLike = false;
            for(let [key, value] of Object.entries(this.itemList[Index])){
                switch(key){
                    case 'templogicValue' : 
                    filterVal += value;
                    break;
                    case 'tempoperatorValue' :
                        filterVal += ' ' +value;
                        if(value === '='){
                            isEqual = true;
                        }else if(value === 'Like'){
                            isLike = true;
                        }
                        break;
                     case 'tempfilterValue': 
                     if(isEqual){
                        if(filterValueSet.has(value.toUpperCase())){
                             filterVal += value;
            
                         }else{
                           var strTemp = '\''+value+'\'';
                               filterVal += ' ' +strTemp;
                         }
                        
                    }else if(isLike){
                        var strTemp = '\'%'+value+'%\'';
                            filterVal += ' ' +strTemp;
                    }else{
                      
                        filterVal += ' ' + value;
                        
                    }
                    break;
                }
                console.log('filterVal ====> '+filterVal);
            }
            if(this.IsORValue === 'AND'){
                console.log('<=======AND>>>>>>>>>>');
            }else if(this.IsORValue === 'OR'){
                console.log('<=======OR>>>>>>>>>>');
            }
            if((Index < this.itemList.length-1) && (this.IsORValue === 'AND'))
                  allFilter += filterVal + ' AND ';
            else if((Index < this.itemList.length-1) && (this.IsORValue === 'OR'))
               allFilter += filterVal + ' OR ';
            else
               allFilter += filterVal;
            console.log('allFilter Index '+ Index + '  '+ allFilter);
        }
        console.log('allFilter ============>'+ allFilter);
        if ( typeof this.nameValue !== 'undefined' && typeof this.objectValue !== 'undefined' && 
        typeof this.fieldName !== 'undefined' && typeof this.limitsValue !== 'undefined' && 
        typeof this.checkboxVal !== 'undefined' && typeof this.distanceName !=='undefined' && 
        typeof this.DistanceValue !== 'undefined') {
            getFilterData({
                name: this.nameValue,
                sourceObject: this.objectValue,
                sourceAddress: this.fieldName,
                targetObject: this.targetObjectValue,
                tagetAddress: this.tagretfieldName,
                distanceValue : this.DistanceValue,
                distanceUnit: this.distanceName,
                filters: allFilter,
                limits: this.limitsValue,
                status: this.checkboxVal,
                showlistViews: this.showlistView
                
                
            })
                .then((result) => {
                    this.isModalOpen = false;
                    this.itemList =[];
                    const event = new ShowToastEvent({
                        title: 'Filter created',
                        message: 'Filter created successfully!',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Error creating filter. Please Contact System Admin',
                        variant: 'error'
                    });
                    this.dispatchEvent(event);
                });
      
             setTimeout(function () {
                location.reload();
             }, 1000);
        } else {
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Please fill the field value',
                variant: 'error'
            });
            this.dispatchEvent(event);
            console.log('Error return')
        }

    }
    handleNameChange(event) {
        this.nameValue = event.detail.value;
    }
    logicHandleChange(event) {
        this.logicValue = event.detail.value;
    }
    operatorHandleChange(event) {
        this.operatorValue = event.detail.value;
    }
    handleFilterChange(event) {
        this.filterValue = event.detail.value;
    }
    handleLimitChange(event) {
        this.limitsValue = event.detail.value;
        
        console.log('this.limitsValue '+ this.limitsValue);
            
    }
    handleStatusChange(event) {
        this.checkboxVal = event.detail.checked;
    }

    handleSave(event) {
        this.draftValues = event.detail.draftValues;
        console.log('draf ' + JSON.stringify(this.draftValues))
        updatelist({ BRDHlist: this.draftValues})
            .then(result => {
                console.log(JSON.stringify("Apex update result: " + result))
                if (result === true) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success!!',
                            message: 'successfully records updated',
                            variant: 'success'
                        })

                    );
                    this.draftValues = []
                    return refreshApex(this._datatableresp);
                } else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error!!',
                            message: 'something went wrong please try again',
                            variant: 'error'
                        })
                    );
                }

            })
    }
    handleRowHandler(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log(row.id);
        switch (actionName) {
            case 'delete':
                this.handleDeleteRow(row.Id);
                break;
            case 'edit':
                this.handleEditRow(row.Id);
                this.rowIdInForEdit = row.Id;
                break;
            default:
        }
    }
    handleDeleteRow(rowId) {
        console.log('handleDeleteRow ' +rowId);
        deleteRecord(rowId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            return refreshApex(this._datatableresp);
            })
    }

    handleEditRow(rowId){
        this.editImgHeight = 0;
        this.itemListInEdit = [];
        this.IsORInEdit = false;
       console.log('Edit Row');

       getBRDHNearbyRecord({brdhrecordId : rowId  })
       .then((result)=>{
      console.log('result  handleEditRow '+ JSON.stringify(result));
      for(let [key, value] of Object.entries(result)){
        //   console.log('key '+key);
        //   console.log('value '+value);
        
          switch(key){
              case 'Name' :
                  console.log('Name '+value);
                  this.editnameValue  = value;
              break;
              case 'sdfcdev__Source_Object__c' : 
              this.objectChangeHelper(value);
              this.editobjectValue = value; 
              if (this.editobjectValue === 'Account') {
                this.areEditDetailsVisible = true;
            } else{
                this.areEditDetailsVisible = false;
            }
              break;
              case 'sdfcdev__Source_Address__c' : 
              this.editfieldName = value;
              break;
              case 'sdfcdev__Target_Object__c' : 
              this.targetEditObjectValue = value;
              setTimeout(()=>{
                this.targetObjectChangeHelper(this.targetEditObjectValue);
            }, 1000);
              break;
              case 'sdfcdev__Target_Address__c' : 
              this.tagretEditfieldName = value; 
              console.log('Target_Address__c '+value); 
              break;
              case 'sdfcdev__Distance_Value__c' :
                this.editDistanceValue = value;
                break;  
              case 'sdfcdev__Distance_and_Unit__c' : 
              this.editDistanceName = value;
              break;
              case 'sdfcdev__Filters__c' :
                setTimeout(()=>{
                    this.targetFieldChnageHelper(this.targetEditObjectValue); 
                }, 1000);
                
              let text = value;
              let myfilterArrayList = []; 
              if( text.includes("AND")){
                myfilterArrayList =  text.split("AND");
                this.IsORInEditValue = 'AND';
              }else if(text.includes("OR")){
                myfilterArrayList =   text.split("OR");
                this.IsORInEdit = true;
                this.IsORInEditValue = 'OR';
              }else{
                myfilterArrayList =  [text];
              }
              console.log('myfilterArrayList ',myfilterArrayList);     
             if(myfilterArrayList.length>0){
                    for(let str of myfilterArrayList ){
                        console.log('Str' +str.trim());
                        let tempStr = str.trim();
                        let tempSingleFilter = tempStr.split(" " , 2);
                        const indexOfOperator = tempStr.indexOf(tempSingleFilter[1]);
                        let finaltestValue = tempStr.substr(indexOfOperator+tempSingleFilter[1].length);
                        console.log('finaltestValue====> '+finaltestValue);
                        
                        if(tempSingleFilter[1] === '='){
                            finaltestValue = finaltestValue.trim().replace(/\'/g, '');
                        }else if(tempSingleFilter[1] === 'Like'){
                            finaltestValue = finaltestValue.trim().replace(/%/g, '');
                            finaltestValue = finaltestValue.trim().replace(/\'/g, '');
                        }
                       console.log('tempSingleFilter '+JSON.stringify(this.getoperatorsOptionsLable(tempSingleFilter[1])));
                            var tempObj = [{
                                id:  this.itemListInEdit[this.itemListInEdit.length - 1] ? this.itemListInEdit[this.itemListInEdit.length - 1].id + 1 : 0,
                                templogicValue : tempSingleFilter[0],
                                tempoperatorValue : tempSingleFilter[1],
                                tempfilterValue : finaltestValue
                                }];
                                console.log('  tempObj'+JSON.stringify(tempObj));
                           this.itemListInEdit = this.itemListInEdit.concat(tempObj);
                    }

                    console.log('this.itemListInEdit '+JSON.stringify(this.itemListInEdit));
             }
            
              break;
              case 'sdfcdev__Limits__c' : 
              this.editLimitsValue = String(value);
              break;
              case 'sdfcdev__Status__c' : 
              this.editCheckboxVal = value;
              break;
              case 'sdfcdev__showListView__c' :
              this.editShowListView = value;
              console.log('sdfcdev__showListView__c ' + value)
              break;
              default:
        console.log('default '); 

          }
      }
     
     this.editImgHeight = ((this.editImgHeight+80)*(this.itemListInEdit.length));
      var elements = this.template.querySelectorAll(".editScroll");
      for(var i=0; i<elements.length; i++)
      elements[i].style.height = this.editImgHeight+ "px";
      
      this.isEditForm = true;
       }).catch((error)=>{

       })
       this.bShowModal = true;
       
    }

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        this.imgHeight = 0;
        this.nameValue = '';
        this.objectValue = '' ;
        this.targetObjectValue = '' ;
        this.tagretfieldName = '' ;
        this.distanceName = '' ;
        this.distanceName = '';
        this.limitsValue = '';
        this.checkboxVal = false;
        this.itemList = [];
        this.imgHeight = 0;
        this.logicValue = '';
        this.operatorValue = '' ;
        this.filterValue = '';
        this.trgetfieldList = [];


    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        console.log('this.nameValue ' + this.nameValue);
        console.log('this.objectValue ' + this.objectValue);
        console.log('this.targetObjectValue ' + this.targetObjectValue);
        console.log('this.tagretfieldName ' + this.tagretfieldName);
        console.log('this.distanceName ' + this.distanceName);
        console.log('this.distanceValue ' + this.DistanceValue);
        console.log('this.logicValue   this.operatorValue this.filterValue ' + this.logicValue + ' ' + this.operatorValue + ' ' + this.filterValue);
        console.log('this.limitsValue' + this.limitsValue);
        console.log('this.checkboxVal' + this.checkboxVal);
        this.nameValue = '';
        this.objectValue = '' ;
        this.targetObjectValue = '' ;
        this.tagretfieldName = '' ;
        this.distanceName = '' ;
        this.distanceName = '';
        this.limitsValue = '';
        this.checkboxVal = false;
        this.itemList = [];
        this.imgHeight = 0;





    }
    
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
      if(this.isInputValid()){
        this.saveHandleFilter();
      }
    }
    closeEditModal(){
        this.bShowModal = false;
    }

    handleEditNameChange(event){
       this.editnameValue = event.detail.value;;
    }
    handleEditObjectChange(event){
        this.editobjectValue = event.detail.value;
        // if (this.editobjectValue === 'Account') {
        //     this.areEditDetailsVisible = true;
        // } else{
        //     this.areEditDetailsVisible = false;
        //     this.targetEditObjectValue = '';
        //     this.tagretEditfieldName = '';
        // }
        this.objectChangeHelper(this.editobjectValue);
    }
    handleEditFieldChange(event){
        this.editfieldName = event.detail.value;

    }
    handleEditTagetObjectChange(event){
        this.targetEditObjectValue = event.detail.value;
        this.targetObjectChangeHelper(this.targetEditObjectValue);
    }
    handleEditTargetFieldChange(event){
        this.tagretEditfieldName = event.detail.value;
        this.targetFieldChnageHelper(this.tagretEditfieldName);
    }
    handleEditDistanceValueChange(event){
        this.editDistanceValue = event.detail.value;
    }
    handleEditDistanceChange(event){
        this.editDistanceName = event.detail.value;
    }
    handleEditLimitChange(event){
     this.editLimitsValue = event.detail.value;
     console.log('this.editLimitsValue '+this.editLimitsValue);
    }
    editCheckboxVal(event){
   this.editCheckboxVal = event.detail.checked;
    }
    logicEditHandleChange(event){
  this.editLogicValue = event.detail.value;
  }
  operatorEditHandleChange(event){
      this.editOperatorValue = event.detail.value;
  }
  handleEditFilterChange(event){
   this.editFilterValue = event.detail.value;
  }
  handleEditStatusChange(event){
   this.editCheckboxVal = event.detail.checked;
  }
  closeEditModal(){
      this.bShowModal = false;

  }
  submitEditDetails(){
    console.log('Name' + this.editnameValue);
    console.log('Source Object' + this.editobjectValue);
    console.log('Source Address '+this.editfieldName);
    console.log('Target Object ' + this.targetEditObjectValue);
    console.log('Target Address ' + this.tagretEditfieldName);
    console.log('Distance ' + this.editDistanceValue);
    console.log('Distance Unit' + this.editDistanceName);
    console.log('Fields  Operators Value ' + this.editLogicValue + ' ' + this.editOperatorValue + ' ' + this.editFilterValue);
    console.log('Limits' + this.editLimitsValue);
    console.log('Active/Inactive' + this.editCheckboxVal);
    console.log('editShowlistView' + this.editShowListView);
    
    debugger;
    let arr=["TRUE","FALSE","YESTERDAY","TODAY","TOMORROW","LAST_WEEK","THIS_WEEK","NEXT_WEEK","LAST_MONTH","THIS_MONTH","NEXT_MONTH","LAST_90_DAYS","NEXT_90_DAYS","THIS_QUARTER","LAST_QUARTER","NEXT_QUARTER","THIS_YEAR","LAST_YEAR","NEXT_YEAR","THIS_FISCAL_QUARTER","LAST_FISCAL_QUARTER","NEXT_FISCAL_QUARTER","THIS_FISCAL_YEAR","LAST_FISCAL_YEAR","NEXT_FISCAL_YEAR"];
    let filterValueSet = new Set();
        arr.forEach(element => {
        filterValueSet.add(element);
        });
   if(this.isEditInputValid()){
    let allFilter='';
    for(var Index in this.itemListInEdit){
        let filterVal = '';
        console.log(JSON.stringify(this.itemListInEdit[Index]));
        let isEqual =false ;
        let isLike = false;
        for(let [key, value] of Object.entries(this.itemListInEdit[Index])){
            switch(key){
                case 'templogicValue' : 
                filterVal += value;
                break;
                case 'tempoperatorValue' :
                    filterVal += ' ' +value;
                    if(value === '='){
                        isEqual = true;
                    }else if(value === 'Like'){
                        isLike = true;
                    }
                    break;
                 case 'tempfilterValue': 
                 if(isEqual){
                     if(filterValueSet.has(value.toUpperCase())){
                             filterVal += value;
                         }
                    var strTemp = '\''+value+'\'';
                           filterVal += ' ' +strTemp;
                }else if(isLike){
                    var strTemp = '\'%'+value+'%\'';
                        filterVal += ' ' +strTemp;
                }else{
                    filterVal += ' ' + value;
                }
                break;
            }
            console.log('filterVal ====> '+filterVal);
        }
        if((Index < this.itemListInEdit.length-1) && (this.IsORInEditValue === 'AND'))
              allFilter += filterVal + ' AND ';
        else if((Index < this.itemListInEdit.length-1) && (this.IsORInEditValue === 'OR'))
           allFilter += filterVal + ' OR ';
        else
           allFilter += filterVal;
        console.log('allFilter Index '+ Index + '  '+ allFilter);
    }
    console.log('allFilter ============>'+ allFilter);

    if ((typeof this.editnameValue !== 'undefined' || !(this.editnameValue === '') )&& (typeof this.editobjectValue !== 'undefined')  && ( typeof this.editLimitsValue !== 'undefined') && (typeof this.editCheckboxVal !== 'undefined') && (typeof this.editDistanceValue !== 'undefined' || !(this.editDistanceValue === '' )) && (typeof this.editDistanceName !== 'undefined' )) {        
        saveFilterData({
            name: this.editnameValue,
            sourceObject: this.editobjectValue,
            sourceAddress: this.editfieldName,
            targetObject: this.targetEditObjectValue,
            tagetAddress: this.tagretEditfieldName,
            distanceValue : this.editDistanceValue,
            distanceUnit: this.editDistanceName,
            filters: allFilter,
            limits: this.editLimitsValue,
            status: this.editCheckboxVal,
            brdhRecordId : this.rowIdInForEdit,
            editShowlistViews: this.editShowlistView
            
        })
            .then((result) => {
                console.log('result' + JSON.stringify(result));
                const event = new ShowToastEvent({
                    title: 'Filter Updated',
                    message: 'Filter Updated successfully!',
                    variant: 'success'
                });
                this.dispatchEvent(event);
            })
            .catch(error => {
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'Error creating filter. Please Contact System Admin',
                    variant: 'error'
                });
                this.dispatchEvent(event);
            });
        //  setTimeout(function () {
        //      location.reload();
        //  }, 1000);
    } else {
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Please fill the field value',
            variant: 'error'
        });
        this.dispatchEvent(event);
        console.log('Error return')
    }

   }
  
  }
  
  handleChange(event) {
      // Get the string of the "value" attribute on the selected option
      const selectedOption = event.detail.value;
      console.log('selected value=' + selectedOption);
      this.chosenValue = selectedOption;
  }

  addFilterToList(){
      console.log('this.imgHeight In add '+ this.imgHeight);
      
      
     
  if(!(this.logicValue.length === '' ) && !(this.operatorValue === '') && !(this.filterValue === '')){
       
       this.imgHeight += this.addHeight ;
      //console.log('scroll'+this.template.querySelectorAll(".scroll"));
      var elements = this.template.querySelectorAll(".scroll");
      elements[0].style["max-height"] = 200+ "px";
      for(var i=0; i<elements.length; i++)
      elements[i].style.height = this.imgHeight + "px";

      console.log('height In add '+ elements[0].style.height);
      console.log('addFilterToList ');
    var tempObj = [{
        id:  this.itemList[this.itemList.length - 1] ? this.itemList[this.itemList.length - 1].id + 1 : 0,
        templogicValue : this.logicValue,
        tempoperatorValue : this.operatorValue,
        tempfilterValue : this.filterValue
        }];
        console.log('  tempObj  addFilterToList' +JSON.stringify(tempObj));
   this.itemList = this.itemList.concat(tempObj);
  }else{
    const event = new ShowToastEvent({
        title: 'Warning',
        message: 'Please fill the Filters value',
        variant: 'Warning'
    });
    this.dispatchEvent(event);
  }
    
  
   console.log('this.itemList '+JSON.stringify(this.itemList));
   this.logicValue = '';
    this.operatorValue = '';
    this.filterValue = '';
  }
  addFilterToListInEdit(){
      
      if(!(this.editLogicValue === '' ) && !(this.editOperatorValue === '') && !(this.editFilterValue === '')){
          this.editImgHeight +=this.addHeight;
      var elements = this.template.querySelectorAll(".editScroll");
      elements[0].style["max-height"] = 200+ "px";
      for(var i=0; i<elements.length; i++)
      elements[i].style.height = this.editImgHeight+ "px";
    console.log('addFilterToListInEdit');
    var tempObj = [{
        id:  this.itemListInEdit[this.itemListInEdit.length - 1] ? this.itemListInEdit[this.itemListInEdit.length - 1].id + 1 : 0,
        templogicValue : this.editLogicValue,
        tempoperatorValue : this.editOperatorValue,
        tempfilterValue : this.editFilterValue
        }];
        console.log('  tempObj'+JSON.stringify(tempObj));
   this.itemListInEdit = this.itemListInEdit.concat(tempObj);
    }else{
        const event = new ShowToastEvent({
            title: 'Warning',
            message: 'Please fill the Filters value',
            variant: 'Warning'
        });
        this.dispatchEvent(event);
      }
  
   console.log('this.itemList '+JSON.stringify(this.itemListInEdit));
   this.editLogicValue = '';
    this.editOperatorValue = '';
    this.editFilterValue = '';
  }
  removeRow(event) {
       console.log(' this.editImgHeight '+ this.imgHeight);
      if (this.itemList.length >= 1) {
              
          this.itemList = this.itemList.filter(function (element) {
              return parseInt(element.id) !== parseInt(event.target.accessKey);
          });

      this.imgHeight -=this.addHeight;
      var elements = this.template.querySelectorAll(".scroll");
      for(var i=0; i<elements.length; i++){
       elements[i].style.height = this.imgHeight+ "px";
        elements[i].style["max-height"] = this.imgHeight+ "px";
      }
      
      }
       var elements = this.template.querySelectorAll(".scroll");
      console.log(' this.editImgHeight '+ this.imgHeight);
      console.log('heigth' +elements[0].style['height'] );
      console.log('max-heigth' +elements[0].style["max-height"] );
  }

  removeRowInEdit(event){
    if (this.itemListInEdit.length >= 1) {
         console.log(' this.editImgHeight  removeRowInEdit'+ this.editImgHeight);
        this.itemListInEdit = this.itemListInEdit.filter(function (element) {
            return parseInt(element.id) !== parseInt(event.target.accessKey);
        });

        this.editImgHeight -=this.addHeight;
      var elements = this.template.querySelectorAll(".editScroll");
      for(var i=0; i<elements.length; i++){
       elements[i].style.height = this.editImgHeight+ "px";

        elements[i].style["max-height"] = this.editImgHeight+ "px";
        elements[i].style["min-height"] = 70+ "px";
      }

       var elements = this.template.querySelectorAll(".editScroll");
      console.log(' this.editImgHeight '+ this.editImgHeight);
      console.log('heigth' +elements[0].style['height'] );
      console.log('max-heigth' +elements[0].style["max-height"] );
    }
  }

  isInputValid() {
    let isValid = true;
    let inputFields = this.template.querySelectorAll('.validate');
    inputFields.forEach(inputField => {
        if(!inputField.checkValidity()) {
            inputField.reportValidity();
            isValid = false;
        }
    });
    return isValid;
}

isEditInputValid() {
    let isValid = true;
    let inputFields = this.template.querySelectorAll('.validateEdit');
    inputFields.forEach(inputField => {
        if(!inputField.checkValidity()) {
            inputField.reportValidity();
            isValid = false;
        }
        
    });
    return isValid;

}

handleshowListView(event){
this.showlistView = event.detail.checked;
console.log('showListView' + this.showlistView );
}

handeleditShowListView(event){
this.editShowlistView = event.detail.checked;
console.log('showEDITListView' + this.editShowlistView );
}
    }