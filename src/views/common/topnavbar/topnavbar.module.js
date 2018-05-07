"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const topnavbar_component_1 = require("./topnavbar.component");
let TopnavbarModule = class TopnavbarModule {
};
TopnavbarModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [topnavbar_component_1.TopnavbarComponent],
        imports: [platform_browser_1.BrowserModule],
        exports: [topnavbar_component_1.TopnavbarComponent],
    })
], TopnavbarModule);
exports.TopnavbarModule = TopnavbarModule;
//# sourceMappingURL=topnavbar.module.js.map