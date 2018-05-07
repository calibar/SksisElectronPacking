import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import {ScrollComponent} from "./scroll.component";

@NgModule({
    declarations: [ScrollComponent],
    exports: [ScrollComponent],
    imports: [
        BrowserModule,
        CommonModule
    ]
})
export class ScrollModule {}