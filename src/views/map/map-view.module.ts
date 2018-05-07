import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { mapViewComponent } from './map-view.component';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";
import {FormsModule} from "@angular/forms";
import {QueryBoxModule} from "../../custom_components/querybox/querybox.module";
import {SoilinfoboxModule} from "../../custom_components/soilinfobox/soilinfobox.module"
import {LegendModule} from "../../custom_components/legend/legend.module";
import {ScrollModule} from "../../custom_components/scroll/scroll.module";


@NgModule({
    declarations: [mapViewComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        QueryBoxModule,
        SoilinfoboxModule,
        LegendModule,
        ScrollModule
    ],
    exports: []
})

export class MapViewModule {}