"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
const router_1 = require("@angular/router");
const services_1 = require("../../services");
let loginViewComponent = class loginViewComponent {
    constructor(fb, _http, router, _login) {
        this.fb = fb;
        this._http = _http;
        this.router = router;
        this._login = _login;
        this.loginForm = this.fb.group({
            email: ["", forms_1.Validators.required],
            password: ["", forms_1.Validators.required]
        });
    }
    ngOnInit() {
        console.log("TESTING LOGIN.");
    }
    login(event) {
        this._login.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(loginResult => {
            this.router.navigate(['map']);
            window.location.reload();
        }, err => {
            alert("Invalid username or password");
            this.loginForm.reset({ email: this.loginForm.value.email });
        });
    }
};
loginViewComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'loginView',
        templateUrl: 'login-view.template.html',
        providers: [services_1.LoginService, services_1.HeaderService]
    }),
    tslib_1.__metadata("design:paramtypes", [forms_1.FormBuilder,
        http_1.Http,
        router_1.Router,
        services_1.LoginService])
], loginViewComponent);
exports.loginViewComponent = loginViewComponent;
//# sourceMappingURL=login-view.component.js.map