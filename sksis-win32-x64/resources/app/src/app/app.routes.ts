import { Routes } from "@angular/router";
import { mainViewComponent } from "../views/main-view/main-view.component";
import { minorViewComponent } from "../views/minor-view/minor-view.component";
import { mapViewComponent } from "../views/map/map-view.component";
import { loginViewComponent } from "../views/login/login-view.component";
import { userRegisterComponent } from "../views/users/user-register.component";
import { accountComponent } from "../views/account/account.component";
import { contactComponent } from "../views/contact/contact.component";
import { guideComponent } from "../views/guide/guide.component";
import { ackComponent } from "../views/acknowledgments/ack.component"
import {developerComponent} from "../views/developer/developer.component";

export const ROUTES: Routes = [
    // Main redirect
    { path: '', redirectTo: 'map', pathMatch: 'full' },

    // App views
    { path: 'data', component: mainViewComponent },
    { path: 'minorView', component: minorViewComponent },
    { path: 'map', component: mapViewComponent },
    { path: 'login', component: loginViewComponent },
    { path: 'register', component: userRegisterComponent },
    { path: 'account', component: accountComponent },
    { path: 'contact', component: contactComponent },
    { path: 'guide', component: guideComponent },
    { path: 'acknowledgments', component: ackComponent },
    { path: 'developer', component: developerComponent},

    // Handle all other routes
    { path: '**', component: mainViewComponent }
];
