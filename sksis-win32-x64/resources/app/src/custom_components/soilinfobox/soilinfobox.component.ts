import {Component, ElementRef, NgModule, ViewChild} from '@angular/core';
import { Http }          from '@angular/http';
import {DoughnutChartComponent} from "../doughnutchart/doughtnutchart.component";
import {
    AcronymConversionService, ComponentService, HeaderService, PointDataService,
    PolygonService
} from "../../services";
import { saveAs } from "../../../node_modules/file-saver";
import * as d3 from 'd3';

@Component({
    selector: 'soilinfobox',
    template: require('./soilinfobox.template.html'),
    styles: [require('./soilinfobox.css').toString()],
    providers: [
        HeaderService,
        ComponentService,
        PointDataService,
        AcronymConversionService,
        PolygonService
    ]
})
export class SoilinfoboxComponent{

    @ViewChild(DoughnutChartComponent) private doughnutChart: DoughnutChartComponent;

    // @ViewChild('ph')
    //     private phDoughnutChart: DoughnutChartComponent;

    @ViewChild('pdfLink') private pdfAnchorTag: ElementRef;



    clickCoordinateLat;
    clickCoordinateLong;

    mouseLatitude;
    mouseLongitude;

    selectedFeature;

    pointOrPolygonSelection;

    pointType;

    components;

    scaleString:string;

    validChartData;

    imageToShow: any;

    phProportions;
    progressBarTypes = ["progress-bar-success", "progress-bar-warning", "progress-bar-danger"];

    ngOnInit(): void {
        this.clickCoordinateLat = "no click registered";
        this.mouseLatitude = 56;
        this.mouseLongitude = -105;
        this.pointOrPolygonSelection = '';

        this.validChartData = true;


    }

    constructor (
        private http: Http,
        private _component: ComponentService,
        private _point: PointDataService,
        private _acr: AcronymConversionService
    ) {}

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    getImageFromService(filename) {
        this._point.getImage(filename).subscribe(data => {
            this.createImageFromBlob(data);
        }, error => {
            console.log(error);
        });
    }

    getPdfFromService(filename){
        this._point.getPdf(filename).subscribe(res => {
            //saveAs(res, filename + '.pdf');
            let fileUrl = URL.createObjectURL(res)
            this.pdfAnchorTag.nativeElement.href = fileUrl;
        });
    }

    setMouseLatLong(lat, long){
        this.mouseLatitude = lat.toFixed(2);
        this.mouseLongitude = long.toFixed(2);
    }

    setClickCoordinate(newCord){
        this.clickCoordinateLat = newCord[1].toFixed(2);
        this.clickCoordinateLong = newCord[0].toFixed(2);
    }

    setScaleString(str:string){
        if (str){
            this.scaleString = str;
        }
    }

    getPointFeatureData(url){
        this.pointOrPolygonSelection = 'point';
        this.getFeatureInfo(url);
    }

    getPolygonFeatureData(url){
        this.pointOrPolygonSelection = 'polygon';
        this.getFeatureInfo(url);
    }

    clearFeatureInfo(){
        this.pointOrPolygonSelection = '';
        this.selectedFeature = null;
    }

    getFeatureInfo(url){
        if (url){
            this.http.get(url).subscribe(
                data => this.displayFeatureInfo(data.json()),
                err => console.log("getFeatureError: [in soilinfobox.component] " + err),
                () => console.log('soilinfobox.component => getFeatureInfo() success')
            )
        }else{
            console.log("ERROR: getFeatureInfo was given null url");
        }
    }

    getComponents(){
        this._component.getComponentsForPolygon(this.selectedFeature.poly_id).subscribe(
            data => this.displayComponents(data.resource),
            err => console.log("getComponentsForPolygon error: [in soilinfobox.component] " + err)
        );
    }

    displayComponents(data){
        this.components = data;
        this.buildChart(data);
    }

    buildChart(data) {
        let values:number[] = [];
        let names:string[] = [];

        if (data.length == 0) {
            console.log("No components");
            values.push(100);
            names.push('No component information');
        }else{
            data.forEach( (datum) => {

                values.push(datum.percent);
                names.push(datum.soilname )
            });
        }

        this.doughnutChart.setChartData(values);
        this.doughnutChart.setChartLabels(names);
    }

    displayFeatureInfo(feature) {
        if (feature.features[0]){
            this.selectedFeature = feature.features[0].properties;

            if (feature.features[0].geometry.type == 'Point') {
                this.pointType = this.selectedFeature.datatype;
                switch (this.pointType) {
                    case 'photo':
                        this.getImageFromService(this.selectedFeature.filename);
                        break;
                    case 'publication':
                        console.log('Getting pdf')
                        this.getPdfFromService(this.selectedFeature.filename);
                        break;
                    case 'observation':

                        break;
                }

            } else {
                this.cleanUpPolygonAttributeCodes();
                this.getComponents();
            }
        } else {
            this.clearFeatureInfo()
        }
    }

    cleanUpPolygonAttributeCodes(){
        this._acr.agCapabilityToDescription(this.selectedFeature.capblty).subscribe( data => {
            this.selectedFeature.agCapDesc = data;
        });

        this._acr.salityClassToDescription(this.selectedFeature.salsym).subscribe( data => {
            this.selectedFeature.salDesc = data;
        });

        this.selectedFeature.text1 = this._acr.letterToTexture(this.selectedFeature.text1);

        this._acr.phToDefinition(this.selectedFeature.phsym).subscribe(data => {
            this.selectedFeature.phDefinition = data;
            this.phProportions = this.parsepH(data)
        })

        this._acr.mapunitToDescription(this.selectedFeature.polygon_label).subscribe( data => {
            this.selectedFeature.mapunitDescription = data;
        })


    }



    parsepH(data) {
        class phChunkObject  {
            percent;
            description;

            constructor(percent?, description?) {
                this.percent = percent;
                this.description = description;
            }
        }

        let allMyObjects = [];

        let eachChunk = data.toString().split(", ");

        eachChunk.forEach(chunk => {
            let parsedChunk = chunk.split("% ");
            allMyObjects.push(new phChunkObject(parsedChunk[0], parsedChunk[1]));
        });

        return allMyObjects;
    }
}