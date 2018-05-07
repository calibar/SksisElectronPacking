import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {Http, Headers, Response, RequestOptions, ResponseContentType} from "@angular/http";
import {ErrorMessage} from "./custom_components/ErrorMessage";
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs/Observable";

class DreamFactoryServerResponse {
    constructor(public resource: any) {}
}


@Injectable()
export class RedrawService {

    // Observable string sources
    private redrawAnnouncedSource = new Subject<string>();

    // Observable string streams
    redrawAnnounced$ = this.redrawAnnouncedSource.asObservable();

    // Service message commands
    announceRedraw() {
        this.redrawAnnouncedSource.next();
    }
}

@Injectable()
export class HeaderService {

    DefaultXDreamFactoryAPIKey = '63c915584e2e9f3dedfb7a01a15ffc027c6ece044aa486f327bd766af0b95585';

    public getHeaders(specifiedAPIkey?:string) {

        let APIkey = specifiedAPIkey ? specifiedAPIkey : this.DefaultXDreamFactoryAPIKey;

        return new Headers({
            'Content-Type': 'application/json',
            'X-DreamFactory-Api-Key': APIkey
        });
    }

    public getBasicOptions() {
        return new RequestOptions({ headers: this.getHeaders() });
    }

    public getImageOptions(){
        return new RequestOptions({headers: new Headers({
                'Content-Type': 'image/png',
                'X-DreamFactory-Api-Key': this.DefaultXDreamFactoryAPIKey
            }),
            responseType: ResponseContentType.Blob
        });
    }

    public getApiKey() {
        return this.DefaultXDreamFactoryAPIKey;
    }

    public getSessionToken() {
        return localStorage.getItem(('session_token'));
    }
}

@Injectable()
export class LoginService {
    constructor(
        public _http: Http,
        public _headers: HeaderService
    ) { }

    DreamFactoryURL = 'https://sksoils.usask.ca/api/v2/user/session';

    error: ErrorMessage;

    public login(username, password) {

        var body = JSON.stringify({ 'email': username, 'password': password });

        var headers = this._headers.getHeaders();

        var options = new RequestOptions({ headers: headers });

        return this._http
            .post(this.DreamFactoryURL, body, options).map(
                res => {
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
                }
            );
    }
}

@Injectable()
export class PointDataService {
    constructor(
        private _http: Http,
        private _header: HeaderService
    ){}

    public uploadPoint(form: FormGroup){
        var pointDataUrl = 'https://sksoils.usask.ca/api/v2/sksoil/_func/create_point_data';

        var nameValuePairs = [];

        nameValuePairs.push({ 'name': 'v_filename', 'value': form.value.filename });
        nameValuePairs.push({ 'name': 'v_datatype', 'value': form.value.datatype });
        nameValuePairs.push({ 'name': 'v_uploader', 'value': localStorage.getItem('email') });
        nameValuePairs.push({ 'name': 'v_description', 'value': form.value.description });
        nameValuePairs.push({ 'name': 'v_long', 'value': form.value.longitude });
        nameValuePairs.push({ 'name': 'v_lat', 'value': form.value.latitude });

        var body = JSON.stringify({ params: nameValuePairs });

        var options = this._header.getBasicOptions();

        return this._http.post(pointDataUrl, body, options).map((resp)=> {return resp});
    }

    public deletePoint(id) {
        var url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/sk_point_data/';

        var options = this._header.getBasicOptions();

        url += id;

        return this._http.delete(url, options).map( (resp) => { return resp });
    }

    public updatePoint(pointId, newDescription) {
        let url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/sk_point_data/';

        url += pointId;

        let options = this._header.getBasicOptions();

        let updatedDescription = JSON.stringify( {'description': newDescription });

        return this._http.patch(url, updatedDescription, options).map( (resp) => { return resp });
    }

    public getImage(filename) {
        let url = 'https://sksoils.usask.ca/api/v2/files/sk_soil_photos/' + filename +'?download=true';

        let options = this._header.getImageOptions();
        console.log(options)

        return this._http.get(url, options).map(
            (res:Response) => {
                return res.blob();
            },
            (err) => {
                console.log(err)
            }
        )
    }

    getPdf(filename) {
        let url = 'https://sksoils.usask.ca/api/v2/files/sk_soil_publications/' + filename +'?download=true';

        let options = this._header.getImageOptions();
        console.log(options)

        return this._http.get(url, options)
            .map((res) => {
                return new Blob([res.blob()], { type: 'application/pdf' })
            });
    }
}

@Injectable()
export class RegisterService {
    constructor(
        private _http: Http,
        private _login: LoginService,
        private _header: HeaderService
    ) { }

    private dreamFactoryUrl = 'https://sksoils.usask.ca/api/v2/system/user';

    public register(name, first_name, last_name, email, password) {

        var body = {
            'name': name,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password
        };

        var resource = JSON.stringify({ resource: [body] });

        var headers = this._header.getHeaders();

        var options = new RequestOptions({ headers: headers });

        return this._http
            .post(this.dreamFactoryUrl, resource, options).map(
                res => {
                    let result = res.json();

                    localStorage.setItem("session_token", result.session_token);
                    return result;
                }
            );
    }

    public getAllSystemSevices() {
        let url = 'https://sksoils.usask.ca/api/v2/system/service';
        return this._http.get(url, this._header.getBasicOptions()).map( services => {return services.json().resource});
    }

    public getListOfAllRoles() {
        let url = 'https://sksoils.usask.ca/api/v2/system/role';
        return this._http.get(url, this._header.getBasicOptions()).map( roles => {return roles.json().resource});
    }

    public checkRolesOfAccount() {
        return this.getUserId().flatMap( user => {
            return this.getRolesForUser(user.id).map( roles => { return roles });
        });
    }

    public getUserId() {
        // Get id of currently signed in user
        let idUrl = 'https://sksoils.usask.ca/api/v2/system/user?filter=email%20%3D%20';
        idUrl+= encodeURIComponent(localStorage.getItem("email"));

        return this._http.get(idUrl, this._header.getBasicOptions()).map(
            result => {
                console.log(result)
                return result.json().resource[0];
            },
            err => {
                console.log(err)
            }
        );
    }

    public getRolesForUser(id:number) {
        let url = 'https://sksoils.usask.ca/api/v2/system/user?related=user_to_app_to_role_by_user_id&filter=id%20%3D%20';

        if (typeof id == "number" && id >= 0) {
            url+= id;
            return this._http
                .get(url, this._header.getBasicOptions())
                .map(
                response => {
                    let resp = response.json();
                    return resp.resource[0].user_to_app_to_role_by_user_id
                });
        }
    }

    public giveRolesToAccount() {
        // Get id of currently signed in user
        let idUrl = 'https://sksoils.usask.ca/api/v2/system/user?filter=email%20%3D%20' + encodeURIComponent(localStorage.getItem("email"));

        this.getUserId().subscribe(
            user => {
                if (user) {
                    let userId = user.id;

                    let roleUrl = 'https://sksoils.usask.ca/api/v2/system/user/' + userId + '?fields=*&related=user_to_app_to_role_by_user_id';

                    let APIDocsBody = {
                        "user_to_app_to_role_by_user_id": [{
                            "app_id": "2",
                            "role_id": "4",
                            "user_id": userId
                        }]
                    };

                    this._http.put(roleUrl, APIDocsBody, this._header.getBasicOptions()).subscribe(
                        result =>{
                            console.log(result)
                        },
                        err => {
                            console.log(err)
                        }
                    );
                }
            },
            err => {
                console.log(err)
            }
        )
    }
}

@Injectable()
export class LogoutService{
    public logout() {
        localStorage.removeItem("session_token");
        localStorage.removeItem("session_id");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem("email");

        window.location.reload();
    }
}

@Injectable()
export class ContributionService {
    constructor(
        public _http: Http,
        public _headers: HeaderService
    ){
        this.pointUrl += encodeURIComponent(localStorage.getItem("email"));
        this.pitUrl += encodeURIComponent(localStorage.getItem("email"));
    }

    private pointUrl = 'https://sksoils.usask.ca/api/v2/sksoil/_table/sk_point_data?filter=uploader%20%3D%20';
    private pitUrl = 'https://sksoils.usask.ca/api/v2/sksoil/_table/soil_pits?filter=uploader%20%3D%20';

    public getContributions() {

        var options = this._headers.getBasicOptions();

        return this._http.get(this.pointUrl, options).map(
            res => {
                return res.json();
            }
        );

    };

    public getPits() {
        let options = this._headers.getBasicOptions();

        return this._http.get(this.pitUrl, options).map(
            res => {
                return res.json();
            }
        );
    }

    public deletePit(id){
        let options = this._headers.getBasicOptions();

        let url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/soil_pits/' + id;

        return this._http.delete(url, options).map(res => {
            return res.json();
        })
    }
}

@Injectable()
export class ComponentService {
    constructor(
        public _http: Http,
        public _headers: HeaderService
    ){}

    private url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/polygon_components?filter=poly_id%20%3D%20';

    public getComponentsForPolygon(polygonID){

        //this.url += polygonID;

        let options = this._headers.getBasicOptions();

        return this._http.get(this.url + polygonID, options).map(
            (resp) => {
                return resp.json();
            }
        )
    }
}

@Injectable()
export class SectionCoordinateService {
    constructor(public _http: Http,
                public _headers: HeaderService) {
    }

    private sectioUurl = 'https://sksoils.usask.ca/api/v2/sksoil/_proc/get_center_section';

    private coordinateUrl = 'https://sksoils.usask.ca/api/v2/sksoil/_proc/check_coordinate';

    public getCenterOfSection(section, township, range, meridian) {
        let myParams = [];

        myParams.push({'name': 'v_sect', 'value': section});
        myParams.push({'name': 'v_ptwp', 'value': township});
        myParams.push({'name': 'v_prge', 'value': range});
        myParams.push({'name': 'v_pmer', 'value': meridian});

        let body = JSON.stringify({params: myParams});

        console.log(body);

        let options = this._headers.getBasicOptions();

        return this._http.post(this.sectioUurl, body, options).map(
            res => {
                return res.json();
            }
        )
    }

    public checkCoordinate(latitude, longitude, radius) {
        let myParams = [];

        myParams.push({'name': 'v_longitude', 'value': longitude});
        myParams.push({'name': 'v_latitude', 'value': latitude});
        myParams.push({'name': 'v_radius', 'value': radius});

        let body = JSON.stringify({params: myParams});



        let options = this._headers.getBasicOptions();

        console.log(this.coordinateUrl)

        return this._http.post(this.coordinateUrl, body, options).map(
            res => {
                return res.json();
            }
        )
    }
}

@Injectable()
export class AcronymConversionService {
    constructor(public _http: Http,
                public _headers: HeaderService) {
    }

    public letterToTexture(letter:String) {
        console.log(letter)
        switch(letter){
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
            case 'VL': return 'Very fine loam'
            default: return 'Error retrieving texture';
        }
    }

    public salityClassToDescription(code:string) {

        let url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/salsym?filter=salsym%20%3D%20' + code;
        let options = this._headers.getBasicOptions();

        return this._http.get(url, options).map( res => {
            let result:DreamFactoryServerResponse = res.json();
            return result.resource.map( (item) => {
                return item.affect_on_prod
            })
        })
    }

    public agCapabilityToDescription(capability:string) {
        let digit = capability.charAt(0);
        let url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/capclass?filter=domi_capablity_class%20%3D%20' + digit;
        let options = this._headers.getBasicOptions();

        return this._http.get(url, options).map( res => {
            let result: DreamFactoryServerResponse = res.json();
            return result.resource.map( item => {
                return item.limitation;
            })
        })
    }

    public phToDefinition(ph) {
        let url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/ph_symbol_definitions?filter=symbol%20%3D%20' + ph;
        let options = this._headers.getBasicOptions();
        return this._http.get(url, options).map( res => {
            let result: DreamFactoryServerResponse = res.json();
            return result.resource.map( item => {
                return item.definition;
            })
        })
    }

    public mapunitToDescription(mu) {
        let url = 'https://sksoils.usask.ca/api/v2/sksoil/_table/soiland?filter=Mapunit_and_Modifier%20%3D%20' + mu.substr(0, mu.indexOf(':'));
        console.log(url)
        let options = this._headers.getBasicOptions();
        return this._http.get(url, options).map( res => {
            let result: DreamFactoryServerResponse = res.json();
            return result.resource.map( item => {
                return item.Soil_Landscape;
            });
        })
    }

}

@Injectable()
export class ThemeingService {
    constructor(
        public _headers: HeaderService,
        public _http: Http
    ){}

    public getColoursForTheme(theme:string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'X-DreamFactory-Api-Key': 'c88e24fad8856513273b98fb9751b3cbddd6f73d9e2ef24b92833c2d66587aa9'});

        let options = new RequestOptions({ headers: headers });


        if(theme == 'dominant_texture_classes'){
            theme = 'text_colours';
        }
        var uurl = 'https://sksoils.usask.ca/api/v2/sksoil/_table/' + theme + '?order=order%20ASC';


        let ooptions = this._headers.getBasicOptions()
        return this._http.get(uurl, ooptions).map(res => res.json(), err => console.log(err));
    }
}

@Injectable()
export class PolygonService {
    constructor(
        public _headers: HeaderService,
        public _http: Http
    ){}

    public getPolygonFeatureInfoForUrl(url) {
        return this._http.get(url).map( data => {
            return data.json();
        });
    }
}