"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var data_service_1 = require("../../shared/data.service");
var ItemDetailComponent = /** @class */ (function () {
    function ItemDetailComponent(_data, _route, _routerExtensions) {
        this._data = _data;
        this._route = _route;
        this._routerExtensions = _routerExtensions;
    }
    ItemDetailComponent.prototype.ngOnInit = function () {
        var id = this._route.snapshot.params.id;
        this.item = this._data.getItem(id);
        this.item.created_at = new Date(this.item.created_at).toLocaleDateString("pl-PL");
    };
    ItemDetailComponent.prototype.onBackTap = function () {
        this._routerExtensions.back();
    };
    ItemDetailComponent = __decorate([
        core_1.Component({
            selector: "ItemDetail",
            moduleId: module.id,
            templateUrl: "./item-detail.component.html"
        }),
        __metadata("design:paramtypes", [data_service_1.DataService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions])
    ], ItemDetailComponent);
    return ItemDetailComponent;
}());
exports.ItemDetailComponent = ItemDetailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS1kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS1kZXRhaWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFDL0QsMERBQW1FO0FBT25FO0lBR0UsNkJBQ1UsS0FBa0IsRUFDbEIsTUFBc0IsRUFDdEIsaUJBQW1DO1FBRm5DLFVBQUssR0FBTCxLQUFLLENBQWE7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDdEIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtJQUMxQyxDQUFDO0lBRUosc0NBQVEsR0FBUjtRQUNFLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGtCQUFrQixDQUN0RSxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFRCx1Q0FBUyxHQUFUO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFuQlUsbUJBQW1CO1FBTC9CLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLDhCQUE4QjtTQUM1QyxDQUFDO3lDQUtpQiwwQkFBVztZQUNWLHVCQUFjO1lBQ0gseUJBQWdCO09BTmxDLG1CQUFtQixDQW9CL0I7SUFBRCwwQkFBQztDQUFBLEFBcEJELElBb0JDO0FBcEJZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBJRGF0YUl0ZW0gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2RhdGEuc2VydmljZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiSXRlbURldGFpbFwiLFxyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgdGVtcGxhdGVVcmw6IFwiLi9pdGVtLWRldGFpbC5jb21wb25lbnQuaHRtbFwiXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJdGVtRGV0YWlsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBpdGVtOiBJRGF0YUl0ZW07XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBfZGF0YTogRGF0YVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICBwcml2YXRlIF9yb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zXHJcbiAgKSB7fVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGlkID0gdGhpcy5fcm91dGUuc25hcHNob3QucGFyYW1zLmlkO1xyXG4gICAgdGhpcy5pdGVtID0gdGhpcy5fZGF0YS5nZXRJdGVtKGlkKTtcclxuICAgIHRoaXMuaXRlbS5jcmVhdGVkX2F0ID0gbmV3IERhdGUodGhpcy5pdGVtLmNyZWF0ZWRfYXQpLnRvTG9jYWxlRGF0ZVN0cmluZyhcclxuICAgICAgXCJwbC1QTFwiXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25CYWNrVGFwKCk6IHZvaWQge1xyXG4gICAgdGhpcy5fcm91dGVyRXh0ZW5zaW9ucy5iYWNrKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==