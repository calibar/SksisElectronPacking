"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const map_view_component_1 = require("./map-view.component");
const toolbox_module_1 = require("../../custom_components/toolbox/toolbox.module");
const forms_1 = require("@angular/forms");
const querybox_module_1 = require("../../custom_components/querybox/querybox.module");
const soilinfobox_module_1 = require("../../custom_components/soilinfobox/soilinfobox.module");
const legend_module_1 = require("../../custom_components/legend/legend.module");
let MapViewModule = class MapViewModule {
};
MapViewModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [map_view_component_1.mapViewComponent],
        imports: [
            platform_browser_1.BrowserModule,
            toolbox_module_1.ToolboxModule,
            forms_1.FormsModule,
            querybox_module_1.QueryBoxModule,
            soilinfobox_module_1.SoilinfoboxModule,
            legend_module_1.LegendModule
        ],
        exports: []
    })
], MapViewModule);
exports.MapViewModule = MapViewModule;
//# sourceMappingURL=map-view.module.js.map