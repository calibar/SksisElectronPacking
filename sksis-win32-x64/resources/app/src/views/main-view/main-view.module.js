"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const main_view_component_1 = require("./main-view.component");
const forms_1 = require("@angular/forms");
const ng2_soil_input_form_1 = require("ng2-soil-input-form");
let MainViewModule = class MainViewModule {
};
MainViewModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [main_view_component_1.mainViewComponent],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            ng2_soil_input_form_1.SoilPitFormModule
        ]
    })
], MainViewModule);
exports.MainViewModule = MainViewModule;
//# sourceMappingURL=main-view.module.js.map