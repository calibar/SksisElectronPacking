import {Component, NgModule, Directive, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Router} from "@angular/router";
import {ContributionService, HeaderService, PointDataService} from "../../services";
import {FlashMessagesService} from "angular2-flash-messages";
import {error} from "util";

interface DataTypes { name:string; }

class DreamFactoryResponseObject {
    resource: any[];
}




@Component({
    selector: 'mainView',
    template: require('./main-view.template.html'),
    styles: [require('./main-view.styles.css').toString()],
    providers: [
        ContributionService,
        HeaderService,
        PointDataService
    ]
})
export class mainViewComponent {
    constructor(
        public fb: FormBuilder,
        public _http: Http,
        private router: Router,
        private _contribs: ContributionService,
        private _headers: HeaderService,
        private _pointData: PointDataService,
        private _flashMessagesService: FlashMessagesService
    ) { }

    @ViewChild('fileList')
    private fileInput: ElementRef;

    public fileList;
    contributions;
    datatype;
    pits;

    descriptionBeingEdited;
    idBeingEdited;

    public dataUploadForm = this.fb.group({
        datatype: ["", Validators.required],
        latitude: ["", Validators.required],
        longitude: ["", Validators.required],
        description: ["", Validators.required],
        filename:[""]
    });

    ngOnInit(): void {
        if(localStorage.getItem("session_token")==null){
            this.router.navigate(['login']);
        }

        this.descriptionBeingEdited = 'error';

    }

    deletePoint(item) {
        this._pointData.deletePoint(item.id).subscribe(
            res => {
                this.getContributions();
            },
            err => {
                console.log(err);
            }
        )
    }

    updatePoint() {
        this._pointData.updatePoint(this.idBeingEdited, this.descriptionBeingEdited).subscribe(
            res => {
                this.getContributions();
            },
            err => {
                console.log(err);
            }
        )
    }

    fixArray(array){
        var arr : any[] = [];
        var key = Object.keys(array[0]);
        for(let a of array){
            if(a[key.toString()]){
                arr.push({'name':a[key.toString()]})
            }
        }
        this.contributions = arr;
    }

    logError(err) {
        console.error('There was an error: ' + err);
    }

    public uploadData(){

        if (!(this.datatype == 'observation')) {

            console.log(this.fileList[0].name)
            this.dataUploadForm.patchValue({"filename": this.fileList[0].name});
            console.log(this.dataUploadForm);

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    console.log("file upload response: " + this.responseText);
                }
            });

            if (this.datatype == 'photo') {
                xhr.open("POST", "https://sksoils.usask.ca/api/v2/files/sk_soil_photos/" + this.fileList[0].name);
            }

            if (this.datatype == 'publication') {
                xhr.open("POST", "https://sksoils.usask.ca/api/v2/files/sk_soil_publications/" + this.fileList[0].name);
            }

            xhr.setRequestHeader("x-dreamfactory-api-key", "63c915584e2e9f3dedfb7a01a15ffc027c6ece044aa486f327bd766af0b95585");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.setRequestHeader("Content-Type",  "image/jpeg");

            xhr.send(this.fileList[0]);
        }



        this._pointData.uploadPoint(this.dataUploadForm).subscribe(
            res => {
                console.log(res);
                alert("Successfully uploaded data");
                this.dataUploadForm.reset();
                // console.log(this.fileInput.nativeElement.files);
                // this.fileInput.nativeElement.value = "";
                // console.log(this.fileInput.nativeElement.files);
            },
            err => {
                console.log(err);
                alert(err);
            }
        )
    }

    public onChangeDatatype(value){
        this.datatype = value;
    }

    public fileAdded(event){
        this.fileList = event.srcElement.files;
    }

    dataTypesArray:DataTypes[] = [{name: 'Photo'}, {name: 'Publication'}, {name: 'Observation'}, {name: 'Soil Pit'}];

    getContributions(){
        this._contribs.getContributions().subscribe(
            res => {
                console.log(res);
                this.contributions = res.resource;
            },
            err => {
                console.log(err);
            }
        )

        this._contribs.getPits().subscribe(res => {
            this.pits = res.resource;
            console.log(res)
        })
    }

    soilPitSubmit(event) {
        console.log("Got a soil pit into main view");
        console.log(event);

        event.value.uploader = localStorage.getItem('email')

        let ob = new DreamFactoryResponseObject();

        ob.resource = [];

        ob.resource.push(event.value);

        ob.resource[0].soil_pits_horizons_by_soil_pits_id = event.value.horizons;

        console.log(ob);

        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-DreamFactory-Api-Key', '63c915584e2e9f3dedfb7a01a15ffc027c6ece044aa486f327bd766af0b95585');

        let options = new RequestOptions({ headers: queryHeaders});

        this._http.post('https://sksoils.usask.ca/api/v2/sksoil/_table/soil_pits', ob, options)
            .subscribe( (resp) => {
                console.log(resp);
                this._flashMessagesService.show('Success!', { cssClass: 'alert-success', timeout: 2000 })

            }, (err) => {
                this._flashMessagesService.show(err.messages, { cssClass: 'alert-danger', timeout: 2000 })
            });


    }

    loadPointForEditing(point) {
        this.descriptionBeingEdited = point.description;
        this.idBeingEdited = point.id;
    }

    deletePit(pit){
        this._contribs.deletePit(pit.id).subscribe(
            (res) => {
                this.getContributions();
                this._flashMessagesService.show('Pit deleted.', { cssClass: 'alert-success', timeout: 2000})
            },
            (error) => {
                this._flashMessagesService.show('Error deleting pit', { cssClass: 'alert-danger', timeout: 2000})
            });
    }
}
