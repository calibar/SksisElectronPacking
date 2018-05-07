"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const ng2_charts_1 = require("ng2-charts");
const doughtnutchart_component_1 = require("./doughtnutchart.component");
let DoughnutchartModule = class DoughnutchartModule {
};
DoughnutchartModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [doughtnutchart_component_1.DoughnutChartComponent],
        exports: [doughtnutchart_component_1.DoughnutChartComponent],
        imports: [platform_browser_1.BrowserModule, ng2_charts_1.ChartsModule]
    })
], DoughnutchartModule);
exports.DoughnutchartModule = DoughnutchartModule;
//# sourceMappingURL=doughnutchart.module.js.map