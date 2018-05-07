import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Http, URLSearchParams, Headers, Response, RequestOptions } from '@angular/http';
import { Result } from '../Result';
import { RouterModule } from "@angular/router";
import { Router } from '@angular/router';
import { ErrorMessage } from "../../custom_components/ErrorMessage";
import { User } from "./user-model";
import { loginViewComponent } from '../login/login-view.component';
import {HeaderService, LoginService, RegisterService} from "../../services";

@Component({
    selector: 'userRegister',
    template: require('./user-register.template.html'),
    styleUrls: ['/views/users/user.style.css'],
    providers: [ RegisterService, LoginService, HeaderService ]
})
export class userRegisterComponent {

    public result;
    private error: ErrorMessage;
    private user: User = new User();

    public userRegisterForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
    });

    constructor(
        public fb: FormBuilder,
        public _http: Http,
        private _router: Router,
        private _register: RegisterService,
        private _login: LoginService
    ) { }

    ngOnInit(): void { }

    register(event){

        this._register.register(
            this.userRegisterForm.value.first_name,
            this.userRegisterForm.value.first_name,
            this.userRegisterForm.value.last_name,
            this.userRegisterForm.value.email,
            this.userRegisterForm.value.password
        ).subscribe(
            res => {
                console.log(res);
                if (res.ok === false) {
                    console.log("Error logging in, server not responding");
                } else {
                    console.log("Successfully created new user");

                    this._login.login(
                        this.userRegisterForm.value.email,
                        this.userRegisterForm.value.password
                    ).subscribe(
                        loginResult => {
                            this._router.navigate(['map']);
                            window.location.reload();
                        },
                        err => {
                            console.log("error logging in automatically ");
                            this._router.navigate(['login'])
                        }
                    )
                }


            },
            err => {
                console.log(err);
            }
        )
    }
}
