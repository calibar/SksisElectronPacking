import { Component } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {APIService} from "../Services";
import {HeaderService, LoginService, RegisterService, SectionCoordinateService, ThemeingService} from "../../services";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import { ChangeDetectorRef } from "@angular/core";


@Component({
    selector: 'contact',
    template: require('./developer.template.html'),
    providers: [RegisterService, LoginService, HeaderService]
})
export class developerComponent {

    html;
    serviceRoleData:object = {};
    roleString:string = '';
    dataLoaded:boolean = false;


    constructor(
        private sanitized: DomSanitizer,
        private router: Router,
        private _apiService: RegisterService,
        private _change: ChangeDetectorRef){


        this.html = `
var polygonLayer = new ol.layer.Image({
  source: new ol.source.ImageWMS({
      ratio: 1,
      url: 'https://sksoilgis1.usask.ca:443/geoserver/sksoil/wms',
      params: {
          'FORMAT': 'img/png',
          'VERSION': '1.1.1',
          STYLES: '',
          LAYERS: 'sksoil:polygon_theme',
      }
  })
});`;

        this.html = this.sanitized.bypassSecurityTrustHtml(this.html);

        if(localStorage.getItem("email")){
            this.checkAccess();
        }
    }

    ngOnInit(): void {
        this.dataLoaded = false;
        if(localStorage.getItem("session_token")==null) {
            this.router.navigate(['login']);
        }

        //window.setInterval( ()=> {this.roleString = Date.now().toString(), 1000})
    }

    requestApiAccess(event) {
        this._apiService.giveRolesToAccount();
        // this.roleString = 'changed'
        // this._change.detectChanges();
        this.checkAccess();
        window.setTimeout( () => { this.checkAccess()}, 400);
    }

    checkAccess() {
        Observable.forkJoin(
            this._apiService.getAllSystemSevices(),
            this._apiService.getListOfAllRoles(),
            this._apiService.checkRolesOfAccount()
        ).subscribe( data => {
            console.log(data)

            data[2].forEach( x => {
                this.roleString = data[1][x.role_id - 1].name + ' on ' + data[0][x.app_id -1].name
            });

            this.serviceRoleData = data;
            this.dataLoaded = true;
        });

        //this._change.detectChanges();
    }
}