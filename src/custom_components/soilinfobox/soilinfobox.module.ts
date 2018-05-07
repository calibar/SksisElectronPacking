import { NgModule } from'@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {SoilinfoboxComponent} from './soilinfobox.component'
import {ChartsModule} from "ng2-charts";
import {DoughnutchartModule} from "../doughnutchart/doughnutchart.module";

@NgModule({
    declarations: [SoilinfoboxComponent],
    exports: [SoilinfoboxComponent],
    imports: [BrowserModule, ChartsModule, DoughnutchartModule]
})
export class SoilinfoboxModule {}