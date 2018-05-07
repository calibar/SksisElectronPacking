"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const router_1 = require("@angular/router");
const navigation_component_1 = require("./navigation.component");
let NavigationModule = class NavigationModule {
};
NavigationModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [navigation_component_1.NavigationComponent],
        imports: [platform_browser_1.BrowserModule, router_1.RouterModule],
        exports: [navigation_component_1.NavigationComponent],
    })
], NavigationModule);
exports.NavigationModule = NavigationModule;
//# sourceMappingURL=navigation.module.js.map