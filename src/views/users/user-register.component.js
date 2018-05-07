"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
const router_1 = require("@angular/router");
const user_model_1 = require("./user-model");
const services_1 = require("../../services");
let userRegisterComponent = class userRegisterComponent {
    constructor(fb, _http, _router, _register, _login) {
        this.fb = fb;
        this._http = _http;
        this._router = _router;
        this._register = _register;
        this._login = _login;
        this.user = new user_model_1.User();
        this.userRegisterForm = this.fb.group({
            first_name: ['', forms_1.Validators.required],
            last_name: ['', forms_1.Validators.required],
            email: ['', forms_1.Validators.required],
            password: ['', forms_1.Validators.required]
        });
    }
    ngOnInit() { }
    register(event) {
        this._register.register(this.userRegisterForm.value.first_name, this.userRegisterForm.value.first_name, this.userRegisterForm.value.last_name, this.userRegisterForm.value.email, this.userRegisterForm.value.password).subscribe(res => {
            console.log(res);
            if (res.ok === false) {
                console.log("Error logging in, server not responding");
            }
            else {
                console.log("Successfully created new user");
                this._login.login(this.userRegisterForm.value.email, this.userRegisterForm.value.password).subscribe(loginResult => {
                    this._router.navigate(['map']);
                    window.location.reload();
                }, err => {
                    console.log("error logging in automatically ");
                    this._router.navigate(['login']);
                });
            }
        }, err => {
            console.log(err);
        });
    }
};
userRegisterComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'userRegister',
        templateUrl: 'user-register.template.html',
        providers: [services_1.RegisterService, services_1.LoginService, services_1.HeaderService]
    }),
    tslib_1.__metadata("design:paramtypes", [forms_1.FormBuilder,
        http_1.Http,
        router_1.Router,
        services_1.RegisterService,
        services_1.LoginService])
], userRegisterComponent);
exports.userRegisterComponent = userRegisterComponent;
//# sourceMappingURL=user-register.component.js.map