import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { userRegisterComponent } from './user-register.component';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [userRegisterComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: []
})

export class UserRegisterModule {}