"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
const router_1 = require("@angular/router");
let accountComponent = class accountComponent {
    constructor(fb, _http, router) {
        this.fb = fb;
        this._http = _http;
        this.router = router;
        this.profile = {
            name: "",
            email: "",
        };
    }
    ngOnInit() {
        if (localStorage.getItem("session_token") == null) {
            this.router.navigate(['login']);
        }
        else {
            this.profile.name = localStorage.getItem('first_name');
            this.profile.email = localStorage.getItem('email');
        }
    }
};
accountComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'account',
        templateUrl: 'account.template.html'
    }),
    tslib_1.__metadata("design:paramtypes", [forms_1.FormBuilder, http_1.Http, router_1.Router])
], accountComponent);
exports.accountComponent = accountComponent;
//# sourceMappingURL=account.component.js.map