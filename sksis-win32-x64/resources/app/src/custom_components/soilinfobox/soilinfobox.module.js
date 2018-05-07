"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const soilinfobox_component_1 = require("./soilinfobox.component");
const ng2_charts_1 = require("ng2-charts");
const doughnutchart_module_1 = require("../doughnutchart/doughnutchart.module");
let SoilinfoboxModule = class SoilinfoboxModule {
};
SoilinfoboxModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [soilinfobox_component_1.SoilinfoboxComponent],
        exports: [soilinfobox_component_1.SoilinfoboxComponent],
        imports: [platform_browser_1.BrowserModule, ng2_charts_1.ChartsModule, doughnutchart_module_1.DoughnutchartModule]
    })
], SoilinfoboxModule);
exports.SoilinfoboxModule = SoilinfoboxModule;
//# sourceMappingURL=soilinfobox.module.js.map