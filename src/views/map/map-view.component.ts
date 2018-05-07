import {Component, OnInit, ViewChild} from '@angular/core'
import { Http }          from '@angular/http';
import {Subscription} from "rxjs/Subscription";
import {SoilinfoboxComponent} from "../../custom_components/soilinfobox/soilinfobox.component";
import {ToolboxComponent} from "../../custom_components/toolbox/toolbox.component";
import {HeaderService, PolygonService, RedrawService, SectionCoordinateService, ThemeingService} from "../../services";
import geospatial_assets = require('../../assets/geospatial');
import {layers, basemaps, polygonsLayer} from "../../assets/geospatial";
import {QueryBoxComponent} from "../../custom_components/querybox/querybox.component";
import {QueryContainer, QueryStore} from "../../custom_components/querybox/queryobject.class";

declare var ol:any;

@Component({
    selector: 'my-map-app',
    template: require('./map-view.template.html'),
    styles: [require('./map-view.style.css').toString()],
    providers: [
        SectionCoordinateService,
        HeaderService,
        ThemeingService,
        PolygonService
    ]
})
export class mapViewComponent implements OnInit {

    @ViewChild(SoilinfoboxComponent)
    private soilInfoBox: SoilinfoboxComponent;

    @ViewChild(ToolboxComponent)
    private toolBox: ToolboxComponent;

    @ViewChild(QueryBoxComponent)
    private qBox: QueryBoxComponent;

    private map;

    subscription: Subscription;

    private zoom;
    private legend;
    private themeInfo;
    private themeName = 'Soil Zone';
    private togglePolygonsChecked;
    private toggleTreatyChecked;

    clickLocationFeature;
    private geoloc:number[];

    constructor (
        private http: Http,
        private redraw: RedrawService,
        private _coords: SectionCoordinateService,
        private _theme: ThemeingService,
        private _poly: PolygonService
    ){
        this.subscription = redraw.redrawAnnounced$.subscribe(
            () => this.redrawMap());
    }

    ngOnInit(): void {


        this.geoloc = [];

        let positionFeature = new ol.Feature();
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

        let geolocation = new ol.Geolocation({
            projection: geospatial_assets.mapView.getProjection()
        });

        geolocation.setTracking(true);

        geolocation.on('change:position', () => {
            let coordinates = geolocation.getPosition();

            this.geoloc = coordinates;

            positionFeature.setGeometry(new ol.geom.Point(coordinates));
            console.log('change pos')
            console.log(coordinates)
        });

        this.map = new ol.Map({
            controls: ol.control.defaults().extend([
                new ol.control.ScaleLine()
            ]),
            layers: [
                new ol.layer.Group({layers: geospatial_assets.basemaps}),
                new ol.layer.Group({layers: geospatial_assets.layers}),
            ],
            target: 'map',
            view: geospatial_assets.mapView
        });

        new ol.layer.Vector({
            map: this.map,
            source: new ol.source.Vector({
                features: [positionFeature,this.clickLocationFeature ]
            })
        });

        geospatial_assets.updatePointLayerParameters({'cql_filter': 'datatype in ()'})

        this.map.on('singleclick', (e) => {this.handleMapClick(e);});

        this.map.on('pointermove', (e) => {this.handlePointerMove(e); });

        this.zoom = this.map.getView().getZoom();

        this.map.on('moveend', (e) => {this.handleMoveEnd(); });

        this.legend = document.getElementById('legend');

        this.togglePolygonsChecked = true;
        this.toggleTreatyChecked = false;

        this.changeTheme('sk_soil_zone');

        this.showModal();


        /**
         * Renders a progress bar.
         * @param {Element} el The target element.
         * @constructor
         */
        function Progress(el) {
            this.el = el;
            this.loading = 0;
            this.loaded = 0;
        }


        /**
         * Increment the count of loading tiles.
         */
        Progress.prototype.addLoading = function() {
            if (this.loading === 0) {
                this.show();
            }
            ++this.loading;
            this.update();
        };


        /**
         * Increment the count of loaded tiles.
         */
        Progress.prototype.addLoaded = function() {
            var this_ = this;
            setTimeout(function() {
                ++this_.loaded;
                this_.update();
            }, 100);
        };


        /**
         * Update the progress bar.
         */
        Progress.prototype.update = function() {
            var width = (this.loaded / this.loading * 100).toFixed(1) + '%';
            this.el.style.width = width;
            if (this.loading === this.loaded) {
                this.loading = 0;
                this.loaded = 0;
                var this_ = this;
                setTimeout(function() {
                    this_.hide();
                }, 500);
            }
        };


        /**
         * Show the progress bar.
         */
        Progress.prototype.show = function() {
            this.el.style.visibility = 'visible';
        };


        /**
         * Hide the progress bar.
         */
        Progress.prototype.hide = function() {
            if (this.loading === this.loaded) {
                this.el.style.visibility = 'hidden';
                this.el.style.width = 0;
            }
        };

        var progress = new Progress(document.getElementById('progress'));

        let src = geospatial_assets.polygonsLayer.getSource()

        src.on('tileloadstart', function() {
            progress.addLoading();
        });

        src.on('tileloadend', function() {
            progress.addLoaded();
        });
        src.on('tileloaderror', function() {
            progress.addLoaded();
        });
    }

    showModal(){
        if (localStorage.getItem('disclaimer-modal') != 'shown'){
            $('#warningModal').modal('show');
            localStorage.setItem('disclaimer-modal', 'shown');
        }
    }

    handleMoveEnd(){
        this.updateLayerVisibility();
        this.updateResolution();

    }

    updateResolution(){
        let resolution = this.map.getView().getResolution();
        let units = this.map.getView().getProjection().getUnits();
        let dpi = 25.4 / 0.28;
        let mpu = ol.proj.METERS_PER_UNIT[units];
        let scale = resolution * mpu * 39.37 * dpi;

        this.soilInfoBox.setScaleString("Scale = 1 : " + this.numberWithCommas(Math.floor(scale)));
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    updateLayerVisibility(){
        console.log(this.map.getView().getZoom())
        if (this.zoom != this.map.getView().getZoom()){
            this.zoom = this.map.getView().getZoom();

            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.POLYGON_OUTLINES,
                this.zoom >= 11 );
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.SECTIONS,
                this.zoom >= 12);
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.LABELS,
                this.zoom >= 14 );
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.TOWNSHIP,
                this.zoom >= 10 && this.zoom < 12 );
            geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.RMS,
                this.zoom >= 6 && this.zoom < 11 );
            //geospatial_assets.setLayerVisible(geospatial_assets.mapLayers.SOILZONE, this.zoom <= 6)

        }
    }


    // EPSG3857 is Web Mercator
    handlePointerMove(event){
        let standardCoordinate = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
        this.soilInfoBox.setMouseLatLong(standardCoordinate[1], standardCoordinate[0]);
    }

    handleMapClick(event){
        // Place the click marker on the map
        this.clickLocationFeature.setGeometry(new ol.geom.Point(event.coordinate));

        let standardCoordinate = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');

        // Set the coordinate in the soil info box
        this.soilInfoBox.setClickCoordinate(standardCoordinate);

        this._coords.checkCoordinate(standardCoordinate[1], standardCoordinate[0], this.getRadius()).subscribe(
            res => {
                console.log(event.coordinate)
                this.routePointOrPolygon(res, event.coordinate);
            },
            err => {
                console.log(err)
            }
        );
    }

    routePointOrPolygon(data, coordinate){
        let url;
        let source;

        if (data.pointlayer){
            source = geospatial_assets.staticPointsLayer.getSource();
            url = this.buildUrlFromSource(source, coordinate);
            this.soilInfoBox.getPointFeatureData(url);
        }else if(data.polygonlayer){
            source = geospatial_assets.staticPolygonsLayer.getSource();
            url = this.buildUrlFromSource(source, coordinate);
            this.soilInfoBox.getPolygonFeatureData(url);
            console.log(url)
        }else{
            this.soilInfoBox.clearFeatureInfo();
        }
    }

    buildUrlFromSource(source, coordinate){
        return source.getGetFeatureInfoUrl(
            coordinate, 
            this.map.getView().getResolution(),
            this.map.getView().getProjection(), 
            {'INFO_FORMAT': 'application/json'}
        );
    }

    getRadius(){
        // The approximate radius of the point data icon, for checking clicks
        return Math.floor(this.map.getView().getResolution() * 10);
    }

    changeBasemap(event):void{
        let index = event.target.selectedIndex;
        for (let i = 0; i < basemaps.length; i++){
            if (i === index){
                basemaps[i].setVisible(true);
            }else{
                basemaps[i].setVisible(false);
            }
        }
    }

    togglePolygons(event):void{
        if(event.target.checked){
            layers[0].setVisible(true);
            this.togglePolygonsChecked = true;
        }else{
            layers[0].setVisible(false);
            this.togglePolygonsChecked = false;
        }

        this.updateLegendVisibility();
    }

    changeTheme(event):void{
        if(typeof event === 'string'){
            this.themeName = 'Soil Zone';
            layers[0].getSource().updateParams({'LAYERS':event});
            this.requestLegend(event)
        }else{
            let index = event.target.selectedIndex;
            this.themeName = this.toolBox.themes[index].name;
            layers[0].getSource().updateParams({'LAYERS':event.target.value});
            this.requestLegend(this.toolBox.themes[index].theme);
        }

        this.updateLegendVisibility();
    }

    updateLegendVisibility(){
        if (this.themeName == 'Map Unit' || !this.togglePolygonsChecked){
            this.hideLegend(true);
        }else{
            this.hideLegend(false);
        }
    }

    hideLegend(condition:boolean){ condition ? this.legend.className = 'hidden' : this.legend.className = ''; }

    requestLegend(theme){
        this._theme.getColoursForTheme(theme).subscribe(
            data => this.themeInfo = data.resource,
            err => console.log(err)
        );
    }

    sortLegendInfo(){
        if (this.themeName == 'Agricultural Capability'){
            console.log('ag cap');
        }
    }

    getBackgroundColor(i){
        let color:string;
        color = '#';
        color += this.themeInfo[i].color;
        return color;
    }

    changePointType(types){
        let cqlFilterString = "datatype in ('";

        for (let i = 0; i < types.length; i++){

            cqlFilterString += types[i].value;
            cqlFilterString += "'";
            if ( i < types.length - 1) {
                cqlFilterString += ",'";
            }
        }

        if(types.length == 0){
            cqlFilterString += "')";
        }else{
            cqlFilterString += ")";
        }

        layers[1].getSource().updateParams({'cql_filter':cqlFilterString});
    }

    moveAndZoom(event){
        let lat, long;

        if (event.y) {
            lat = parseFloat(event.y);
        } else if (event.latitude){
            lat = parseFloat(event.latitude)
        }

        if (event.x) {
            long = parseFloat(event.x);
        } else if (event.longitude){
            long = parseFloat(event.longitude)
        }

        this.map.getView().animate({
            zoom: 14,
            center: ol.proj.fromLonLat([long,lat])
        });
    }

    toggleTreaty(event){
        if(event.target.checked){
            layers[5].setVisible(true);
            this.toggleTreatyChecked = true;
        }else{
            layers[5].setVisible(false);
            this.toggleTreatyChecked = false;
        }
    }

    changePolygonOpacity(event){
        geospatial_assets.setPolygonOpacity(event.value/100);
    }

    public redrawMap() {
        setTimeout( () => {
            this.map.updateSize();
        }, 400);
    }

    goToDsm(event) {
        this.map.getView().animate({
            zoom: 13,
            center: ol.proj.fromLonLat([-106.42, 50.73])
        })
    }

    rightHereClicked(event) {
        if (this.geoloc.length == 0){
            this.qBox.receiveMessage('Geolocation not enabled')
        } else{
            let standardCoordinate = ol.proj.transform(this.geoloc, 'EPSG:3857', 'EPSG:4326');
            this._coords.checkCoordinate(standardCoordinate[1], standardCoordinate[0], this.getRadius()).subscribe( res => {
                if (res.polygonlayer){
                    let source = geospatial_assets.staticPolygonsLayer.getSource();
                    let url = this.buildUrlFromSource(source,  this.geoloc);

                    this._poly.getPolygonFeatureInfoForUrl(url).subscribe( (data) => {
                        if (data.features.length == 0) {
                            this.qBox.receiveMessage("You do not appear to be located in a soil map unit right now.")
                        }else{
                            let soilName = data.features[0].properties.group_name;
                            this.qBox.receiveMessage("Looks like a " + soilName + "! Check out the soil info box for more details.");
                            this.handleMapClick(new Object({coordinate: this.geoloc}))
                        }
                    })
                }else {
                    // not in SK
                    this.qBox.receiveMessage("You do not appear to be located in a soil map unit right now.")
                }
            });
        }
    }

    combineQueryFilterArray(queryOb:QueryStore) {
        let combinedString = '';

        queryOb.getQueries().forEach( (q, i) => {
            console.log(i)
            if (i == 0) {
                combinedString += q.getStartParens() + this.getCqlQueryFilterString(q) + q.getEndParens();
            }else{
                combinedString += q.getStartParens() + ' ' + q.logicalOperator + ' ' + this.getCqlQueryFilterString(q) + q.getEndParens();
            }
        });

        if (combinedString == '') {
            this.clearFilter();
        }else{
            this.applyFilterToMap(combinedString)
            console.log(combinedString)
        }
    }

    applyFilterToMap(cqlString) {
        if(cqlString){
            layers[0].getSource().updateParams({'cql_filter':cqlString});
        }
    }

    getCqlQueryFilterString(q:QueryContainer){
        let cql_string;

        if( q.attribute == 'slope_rg') {
            cql_string = q.attribute;
            switch (q.value){
                case '1':
                    cql_string += ' in (\'1\',\'1-2\',\'1-3\')';
                    break;
                case '2':
                    cql_string += ' in (\'2\',\'2-6\',\'2-3\',\'2-1\',\'2-4\',\'2-5\')';
                    break;
                case '3':
                    cql_string += ' in (\'3-7\',\'3-2\',\'3-4\',\'3-6\',\'3\',\'3-5\')';
                    break;
                case '4':
                    cql_string += ' in (\'4-5\',\'4\',\'4-3\',\'4-6\',\'4-7\',\'4-2\')';
                    break;
                case '5':
                    cql_string += ' in (\'5-6\',\'5\',\'5-7\',\'5-3\',\'5-4\')';
                    break;
                case '6':
                    cql_string += ' in (\'6-5\',\'6-3\',\'6-4\',\'6\',\'6-7\')';
                    break;
                case '7':
                    cql_string += ' in (\'7-5\',\'7-3\',\'7\',\'7-4\',\'7-6\')';
                    break;
            }

        } else if(q.attribute == 'slpl'){
            cql_string = q.attribute;
            switch (q.value){
                case '1':
                    cql_string += ' in (\'1\',\'1-2\',\'1-3\')';
                    break;
                case '2':
                    cql_string += ' in (\'2\',\'2-6\',\'2-3\',\'2-1\',\'2-4\',\'2-5\')';
                    break;
                case '3':
                    cql_string += ' in (\'3-7\',\'3-2\',\'3-4\',\'3-6\',\'3\',\'3-5\')';
                    break;
                case '4':
                    cql_string += ' in (\'4-5\',\'4\',\'4-3\',\'4-6\',\'4-7\',\'4-2\')';
                    break;
                case '5':
                    cql_string += ' in (\'5-6\',\'5\',\'5-7\',\'5-3\',\'5-4\')';
                    break;
                case '6':
                    cql_string += ' in (\'6-5\',\'6-3\',\'6-4\',\'6\',\'6-7\')';
                    break;
                case '7':
                    cql_string += ' in (\'7-5\',\'7-3\',\'7\',\'7-4\',\'7-6\')';
                    break;
            }
        }else if(q.attribute == 'phsym'){
            cql_string = q.attribute;
            switch (q.value){
                case '1':
                    cql_string += ' in (\'A2\', \'A4\', \'A6\', \'A0\', \'A1\', \'A3\', \'A5\')';
                    break;
                case '2':
                    cql_string += ' in (\'B2\', \'B4\', \'B6\', \'B0\', \'B1\', \'B3\', \'B5\')';
                    break;
                case '3':
                    cql_string += ' in (\'C2\', \'C4\', \'C6\', \'C0\', \'C1\', \'C3\', \'C5\')';
                    break;
                case '4':
                    cql_string += ' in (\'D2\', \'D4\', \'D6\', \'D0\', \'D1\', \'D3\', \'D5\')';
                    break;
                case '5':
                    cql_string += ' in (\'X2\', \'X4\', \'X6\', \'X0\', \'X1\', \'X3\', \'X5\')';
                    break;

            }
        }else if(q.attribute =='pasteros'){
            cql_string = q.attribute;
            switch(q.value){
                case '1':
                    cql_string += ' = \'W0%\'';
                    break;
                case '2':
                    cql_string += ' in (\'W1BK\',\'W1KB\'\',W1K\',\'W1KG\'\',W1B\',\'W1GK\',\'W1GB\',\'W1BG\',\'W1G\')';
                    break;
                case '3':
                    cql_string += ' in (\'W2KB\',\'W2G\',\'W2K\',\'W2BK\',\'W2KG\',\'W2GK\',\'W2BG\',\'W2B\',\'W2GB\')';
                    break;
                case '4':
                    cql_string += ' in (\'W3B\', \'W3KB\', \'W3GB\', \'W3GK\', \'W3G\', \'W3KG\', \'W3K\', \'W3BK\', \'W3BG\')';
                    break;
                case '5':
                    cql_string += ' in (\'W4GB\',\'W4G\',\'W4BK\',\'W4KB\',\'W4B\',\'W4GK\',\'W4K\',\'W4KG\',\'W4BG\')';
                    break;
                case '6':
                    cql_string += ' in (\'W5B\',\'W5K\',\'W5GK\',\'W5G\',\'W5KG\')';
                    break;
                case '7':
                    cql_string += ' = \'U\'';
                    break;
            }
        }else if(q.attribute == 'irrig'){
            // excellent: 1A
            // good: 1B, 2A, 2B
            // fair: 1C, 2, 3A, 3B, 3C
            // poor: 1D, 2D 3D 4 4A 4B 4C 4D
            // un: UnClassified
            cql_string = q.attribute;
            switch (q.value){
                case '1':// excellent
                    cql_string += ' = \'1A\'';
                    break;
                case '2':// good
                    cql_string += " in ('2Am','2Bmt1p','2Bdgt2','2Ams','2Bdpv','2Bmdt2','2Bmdv','2Ag','2Bgpv','2Bmt1','1Bt2p','2Bgt1p','2Bst2v','2Bsp','2Bmst1','2Bdgt1','2Bgvt1','2Bqt1v','1Bt2pv','1Bt2vp','2Bqgp','2As','2Bdst1','2Bmsv','2Bqpv','2Bqgv','2Amd','2Aqd','1Bt1','2Bmt1c','2Bqgc','2Bqvp','2Bmpv','2Aqgs','2Bdt2v','2Ags','2Bgv','1Bpv','2Bmgv','2Bqvt1','2Bmvt1','2Aqg','2Bdvt1','2Bsv','2Bst2','2Bst1v','2Bspv','2Bst1p','2Bst2p','1Bt1v','1Bv','2Bqdt2','2Bqt1','1Bt1cv','2Bgp','2Bmt2','2Aq','2Bdt1v','2Bst2c','2Bdt2p','2Ad','1Bt2cv','2Bqv','2Bqt2v','2Bdvp','1Bt2','2Bdst2','2Bgst1','2Aqdg','2Bgt2','2Bqt2p','1Bp','2Bdv','2Bmgt1','2Bdt1','2Bgt1','2Bgsv','2Bqst1','2Bsvt1','2Bqp','2Bmt2p','1Bt1p','1Bvt1','2Bmst2','2Bqsv','2Bqgt1','1Bt2v','2Bqgt2','1Bt1pv','2Bmgt2','2Bgt2p','2Amg','2Adg','2Bgt1v','2Bst1c','2Bmdt1','2Bgt2v','2Bqdv','2Bt2p','2Bqt1c','2Aqs','2Bdt2','2Bdsv','2Bgst2','2Bmgp','1Bvt1p','2Bt1p','2Bqdt1','2Bmt2v','2Bdt1p','2Bqt1p','2Bst1','2Bmv','2Bqst2','2Bqt2','2Bmt1v','2Bgsp')";
                    break;
                case '3':
                    cql_string += ' in (\'1Ct2c\',\'2\',\'1Cp\',\'1Ct2v\',\'1Ct2p\',\'1Ct1\',\'1Cvp\',\'1Ct2\',\'1Ct1v\',\'1Ct2vp\',\'1Cc\',\'1Ct1p\',\'1Cv\')';
                    break;
                case '4':
                    cql_string += ' in (\'4Bgt2\',\'3Dgv\',\'4Cwvi\',\'4Bgv\',\'4Crt2\',\'3Dsc\',\'4Brt1\',\'2Dsv\',\'3Dsv\',\'3Dmrt2\',\'3Dqsc\',\'4Cwa\',\'4Bmvt1\',\'4Dkv\',\'3Dqdv\',\'4Bmt1v\',\'3Dgsv\',\'2Dt2v\',\'4Drst1\',\'2Dms\',\'4Dwmv\',\'4Cmt2v\',\'4Dsp\',\'2Dsp\',\'4Bqsv\',\'4Cmsv\',\'4Cwqa\',\'4Dmt2p\',\'4Cqt1v\',\'4Dkrv\',\'3Dwav\',\'4Drvc\',\'4Dqsv\',\'3Dwsv\',\'4Ckt2\',\'2Dqgv\',\'3Dqdt2\',\'1Dc\',\'4Ckt2p\',\'3Dmgt2\',\'4Bst2\',\'4Cqt1\',\'4Cmv\',\'4Ckt1\',\'4Drt2\',\'3Dgt2\',\'4Bmv\',\'1Dt2v\',\'3Dsdv\',\'4Dkt2\',\'4Dqrv\',\'3Dsdt2\',\'4Cdv\',\'2Ddt2p\',\'4Bkt2p\',\'4Bqt1v\',\'2Dst2\',\'2Dmt2p\',\'3Drsv\',\'4Bsvt1\',\'4Dwq\',\'4Bkt1p\',\'4Bqvt1\',\'4Csav\',\'4Dkst2\',\'4Dqt2v\',\'4Ckst1\',\'3Dqs\',\'4Bksv\',\'4Bsv\',\'4Drc\',\'4Dsa\',\'4Bkcv\',\'3Dmvp\',\'4Dct2\',\'4Bspv\',\'3Dsp\',\'2Dqdv\',\'4Bmgv\',\'4Dqt2\',\'4Brst2\',\'4Bdt1v\',\'2Dmst2\',\'4Dkt2v\',\'4Dqkv\',\'4Bsp\',\'4Dkc\',\'2Dmv\',\'4Cst1v\',\'4Brst1\',\'4Crc\',\'1Dvc\',\'4Bqt2\',\'4Csvp\',\'4Bmpv\',\'3Ddv\',\'4Dksv\',\'4Ckt2v\',\'4Dmsv\',\'2Dgv\',\'3Dqst2\',\'1Dt2vp\',\'1Dt2c\',\'3Dsvp\',\'4Ckp\',\'4Dt2c\',\'3Dmsv\',\'4Cst1\',\'4Dqst2\',\'4Cqkv\',\'3Dqt2v\',\'4Brt1v\',\'2Dqv\',\'3Drst2\',\'2Dmsv\',\'4Bkst1\',\'3Dmdv\',\'1Dt2p\',\'4Dqv\',\'4Cgv\',\'4Cst2v\',\'4Dst2v\',\'4Bqv\',\'4Ckv\',\'4Cwi\',\'3Drdt2\',\'4Dmrc\',\'4Dmvp\',\'2Dmgt2\',\'4Csvi\',\'4Bmt2p\',\'4Bgt1\',\'4Dst2\',\'3Dst2\',\'4Cmst2\',\'2Dgsv\',\'4Bkv\',\'3Dst2v\',\'4Dws\',\'4Cwqi\',\'4Bwst2\',\'2Dmt2c\',\'4Bst1\',\'1Dp\',\'4Dsav\',\'2Dgt2\',\'4Cwms\',\'2Dmc\',\'4Dwmt2\',\'4Cwst2\',\'3Dmv\',\'2Ddvp\',\'4Bgt2v\',\'2Dsvp\',\'4Bs\',\'3Dwqa\',\'1Dv\',\'4Drsc\',\'4Bqst1\',\'4Dmrt2\',\'3Dmst2\',\'4Cwsv\',\'4Dwsv\',\'4Bkt1c\',\'4Bst1p\',\'3Dmg\',\'2Dmgv\',\'2Dmt2v\',\'4Dwt2v\',\'2Dqt2v\',\'4Bmt1p\',\'2Dmdv\',\'4Bmgt2\',\'4Bkpv\',\'4Bqt2v\',\'4Bst1c\',\'4Bmst2\',\'4Cmt2p\',\'4Brt2v\',\'3Drt2\',\'4Cmp\',\'4Bkst2\',\'4Dgv\',\'4Crst2\',\'3Dmgv\',\'2Dsc\',\'4Bwst1\',\'4Bkt2\',\'4Cqt2\',\'4Drst2\',\'4Cksv\',\'2Dmvp\',\'3Dqt2\',\'4Cqv\',\'4Bmst1\',\'3Dqsv\',\'4Cqt2v\',\'4Bkvt1\',\'4Bmt2\',\'3Dqv\',\'4Cmvp\',\'4Bmt2c\',\'4Dqrt2\',\'4Bmt1\',\'4Cmvi\',\'4Crvc\',\'4Cmt1v\',\'2Ddp\',\'4Dmt2\',\'2Ddgv\',\'2Dst2v\',\'4Bmt2v\',\'2Ddt2v\',\'4Cqsv\',\'3Dwqv\',\'4Dwst2\',\'4Bst2p\',\'4Cwqv\',\'4Cwmi\',\'4Bqkv\',\'4Bst2v\',\'4Dwt2i\',\'4Bdvt1\',\'1Dt2\',\'4Dqrc\',\'4Cst2\',\'4Bmp\',\'4Bwsv\',\'4Dsv\',\'4Bkt2v\',\'1Dt2vc\',\'4Bdv\',\'1Dvp\',\'4Dmv\',\'4Dmp\',\'2Dmd\',\'4Bmsv\',\'4Cst2p\',\'4Cqst2\',\'4Dmst2\',\'3Drt2v\',\'2Dmt2\',\'4Dwv\',\'2Dqsv\',\'4Cgt2\',\'4Dwic\',\'4Cmt2\',\'4Dmt2v\',\'4Csp\',\'4Crsc\',\'3Drv\',\'2Dmsc\',\'4Csv\',\'2Ddt2\',\'3Dwa\',\'2Ddsv\',\'2Dqt2\',\'2Dqc\',\'4Bkt2c\',\'3Dwmv\',\'4Crt2c\',\'4Bkt1\',\'4Ckst2\',\'3Dwsa\',\'4Dwqv\',\'4Ddv\',\'4Csc\',\'3Dmrv\',\'4Dkrc\',\'3Dmt2\',\'4Cwsi\',\'4Dsc\',\'2Dqst2\',\'4Bgt1v\',\'4\',\'4Cwsa\',\'4Bwvt1\',\'4Drt2v\',\'4Bwv\',\'4Dwm\',\'4Bst1v\',\'3Ddc\',\'4Bqt1\',\'4Bkt1v\',\'3Ddt2\',\'4Bksp\',\'2Ddv\',\'3Dmt2v\',\'4Crsv\',\'4Cmt1\',\'3Dwv\')';
                    break;
                case '5':
                    cql_string += ' = \'U\'';
            }
        }else if(q.attribute == 'text1' || q.attribute == 'text2'){
            cql_string = q.attribute;

            switch(q.value){
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
                    cql_string += ' in (\'O\')';
                    break;
                case '7':
                    cql_string += ' in  (\'U\')';
                    break;

            }
        }else if (q.attribute == 'stone') {
            cql_string = 'stsym';
            switch (q.value) {
                case '1':
                    cql_string += ' = \'S1\'';
                    break;
                case '2':
                    cql_string += ' = \'S2\'';
                    break;
                case '3':
                    cql_string += ' = \'S3\'';
                    break;
                case '4':
                    cql_string += ' = \'S4\'';
                    break;
                case '5':
                    cql_string += ' = \'S5\'';
                    break;
                case '6':
                    cql_string += ' = \'U\'';
                    break;
            }
        }else if (q.attribute == 'salsym') {
            cql_string = '';
            switch (q.value) {
                case '1':
                    cql_string += `salsym in (0)`;
                    break;
                case '2':
                    cql_string += 'salsym in (\'1SD\',\'1MI\',\'1WAS\',\'2WS\',\'1MPS\',\'1MAS\',\'1SA\',\'2WP\',\'1WAD\',\'2WAD\',\'1MPA\',\'1SAS\',\'1WS\',\'2WA\',\'1WPD\',\'1WP\',\'2WD\',\'1VA\',\'1MAD\',\'1SPD\',\'1MA\',\'1SP\',\'1VD\',\'2WPD\',\'1WI\',\'1WDA\',\'1SS\',\'2WI\',\'1WPA\',\'1MPD\',\'1MP\',\'1\',\'1SAD\',\'1MS\',\'1WD\',\'2WPA\',\'1SPA\',\'1WA\',\'1MD\')';
                    break;
                case '3':
                    cql_string += 'salsym in (\'3WI\',\'3MA\',\'2\',\'2MI\',\'2MAS\',\'2SPS\',\'3WP\',\'2MAD\',\'2SAD\',\'2SP\',\'4WA\',\'2SD\',\'2MD\',\'3MPA\',\'3WPA\',\'3WD\',\'2MP\',\'2SPA\',\'3MPD\',\'3MAD\',\'2MS\',\'2SI\',\'3MD\',\'2SAS\',\'3\',\'3WA\',\'2MPD\',\'3MS\',\'2SS\',\'2MAI\',\'2MA\',\'3MAS\',\'3MI\',\'2MPA\',\'2MPS\',\'2SA\',\'3MPS\',\'3MP\')';
                    break;
                case '4':
                    cql_string += 'salsym in (\'5MD\',\'5MS\',\'4MAD\',\'4MD\',\'4SAI\',\'4MPA\',\'2VA\',\'3SAD\',\'4\',\'4SAD\',\'3SD\',\'4SA\',\'5MAD\',\'4SD\',\'2VPA\',\'3SPA\',\'3VA\',\'2VP\',\'6WA\',\'4MAS\',\'4MI\',\'5\',\'5MPA\',\'4SI\',\'4SP\',\'5WA\',\'2VAS\',\'3SA\',\'3SP\',\'5MI\',\'3SAS\',\'4SPA\',\'3VP\')';
                    break;
                case '5':
                    cql_string += 'salsym in (\'6VA\',\'5SD\',\'6SAD\',\'6SI\',\'6SAP\',\'5SI\',\'5SA\',\'6VI\',\'6SA\',\'6MA\',\'6VAP\',\'5VA\',\'6SAS\',\'5SAD\',\'6\',\'6MD\',\'4VAS\',\'4VA\',\'5VD\',\'5VAS\')';
                    break;
            }
        }else{
            cql_string = q.attribute;
            cql_string += ' in (\'';
            cql_string += q.value;
            cql_string += '\')';
        }

        console.log(cql_string)

        return cql_string;
    }

    clearFilter(){
        layers[0].getSource().updateParams({'cql_filter': null });
    }
}
