import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
@Component({
    selector: 'account',
    template: require('./account.template.html')
})
export class accountComponent  implements OnInit {
    constructor(public fb: FormBuilder, public _http: Http, private router: Router) { }

    profile={
        name:"",
        email:"",
    };
    contributions;

    ngOnInit(): void {
        if(localStorage.getItem("session_token")==null){
            this.router.navigate(['login']);
        } else {
            this.profile.name = localStorage.getItem('first_name');
            this.profile.email = localStorage.getItem('email');
        }

    }
}