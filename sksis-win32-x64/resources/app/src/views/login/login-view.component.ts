import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Result } from '../Result';
import { Router } from '@angular/router';
import {ErrorMessage} from "../../custom_components/ErrorMessage";
import {HeaderService, LoginService} from '../../services';

@Component({
    selector: 'loginView',
    template: require('./login-view.template.html'),
    providers: [ LoginService, HeaderService ]
})
export class loginViewComponent {

    public result: Result;
    public error: ErrorMessage;

    public loginForm = this.fb.group({
        email: ["", Validators.required],
        password: ["", Validators.required]
    });

    constructor(
        public fb: FormBuilder,
        public _http: Http,
        private router: Router,
        private _login: LoginService

    ) { }

    ngOnInit(): void {
        console.log("TESTING LOGIN.");
    }

    login(event) {
        this._login.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
            loginResult => {
                this.router.navigate(['map']);
                window.location.reload();
            },
            err => {
                alert("Invalid username or password");
                this.loginForm.reset({email: this.loginForm.value.email});
            }
        );
    }
}