"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const legend_component_1 = require("./legend.component");
const platform_browser_1 = require("@angular/platform-browser");
const common_1 = require("@angular/common");
let LegendModule = class LegendModule {
};
LegendModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [legend_component_1.LegendComponent],
        exports: [legend_component_1.LegendComponent],
        imports: [
            platform_browser_1.BrowserModule,
            common_1.CommonModule
        ]
    })
], LegendModule);
exports.LegendModule = LegendModule;
//# sourceMappingURL=legend.module.js.map