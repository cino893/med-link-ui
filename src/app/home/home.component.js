"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var data_service_1 = require("../shared/data.service");
var database_service_1 = require("~/app/shared/database.service");
var operators_1 = require("rxjs/operators");
var platform_1 = require("tns-core-modules/platform");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(dataService, databaseService) {
        this.dataService = dataService;
        this.databaseService = databaseService;
        this.webViewSrc = 'https://openaps.readthedocs.io/en/latest/docs/While%20You%20Wait%20For%20Gear/nightscout-setup.html';
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sendDatatoNightscout7().then(function () { return console.log(_this.webViewSrc + "ffffffffffffff111111"); });
    };
    HomeComponent.prototype.onRefresh = function () {
        var _this = this;
        this.sendDatatoNightscout7().then(function () { return console.log(_this.webViewSrc + "ffffffffffffff111111"); });
    };
    HomeComponent.prototype.onWebViewLoaded = function (args) {
        var webView = args.object;
        var nativeWebView = webView.nativeView; // equal to webView.android or webView.ios (depending on the platform)
        if (platform_1.isAndroid) {
            nativeWebView.getSettings().setAppCacheEnabled(true);
            nativeWebView.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_NORMAL);
            nativeWebView.getSettings().setJavaScriptEnabled(true);
            nativeWebView.getSettings().setDomStorageEnabled(true);
            nativeWebView.getSettings().setDatabaseEnabled(true);
            //nativeWebView.getSettings().setDatabasePath(dbpath); //check the documentation for info about dbpath
            nativeWebView.getSettings().setMinimumFontSize(1);
            nativeWebView.getSettings().setMinimumLogicalFontSize(1);
            //nativeWebView.setSupportZoom(true);
        }
    };
    HomeComponent.prototype.getNSData = function () {
        return this.databaseService.NSconf().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                http: a[0],
                secret: a[1],
                hash: a[2]
            }); });
        }));
    };
    HomeComponent.prototype.sendDatatoNightscout7 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getNSData().subscribe(function (g) {
                g.map(function (bol) {
                    console.log(bol.http.toString() + "66666666666" + bol.secret.toString());
                    _this.webViewSrc = bol.http.toString();
                });
                console.log("as" + _this.webViewSrc);
                resolve(),
                    reject();
            });
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: "Home",
            moduleId: module.id,
            templateUrl: "./home.component.html"
        }),
        __metadata("design:paramtypes", [data_service_1.DataService,
            database_service_1.DatabaseService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCx1REFBcUQ7QUFDckQsa0VBQWdFO0FBRWhFLDRDQUFxQztBQUdyQyxzREFBc0Q7QUFPdEQ7SUFFRSx1QkFBbUIsV0FBd0IsRUFDeEIsZUFBZ0M7UUFEaEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBRm5ELGVBQVUsR0FBVyxxR0FBcUcsQ0FBQztJQUVwRSxDQUFDO0lBRXhELGdDQUFRLEdBQVI7UUFBQSxpQkFFQztRQURDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsVUFBVSxHQUFHLHNCQUFzQixDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBQ0QsaUNBQVMsR0FBVDtRQUFBLGlCQUVDO1FBREMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsc0JBQXNCLENBQUMsRUFBckQsQ0FBcUQsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFDRCx1Q0FBZSxHQUFmLFVBQWdCLElBQWU7UUFDN0IsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQWlCLENBQUM7UUFFdkMsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHNFQUFzRTtRQUVoSCxJQUFJLG9CQUFTLEVBQUU7WUFDYixhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNqRixhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkQsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZELGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxzR0FBc0c7WUFDdEcsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxxQ0FBcUM7U0FDdEM7SUFDSCxDQUFDO0lBRUQsaUNBQVMsR0FBVDtRQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQ3ZDLGVBQUcsQ0FBQyxVQUFBLElBQUk7WUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDO2dCQUNwQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNYLENBQUMsRUFKbUIsQ0FJbkIsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFDRCw2Q0FBcUIsR0FBckI7UUFBQSxpQkFZQztRQVhDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBQ3pFLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDeEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXBEVSxhQUFhO1FBTHpCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTTtZQUNoQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHVCQUF1QjtTQUNyQyxDQUFDO3lDQUdnQywwQkFBVztZQUNQLGtDQUFlO09BSHhDLGFBQWEsQ0FxRHpCO0lBQUQsb0JBQUM7Q0FBQSxBQXJERCxJQXFEQztBQXJEWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tIFwiLi4vc2hhcmVkL2RhdGEuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBEYXRhYmFzZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zaGFyZWQvZGF0YWJhc2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcclxuaW1wb3J0IHsgV2ViVmlldyB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3dlYi12aWV3XCI7XHJcbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiSG9tZVwiLFxyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgdGVtcGxhdGVVcmw6IFwiLi9ob21lLmNvbXBvbmVudC5odG1sXCJcclxufSlcclxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIHdlYlZpZXdTcmM6IHN0cmluZyA9ICdodHRwczovL29wZW5hcHMucmVhZHRoZWRvY3MuaW8vZW4vbGF0ZXN0L2RvY3MvV2hpbGUlMjBZb3UlMjBXYWl0JTIwRm9yJTIwR2Vhci9uaWdodHNjb3V0LXNldHVwLmh0bWwnO1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhU2VydmljZTogRGF0YVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHVibGljIGRhdGFiYXNlU2VydmljZTogRGF0YWJhc2VTZXJ2aWNlICkge31cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbmREYXRhdG9OaWdodHNjb3V0NygpLnRoZW4oKCkgPT4gY29uc29sZS5sb2codGhpcy53ZWJWaWV3U3JjICsgXCJmZmZmZmZmZmZmZmZmZjExMTExMVwiKSk7XHJcbiAgfVxyXG4gIG9uUmVmcmVzaCgpe1xyXG4gICAgdGhpcy5zZW5kRGF0YXRvTmlnaHRzY291dDcoKS50aGVuKCgpID0+IGNvbnNvbGUubG9nKHRoaXMud2ViVmlld1NyYyArIFwiZmZmZmZmZmZmZmZmZmYxMTExMTFcIikpO1xyXG4gIH1cclxuICBvbldlYlZpZXdMb2FkZWQoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgICBjb25zdCB3ZWJWaWV3ID0gYXJncy5vYmplY3QgYXMgV2ViVmlldztcclxuXHJcbiAgICBjb25zdCBuYXRpdmVXZWJWaWV3ID0gd2ViVmlldy5uYXRpdmVWaWV3OyAvLyBlcXVhbCB0byB3ZWJWaWV3LmFuZHJvaWQgb3Igd2ViVmlldy5pb3MgKGRlcGVuZGluZyBvbiB0aGUgcGxhdGZvcm0pXHJcblxyXG4gICAgaWYgKGlzQW5kcm9pZCkge1xyXG4gICAgICBuYXRpdmVXZWJWaWV3LmdldFNldHRpbmdzKCkuc2V0QXBwQ2FjaGVFbmFibGVkKHRydWUpO1xyXG4gICAgICBuYXRpdmVXZWJWaWV3LmdldFNldHRpbmdzKCkuc2V0Q2FjaGVNb2RlKGFuZHJvaWQud2Via2l0LldlYlNldHRpbmdzLkxPQURfTk9STUFMKTtcclxuICAgICAgbmF0aXZlV2ViVmlldy5nZXRTZXR0aW5ncygpLnNldEphdmFTY3JpcHRFbmFibGVkKHRydWUpO1xyXG4gICAgICBuYXRpdmVXZWJWaWV3LmdldFNldHRpbmdzKCkuc2V0RG9tU3RvcmFnZUVuYWJsZWQodHJ1ZSk7XHJcbiAgICAgIG5hdGl2ZVdlYlZpZXcuZ2V0U2V0dGluZ3MoKS5zZXREYXRhYmFzZUVuYWJsZWQodHJ1ZSk7XHJcbiAgICAgIC8vbmF0aXZlV2ViVmlldy5nZXRTZXR0aW5ncygpLnNldERhdGFiYXNlUGF0aChkYnBhdGgpOyAvL2NoZWNrIHRoZSBkb2N1bWVudGF0aW9uIGZvciBpbmZvIGFib3V0IGRicGF0aFxyXG4gICAgICBuYXRpdmVXZWJWaWV3LmdldFNldHRpbmdzKCkuc2V0TWluaW11bUZvbnRTaXplKDEpO1xyXG4gICAgICBuYXRpdmVXZWJWaWV3LmdldFNldHRpbmdzKCkuc2V0TWluaW11bUxvZ2ljYWxGb250U2l6ZSgxKTtcclxuICAgICAgLy9uYXRpdmVXZWJWaWV3LnNldFN1cHBvcnRab29tKHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0TlNEYXRhKCk6IE9ic2VydmFibGU8QXJyYXk8eyBodHRwOiBzdHJpbmc7IHNlY3JldDogc3RyaW5nOyBoYXNoOiBzdHJpbmcgfT4+IHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlU2VydmljZS5OU2NvbmYoKS5waXBlKFxyXG4gICAgICBtYXAocm93cyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJvd3MubWFwKGEgPT4gKHtcclxuICAgICAgICAgIGh0dHA6IGFbMF0sXHJcbiAgICAgICAgICBzZWNyZXQ6IGFbMV0sXHJcbiAgICAgICAgICBoYXNoOiBhWzJdXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbiAgc2VuZERhdGF0b05pZ2h0c2NvdXQ3KCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5nZXROU0RhdGEoKS5zdWJzY3JpYmUoZyA9PiB7XHJcbiAgICAgICAgZy5tYXAoYm9sID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGJvbC5odHRwLnRvU3RyaW5nKCkgKyBcIjY2NjY2NjY2NjY2XCIgKyBib2wuc2VjcmV0LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgdGhpcy53ZWJWaWV3U3JjID0gYm9sLmh0dHAudG9TdHJpbmcoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImFzXCIgKyB0aGlzLndlYlZpZXdTcmMpO1xyXG4gICAgICAgIHJlc29sdmUoKSxcclxuICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=