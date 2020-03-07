"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_angular_1 = require("nativescript-angular");
var router_1 = require("nativescript-angular/router");
var routes = [
    {
        path: "",
        redirectTo: "/(homeTab:home/default//browseTab:browse/default//searchTab:search/default)",
        pathMatch: "full"
    },
    {
        path: "home",
        component: nativescript_angular_1.NSEmptyOutletComponent,
        loadChildren: "~/app/home/home.module#HomeModule",
        outlet: "homeTab"
    },
    {
        path: "browse",
        component: nativescript_angular_1.NSEmptyOutletComponent,
        loadChildren: "~/app/browse/browse.module#BrowseModule",
        outlet: "browseTab"
    },
    {
        path: "search",
        component: nativescript_angular_1.NSEmptyOutletComponent,
        loadChildren: "~/app/search/search.module#SearchModule",
        outlet: "searchTab"
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forRoot(routes)],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXJvdXRpbmcubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLXJvdXRpbmcubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlDO0FBRXpDLDZEQUE4RDtBQUM5RCxzREFBdUU7QUFFdkUsSUFBTSxNQUFNLEdBQVc7SUFDckI7UUFDRSxJQUFJLEVBQUUsRUFBRTtRQUNSLFVBQVUsRUFDUiw2RUFBNkU7UUFDL0UsU0FBUyxFQUFFLE1BQU07S0FDbEI7SUFFRDtRQUNFLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLDZDQUFzQjtRQUNqQyxZQUFZLEVBQUUsbUNBQW1DO1FBQ2pELE1BQU0sRUFBRSxTQUFTO0tBQ2xCO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsUUFBUTtRQUNkLFNBQVMsRUFBRSw2Q0FBc0I7UUFDakMsWUFBWSxFQUFFLHlDQUF5QztRQUN2RCxNQUFNLEVBQUUsV0FBVztLQUNwQjtJQUNEO1FBQ0UsSUFBSSxFQUFFLFFBQVE7UUFDZCxTQUFTLEVBQUUsNkNBQXNCO1FBQ2pDLFlBQVksRUFBRSx5Q0FBeUM7UUFDdkQsTUFBTSxFQUFFLFdBQVc7S0FDcEI7Q0FDRixDQUFDO0FBTUY7SUFBQTtJQUErQixDQUFDO0lBQW5CLGdCQUFnQjtRQUo1QixlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxpQ0FBd0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsT0FBTyxFQUFFLENBQUMsaUNBQXdCLENBQUM7U0FDcEMsQ0FBQztPQUNXLGdCQUFnQixDQUFHO0lBQUQsdUJBQUM7Q0FBQSxBQUFoQyxJQUFnQztBQUFuQiw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgTlNFbXB0eU91dGxldENvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcblxyXG5jb25zdCByb3V0ZXM6IFJvdXRlcyA9IFtcclxuICB7XHJcbiAgICBwYXRoOiBcIlwiLFxyXG4gICAgcmVkaXJlY3RUbzpcclxuICAgICAgXCIvKGhvbWVUYWI6aG9tZS9kZWZhdWx0Ly9icm93c2VUYWI6YnJvd3NlL2RlZmF1bHQvL3NlYXJjaFRhYjpzZWFyY2gvZGVmYXVsdClcIixcclxuICAgIHBhdGhNYXRjaDogXCJmdWxsXCJcclxuICB9LFxyXG5cclxuICB7XHJcbiAgICBwYXRoOiBcImhvbWVcIixcclxuICAgIGNvbXBvbmVudDogTlNFbXB0eU91dGxldENvbXBvbmVudCxcclxuICAgIGxvYWRDaGlsZHJlbjogXCJ+L2FwcC9ob21lL2hvbWUubW9kdWxlI0hvbWVNb2R1bGVcIixcclxuICAgIG91dGxldDogXCJob21lVGFiXCJcclxuICB9LFxyXG4gIHtcclxuICAgIHBhdGg6IFwiYnJvd3NlXCIsXHJcbiAgICBjb21wb25lbnQ6IE5TRW1wdHlPdXRsZXRDb21wb25lbnQsXHJcbiAgICBsb2FkQ2hpbGRyZW46IFwifi9hcHAvYnJvd3NlL2Jyb3dzZS5tb2R1bGUjQnJvd3NlTW9kdWxlXCIsXHJcbiAgICBvdXRsZXQ6IFwiYnJvd3NlVGFiXCJcclxuICB9LFxyXG4gIHtcclxuICAgIHBhdGg6IFwic2VhcmNoXCIsXHJcbiAgICBjb21wb25lbnQ6IE5TRW1wdHlPdXRsZXRDb21wb25lbnQsXHJcbiAgICBsb2FkQ2hpbGRyZW46IFwifi9hcHAvc2VhcmNoL3NlYXJjaC5tb2R1bGUjU2VhcmNoTW9kdWxlXCIsXHJcbiAgICBvdXRsZXQ6IFwic2VhcmNoVGFiXCJcclxuICB9XHJcbl07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpXSxcclxuICBleHBvcnRzOiBbTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwUm91dGluZ01vZHVsZSB7fVxyXG4iXX0=