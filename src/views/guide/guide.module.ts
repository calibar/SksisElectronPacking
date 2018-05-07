import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { guideComponent } from './guide.component';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [guideComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: []
})

export class GuideModule {}