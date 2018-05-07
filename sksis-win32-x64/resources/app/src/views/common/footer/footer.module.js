"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const footer_component_1 = require("./footer.component");
let FooterModule = class FooterModule {
};
FooterModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [footer_component_1.FooterComponent],
        imports: [platform_browser_1.BrowserModule],
        exports: [footer_component_1.FooterComponent],
    })
], FooterModule);
exports.FooterModule = FooterModule;
//# sourceMappingURL=footer.module.js.map