"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
const router_1 = require("@angular/router");
const services_1 = require("../../services");
class DreamFactoryResponseObject {
}
let mainViewComponent = class mainViewComponent {
    constructor(fb, _http, router, _contribs, _headers, _pointData) {
        this.fb = fb;
        this._http = _http;
        this.router = router;
        this._contribs = _contribs;
        this._headers = _headers;
        this._pointData = _pointData;
        this.dataUploadForm = this.fb.group({
            datatype: ["", forms_1.Validators.required],
            latitude: ["", forms_1.Validators.required],
            longitude: ["", forms_1.Validators.required],
            description: ["", forms_1.Validators.required],
            filename: [""]
        });
        this.dataTypesArray = [{ name: 'Photo' }, { name: 'Publication' }, { name: 'Observation' }, { name: 'Soil Pit' }];
    }
    ngOnInit() {
        if (localStorage.getItem("session_token") == null) {
            this.router.navigate(['login']);
        }
        this.descriptionBeingEdited = 'error';
    }
    deletePoint(item) {
        this._pointData.deletePoint(item.id).subscribe(res => {
            this.getContributions();
        }, err => {
            console.log(err);
        });
    }
    updatePoint() {
        this._pointData.updatePoint(this.idBeingEdited, this.descriptionBeingEdited).subscribe(res => {
            this.getContributions();
        }, err => {
            console.log(err);
        });
    }
    fixArray(array) {
        var arr = [];
        var key = Object.keys(array[0]);
        for (let a of array) {
            if (a[key.toString()]) {
                arr.push({ 'name': a[key.toString()] });
            }
        }
        this.contributions = arr;
    }
    logError(err) {
        console.error('There was an error: ' + err);
    }
    uploadData() {
        if (!(this.datatype == 'observation')) {
            console.log(this.fileList[0].name);
            this.dataUploadForm.patchValue({ "filename": this.fileList[0].name });
            console.log(this.dataUploadForm);
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    console.log("file upload response: " + this.responseText);
                }
            });
            if (this.datatype == 'photo') {
                xhr.open("POST", "http://sksoils.usask.ca/api/v2/files/sk_soil_photos/" + this.fileList[0].name);
            }
            if (this.datatype == 'publication') {
                xhr.open("POST", "http://sksoils.usask.ca/api/v2/files/sk_soil_publications/" + this.fileList[0].name);
            }
            xhr.setRequestHeader("x-dreamfactory-api-key", "63c915584e2e9f3dedfb7a01a15ffc027c6ece044aa486f327bd766af0b95585");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.setRequestHeader("Content-Type", "image/jpeg");
            xhr.send(this.fileList[0]);
        }
        this._pointData.uploadPoint(this.dataUploadForm).subscribe(res => {
            console.log(res);
            alert("Successfully uploaded data");
            this.dataUploadForm.reset();
        }, err => {
            console.log(err);
            alert(err);
        });
    }
    onChangeDatatype(value) {
        this.datatype = value;
    }
    fileAdded(event) {
        this.fileList = event.srcElement.files;
    }
    getContributions() {
        this._contribs.getContributions().subscribe(res => {
            console.log(res);
            this.contributions = res.resource;
        }, err => {
            console.log(err);
        });
    }
    soilPitSubmit(event) {
        console.log("Got a soil pit into main view");
        console.log(event);
        let ob = new DreamFactoryResponseObject();
        ob.resource = [];
        ob.resource.push(event.value);
        ob.resource[0].soil_pits_horizons_by_soil_pits_id = event.value.horizons;
        console.log(ob);
        var queryHeaders = new http_1.Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-DreamFactory-Api-Key', 'c88e24fad8856513273b98fb9751b3cbddd6f73d9e2ef24b92833c2d66587aa9');
        let options = new http_1.RequestOptions({ headers: queryHeaders });
        this._http.post('http://sksoildb.usask.ca/api/v2/sksoil/_table/soil_pits', ob, options)
            .subscribe((resp) => {
            console.log(resp);
        }, (err) => {
            console.log(err);
        });
    }
    loadPointForEditing(point) {
        this.descriptionBeingEdited = point.description;
        this.idBeingEdited = point.id;
    }
};
mainViewComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'mainView',
        templateUrl: 'main-view.template.html',
        providers: [
            services_1.ContributionService,
            services_1.HeaderService,
            services_1.PointDataService
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [forms_1.FormBuilder,
        http_1.Http,
        router_1.Router,
        services_1.ContributionService,
        services_1.HeaderService,
        services_1.PointDataService])
], mainViewComponent);
exports.mainViewComponent = mainViewComponent;
//# sourceMappingURL=main-view.component.js.map