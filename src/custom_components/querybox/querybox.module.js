"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const querybox_component_1 = require("./querybox.component");
const forms_1 = require("@angular/forms");
const platform_browser_1 = require("@angular/platform-browser");
const common_1 = require("@angular/common");
let QueryBoxModule = class QueryBoxModule {
};
QueryBoxModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [querybox_component_1.QueryBoxComponent],
        exports: [querybox_component_1.QueryBoxComponent],
        imports: [
            forms_1.ReactiveFormsModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            common_1.CommonModule
        ]
    })
], QueryBoxModule);
exports.QueryBoxModule = QueryBoxModule;
//# sourceMappingURL=querybox.module.js.map