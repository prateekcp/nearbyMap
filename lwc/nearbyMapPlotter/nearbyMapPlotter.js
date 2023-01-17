import { LightningElement, api ,track} from 'lwc';
import getSearchData from '@salesforce/apex/NearbyMapData.getSearchData';
export default class NearbyMapPlotter extends LightningElement {
    
    @api activeAddress; 
    @api recordId;
    @track mapMarkers = [];
    @track visible;
    @track center;
    @track zoomLevel = 2 ;
    @track zoom;
    isScroll = false;
    
    
    connectedCallback() {
       
        getSearchData({ BRDHRecordId: this.activeAddress , ParnetId : this.recordId })
            .then((result) => {
                console.log(JSON.stringify(result));
              this.mapMarkers = result.mapmarker;
              console.log(this.mapMarkers.length);
             
              this.visible = result.listView;
              this.center = result.center;
              this.zoom = result.zoom;
              console.log("this.mapMarkers" + JSON.stringify(result.mapmarker));
              console.log("tvisiblity" + this.visible);
               if(this.mapMarkers.length > 10 ){
              this.isScroll = true;
              }
              console.log(' this.isScroll '+ this.isScroll);
            })
            .catch((error) => {
                console.log(error)
            });
    }
}