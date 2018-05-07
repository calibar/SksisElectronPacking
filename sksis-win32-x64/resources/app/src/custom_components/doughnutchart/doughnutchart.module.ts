import { NgModule } from'@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {ChartsModule} from "ng2-charts";
import {DoughnutChartComponent} from "./doughtnutchart.component";

@NgModule({
    declarations: [DoughnutChartComponent],
    exports: [DoughnutChartComponent],
    imports: [BrowserModule, ChartsModule]
})
export class DoughnutchartModule {}