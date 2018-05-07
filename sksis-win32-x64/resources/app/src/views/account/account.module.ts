import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { accountComponent } from './account.component';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [accountComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: []
})

export class AccountModule {}