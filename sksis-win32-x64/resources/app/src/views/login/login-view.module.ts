import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { loginViewComponent } from './login-view.component';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [loginViewComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: []
})

export class LoginViewModule {}