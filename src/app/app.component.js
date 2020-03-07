"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_1 = require("tns-core-modules/platform");
var data_service_1 = require("~/app/shared/data.service");
var trace_writer_service_1 = require("~/app/shared/trace-writer.service");
var database_service_1 = require("~/app/shared/database.service");
var nativescript_email_1 = require("nativescript-email");
var AppComponent = /** @class */ (function () {
    function AppComponent(dataService, traceWriterService, databaseService) {
        this.dataService = dataService;
        this.traceWriterService = traceWriterService;
        this.databaseService = databaseService;
        // Use the component constructor to inject providers.
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.traceWriterService.subscribe(function (_a) {
            var message = _a.message, date = _a.date, category = _a.category, messageType = _a.messageType;
            _this.databaseService.insertLogs(date, message, messageType, category);
        });
    };
    AppComponent.prototype.sendLogs = function () {
        this.databaseService.getLogs().subscribe(function (a) {
            var aMaped = a.map(function (b) {
                return b.reduce(function (prev, next) { return prev + next; }, "");
            });
            var aReduced = aMaped.reduce(function (b) { return b + "\r\n"; }, "");
            nativescript_email_1.compose({
                subject: "Debug med-link-ui",
                body: aReduced,
                to: ["jrkf@o2.pl"]
            });
        });
    };
    AppComponent.prototype.getIconSource = function (icon) {
        var iconPrefix = platform_1.isAndroid ? "res://" : "res://tabIcons/";
        return iconPrefix + icon;
    };
    AppComponent.prototype.onSelectedIndexChanged = function (event) {
        if (event.newIndex === 0) {
            this.dataService.reloadData();
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "ns-app",
            moduleId: module.id,
            templateUrl: "app.component.html",
            styleUrls: ["./app.component.scss"]
        }),
        __metadata("design:paramtypes", [data_service_1.DataService,
            trace_writer_service_1.TraceWriterService,
            database_service_1.DatabaseService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFFbEQsc0RBQXNEO0FBQ3RELDBEQUF3RDtBQUN4RCwwRUFBdUU7QUFDdkUsa0VBQWdFO0FBRWhFLHlEQUE2QztBQVE3QztJQUNFLHNCQUNTLFdBQXdCLEVBQ3hCLGtCQUFzQyxFQUN0QyxlQUFnQztRQUZoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUV2QyxxREFBcUQ7SUFDdkQsQ0FBQztJQUVELCtCQUFRLEdBQVI7UUFBQSxpQkFNQztRQUxDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQy9CLFVBQUMsRUFBd0M7Z0JBQXRDLG9CQUFPLEVBQUUsY0FBSSxFQUFFLHNCQUFRLEVBQUUsNEJBQVc7WUFDckMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEUsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsK0JBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUN4QyxJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLElBQUksSUFBSyxPQUFBLElBQUksR0FBRyxJQUFJLEVBQVgsQ0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsR0FBRyxNQUFNLEVBQVYsQ0FBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXBELDRCQUFPLENBQUM7Z0JBQ04sT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDO2FBQ25CLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9DQUFhLEdBQWIsVUFBYyxJQUFZO1FBQ3hCLElBQU0sVUFBVSxHQUFHLG9CQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7UUFFNUQsT0FBTyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFFRCw2Q0FBc0IsR0FBdEIsVUFDRSxLQUF5RDtRQUV6RCxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBN0NVLFlBQVk7UUFOeEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO1NBQ3BDLENBQUM7eUNBR3NCLDBCQUFXO1lBQ0oseUNBQWtCO1lBQ3JCLGtDQUFlO09BSjlCLFlBQVksQ0E4Q3hCO0lBQUQsbUJBQUM7Q0FBQSxBQTlDRCxJQThDQztBQTlDWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7IGlzQW5kcm9pZCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlIH0gZnJvbSBcIn4vYXBwL3NoYXJlZC9kYXRhLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgVHJhY2VXcml0ZXJTZXJ2aWNlIH0gZnJvbSBcIn4vYXBwL3NoYXJlZC90cmFjZS13cml0ZXIuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBEYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwifi9hcHAvc2hhcmVkL2RhdGFiYXNlLnNlcnZpY2VcIjtcclxuXHJcbmltcG9ydCB7IGNvbXBvc2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWVtYWlsXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJucy1hcHBcIixcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHRlbXBsYXRlVXJsOiBcImFwcC5jb21wb25lbnQuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wiLi9hcHAuY29tcG9uZW50LnNjc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLFxyXG4gICAgcHVibGljIHRyYWNlV3JpdGVyU2VydmljZTogVHJhY2VXcml0ZXJTZXJ2aWNlLFxyXG4gICAgcHVibGljIGRhdGFiYXNlU2VydmljZTogRGF0YWJhc2VTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICAvLyBVc2UgdGhlIGNvbXBvbmVudCBjb25zdHJ1Y3RvciB0byBpbmplY3QgcHJvdmlkZXJzLlxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYWNlV3JpdGVyU2VydmljZS5zdWJzY3JpYmUoXHJcbiAgICAgICh7IG1lc3NhZ2UsIGRhdGUsIGNhdGVnb3J5LCBtZXNzYWdlVHlwZSB9KSA9PiB7XHJcbiAgICAgICAgdGhpcy5kYXRhYmFzZVNlcnZpY2UuaW5zZXJ0TG9ncyhkYXRlLCBtZXNzYWdlLCBtZXNzYWdlVHlwZSwgY2F0ZWdvcnkpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc2VuZExvZ3MoKSB7XHJcbiAgICB0aGlzLmRhdGFiYXNlU2VydmljZS5nZXRMb2dzKCkuc3Vic2NyaWJlKGEgPT4ge1xyXG4gICAgICBjb25zdCBhTWFwZWQgPSBhLm1hcChiID0+IHtcclxuICAgICAgICByZXR1cm4gYi5yZWR1Y2UoKHByZXYsIG5leHQpID0+IHByZXYgKyBuZXh0LCBcIlwiKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBhUmVkdWNlZCA9IGFNYXBlZC5yZWR1Y2UoYiA9PiBiICsgXCJcXHJcXG5cIiwgXCJcIik7XHJcblxyXG4gICAgICBjb21wb3NlKHtcclxuICAgICAgICBzdWJqZWN0OiBcIkRlYnVnIG1lZC1saW5rLXVpXCIsXHJcbiAgICAgICAgYm9keTogYVJlZHVjZWQsXHJcbiAgICAgICAgdG86IFtcImpya2ZAbzIucGxcIl1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEljb25Tb3VyY2UoaWNvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGljb25QcmVmaXggPSBpc0FuZHJvaWQgPyBcInJlczovL1wiIDogXCJyZXM6Ly90YWJJY29ucy9cIjtcclxuXHJcbiAgICByZXR1cm4gaWNvblByZWZpeCArIGljb247XHJcbiAgfVxyXG5cclxuICBvblNlbGVjdGVkSW5kZXhDaGFuZ2VkKFxyXG4gICAgZXZlbnQ6IEV2ZW50RGF0YSAmIHsgb2xkSW5kZXg6IG51bWJlcjsgbmV3SW5kZXg6IG51bWJlciB9XHJcbiAgKSB7XHJcbiAgICBpZiAoZXZlbnQubmV3SW5kZXggPT09IDApIHtcclxuICAgICAgdGhpcy5kYXRhU2VydmljZS5yZWxvYWREYXRhKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==