"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const doughtnutchart_component_1 = require("../doughnutchart/doughtnutchart.component");
const services_1 = require("../../services");
let SoilinfoboxComponent = class SoilinfoboxComponent {
    constructor(http, _component, _point, _acr) {
        this.http = http;
        this._component = _component;
        this._point = _point;
        this._acr = _acr;
        this.unknownResponse = '{"type":"FeatureCollection","totalFeatures":"unknown","features":[],"crs":null}';
    }
    ngOnInit() {
        this.clickCoordinateLat = "no click registered";
        this.mouseLatitude = 56;
        this.mouseLongitude = -105;
        this.pointOrPolygonSelection = '';
        this.validChartData = true;
    }
    setMouseLatLong(lat, long) {
        this.mouseLatitude = lat.toFixed(2);
        this.mouseLongitude = long.toFixed(2);
    }
    setClickCoordinate(newCord) {
        this.clickCoordinateLat = newCord[1].toFixed(2);
        this.clickCoordinateLong = newCord[0].toFixed(2);
    }
    setScaleString(str) {
        if (str) {
            this.scaleString = str;
        }
    }
    getPointFeatureData(url) {
        this.pointOrPolygonSelection = 'point';
        console.log('Getting point info at this url: ');
        console.log(url);
        this.getFeatureInfo(url);
    }
    getPolygonFeatureData(url) {
        this.pointOrPolygonSelection = 'polygon';
        console.log('Getting polygon info at this url: ');
        console.log(url);
        this.getFeatureInfo(url);
    }
    clearFeatureInfo() {
        this.pointOrPolygonSelection = '';
        this.selectedFeature = null;
        console.log("Clearing feature data");
    }
    getFeatureInfo(url) {
        if (url) {
            this.http.get(url).subscribe(data => this.displayFeatureInfo(data), err => console.log("getFeatureError: [in soilinfobox.component] " + err), () => console.log('soilinfobox.component => getFeatureInfo() success'));
        }
        else {
            console.log("ERROR: getFeatureInfo was given null url");
        }
    }
    getComponents() {
        this._component.getComponentsForPolygon(this.selectedFeature.poly_id).subscribe(data => this.displayComponents(data.resource), err => console.log("getComponentsForPolygon error: [in soilinfobox.component] " + err));
    }
    displayComponents(data) {
        this.components = data;
        this.buildChart(data);
    }
    buildChart(data) {
        let values = [];
        let names = [];
        if (data.length == 0) {
            console.log("No components");
            values.push(100);
            names.push('No component information');
            //this.validChartData = false;
        }
        else {
            //this.validChartData = true;
            data.forEach((datum) => {
                values.push(datum.percent);
                names.push(datum.soilname);
            });
        }
        this.doughnutChart.setChartData(values);
        this.doughnutChart.setChartLabels(names);
    }
    displayFeatureInfo(resp) {
        if (resp._body) {
            try {
                var feature = JSON.parse(resp._body);
                if (feature.features[0]) {
                    console.log(feature.features[0]);
                    this.selectedFeature = feature.features[0].properties;
                    if (feature.features[0].geometry.type == 'Point') {
                        this.pointType = this.selectedFeature.datatype;
                        //console.log(this.selectedFeature)
                        this._point.getImage(this.selectedFeature.filename).subscribe((res) => {
                            var b64Response = btoa(res.toString());
                            var outputImg = document.createElement('img');
                            outputImg.src = 'data:image/png;base64,' + b64Response;
                            document.getElementById('image-div').appendChild(outputImg);
                            console.log(b64Response);
                            // const urlCreator = window.URL;
                            // document.getElementById('point-img').src = urlCreator.createObjectURL(this.imgData);
                        }, (err) => {
                            console.log(err);
                        });
                    }
                    else {
                        this.selectedFeature.text1 = this._acr.letterToTexture(this.selectedFeature.text1);
                        this.getComponents();
                    }
                }
                else {
                    console.log("no soil here");
                    this.clearFeatureInfo();
                }
            }
            catch (err) {
                console.log("Error from geoserver; not JSON. Here's the response:");
                console.log(resp);
            }
        }
    }
};
tslib_1.__decorate([
    core_1.ViewChild(doughtnutchart_component_1.DoughnutChartComponent),
    tslib_1.__metadata("design:type", doughtnutchart_component_1.DoughnutChartComponent)
], SoilinfoboxComponent.prototype, "doughnutChart", void 0);
SoilinfoboxComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'soilinfobox',
        templateUrl: 'soilinfobox.template.html',
        styleUrls: ['./soilinfobox.css'],
        providers: [
            services_1.HeaderService,
            services_1.ComponentService,
            services_1.PointDataService,
            services_1.AcronymConversionService
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        services_1.ComponentService,
        services_1.PointDataService,
        services_1.AcronymConversionService])
], SoilinfoboxComponent);
exports.SoilinfoboxComponent = SoilinfoboxComponent;
//# sourceMappingURL=soilinfobox.component.js.map