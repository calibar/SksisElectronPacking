"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const contact_component_1 = require("./contact.component");
const toolbox_module_1 = require("../../custom_components/toolbox/toolbox.module");
const forms_1 = require("@angular/forms");
let ContactModule = class ContactModule {
};
ContactModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [contact_component_1.contactComponent],
        imports: [
            platform_browser_1.BrowserModule,
            toolbox_module_1.ToolboxModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        exports: []
    })
], ContactModule);
exports.ContactModule = ContactModule;
//# sourceMappingURL=contact.module.js.map