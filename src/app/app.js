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
const services_1 = require("../services");
let AppComponent = class AppComponent {
    constructor(redrawService) {
        this.redrawService = redrawService;
    }
    ngAfterViewInit() {
        console.log("testing application");
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
    redraw() {
        this.redrawService.announceRedraw();
    }
};
AppComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'app',
        templateUrl: 'app.template.html',
        providers: [services_1.RedrawService]
    }),
    tslib_1.__metadata("design:paramtypes", [services_1.RedrawService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.js.map