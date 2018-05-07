import {Component, Output, EventEmitter} from '@angular/core';
import { smoothlyMenu } from '../../../app/app.helpers';
import {mapViewComponent} from "../../map/map-view.component";
import {LogoutService} from "../../../services";

declare var jQuery:any;

@Component({
    selector: 'topnavbar',
    template: require('./topnavbar.template.html'),
    providers: [ LogoutService ]
})
export class TopnavbarComponent {

    currentlyLoggedIn: boolean;

    @Output() redrawMapEmitter = new EventEmitter();

    ngOnInit(): void {
        this.currentlyLoggedIn = localStorage.getItem('session_token') != null;
    }

    constructor(private _logout: LogoutService) { }

    toggleNavigation(): void {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
        this.redrawMapEmitter.emit()
    }

    logout() {
        this._logout.logout();
    }

    search(){
        console.log("Search");
    }

}