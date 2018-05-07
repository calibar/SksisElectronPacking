"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
const ErrorMessage_1 = require("../ErrorMessage");
const services_1 = require("../../services");
let QueryBoxComponent = class QueryBoxComponent {
    constructor(http, _coords) {
        this.http = http;
        this._coords = _coords;
        this.applyFilterEmitter = new core_1.EventEmitter();
        this.clearFilterEmitter = new core_1.EventEmitter();
        this.moveAndZoomEmitter = new core_1.EventEmitter();
        this.attributeValuesURL = 'http://mgl.usask.ca:8080/sksoilservice/api/v2/';
        this.centroidURL = "http://mgl.usask.ca:8080/sksoilservice/api/v1/section/center/";
        this.dataTypes = [
            { name: 'Polygons' },
            { name: 'Photos' },
            { name: 'Soil Pits' },
            { name: 'Publications' },
            { name: 'Observations' },
            { name: 'All point data' }
        ];
        this.locationTypes = [
            { name: 'Entire province' },
            { name: 'Specific location' }
        ];
        this.locSelectionMethod = [
            { name: 'Lat/Long', selected: false, value: 'coordinates' },
            { name: 'Legal Land Description', selected: false, value: 'LLD' },
            { name: 'Select on map', selected: false, value: 'map location' }
        ];
        this.polygonAttributes = [
            { name: 'Dominant Slope Class', value: 'prt_slope_rg_view', databaseID: 'slope_rg' },
            { name: 'Dominant Slope Length', value: 'prt_slpl_view', databaseID: 'slpl' },
            { name: 'Salinity Class', value: 'prt_salsym_view', databaseID: 'salsym' },
            { name: 'Irrigation potential', value: 'prt_irrig_view', databaseID: 'irrig' },
            { name: 'Texture 1', value: 'prt_text1_view', databaseID: 'text1' },
            { name: 'Texture 2', value: 'prt_text2_view', databaseID: 'text2' },
            { name: 'pH', value: 'prt_phsym_view', databaseID: 'phsym' },
            { name: 'Past Erosion Class', value: 'prt_pasteros_view', databaseID: 'pasteros' },
            { name: 'Stone Class', value: 'prt_stone_view', databaseID: 'stone' },
            { name: 'Map unit', value: 'prt_mapunit_view', databaseID: 'skv3_prt_mapunit' }
        ];
    }
    // polygonAttributes = [
    //     {name: 'Map unit',                  value:'prt_mapunit_view',   databaseID:'skv3_prt_mapunit'},
    //     {name: 'Dominant Slope Class',      value:'prt_slope_rg_view',  databaseID:'slope_rg'},
    //     {name: 'Dominant Slope Length',     value:'prt_slpl_view',      databaseID:'slpl'},
    //     {name: 'Salinity Class',            value:'prt_salsym_view',    databaseID:'salsym'},
    //     {name: 'Wind Erosion',              value:'prt_wind_view',      databaseID:'wind'},
    //     {name: 'Water Erosion',             value:'prt_water_view',     databaseID:'water'},
    //     {name: 'Irrigation potential',      value:'prt_irrig_view',     databaseID:'irrig'},
    //     {name: 'Texture 1',                 value:'prt_text1_view',     databaseID:'text1'},
    //     {name: 'Texture 2',                 value:'prt_text2_view',     databaseID:'text2'},
    //     {name: 'pH',                        value:'prt_phsym_view',     databaseID:'phsym'},
    //     {name: 'Past Erosion',              value:'prt_pasteros_view',  databaseID:'pasteros'},
    //     {name: 'Stoniness',                 value:'prt_stone_view',     databaseID:'stone'},
    //     {name: 'Deep Tillage Potential',    value:'prt_deeptill_view',  databaseID:'deeptill'},
    //     {name: 'Sand and Gravel',           value:'prt_sdgr_view',      databaseID:'sdgr'},
    // ];
    ngOnInit() {
        this.currentSelMethod = 'coordinates';
        this.currentLocType = 'Entire province';
        this.currentPolyAtr = this.polygonAttributes[0].value;
        this.loadNewAttributeValues(0, 'prt_slope_rg_view');
        this.sections = this.getRange(37);
        this.sections.unshift('sec');
        this.section = this.sections[0];
        this.townships = this.getRange(65);
        this.townships.unshift('twp');
        this.township = this.townships[0];
        this.ranges = this.getRange(35);
        this.ranges.unshift('rge');
        this.range = this.ranges[0];
        this.meridians = this.getRange(4);
        this.meridians.unshift('mer');
        this.meridian = this.meridians[0];
        this.LLDerror = new ErrorMessage_1.ErrorMessage('', false);
        this.LatLongError = new ErrorMessage_1.ErrorMessage('', false);
        $('.collapse-link').on('click', function () {
            var ibox = $(this).closest('div.ibox');
            var button = $(this).find('i');
            var content = ibox.find('div.ibox-content');
            content.slideToggle(200);
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            ibox.toggleClass('').toggleClass('border-bottom');
            setTimeout(function () {
                ibox.resize();
                ibox.find('[id^=map-]').resize();
            }, 50);
        });
    }
    getRange(i) {
        if (i > 1) {
            return this.getRange(i - 1).concat(i - 1);
        }
        else {
            return [];
        }
    }
    toLeadingZeroString(val) {
        if (val < 10) {
            return '0' + val;
        }
        else {
            return val.toString();
        }
    }
    searchLLD() {
        var url = this.centroidURL.concat(this.toLeadingZeroString(this.section), '/', this.toLeadingZeroString(this.township), '/', this.toLeadingZeroString(this.range), '/', this.meridian);
        this._coords.getCenterOfSection(this.toLeadingZeroString(this.section), this.toLeadingZeroString(this.township), this.toLeadingZeroString(this.range), this.meridian).subscribe(data => { console.log(data); this.zoomToLLD(data); }, err => { console.log(err); });
        // Object {longitude: "-103.282043835619", latitude: "49.8064067486637"}
        // console.log(url);
        //
        // this.http.get(url)
        //     .map(res => res.json())
        //     .subscribe(
        //         data => this.zoomToLLD(data),
        //         err => console.log(err))
    }
    zoomToLLD(jsonLocation) {
        if (jsonLocation.x && jsonLocation.y) {
            this.moveAndZoomEmitter.emit(jsonLocation);
            this.LLDerror = new ErrorMessage_1.ErrorMessage('', false);
        }
        else {
            console.log("invalid LLD");
            this.LLDerror = new ErrorMessage_1.ErrorMessage('Invalid LLD', true);
        }
    }
    loadNewAttributeValues(attributeIndex, attributeName) {
        this.currentPolyAtr = this.polygonAttributes[attributeIndex];
        console.log(attributeName);
        if (attributeName == 'prt_irrig_view') {
            let irrigValues = [
                { 'value': 0, 'name': 'any' },
                { 'value': 1, 'name': 'No soil or landscape limitations' },
                { 'value': 2, 'name': 'Moderate soil and/or landscape limitations' },
                { 'value': 3, 'name': 'Slight soil and/or landscape limitations' },
                { 'value': 4, 'name': 'Severe soil and/or landscape limitations' },
                { 'value': 5, 'name': 'Unclassified' }
            ];
            this.currentAttrValues = irrigValues;
        }
        else if (attributeName == 'prt_slope_rg_view') {
            let domSlopeClass = [
                { 'value': 0, 'name': 'any' },
                { 'value': 1, 'name': 'NEARLY LEVEL 0 - 0.5%' },
                { 'value': 2, 'name': 'VERY GENTLE SLOPES 0.5 - 2%' },
                { 'value': 3, 'name': 'GENTLE SLOPES 2 - 5%' },
                { 'value': 4, 'name': 'MODERATE SLOPES 5 - 10%' },
                { 'value': 5, 'name': 'STRONG SLOPES 10 -15%' },
                { 'value': 6, 'name': 'STEEP SLOPES 15 -30 %' },
                { 'value': 7, 'name': 'VERY STEEP SLOPES >30%' },
            ];
            this.currentAttrValues = domSlopeClass;
        }
        else if (attributeName == 'prt_slpl_view') {
            let domSlopeLength = [
                { 'value': 0, 'name': 'any' },
                { 'value': 1, 'name': '0 - 25 meters' },
                { 'value': 2, 'name': '25 - 50 meters' },
                { 'value': 3, 'name': '50 - 100 meters' },
                { 'value': 4, 'name': '100 - 500 meters' },
                { 'value': 5, 'name': '500 - 1000 meters' },
                { 'value': 6, 'name': '> 1000 meters' },
            ];
            this.currentAttrValues = domSlopeLength;
        }
        else if (attributeName == 'prt_salsym_view') {
            let salinityClass = [
                { 'value': 0, 'name': 'any' },
                { 'value': 1, 'name': 'None' },
                { 'value': 2, 'name': 'Very slight' },
                { 'value': 3, 'name': 'Slight' },
                { 'value': 4, 'name': 'Moderate' },
                { 'value': 5, 'name': 'Severe' },
            ];
            this.currentAttrValues = salinityClass;
        }
        else if (attributeName == 'prt_text1_view' || attributeName == 'prt_text2_view') {
            let textureClasses = [
                { 'value': 0, 'name': 'any' },
                { 'value': 1, 'name': 'Coarse' },
                { 'value': 2, 'name': 'Moderately coarse' },
                { 'value': 3, 'name': 'Medium' },
                { 'value': 4, 'name': 'Moderately fine' },
                { 'value': 5, 'name': 'Fine' },
                { 'value': 6, 'name': 'Organic' },
                { 'value': 7, 'name': 'Unclassified' },
            ];
            this.currentAttrValues = textureClasses;
        }
        else if (attributeName == 'prt_pasteros_view') {
            let pastErosionClasses = [
                { 'value': 0, 'name': 'any' },
                { 'value': 1, 'name': 'WO' },
                { 'value': 2, 'name': 'W1' },
                { 'value': 3, 'name': 'W2' },
                { 'value': 4, 'name': 'W3' },
                { 'value': 5, 'name': 'W4' },
                { 'value': 6, 'name': 'W5' },
                { 'value': 7, 'name': 'Unclassified' },
            ];
            this.currentAttrValues = pastErosionClasses;
        }
        else if (attributeName == 'prt_stone_view') {
            let stoneClasses = [
                { 'value': 0, 'name': 'any' },
                { 'value': 1, 'name': 'Nonstony' },
                { 'value': 2, 'name': 'Slightly stony' },
                { 'value': 3, 'name': 'Moderately stony' },
                { 'value': 4, 'name': 'Very stony' },
                { 'value': 5, 'name': 'Exceedingly stony' },
                { 'value': 6, 'name': 'Excessively stony' },
            ];
            this.currentAttrValues = stoneClasses;
        }
        else {
            this.http.get(this.attributeValuesURL + attributeName)
                .map(res => res.json())
                .subscribe(data => this.currentAttrValues = data, err => this.logError(err), () => this.fixArray(this.currentAttrValues));
        }
    }
    fixArray(array) {
        var arr = [];
        arr.push({ 'name': 'any' });
        var key = Object.keys(array[0]);
        for (let a of array) {
            if (a[key.toString()]) {
                arr.push({ 'name': a[key.toString()], 'value': a[key.toString()] });
            }
        }
        this.currentAttrValues = arr;
    }
    logError(err) {
        console.error('There was an error: ' + err);
    }
    applyFilter(event) {
        if (event.target.selectedIndex == 0) {
            this.clearFilter();
        }
        else {
            let customEvent = { 'attribute': this.currentPolyAtr.databaseID, 'value': event.target.value };
            this.applyFilterEmitter.emit(customEvent);
        }
    }
    clearFilter() {
        this.clearFilterEmitter.emit();
        // change dropdown back to 'any'
    }
    searchLatLong() {
        if (this.lat > 48 && this.lat < 61 && this.long < -100 && this.long > -110) {
            let location = { latitude: this.lat, longitude: this.long };
            this.moveAndZoomEmitter.emit(location);
            this.LatLongError = new ErrorMessage_1.ErrorMessage('', false);
        }
        else {
            this.LatLongError = new ErrorMessage_1.ErrorMessage('That location is not in Saskatchewan', true);
        }
    }
};
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], QueryBoxComponent.prototype, "applyFilterEmitter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], QueryBoxComponent.prototype, "clearFilterEmitter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], QueryBoxComponent.prototype, "moveAndZoomEmitter", void 0);
QueryBoxComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'querybox',
        templateUrl: 'querybox.template.html',
        styleUrls: ['/querybox.style.css'],
        providers: [services_1.SectionCoordinateService, services_1.HeaderService]
    }),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        services_1.SectionCoordinateService])
], QueryBoxComponent);
exports.QueryBoxComponent = QueryBoxComponent;
//# sourceMappingURL=querybox.component.js.map