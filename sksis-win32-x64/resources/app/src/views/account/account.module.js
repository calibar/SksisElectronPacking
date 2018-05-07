"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const account_component_1 = require("./account.component");
const toolbox_module_1 = require("../../custom_components/toolbox/toolbox.module");
const forms_1 = require("@angular/forms");
let AccountModule = class AccountModule {
};
AccountModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [account_component_1.accountComponent],
        imports: [
            platform_browser_1.BrowserModule,
            toolbox_module_1.ToolboxModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        exports: []
    })
], AccountModule);
exports.AccountModule = AccountModule;
//# sourceMappingURL=account.module.js.map