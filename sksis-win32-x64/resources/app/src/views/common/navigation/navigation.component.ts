import {Component, Input, NgZone} from '@angular/core';
import { Router } from '@angular/router';
import {LogoutService} from "../../../services";

declare var jQuery:any;

@Component({
    selector: 'navigation',
    template: require('./navigation.template.html'),
    providers: [ LogoutService ]
})

export class NavigationComponent {

    currentlyLoggedIn: boolean;
    name: string;

    ngOnInit(): void {
        this.currentlyLoggedIn = localStorage.getItem('session_token') != null;

    }

    constructor(
        private router: Router,
        public zone: NgZone,
        private _logout: LogoutService
    ) {
        this.zone.run(() => this.name = localStorage.getItem("first_name"));
    }

    logout() {
        this._logout.logout();
    }

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();
    }

    activeRoute(routename: string): boolean{
        return this.router.url.indexOf(routename) > -1;
    }
}