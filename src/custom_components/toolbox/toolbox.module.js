"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const toolbox_component_1 = require("./toolbox.component");
const forms_1 = require("@angular/forms");
const platform_browser_1 = require("@angular/platform-browser");
const primeng_1 = require("primeng/primeng");
let ToolboxModule = class ToolboxModule {
};
ToolboxModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [toolbox_component_1.ToolboxComponent],
        exports: [toolbox_component_1.ToolboxComponent],
        imports: [
            forms_1.ReactiveFormsModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            primeng_1.SliderModule
        ]
    })
], ToolboxModule);
exports.ToolboxModule = ToolboxModule;
//# sourceMappingURL=toolbox.module.js.map