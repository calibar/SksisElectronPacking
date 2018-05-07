import { NgModule } from '@angular/core';
import { QueryBoxComponent } from "./querybox.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import {TooltipModule} from "ngx-tooltip";

@NgModule({
    declarations: [QueryBoxComponent],
    exports: [QueryBoxComponent],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        CommonModule,
        TooltipModule
    ]
})
export class QueryBoxModule {}