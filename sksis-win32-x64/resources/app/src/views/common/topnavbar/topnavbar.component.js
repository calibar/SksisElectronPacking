"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const app_helpers_1 = require("../../../app/app.helpers");
const services_1 = require("../../../services");
let TopnavbarComponent = class TopnavbarComponent {
    constructor(_logout) {
        this._logout = _logout;
        this.redrawMapEmitter = new core_1.EventEmitter();
    }
    ngOnInit() {
        this.currentlyLoggedIn = localStorage.getItem('session_token') != null;
        console.log('Currently logged: ' + this.currentlyLoggedIn);
    }
    toggleNavigation() {
        jQuery("body").toggleClass("mini-navbar");
        app_helpers_1.smoothlyMenu();
        this.redrawMapEmitter.emit();
    }
    logout() {
        this._logout.logout();
    }
    search() {
        console.log("Search");
    }
};
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], TopnavbarComponent.prototype, "redrawMapEmitter", void 0);
TopnavbarComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'topnavbar',
        templateUrl: 'topnavbar.template.html',
        providers: [services_1.LogoutService]
    }),
    tslib_1.__metadata("design:paramtypes", [services_1.LogoutService])
], TopnavbarComponent);
exports.TopnavbarComponent = TopnavbarComponent;
//# sourceMappingURL=topnavbar.component.js.map