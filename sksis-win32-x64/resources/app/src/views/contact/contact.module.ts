import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { contactComponent } from './contact.component';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [contactComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: []
})

export class ContactModule {}