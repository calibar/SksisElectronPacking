import { NgModule } from '@angular/core';
import { LegendComponent } from "./legend.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [LegendComponent],
    exports: [LegendComponent],
    imports: [
        BrowserModule,
        CommonModule
    ]
})
export class LegendModule {}