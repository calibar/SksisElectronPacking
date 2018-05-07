import { NgModule } from '@angular/core';
import {ToolboxComponent} from "./toolbox.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {SliderModule} from 'primeng/primeng';


@NgModule({
    declarations: [ToolboxComponent],
    exports: [ToolboxComponent],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        SliderModule

    ]
})
export class ToolboxModule {
    val: number;
}