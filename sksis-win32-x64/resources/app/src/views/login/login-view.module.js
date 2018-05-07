"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const login_view_component_1 = require("./login-view.component");
const toolbox_module_1 = require("../../custom_components/toolbox/toolbox.module");
const forms_1 = require("@angular/forms");
let LoginViewModule = class LoginViewModule {
};
LoginViewModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [login_view_component_1.loginViewComponent],
        imports: [
            platform_browser_1.BrowserModule,
            toolbox_module_1.ToolboxModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        exports: []
    })
], LoginViewModule);
exports.LoginViewModule = LoginViewModule;
//# sourceMappingURL=login-view.module.js.map