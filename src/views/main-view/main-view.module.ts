import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { mainViewComponent } from './main-view.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SoilPitFormModule} from "ng2-soil-input-form";


@NgModule({
    declarations: [mainViewComponent],
    imports     : [ 
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        SoilPitFormModule,
        ]

})
export class MainViewModule {}