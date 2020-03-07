"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("nativescript-angular/common");
var home_routing_module_1 = require("./home-routing.module");
var home_component_1 = require("./home.component");
var item_detail_component_1 = require("./item-detail/item-detail.component");
var HomeModule = /** @class */ (function () {
    function HomeModule() {
    }
    HomeModule = __decorate([
        core_1.NgModule({
            imports: [common_1.NativeScriptCommonModule, home_routing_module_1.HomeRoutingModule],
            declarations: [home_component_1.HomeComponent, item_detail_component_1.ItemDetailComponent],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        })
    ], HomeModule);
    return HomeModule;
}());
exports.HomeModule = HomeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyRDtBQUMzRCxzREFBdUU7QUFFdkUsNkRBQTBEO0FBQzFELG1EQUFpRDtBQUNqRCw2RUFBMEU7QUFPMUU7SUFBQTtJQUF5QixDQUFDO0lBQWIsVUFBVTtRQUx0QixlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxpQ0FBd0IsRUFBRSx1Q0FBaUIsQ0FBQztZQUN0RCxZQUFZLEVBQUUsQ0FBQyw4QkFBYSxFQUFFLDJDQUFtQixDQUFDO1lBQ2xELE9BQU8sRUFBRSxDQUFDLHVCQUFnQixDQUFDO1NBQzVCLENBQUM7T0FDVyxVQUFVLENBQUc7SUFBRCxpQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdENvbW1vbk1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9jb21tb25cIjtcclxuXHJcbmltcG9ydCB7IEhvbWVSb3V0aW5nTW9kdWxlIH0gZnJvbSBcIi4vaG9tZS1yb3V0aW5nLm1vZHVsZVwiO1xyXG5pbXBvcnQgeyBIb21lQ29tcG9uZW50IH0gZnJvbSBcIi4vaG9tZS5jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgSXRlbURldGFpbENvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0tZGV0YWlsL2l0ZW0tZGV0YWlsLmNvbXBvbmVudFwiO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbTmF0aXZlU2NyaXB0Q29tbW9uTW9kdWxlLCBIb21lUm91dGluZ01vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbSG9tZUNvbXBvbmVudCwgSXRlbURldGFpbENvbXBvbmVudF0sXHJcbiAgc2NoZW1hczogW05PX0VSUk9SU19TQ0hFTUFdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIb21lTW9kdWxlIHt9XHJcbiJdfQ==