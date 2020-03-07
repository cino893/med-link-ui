"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app = require("tns-core-modules/application");
var database_service_1 = require("~/app/shared/database.service");
var WidgetFacadeService = /** @class */ (function () {
    function WidgetFacadeService(databaseService) {
        this.databaseService = databaseService;
        this.belka = "MED-LINK";
    }
    WidgetFacadeService.prototype.updateWidget = function () {
        // const context = app.android.context;
        // const res = context.getResources().getIdentifier("my_widget", "layout", context.getPackageName());
        //console.log(res.toString());
        this.databaseService.getLastBg().subscribe(function (wynik) {
            console.log("to jest wynik co ma isc do belki: " + wynik.toString());
            //this.belka = wynik.toString() + new Date();
            var widgetNotificationIntent = new android.content.Intent();
            widgetNotificationIntent.setClassName(app.android.context, 'com.tns.MyWidget');
            widgetNotificationIntent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            widgetNotificationIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, 1);
            widgetNotificationIntent.setAction('a');
            //android.app.PendingIntent.getBroadcast(app.android.context, 0, widgetNotificationIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            console.log("Update called ttss!");
            // const views = new android.widget.RemoteViews(app.android.context.getPackageName(), android.R.layout.my_widget_info);
            //views.setTextViewText(res.id.taps_text, '5');
            //const startAppIntent = new android.content.Intent();
            //startAppIntent.setClassName(app.android.context, 'com.tns.NativeScriptActivity');
            //startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, 0);
            //const pI = android.app.PendingIntent.getBroadcast(app.android.context, 0, widgetNotificationIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            //const pI2 = android.app.PendingIntent.getActivity(app.android.context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            //console.log(pI.toString());
            //views.setOnClickPendingIntent(android.R.id.text1, pI);
            //views.setOnClickPendingIntent(android.R.id.button1, pI2);
            //app.android.context.updateAppWidget(0, views);
        });
    };
    WidgetFacadeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [database_service_1.DatabaseService])
    ], WidgetFacadeService);
    return WidgetFacadeService;
}());
exports.WidgetFacadeService = WidgetFacadeService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LWZhY2FkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndpZGdldC1mYWNhZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msa0RBQW9EO0FBQ3BELGtFQUFnRTtBQUtoRTtJQUtFLDZCQUNVLGVBQWdDO1FBQWhDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUYxQyxVQUFLLEdBQVcsVUFBVSxDQUFDO0lBSTNCLENBQUM7SUFDRCwwQ0FBWSxHQUFaO1FBQ0MsdUNBQXVDO1FBQ3ZDLHFHQUFxRztRQUNwRyw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLO1lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDckUsNkNBQTZDO1lBQzdDLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlELHdCQUF3QixDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQy9FLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDL0Ysd0JBQXdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0Ysd0JBQXdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLDBJQUEwSTtZQUMxSSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFcEMsdUhBQXVIO1lBQ3RILCtDQUErQztZQUUvQyxzREFBc0Q7WUFDdEQsbUZBQW1GO1lBQ25GLG9GQUFvRjtZQUNwRixxSkFBcUo7WUFDckosMklBQTJJO1lBQzNJLDZCQUE2QjtZQUM3Qix3REFBd0Q7WUFDeEQsMkRBQTJEO1lBQzNELGdEQUFnRDtRQUNsRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFyQ1UsbUJBQW1CO1FBSC9CLGlCQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO3lDQU8yQixrQ0FBZTtPQU4vQixtQkFBbUIsQ0FzQy9CO0lBQUQsMEJBQUM7Q0FBQSxBQXRDRCxJQXNDQztBQXRDWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCAqIGFzIGFwcCBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uJztcclxuaW1wb3J0IHsgRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnfi9hcHAvc2hhcmVkL2RhdGFiYXNlLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgV2lkZ2V0RmFjYWRlU2VydmljZSB7XHJcbiAgaW50MTogbnVtYmVyO1xyXG4gIGludGVydmFsOiBudW1iZXI7XHJcbiAgY291bnRlcjogbnVtYmVyO1xyXG4gIGJlbGthOiBzdHJpbmcgPSBcIk1FRC1MSU5LXCI7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGRhdGFiYXNlU2VydmljZTogRGF0YWJhc2VTZXJ2aWNlXHJcbiAgKXtcclxuICB9XHJcbiAgdXBkYXRlV2lkZ2V0KCl7XHJcbiAgIC8vIGNvbnN0IGNvbnRleHQgPSBhcHAuYW5kcm9pZC5jb250ZXh0O1xyXG4gICAvLyBjb25zdCByZXMgPSBjb250ZXh0LmdldFJlc291cmNlcygpLmdldElkZW50aWZpZXIoXCJteV93aWRnZXRcIiwgXCJsYXlvdXRcIiwgY29udGV4dC5nZXRQYWNrYWdlTmFtZSgpKTtcclxuICAgIC8vY29uc29sZS5sb2cocmVzLnRvU3RyaW5nKCkpO1xyXG4gICAgdGhpcy5kYXRhYmFzZVNlcnZpY2UuZ2V0TGFzdEJnKCkuc3Vic2NyaWJlKHd5bmlrID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJ0byBqZXN0IHd5bmlrIGNvIG1hIGlzYyBkbyBiZWxraTogXCIgKyB3eW5pay50b1N0cmluZygpKTtcclxuICAgICAgLy90aGlzLmJlbGthID0gd3luaWsudG9TdHJpbmcoKSArIG5ldyBEYXRlKCk7XHJcbiAgICAgIGNvbnN0IHdpZGdldE5vdGlmaWNhdGlvbkludGVudCA9IG5ldyBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KCk7XHJcbiAgICAgIHdpZGdldE5vdGlmaWNhdGlvbkludGVudC5zZXRDbGFzc05hbWUoYXBwLmFuZHJvaWQuY29udGV4dCwgJ2NvbS50bnMuTXlXaWRnZXQnKTtcclxuICAgICAgd2lkZ2V0Tm90aWZpY2F0aW9uSW50ZW50LnNldEFjdGlvbihhbmRyb2lkLmFwcHdpZGdldC5BcHBXaWRnZXRNYW5hZ2VyLkFDVElPTl9BUFBXSURHRVRfVVBEQVRFKTtcclxuICAgICAgd2lkZ2V0Tm90aWZpY2F0aW9uSW50ZW50LnB1dEV4dHJhKGFuZHJvaWQuYXBwd2lkZ2V0LkFwcFdpZGdldE1hbmFnZXIuRVhUUkFfQVBQV0lER0VUX0lEUywgMSk7XHJcbiAgICAgIHdpZGdldE5vdGlmaWNhdGlvbkludGVudC5zZXRBY3Rpb24oJ2EnKTtcclxuICAgICAgLy9hbmRyb2lkLmFwcC5QZW5kaW5nSW50ZW50LmdldEJyb2FkY2FzdChhcHAuYW5kcm9pZC5jb250ZXh0LCAwLCB3aWRnZXROb3RpZmljYXRpb25JbnRlbnQsIGFuZHJvaWQuYXBwLlBlbmRpbmdJbnRlbnQuRkxBR19VUERBVEVfQ1VSUkVOVCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRlIGNhbGxlZCB0dHNzIVwiKTtcclxuXHJcbiAgICAgLy8gY29uc3Qgdmlld3MgPSBuZXcgYW5kcm9pZC53aWRnZXQuUmVtb3RlVmlld3MoYXBwLmFuZHJvaWQuY29udGV4dC5nZXRQYWNrYWdlTmFtZSgpLCBhbmRyb2lkLlIubGF5b3V0Lm15X3dpZGdldF9pbmZvKTtcclxuICAgICAgLy92aWV3cy5zZXRUZXh0Vmlld1RleHQocmVzLmlkLnRhcHNfdGV4dCwgJzUnKTtcclxuXHJcbiAgICAgIC8vY29uc3Qgc3RhcnRBcHBJbnRlbnQgPSBuZXcgYW5kcm9pZC5jb250ZW50LkludGVudCgpO1xyXG4gICAgICAvL3N0YXJ0QXBwSW50ZW50LnNldENsYXNzTmFtZShhcHAuYW5kcm9pZC5jb250ZXh0LCAnY29tLnRucy5OYXRpdmVTY3JpcHRBY3Rpdml0eScpO1xyXG4gICAgICAvL3N0YXJ0QXBwSW50ZW50LnB1dEV4dHJhKGFuZHJvaWQuYXBwd2lkZ2V0LkFwcFdpZGdldE1hbmFnZXIuRVhUUkFfQVBQV0lER0VUX0lELCAwKTtcclxuICAgICAgLy9jb25zdCBwSSA9IGFuZHJvaWQuYXBwLlBlbmRpbmdJbnRlbnQuZ2V0QnJvYWRjYXN0KGFwcC5hbmRyb2lkLmNvbnRleHQsIDAsIHdpZGdldE5vdGlmaWNhdGlvbkludGVudCwgYW5kcm9pZC5hcHAuUGVuZGluZ0ludGVudC5GTEFHX1VQREFURV9DVVJSRU5UKTtcclxuICAgICAgLy9jb25zdCBwSTIgPSBhbmRyb2lkLmFwcC5QZW5kaW5nSW50ZW50LmdldEFjdGl2aXR5KGFwcC5hbmRyb2lkLmNvbnRleHQsIDAsIHN0YXJ0QXBwSW50ZW50LCBhbmRyb2lkLmFwcC5QZW5kaW5nSW50ZW50LkZMQUdfVVBEQVRFX0NVUlJFTlQpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHBJLnRvU3RyaW5nKCkpO1xyXG4gICAgICAvL3ZpZXdzLnNldE9uQ2xpY2tQZW5kaW5nSW50ZW50KGFuZHJvaWQuUi5pZC50ZXh0MSwgcEkpO1xyXG4gICAgICAvL3ZpZXdzLnNldE9uQ2xpY2tQZW5kaW5nSW50ZW50KGFuZHJvaWQuUi5pZC5idXR0b24xLCBwSTIpO1xyXG4gICAgICAvL2FwcC5hbmRyb2lkLmNvbnRleHQudXBkYXRlQXBwV2lkZ2V0KDAsIHZpZXdzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=