"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const app_helpers_1 = require("./app.helpers");
// Core vendor styles
require("../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../node_modules/font-awesome/css/font-awesome.css");
require("../../node_modules/animate.css/animate.min.css");
// Main Inspinia CSS files
require("../../src/assets/styles/style.css");
let LoginComponent = class LoginComponent {
    ngAfterViewInit() {
        // Run correctHeight function on load and resize window event
        jQuery(window).bind("load resize", function () {
            app_helpers_1.correctHeight();
            app_helpers_1.detectBody();
        });
        // Correct height of wrapper after metisMenu animation.
        jQuery('.metismenu a').click(() => {
            setTimeout(() => {
                app_helpers_1.correctHeight();
            }, 300);
        });
    }
};
LoginComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'app',
        templateUrl: 'login.template.html',
    })
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.js.map