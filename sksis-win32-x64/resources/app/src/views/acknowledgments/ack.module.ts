import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ToolboxModule} from "../../custom_components/toolbox/toolbox.module";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ackComponent } from "./ack.component";

@NgModule({
    declarations: [ackComponent],
    imports: [
        BrowserModule,
        ToolboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: []
})

export class AckModule {}