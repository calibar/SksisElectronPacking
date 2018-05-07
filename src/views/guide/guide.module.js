"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const guide_component_1 = require("./guide.component");
const toolbox_module_1 = require("../../custom_components/toolbox/toolbox.module");
const forms_1 = require("@angular/forms");
let GuideModule = class GuideModule {
};
GuideModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [guide_component_1.guideComponent],
        imports: [
            platform_browser_1.BrowserModule,
            toolbox_module_1.ToolboxModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        exports: []
    })
], GuideModule);
exports.GuideModule = GuideModule;
//# sourceMappingURL=guide.module.js.map