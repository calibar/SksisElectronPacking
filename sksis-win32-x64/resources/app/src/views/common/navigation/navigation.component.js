"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const services_1 = require("../../../services");
let NavigationComponent = class NavigationComponent {
    constructor(router, zone, _logout) {
        this.router = router;
        this.zone = zone;
        this._logout = _logout;
        this.zone.run(() => this.name = localStorage.getItem("first_name"));
    }
    ngOnInit() {
        this.currentlyLoggedIn = localStorage.getItem('session_token') != null;
        console.log('Currently logged: ' + this.currentlyLoggedIn);
    }
    logout() {
        this._logout.logout();
    }
    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();
    }
    activeRoute(routename) {
        return this.router.url.indexOf(routename) > -1;
    }
};
NavigationComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'navigation',
        templateUrl: 'navigation.template.html',
        providers: [services_1.LogoutService]
    }),
    tslib_1.__metadata("design:paramtypes", [router_1.Router,
        core_1.NgZone,
        services_1.LogoutService])
], NavigationComponent);
exports.NavigationComponent = NavigationComponent;
//# sourceMappingURL=navigation.component.js.map