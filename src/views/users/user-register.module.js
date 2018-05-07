"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const user_register_component_1 = require("./user-register.component");
const toolbox_module_1 = require("../../custom_components/toolbox/toolbox.module");
const forms_1 = require("@angular/forms");
let UserRegisterModule = class UserRegisterModule {
};
UserRegisterModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [user_register_component_1.userRegisterComponent],
        imports: [
            platform_browser_1.BrowserModule,
            toolbox_module_1.ToolboxModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        exports: []
    })
], UserRegisterModule);
exports.UserRegisterModule = UserRegisterModule;
//# sourceMappingURL=user-register.module.js.map