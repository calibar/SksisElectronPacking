"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const minor_view_component_1 = require("./minor-view.component");
let MinorViewModule = class MinorViewModule {
};
MinorViewModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [minor_view_component_1.minorViewComponent],
        imports: [platform_browser_1.BrowserModule],
    })
], MinorViewModule);
exports.MinorViewModule = MinorViewModule;
//# sourceMappingURL=minor-view.module.js.map