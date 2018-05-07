"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const app_1 = require("./app");
const login_1 = require("./login");
const platform_browser_1 = require("@angular/platform-browser");
const http_1 = require("@angular/http");
const app_routes_1 = require("./app.routes");
const common_1 = require("@angular/common");
// App views
const main_view_module_1 = require("../views/main-view/main-view.module");
const minor_view_module_1 = require("../views/minor-view/minor-view.module");
const map_view_module_1 = require("../views/map/map-view.module");
const login_view_module_1 = require("../views/login/login-view.module");
const user_register_module_1 = require("../views/users/user-register.module");
// App modules/components
const navigation_module_1 = require("../views/common/navigation/navigation.module");
const footer_module_1 = require("../views/common/footer/footer.module");
const topnavbar_module_1 = require("../views/common/topnavbar/topnavbar.module");
const ng2_file_upload_1 = require("ng2-file-upload");
const account_module_1 = require("../views/account/account.module");
const contact_module_1 = require("../views/contact/contact.module");
const guide_module_1 = require("../views/guide/guide.module");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    core_1.NgModule({
        declarations: [app_1.AppComponent, login_1.LoginComponent, ng2_file_upload_1.FileSelectDirective],
        imports: [
            // Angular modules
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            // Views
            main_view_module_1.MainViewModule,
            minor_view_module_1.MinorViewModule,
            map_view_module_1.MapViewModule,
            login_view_module_1.LoginViewModule,
            user_register_module_1.UserRegisterModule,
            account_module_1.AccountModule,
            contact_module_1.ContactModule,
            guide_module_1.GuideModule,
            // Modules
            navigation_module_1.NavigationModule,
            footer_module_1.FooterModule,
            topnavbar_module_1.TopnavbarModule,
            router_1.RouterModule.forRoot(app_routes_1.ROUTES)
        ],
        providers: [{ provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy }],
        bootstrap: [app_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map