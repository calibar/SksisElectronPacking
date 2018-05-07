import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { developerComponent} from './developer.component';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {UserRegisterModule} from "../users/user-register.module";

@NgModule({
    declarations: [developerComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: []
})

export class DeveloperModule {}