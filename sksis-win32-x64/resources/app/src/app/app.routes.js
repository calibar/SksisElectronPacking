"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_view_component_1 = require("../views/main-view/main-view.component");
const minor_view_component_1 = require("../views/minor-view/minor-view.component");
const map_view_component_1 = require("../views/map/map-view.component");
const login_view_component_1 = require("../views/login/login-view.component");
const user_register_component_1 = require("../views/users/user-register.component");
const account_component_1 = require("../views/account/account.component");
const contact_component_1 = require("../views/contact/contact.component");
const guide_component_1 = require("../views/guide/guide.component");
exports.ROUTES = [
    // Main redirect
    { path: '', redirectTo: 'map', pathMatch: 'full' },
    // App views
    { path: 'data', component: main_view_component_1.mainViewComponent },
    { path: 'minorView', component: minor_view_component_1.minorViewComponent },
    { path: 'map', component: map_view_component_1.mapViewComponent },
    { path: 'login', component: login_view_component_1.loginViewComponent },
    { path: 'userRegister', component: user_register_component_1.userRegisterComponent },
    { path: 'account', component: account_component_1.accountComponent },
    { path: 'contact', component: contact_component_1.contactComponent },
    { path: 'guide', component: guide_component_1.guideComponent },
    // Handle all other routes
    { path: '**', component: main_view_component_1.mainViewComponent }
];
//# sourceMappingURL=app.routes.js.map