"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const geospatial_assets = require("../../assets/geospatial");
const geospatial_1 = require("../../assets/geospatial");
const soilinfobox_component_1 = require("../../custom_components/soilinfobox/soilinfobox.component");
const http_1 = require("@angular/http");
const toolbox_component_1 = require("../../custom_components/toolbox/toolbox.component");
const services_1 = require("../../services");
let mapViewComponent = class mapViewComponent {
    constructor(http, redraw, _coords, _theme) {
        this.http = http;
        this.redraw = redraw;
        this._coords = _coords;
        this._theme = _theme;
        this.subscription = redraw.redrawAnnounced$.subscribe(() => this.redrawMap());
    }
    ngOnInit() {
        var positionFeature = new ol.Feature();
        this.clickLocationFeature = new ol.Feature();
        positionFeature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                    color: '#3399CC'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        }));
        this.clickLocationFeature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 4,
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        }));
        var geolocation = new ol.Geolocation({
            projection: geospatial_assets.mapView.getProjection()
        });
        geolocation.setTracking(true);
        geolocation.on('change:position', function () {
            var coordinates = geolocation.getPosition();
            console.log(coordinates);
            positionFeature.setGeometry(new ol.geom.Point(coordinates));
            // positionFeature.getGeometry().setCoordinates(coordinates);
        });
        this.map = new ol.Map({
            controls: ol.control.defaults().extend([
                new ol.control.ScaleLine()
            ]),
            layers: [
                new ol.layer.Group({ layers: geospatial_assets.basemaps }),
                new ol.layer.Group({ layers: geospatial_assets.layers }),
            ],
            target: 'map',
            view: geospatial_assets.mapView
        });
        new ol.layer.Vector({
            map: this.map,
            source: new ol.source.Vector({
                features: [positionFeature, this.clickLocationFeature]
            })
        });
        geospatial_1.layers[1].getSource().updateParams({ 'cql_filter': 'datatype in ()' });
        this.map.on('singleclick', (e) => { this.handleMapClick(e); });
        this.map.on('pointermove', (e) => { this.handlePointerMove(e); });
        this.zoom = this.map.getView().getZoom();
        this.map.on('moveend', (e) => { this.handleMoveEnd(); });
        this.legend = document.getElementById('legend');
        this.togglePolygonsChecked = true;
        this.toggleTreatyChecked = false;
        this.themeName = 'Default Polygon Theme';
        this.showModal();
    }
    showModal() {
        if (localStorage.getItem('disclaimer-modal') == 'shown') {
            //$('#warningModal').modal('show');
            localStorage.setItem('disclaimer-modal', 'shown');
        }
    }
    handleMoveEnd() {
        this.updateLayerVisibility();
        this.updateResolution();
    }
    updateResolution() {
        var resolution = this.map.getView().getResolution();
        var units = this.map.getView().getProjection().getUnits();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var scale = resolution * mpu * 39.37 * dpi;
        console.log("Scale = 1 : " + this.numberWithCommas(Math.floor(scale)));
        this.soilInfoBox.setScaleString("Scale = 1 : " + this.numberWithCommas(Math.floor(scale)));
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    updateLayerVisibility() {
        if (this.zoom != this.map.getView().getZoom()) {
            this.zoom = this.map.getView().getZoom();
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.POLYGON_OUTLINES, (this.zoom >= 11));
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.SECTIONS, this.zoom >= 12);
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.LABELS, (this.zoom >= 14));
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.TOWNSHIP, (this.zoom >= 10 && this.zoom < 12));
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.RMS, (this.zoom > 6 && this.zoom < 11));
            console.log("zoomed: " + this.zoom);
        }
    }
    // EPSG3857 is Web Mercator
    handlePointerMove(event) {
        var standardCoordinate = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
        this.soilInfoBox.setMouseLatLong(standardCoordinate[1], standardCoordinate[0]);
    }
    handleMapClick(event) {
        this.clickLocationFeature.setGeometry(new ol.geom.Point(event.coordinate));
        var standardCoordinate = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
        this.soilInfoBox.setClickCoordinate(standardCoordinate);
        this._coords.checkCoordinate(standardCoordinate[1], standardCoordinate[0], this.getRadius()).subscribe(res => {
            this.routePointOrPolygon(res, event.coordinate);
        }, err => {
            console.log(err);
        });
    }
    routePointOrPolygon(data, coordinate) {
        var url;
        var source;
        if (data.pointlayer) {
            source = geospatial_assets.staticPointsLayer.getSource();
            url = this.buildUrlFromSource(source, coordinate);
            this.soilInfoBox.getPointFeatureData(url);
        }
        else if (data.polygonlayer) {
            source = geospatial_assets.staticPolygonsLayer.getSource();
            url = this.buildUrlFromSource(source, coordinate);
            this.soilInfoBox.getPolygonFeatureData(url);
        }
        else {
            this.soilInfoBox.clearFeatureInfo();
        }
    }
    buildUrlFromSource(source, coordinate) {
        return source.getGetFeatureInfoUrl(coordinate, this.map.getView().getResolution(), this.map.getView().getProjection(), { 'INFO_FORMAT': 'application/json' });
    }
    getRadius() {
        return Math.floor(this.map.getView().getResolution() * 10);
    }
    changeBasemap(event) {
        var index = event.target.selectedIndex;
        var _i;
        for (_i = 0; _i < geospatial_1.basemaps.length; _i++) {
            if (_i === index) {
                geospatial_1.basemaps[_i].setVisible(true);
            }
            else {
                geospatial_1.basemaps[_i].setVisible(false);
            }
        }
    }
    togglePolygons(event) {
        if (event.target.checked) {
            geospatial_1.layers[0].setVisible(true);
            this.togglePolygonsChecked = true;
        }
        else {
            geospatial_1.layers[0].setVisible(false);
            this.togglePolygonsChecked = false;
        }
        this.updateLegendVisibility();
    }
    changeTheme(event) {
        let index = event.target.selectedIndex;
        this.themeName = this.toolBox.themes[index].name;
        geospatial_1.layers[0].getSource().updateParams({ 'LAYERS': event.target.value });
        if (index != 0) {
            this.requestLegend(this.toolBox.themes[index].theme);
        }
        this.updateLegendVisibility();
    }
    updateLegendVisibility() {
        if (this.themeName == 'Default Polygon Theme' || !this.togglePolygonsChecked) {
            this.hideLegend(true);
        }
        else {
            this.hideLegend(false);
        }
    }
    hideLegend(condition) {
        if (condition) {
            this.legend.className = 'hidden';
        }
        else {
            this.legend.className = '';
        }
    }
    requestLegend(theme) {
        console.log(theme);
        this._theme.getColoursForTheme(theme).subscribe(data => this.themeInfo = data.resource, err => console.log(err));
        console.log(this.themeInfo);
        // var aurl = 'http://sksoildb.usask.ca/api/v2/db/_table/' + theme;
        //
        //
        // var url = 'http://mgl.usask.ca:8080/sksoilservice/api/v2/' + theme;
        //
        // console.log(theme)
        // this.http.get(aurl)
        //     .map(res => res.json())
        //     .subscribe(
        //         data => this.themeInfo = data,
        //         err => console.log(err)
        //     )
    }
    sortLegendInfo() {
        if (this.themeName == 'Agricultural Capability') {
            console.log('ag cap');
        }
    }
    getBackgroundColor(i) {
        var color;
        color = '#';
        color += this.themeInfo[i].color;
        return color;
    }
    changePointType(types) {
        var cqlFilterString = "datatype in ('";
        for (let i = 0; i < types.length; i++) {
            cqlFilterString += types[i].value;
            cqlFilterString += "'";
            if (i < types.length - 1) {
                cqlFilterString += ",'";
            }
        }
        if (types.length == 0) {
            cqlFilterString += "')";
        }
        else {
            cqlFilterString += ")";
        }
        geospatial_1.layers[1].getSource().updateParams({ 'cql_filter': cqlFilterString });
        console.log(cqlFilterString);
    }
    applyFilter(event) {
        var cql_string;
        // irrig like  '3%'
        console.log(event);
        if (event.attribute == 'slope_rg' ||
            event.attribute == 'slpl') {
            cql_string = event.attribute;
            cql_string += ' like \'';
            cql_string += event.value.charAt(0);
            cql_string += '\%\'';
        }
        else if (event.attribute == 'pasteros') {
            cql_string = event.attribute;
            switch (event.value) {
                case '1':
                    cql_string += ' like \'W0%\'';
                    break;
                case '2':
                    cql_string += ' like \'W1%\'';
                    break;
                case '3':
                    cql_string += ' like \'W2%\'';
                    break;
                case '4':
                    cql_string += ' like \'W3%\'';
                    break;
                case '5':
                    cql_string += ' like \'W4%\'';
                    break;
                case '6':
                    cql_string += ' like \'W5%\'';
                    break;
                case '7':
                    cql_string += ' like \'W6%\'';
                    break;
            }
        }
        else if (event.attribute == 'irrig') {
            // excellent: 1A
            // good: 1B, 2A, 2B
            // fair: 1C, 2, 3A, 3B, 3C
            // poor: 1D, 2D 3D 4 4A 4B 4C 4D
            // un: UnClassified
            cql_string = event.attribute;
            switch (event.value) {
                case '1':
                    cql_string += ' like \'1A%\'';
                    break;
                case '2':
                    cql_string += ' like \'1B%\' or irrig like \'2A%\' or irrig like \'2B%\'';
                    break;
                case '3':
                    cql_string += ' like \'1C%\' or irrig = \'2\' or irrig like \'3A\' or irrig like \'3B\' or irrig like \'3C\'';
                    break;
                case '4':
                    cql_string += ' like \'1D%\' or irrig = \'4\' or irrig like \'2D%\' or irrig like \'3D%\' or irrig like \'4B%\' or irrig like \'4C%\' or irrig like \'4D%\'';
                    break;
                case '5':
                    cql_string += ' like \'U%\'';
            }
        }
        else if (event.attribute == 'text1' || event.attribute == 'text2') {
            cql_string = event.attribute;
            switch (event.value) {
                case '1':
                    cql_string += ' in (\'CS\', \'GS\', \'S\', \'FS\', \'GLS\', \'LS\', \'LFS\')';
                    break;
                case '2':
                    cql_string += ' in (\'GSL\', \'SL\', \'FL\', \'GL\', \'VL\')';
                    break;
                case '3':
                    cql_string += ' in (\'L\', \'FCL\', \'SCL\', \'VCL\')';
                    break;
                case '4':
                    cql_string += ' in (\'SIL\', \'SICL\', \'CL\')';
                    break;
                case '5':
                    cql_string += ' in (\'SIC\', \'C\', \'HC\')';
                    break;
                case '6':
                    cql_string += ' = \'O\'';
                    break;
                case '7':
                    cql_string += ' = \'U\'';
                    break;
            }
        }
        else if (event.attribute == 'stone') {
            cql_string = 'stsym';
            switch (event.value) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    cql_string += ' like \'S';
                    let tempNum = parseInt(event.value.charAt(0));
                    tempNum = tempNum - 1;
                    cql_string += tempNum;
                    cql_string += '\%\'';
                    break;
            }
        }
        else if (event.attribute == 'salsym') {
            cql_string = '';
            switch (event.value) {
                case '1':
                    cql_string += `salsym in (0)`;
                    break;
                case '2':
                    cql_string += `
                    salsym like '1%' 
                    or salsym in ('2W') 
                    or salsym like '2W%'`;
                    break;
                case '3':
                    cql_string += `
                    salsym in ('2','3','2M','2S','3M','3W','4W') 
                    or salsym like '2M%'
                    or salsym like '2S%'
                    or salsym like '3M%'
                    or salsym like '3W%'
                    or salsym like '4W%'`;
                    break;
                case '4':
                    cql_string += `
                    salsym in ('2V','3S','3V','4M','4S','5M','5W','6W','4','5')
                    or salsym like '2V%'
                    or salsym like '3S%'
                    or salsym like '3V%'
                    or salsym like '4M%'
                    or salsym like '4S%'
                    or salsym like '5M%'
                    or salsym like '5W%'
                    or salsym like '6W%'
                    `;
                    break;
                case '5':
                    cql_string += `
                    salsym in ('4V','5S','5V','6','6M','6S','6V')
                    or salsym like '4V%'
                    or salsym like '5S%'
                    or salsym like '5V%'
                    or salsym like '6M%'
                    or salsym like '6S%'
                    or salsym like '6V%'`;
                    break;
            }
        }
        else {
            cql_string = event.attribute;
            cql_string += ' in (\'';
            cql_string += event.value;
            cql_string += '\')';
        }
        console.log(cql_string);
        geospatial_1.layers[0].getSource().updateParams({ 'cql_filter': cql_string });
    }
    clear() {
        geospatial_1.layers[0].getSource().updateParams({ 'cql_filter': null });
    }
    moveAndZoom(event) {
        var lat = parseFloat(event.y);
        var long = parseFloat(event.x);
        this.map.getView().animate({
            zoom: 13.5,
            center: ol.proj.fromLonLat([long, lat])
        });
    }
    toggleTreaty(event) {
        if (event.target.checked) {
            geospatial_1.layers[5].setVisible(true);
            this.toggleTreatyChecked = true;
        }
        else {
            geospatial_1.layers[5].setVisible(false);
            this.toggleTreatyChecked = false;
        }
    }
    changePolygonOpacity(event) {
        geospatial_assets.setPolygonOpacity(event.value / 100);
    }
    redrawMap() {
        setTimeout(() => {
            this.map.updateSize();
        }, 400);
    }
};
tslib_1.__decorate([
    core_1.ViewChild(soilinfobox_component_1.SoilinfoboxComponent),
    tslib_1.__metadata("design:type", soilinfobox_component_1.SoilinfoboxComponent)
], mapViewComponent.prototype, "soilInfoBox", void 0);
tslib_1.__decorate([
    core_1.ViewChild(toolbox_component_1.ToolboxComponent),
    tslib_1.__metadata("design:type", toolbox_component_1.ToolboxComponent)
], mapViewComponent.prototype, "toolBox", void 0);
mapViewComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'my-map-app',
        templateUrl: 'map-view.template.html',
        styles: ['./map-view.css'],
        providers: [services_1.SectionCoordinateService, services_1.HeaderService, services_1.ThemeingService]
    }),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        services_1.RedrawService,
        services_1.SectionCoordinateService,
        services_1.ThemeingService])
], mapViewComponent);
exports.mapViewComponent = mapViewComponent;
//# sourceMappingURL=map-view.component.js.map