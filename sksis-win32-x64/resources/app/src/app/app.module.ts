import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {AppComponent} from "./app";
import {LoginComponent} from "./login";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {ROUTES} from "./app.routes";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

// App views
import { MainViewModule } from "../views/main-view/main-view.module";
import { MinorViewModule } from "../views/minor-view/minor-view.module";
import { MapViewModule } from '../views/map/map-view.module'
import { LoginViewModule } from '../views/login/login-view.module'
import { UserRegisterModule } from '../views/users/user-register.module'

// App modules/components
import {NavigationModule} from '../views/common/navigation/navigation.module';
import {FooterModule} from '../views/common/footer/footer.module';
import {TopnavbarModule} from '../views/common/topnavbar/topnavbar.module';
import {FileSelectDirective, FileDropDirective, FileUploadModule} from 'ng2-file-upload'
import {AccountModule} from "../views/account/account.module";
import {ContactModule} from "../views/contact/contact.module";
import {GuideModule} from "../views/guide/guide.module";
import {SoilPitFormModule} from "ng2-soil-input-form";
import {FlashMessagesModule} from "angular2-flash-messages";
import {AckModule} from "../views/acknowledgments/ack.module";
import {DeveloperModule} from "../views/developer/developer.module";
import {ScrollModule} from "../custom_components/scroll/scroll.module";


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        FileSelectDirective,],
    imports     : [

        // Angular modules
        BrowserModule,
        HttpModule,

        // Views
        MainViewModule,
        MinorViewModule,
        MapViewModule,
        LoginViewModule,
        UserRegisterModule,
        AccountModule,
        ContactModule,
        GuideModule,
        AckModule,
        DeveloperModule,

        ScrollModule,

        // Modules
        NavigationModule,
        FooterModule,
        TopnavbarModule,
        FlashMessagesModule.forRoot(),

        RouterModule.forRoot(ROUTES)

    ],
    providers   : [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap   : [AppComponent]
})

export class AppModule {}
