import { Component, Output, EventEmitter } from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ErrorMessage} from '../ErrorMessage';
import {HeaderService, SectionCoordinateService} from "../../services";
import {QueryStore, QueryContainer} from "./queryobject.class";

declare var $:JQueryStatic;

@Component({
    selector: 'querybox',
    template: require('./querybox.template.html'),
    styles: [require('./querybox.style.css').toString()],
    providers: [SectionCoordinateService, HeaderService]
})
export class QueryBoxComponent {

    @Output() applyFilterEmitter = new EventEmitter();
    @Output() clearFilterEmitter = new EventEmitter();
    @Output() applyFilterArrayEmitter = new EventEmitter();
    @Output() moveAndZoomEmitter = new EventEmitter();
    @Output() rightHereEmitter   = new EventEmitter();


    sections;
    townships;
    ranges;
    meridians;

    section;
    township;
    range;
    meridian;

    lat:number;
    long:number;

    currentSelMethod;
    currentLocType;

    currentPolyAtr;
    currentPolyAtrVal;
    currentPolyAttributeValues;

    LLDerror:ErrorMessage;
    LatLongError:ErrorMessage;

    queryMessage = '';

    queryStore:QueryStore;

    dataTypes = [
        {name: 'Polygons'},
        {name: 'Photos'},
        {name: 'Soil Pits'},
        {name: 'Publications'},
        {name: 'Observations'},
        {name: 'All point data'}
    ];

    polygonAttributes = [
        {name: 'Dominant Slope Class',      value:'prt_slope_rg_view',  databaseID:'slope_rg',  disabled: false},
        {name: 'Dominant Slope Length',     value:'prt_slpl_view',      databaseID:'slpl',      disabled: false},
        {name: 'Salinity Class',            value:'prt_salsym_view',    databaseID:'salsym',    disabled: false},
        {name: 'Irrigation potential',      value:'prt_irrig_view',     databaseID:'irrig',     disabled: true},
        {name: 'Texture 1',                 value:'prt_text1_view',     databaseID:'text1',     disabled: false},
        {name: 'Texture 2',                 value:'prt_text2_view',     databaseID:'text2',     disabled: false},
        {name: 'pH',                        value:'prt_phsym_view',     databaseID:'phsym',     disabled: false},
        {name: 'Past Erosion Class',        value:'prt_pasteros_view',  databaseID:'pasteros',  disabled: false},
        {name: 'Stone Class',               value:'prt_stone_view',     databaseID:'stone',     disabled: false}
    ];

    ngOnInit(){
        this.currentSelMethod = 'coordinates';
        this.currentLocType = 'Entire province';
        this.currentPolyAtr = this.polygonAttributes[0].value;
        this.currentPolyAtrVal = '1';

        this.loadNewAttributeValues(0,'prt_slope_rg_view');

        this.sections = this.getRange(37);
        this.sections.unshift('section');
        this.section = this.sections[0];

        this.townships = this.getRange(65);
        this.townships.push('19A', '27A', '42A', '43A', '45A', '46A', '47A');
        this.townships.unshift('township');
        this.township = this.townships[0];

        this.ranges = this.getRange(35);
        this.ranges.push('13A', '21A', '24A');
        this.ranges.unshift('range');
        this.range = this.ranges[0];

        this.meridians = this.getRange(4);
        this.meridians.unshift('meridian');
        this.meridian = this.meridians[0];

        this.LLDerror = new ErrorMessage('', false);
        this.LatLongError = new ErrorMessage('',false);

        // New Query Stuff
        this.queryStore = new QueryStore();

    }

    constructor (
        private http: Http,
        private _coords: SectionCoordinateService
    ) {}

    getRange(i) {
        if (i > 1) {
            return this.getRange(i - 1).concat(i - 1)
        } else {
            return [];
        }
    }

    toLeadingZeroString(val:number):string{
        if (val < 10){
            return '0' + val;
        }else{
            return val.toString();
        }
    }

    searchLLD(){
        this._coords.getCenterOfSection(
            this.toLeadingZeroString(this.section),
            this.toLeadingZeroString(this.township),
            this.toLeadingZeroString(this.range),
            this.meridian
        ).subscribe(
            data => { console.log(data); this.zoomToLLD(data)  },
            err => { console.log(err)}
        );
    }

    zoomToLLD(jsonLocation){
        if(jsonLocation.x && jsonLocation.y){
            this.moveAndZoomEmitter.emit(jsonLocation);
            this.LLDerror = new ErrorMessage('', false);
        }else{
            this.LLDerror = new ErrorMessage('Invalid LLD', true);
        }
    }

    loadNewAttributeValues(attributeIndex, attributeName){
        this.currentPolyAtr = this.polygonAttributes[attributeIndex];

        if (attributeName == 'prt_irrig_view' ){
            let irrigValues = [
                {'value':1,'name':'No soil or landscape limitations'},
                {'value':2,'name':'Moderate soil and/or landscape limitations'},
                {'value':3,'name':'Slight soil and/or landscape limitations'},
                {'value':4,'name':'Severe soil and/or landscape limitations'},
                {'value':5,'name':'Unclassified'}
            ];
            this.currentPolyAttributeValues = irrigValues;
        }else if (attributeName == 'prt_slope_rg_view'){
            let domSlopeClass = [
                {'value':1,'name':'NEARLY LEVEL 0 - 0.5%'},
                {'value':2,'name':'VERY GENTLE SLOPES 0.5 - 2%'},
                {'value':3,'name':'GENTLE SLOPES 2 - 5%'},
                {'value':4,'name':'MODERATE SLOPES 5 - 10%'},
                {'value':5,'name':'STRONG SLOPES 10 -15%'},
                {'value':6,'name':'STEEP SLOPES 15 -30 %'},
                {'value':7,'name':'VERY STEEP SLOPES >30%'},
            ];
            this.currentPolyAttributeValues = domSlopeClass;
        }else if (attributeName == 'prt_slpl_view'){
            let domSlopeLength = [
                {'value':1,'name':'0 - 25 meters'},
                {'value':2,'name':'25 - 50 meters'},
                {'value':3,'name':'50 - 100 meters'},
                {'value':4,'name':'100 - 500 meters'},
                {'value':5,'name':'500 - 1000 meters'},
                {'value':6,'name':'> 1000 meters'},
            ];
            this.currentPolyAttributeValues = domSlopeLength;
        }else if(attributeName =='prt_salsym_view'){
            let salinityClass = [
                {'value':1,'name':'None'},
                {'value':2,'name':'Very slight (2-4 mS/cm)'},
                {'value':3,'name':'Slight (4-8 mS/cm)'},
                {'value':4,'name':'Moderate (8-16 mS/cm)'},
                {'value':5,'name':'Severe (>16 mS/cm)'},
            ];
            this.currentPolyAttributeValues = salinityClass;
        }else if (attributeName =='prt_text1_view' || attributeName =='prt_text2_view'){
            let textureClasses = [
                {'value':1,'name':'Coarse'},
                {'value':2,'name':'Moderately coarse'},
                {'value':3,'name':'Medium'},
                {'value':4,'name':'Moderately fine'},
                {'value':5,'name':'Fine'},
                {'value':6,'name':'Organic'},
                {'value':7,'name':'Unclassified'},
            ];
            this.currentPolyAttributeValues = textureClasses;

        }else if(attributeName =='prt_pasteros_view'){
            let pastErosionClasses = [
                {'value':1,'name':'WO - Very Low'},
                {'value':2,'name':'W1 - Low'},
                {'value':3,'name':'W2 - Moderate'},
                {'value':4,'name':'W3 - High'},
                {'value':5,'name':'W4 - Very High'},
                {'value':6,'name':'W5 - Extremely High'},
                {'value':7,'name':'Unclassified'},
            ];
            this.currentPolyAttributeValues = pastErosionClasses;
        }else if(attributeName =='prt_stone_view'){
            let stoneClasses = [
                {'value':1,'name':'Nonstony'},
                {'value':2,'name':'Slightly stony'},
                {'value':3,'name':'Moderately stony'},
                {'value':4,'name':'Very stony'},
                {'value':5,'name':'Exceedingly stony'},
                {'value':6,'name':'Unclassified'},
            ];
            this.currentPolyAttributeValues = stoneClasses;
        }else if(attributeName == 'prt_phsym_view'){
            let phClasses = [
                {'value':5,'name':'X: < 5.5'},
                {'value':1,'name':'A: 5.5 - 6.0'},
                {'value':2,'name':'B: 6.1 - 6.7'},
                {'value':3,'name':'C: 6.8 - 7.5'},
                {'value':4,'name':'D: > 7.5'}

            ];
            this.currentPolyAttributeValues = phClasses;
        }
    }

    currentAtrVals(event){
        console.log("event")
        console.log(this.currentPolyAttributeValues[event.target.value - 1])
        this.currentPolyAtrVal = event.target.value;
    }

    applyFilter(operator){

        // send message to toolbox saying if on soil zone, switch to another layer
        let q:QueryContainer = new QueryContainer();
        q.attribute = this.currentPolyAtr.databaseID;
        q.value = this.currentPolyAtrVal;
        q.valueName = this.currentPolyAttributeValues[parseInt(this.currentPolyAtrVal) - 1].name
        if (operator){
            q.logicalOperator = operator
        }
        this.queryStore.addQuery(q);
        this.applyFilterArrayEmitter.emit(this.queryStore)
    }

    clearFilter(){
        this.clearFilterEmitter.emit();
    }

    searchLatLong(){
        if (this.lat > 48 && this.lat < 61 && this.long < -100 && this.long > -110 ){
            let location = {latitude:this.lat, longitude:this.long};

            this.moveAndZoomEmitter.emit(location);

            console.log(location)

            this.LatLongError = new ErrorMessage('', false);
        }else{
            this.LatLongError =  new ErrorMessage('That location is not in Saskatchewan', true);
        }
    }

    rightHere($event) {
        this.rightHereEmitter.emit()
    }

    receiveMessage(m:string) {
        this.queryMessage = m
    }

    removeAndReapplyQuery(q:QueryContainer) {
        this.queryStore.removeQuery(q);
        this.applyFilterArrayEmitter.emit(this.queryStore)
    }

    getAtrName(atr){
        return this.polygonAttributes.find( o => o.databaseID == atr).name;
    }

    addParenthesis(p, q) {
        switch (p){
            case '(':
                q.startParens ++;
                break;
            case ')':
                q.endParens ++;
                break;
        }
        this.applyFilterArrayEmitter.emit(this.queryStore)
    }
}