"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const Subject_1 = require("rxjs/Subject");
const http_1 = require("@angular/http");
let RedrawService = class RedrawService {
    constructor() {
        // Observable string sources
        this.redrawAnnouncedSource = new Subject_1.Subject();
        // Observable string streams
        this.redrawAnnounced$ = this.redrawAnnouncedSource.asObservable();
    }
    // Service message commands
    announceRedraw() {
        this.redrawAnnouncedSource.next();
    }
};
RedrawService = tslib_1.__decorate([
    core_1.Injectable()
], RedrawService);
exports.RedrawService = RedrawService;
let HeaderService = class HeaderService {
    constructor() {
        this.DefaultXDreamFactoryAPIKey = '63c915584e2e9f3dedfb7a01a15ffc027c6ece044aa486f327bd766af0b95585';
    }
    getHeaders(specifiedAPIkey) {
        let APIkey = specifiedAPIkey ? specifiedAPIkey : this.DefaultXDreamFactoryAPIKey;
        return new http_1.Headers({
            'Content-Type': 'application/json',
            'X-DreamFactory-Api-Key': APIkey
        });
    }
    getBasicOptions() {
        return new http_1.RequestOptions({ headers: this.getHeaders() });
    }
    getImageOptions() {
        return new http_1.RequestOptions({ headers: new http_1.Headers({
                'Content-Type': 'image/png',
                'X-DreamFactory-Api-Key': this.DefaultXDreamFactoryAPIKey
            }) });
    }
    getApiKey() {
        return this.DefaultXDreamFactoryAPIKey;
    }
    getSessionToken() {
        return localStorage.getItem(('session_token'));
    }
};
HeaderService = tslib_1.__decorate([
    core_1.Injectable()
], HeaderService);
exports.HeaderService = HeaderService;
let LoginService = class LoginService {
    constructor(_http, _headers) {
        this._http = _http;
        this._headers = _headers;
        this.DreamFactoryURL = 'http://sksoils.usask.ca/api/v2/user/session';
    }
    login(username, password) {
        var body = JSON.stringify({ 'email': username, 'password': password });
        var headers = this._headers.getHeaders();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http
            .post(this.DreamFactoryURL, body, options).map(res => {
            console.log(res);
            let result = res.json();
            if (result.session_token) {
                localStorage.setItem("session_token", result.session_token);
                localStorage.setItem("session_id", result.session_id);
                localStorage.setItem("first_name", result.first_name);
                localStorage.setItem("last_name", result.last_name);
                localStorage.setItem("email", result.email);
            }
            return result;
        });
    }
};
LoginService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        HeaderService])
], LoginService);
exports.LoginService = LoginService;
let PointDataService = class PointDataService {
    constructor(_http, _header) {
        this._http = _http;
        this._header = _header;
    }
    uploadPoint(form) {
        var pointDataUrl = 'http://sksoils.usask.ca/api/v2/sksoil/_func/create_point_data';
        var nameValuePairs = [];
        nameValuePairs.push({ 'name': 'v_filename', 'value': form.value.filename });
        nameValuePairs.push({ 'name': 'v_datatype', 'value': form.value.datatype });
        nameValuePairs.push({ 'name': 'v_uploader', 'value': localStorage.getItem('email') });
        nameValuePairs.push({ 'name': 'v_description', 'value': form.value.description });
        nameValuePairs.push({ 'name': 'v_long', 'value': form.value.longitude });
        nameValuePairs.push({ 'name': 'v_lat', 'value': form.value.latitude });
        var body = JSON.stringify({ params: nameValuePairs });
        var options = this._header.getBasicOptions();
        return this._http.post(pointDataUrl, body, options).map((resp) => { return resp; });
    }
    deletePoint(id) {
        var url = 'http://sksoils.usask.ca/api/v2/sksoil/_table/sk_point_data/';
        var options = this._header.getBasicOptions();
        url += id;
        return this._http.delete(url, options).map((resp) => { return resp; });
    }
    updatePoint(pointId, newDescription) {
        let url = 'http://sksoils.usask.ca/api/v2/sksoil/_table/sk_point_data/';
        url += pointId;
        let options = this._header.getBasicOptions();
        let updatedDescription = JSON.stringify({ 'description': newDescription });
        return this._http.patch(url, updatedDescription, options).map((resp) => { return resp; });
    }
    getImage(filename) {
        let url = 'http://sksoils.usask.ca/api/v2/files/sk_soil_photos/' + filename;
        let options = this._header.getImageOptions();
        console.log(options);
        return this._http.get(url, options).map((res) => {
            console.log(res);
            return res;
        }, (err) => {
            console.log(err);
        });
    }
};
PointDataService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        HeaderService])
], PointDataService);
exports.PointDataService = PointDataService;
let RegisterService = class RegisterService {
    constructor(_http, _login, _header) {
        this._http = _http;
        this._login = _login;
        this._header = _header;
        this.dreamFactoryUrl = 'http://sksoils.usask.ca/api/v2/system/user';
    }
    register(name, first_name, last_name, email, password) {
        var body = {
            'name': name,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password
        };
        var resource = JSON.stringify({ resource: [body] });
        var headers = this._header.getHeaders();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http
            .post(this.dreamFactoryUrl, resource, options).map(res => {
            let result = res.json();
            return result;
        });
    }
};
RegisterService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        LoginService,
        HeaderService])
], RegisterService);
exports.RegisterService = RegisterService;
let LogoutService = class LogoutService {
    logout() {
        localStorage.removeItem("session_token");
        localStorage.removeItem("session_id");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem("email");
        window.location.reload();
    }
};
LogoutService = tslib_1.__decorate([
    core_1.Injectable()
], LogoutService);
exports.LogoutService = LogoutService;
let ContributionService = class ContributionService {
    constructor(_http, _headers) {
        this._http = _http;
        this._headers = _headers;
        this.url = 'http://sksoils.usask.ca/api/v2/sksoil/_table/sk_point_data?filter=uploader%20%3D%20';
        this.url += encodeURIComponent(localStorage.getItem("email"));
    }
    getContributions() {
        var options = this._headers.getBasicOptions();
        console.log(this.url);
        return this._http.get(this.url, options).map(res => {
            return res.json();
        });
    }
    ;
};
ContributionService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        HeaderService])
], ContributionService);
exports.ContributionService = ContributionService;
let ComponentService = class ComponentService {
    constructor(_http, _headers) {
        this._http = _http;
        this._headers = _headers;
        this.url = 'http://sksoils.usask.ca/api/v2/sksoil/_table/polygon_components?filter=poly_id%20%3D%20';
    }
    getComponentsForPolygon(polygonID) {
        //this.url += polygonID;
        let options = this._headers.getBasicOptions();
        return this._http.get(this.url + polygonID, options).map((resp) => {
            return resp.json();
        });
    }
};
ComponentService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        HeaderService])
], ComponentService);
exports.ComponentService = ComponentService;
let SectionCoordinateService = class SectionCoordinateService {
    constructor(_http, _headers) {
        this._http = _http;
        this._headers = _headers;
        this.sectioUurl = 'http://sksoils.usask.ca/api/v2/sksoil/_proc/get_center_section';
        this.coordinateUrl = 'http://sksoils.usask.ca/api/v2/sksoil/_proc/check_coordinate';
    }
    getCenterOfSection(section, township, range, meridian) {
        let myParams = [];
        myParams.push({ 'name': 'v_sect', 'value': section });
        myParams.push({ 'name': 'v_ptwp', 'value': township });
        myParams.push({ 'name': 'v_prge', 'value': range });
        myParams.push({ 'name': 'v_pmer', 'value': meridian });
        let body = JSON.stringify({ params: myParams });
        console.log(body);
        let options = this._headers.getBasicOptions();
        return this._http.post(this.sectioUurl, body, options).map(res => {
            return res.json();
        });
    }
    checkCoordinate(latitude, longitude, radius) {
        let myParams = [];
        myParams.push({ 'name': 'v_longitude', 'value': longitude });
        myParams.push({ 'name': 'v_latitude', 'value': latitude });
        myParams.push({ 'name': 'v_radius', 'value': radius });
        let body = JSON.stringify({ params: myParams });
        console.log(body);
        let options = this._headers.getBasicOptions();
        return this._http.post(this.coordinateUrl, body, options).map(res => {
            return res.json();
        });
    }
};
SectionCoordinateService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [http_1.Http,
        HeaderService])
], SectionCoordinateService);
exports.SectionCoordinateService = SectionCoordinateService;
let AcronymConversionService = class AcronymConversionService {
    constructor() { }
    letterToTexture(letter) {
        switch (letter) {
            case 'C': return 'Clay';
            case 'CL': return 'Clay loam';
            case 'CS': return 'Clay sand';
            case 'FCL': return 'Fine clay loam';
            case 'FL': return 'Fine loam';
            case 'FS': return 'Fine sand';
            case 'HC': return 'Heavy clay';
            case 'L': return 'Loam';
            case 'O': return 'Organic';
            case 'S': return 'Sand';
            case 'SCL': return 'Sandy clay loam';
            case 'SIC': return 'Silty clay';
            case 'SICL': return 'Silty clay loam';
            case 'SIL': return 'Silty loam';
            case 'SL': return 'Sandy loam';
            default: return 'Error retrieving texture';
        }
    }
};
AcronymConversionService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], AcronymConversionService);
exports.AcronymConversionService = AcronymConversionService;
let ThemeingService = class ThemeingService {
    constructor(_headers, _http) {
        this._headers = _headers;
        this._http = _http;
    }
    getColoursForTheme(theme) {
        let headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'X-DreamFactory-Api-Key': 'c88e24fad8856513273b98fb9751b3cbddd6f73d9e2ef24b92833c2d66587aa9'
        });
        let options = new http_1.RequestOptions({ headers: headers });
        if (theme == 'dominant_texture_classes') {
            theme = 'text_colours';
        }
        var uurl = 'http://sksoils.usask.ca/api/v2/sksoil/_table/' + theme;
        var url = 'http://sksoildb.usask.ca/api/v2/sksoil/_table/' + theme;
        let ooptions = this._headers.getBasicOptions();
        // return this._http.get(url, options).map(res => res.json(), err => console.log(err));
        return this._http.get(uurl, ooptions).map(res => res.json(), err => console.log(err));
    }
};
ThemeingService = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [HeaderService,
        http_1.Http])
], ThemeingService);
exports.ThemeingService = ThemeingService;
//# sourceMappingURL=services.js.map