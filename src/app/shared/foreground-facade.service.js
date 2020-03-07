"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app = require("tns-core-modules/application");
var database_service_1 = require("~/app/shared/database.service");
var data_facade_service_1 = require("~/app/shared/data-facade.service");
var appSettings = require("tns-core-modules/application-settings");
var wake_facade_service_1 = require("~/app/shared/wake-facade.service");
var ForegroundFacadeService = /** @class */ (function () {
    function ForegroundFacadeService(fa, databaseService, wakeFacadeService) {
        this.fa = fa;
        this.databaseService = databaseService;
        this.wakeFacadeService = wakeFacadeService;
        this.belka = "MED-LINK";
    }
    ForegroundFacadeService.prototype.updateForeground = function () {
        this.databaseService.getLastBg().subscribe(function (wynik) {
            console.log("to jest wynik co ma isc do belki: " + wynik.toString());
            //this.belka = wynik.toString() + new Date();
            var foregroundNotificationIntent = new android.content.Intent();
            foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
            foregroundNotificationIntent.putExtra('title', 'BG: ' + wynik.toString());
            app.android.context.startService(foregroundNotificationIntent);
            appSettings.setString('BG', wynik.toString());
            //nm.notify(app.android.context, foregroundNotificationIntent);
        });
        //app.android.context.notify(foregroundNotificationIntent);
    };
    ForegroundFacadeService.prototype.startForeground = function () {
        var _this = this;
        if (!app.android || !app.android.context) {
            return;
        }
        var foregroundNotificationIntent = new android.content.Intent();
        foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
        foregroundNotificationIntent.putExtra('title', this.belka);
        console.log("DAJESZ MALENKI2" + this.belka);
        console.log("start freground");
        app.android.context.startService(foregroundNotificationIntent);
        //app.android.context.startForegroundService(foregroundNotificationIntent);
        this.startCountdown(300);
        this.int1 = setInterval(function () { clearInterval(appSettings.getNumber('interval')); _this.startCountdown(300); }, 300000);
        appSettings.setNumber("int1", this.int1);
        setTimeout(function () { return _this.fa.establishConnectionWithPump(); }, 500);
    };
    ForegroundFacadeService.prototype.stopForeground = function () {
        clearInterval(appSettings.getNumber('int1'));
        clearInterval(appSettings.getNumber('int0'));
        clearInterval(appSettings.getNumber('interval'));
        this.fa.clearInt();
        /*    for(let i = 0; i < 100; i++)
            {
              clearInterval(i);
            }*/
        this.wakeFacadeService.cancelAlarm();
        var foregroundNotificationIntent = new android.content.Intent();
        foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
        console.log("stop freground");
        app.android.context.stopService(foregroundNotificationIntent);
        //app.android.context.stopService(true);
    };
    ForegroundFacadeService.prototype.startCountdown = function (seconds) {
        var _this = this;
        this.counter = seconds;
        this.interval = setInterval(function () {
            console.log(_this.counter);
            // this.uuid = this.counter.toString();
            appSettings.setString("counter", _this.counter.toString());
            _this.counter--;
            if (_this.counter <= 2) {
                clearInterval(appSettings.getNumber('interval'));
                console.log('Ding!');
            }
        }, 1000);
        appSettings.setNumber('interval', this.interval);
    };
    ForegroundFacadeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [data_facade_service_1.DataFacadeService,
            database_service_1.DatabaseService,
            wake_facade_service_1.WakeFacadeService])
    ], ForegroundFacadeService);
    return ForegroundFacadeService;
}());
exports.ForegroundFacadeService = ForegroundFacadeService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZWdyb3VuZC1mYWNhZGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcmVncm91bmQtZmFjYWRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msa0RBQW9EO0FBQ3BELGtFQUFnRTtBQUNoRSx3RUFBcUU7QUFDckUsbUVBQXFFO0FBQ3JFLHdFQUFxRTtBQUtyRTtJQUtFLGlDQUNVLEVBQXFCLEVBQ3JCLGVBQWdDLEVBQ2hDLGlCQUFvQztRQUZwQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUo5QyxVQUFLLEdBQVcsVUFBVSxDQUFDO0lBTTNCLENBQUM7SUFDRCxrREFBZ0IsR0FBaEI7UUFDRSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7WUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNyRSw2Q0FBNkM7WUFDN0MsSUFBTSw0QkFBNEIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEUsNEJBQTRCLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFDNUYsNEJBQTRCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDMUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDL0QsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDOUMsK0RBQStE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QVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3RCO1FBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1QsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUF4RVUsdUJBQXVCO1FBSG5DLGlCQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO3lDQU9jLHVDQUFpQjtZQUNKLGtDQUFlO1lBQ2IsdUNBQWlCO09BUm5DLHVCQUF1QixDQXlFbkM7SUFBRCw4QkFBQztDQUFBLEFBekVELElBeUVDO0FBekVZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgYXBwIGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24nO1xyXG5pbXBvcnQgeyBEYXRhYmFzZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zaGFyZWQvZGF0YWJhc2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IERhdGFGYWNhZGVTZXJ2aWNlIH0gZnJvbSAnfi9hcHAvc2hhcmVkL2RhdGEtZmFjYWRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgKiBhcyBhcHBTZXR0aW5ncyBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBXYWtlRmFjYWRlU2VydmljZSB9IGZyb20gXCJ+L2FwcC9zaGFyZWQvd2FrZS1mYWNhZGUuc2VydmljZVwiO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9yZWdyb3VuZEZhY2FkZVNlcnZpY2Uge1xyXG4gIGludDE6IG51bWJlcjtcclxuICBpbnRlcnZhbDogbnVtYmVyO1xyXG4gIGNvdW50ZXI6IG51bWJlcjtcclxuICBiZWxrYTogc3RyaW5nID0gXCJNRUQtTElOS1wiO1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBmYTogRGF0YUZhY2FkZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGRhdGFiYXNlU2VydmljZTogRGF0YWJhc2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSB3YWtlRmFjYWRlU2VydmljZTogV2FrZUZhY2FkZVNlcnZpY2VcclxuICApe1xyXG4gIH1cclxuICB1cGRhdGVGb3JlZ3JvdW5kKCl7XHJcbiAgICB0aGlzLmRhdGFiYXNlU2VydmljZS5nZXRMYXN0QmcoKS5zdWJzY3JpYmUod3luaWsgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInRvIGplc3Qgd3luaWsgY28gbWEgaXNjIGRvIGJlbGtpOiBcIiArIHd5bmlrLnRvU3RyaW5nKCkpO1xyXG4gICAgICAvL3RoaXMuYmVsa2EgPSB3eW5pay50b1N0cmluZygpICsgbmV3IERhdGUoKTtcclxuICAgICAgY29uc3QgZm9yZWdyb3VuZE5vdGlmaWNhdGlvbkludGVudCA9IG5ldyBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KCk7XHJcbiAgICAgIGZvcmVncm91bmROb3RpZmljYXRpb25JbnRlbnQuc2V0Q2xhc3NOYW1lKGFwcC5hbmRyb2lkLmNvbnRleHQsICdjb20udG5zLkZvcmVncm91bmRTZXJ2aWNlJyk7XHJcbiAgICAgIGZvcmVncm91bmROb3RpZmljYXRpb25JbnRlbnQucHV0RXh0cmEoJ3RpdGxlJywgJ0JHOiAnICsgd3luaWsudG9TdHJpbmcoKSk7XHJcbiAgICAgIGFwcC5hbmRyb2lkLmNvbnRleHQuc3RhcnRTZXJ2aWNlKGZvcmVncm91bmROb3RpZmljYXRpb25JbnRlbnQpO1xyXG4gICAgICBhcHBTZXR0aW5ncy5zZXRTdHJpbmcoJ0JHJywgd3luaWsudG9TdHJpbmcoKSk7XHJcbiAgICAgIC8vbm0ubm90aWZ5KGFwcC5hbmRyb2lkLmNvbnRleHQsIGZvcmVncm91bmROb3RpZmljYXRpb25JbnRlbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy9hcHAuYW5kcm9pZC5jb250ZXh0Lm5vdGlmeShmb3JlZ3JvdW5kTm90aWZpY2F0aW9uSW50ZW50KTtcclxuICB9XHJcbiAgc3RhcnRGb3JlZ3JvdW5kKCkge1xyXG4gICAgaWYgKCFhcHAuYW5kcm9pZCB8fCAhYXBwLmFuZHJvaWQuY29udGV4dCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBmb3JlZ3JvdW5kTm90aWZpY2F0aW9uSW50ZW50ID0gbmV3IGFuZHJvaWQuY29udGVudC5JbnRlbnQoKTtcclxuICAgIGZvcmVncm91bmROb3RpZmljYXRpb25JbnRlbnQuc2V0Q2xhc3NOYW1lKGFwcC5hbmRyb2lkLmNvbnRleHQsICdjb20udG5zLkZvcmVncm91bmRTZXJ2aWNlJyk7XHJcbiAgICBmb3JlZ3JvdW5kTm90aWZpY2F0aW9uSW50ZW50LnB1dEV4dHJhKCd0aXRsZScsIHRoaXMuYmVsa2EpO1xyXG4gICAgY29uc29sZS5sb2coXCJEQUpFU1ogTUFMRU5LSTJcIiArIHRoaXMuYmVsa2EpO1xyXG4gICAgY29uc29sZS5sb2coXCJzdGFydCBmcmVncm91bmRcIik7XHJcbiAgICBhcHAuYW5kcm9pZC5jb250ZXh0LnN0YXJ0U2VydmljZShmb3JlZ3JvdW5kTm90aWZpY2F0aW9uSW50ZW50KTtcclxuICAgIC8vYXBwLmFuZHJvaWQuY29udGV4dC5zdGFydEZvcmVncm91bmRTZXJ2aWNlKGZvcmVncm91bmROb3RpZmljYXRpb25JbnRlbnQpO1xyXG4gICAgdGhpcy5zdGFydENvdW50ZG93bigzMDApO1xyXG4gICAgdGhpcy5pbnQxID0gc2V0SW50ZXJ2YWwoKCkgPT4geyBjbGVhckludGVydmFsKGFwcFNldHRpbmdzLmdldE51bWJlcignaW50ZXJ2YWwnKSk7IHRoaXMuc3RhcnRDb3VudGRvd24oMzAwKTsgfSwgMzAwMDAwKTtcclxuICAgIGFwcFNldHRpbmdzLnNldE51bWJlcihcImludDFcIiwgdGhpcy5pbnQxKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYS5lc3RhYmxpc2hDb25uZWN0aW9uV2l0aFB1bXAoKSwgNTAwKTtcclxuICB9XHJcblxyXG4gIHN0b3BGb3JlZ3JvdW5kKCkge1xyXG4gICAgY2xlYXJJbnRlcnZhbChhcHBTZXR0aW5ncy5nZXROdW1iZXIoJ2ludDEnKSk7XHJcbiAgICBjbGVhckludGVydmFsKGFwcFNldHRpbmdzLmdldE51bWJlcignaW50MCcpKTtcclxuICAgIGNsZWFySW50ZXJ2YWwoYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKCdpbnRlcnZhbCcpKTtcclxuICAgIHRoaXMuZmEuY2xlYXJJbnQoKTtcclxuLyogICAgZm9yKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKVxyXG4gICAge1xyXG4gICAgICBjbGVhckludGVydmFsKGkpO1xyXG4gICAgfSovXHJcbiAgICB0aGlzLndha2VGYWNhZGVTZXJ2aWNlLmNhbmNlbEFsYXJtKCk7XHJcblxyXG4gICAgY29uc3QgZm9yZWdyb3VuZE5vdGlmaWNhdGlvbkludGVudCA9IG5ldyBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KCk7XHJcbiAgICBmb3JlZ3JvdW5kTm90aWZpY2F0aW9uSW50ZW50LnNldENsYXNzTmFtZShhcHAuYW5kcm9pZC5jb250ZXh0LCAnY29tLnRucy5Gb3JlZ3JvdW5kU2VydmljZScpO1xyXG4gICAgY29uc29sZS5sb2coXCJzdG9wIGZyZWdyb3VuZFwiKTtcclxuICAgIGFwcC5hbmRyb2lkLmNvbnRleHQuc3RvcFNlcnZpY2UoZm9yZWdyb3VuZE5vdGlmaWNhdGlvbkludGVudCk7XHJcbiAgICAvL2FwcC5hbmRyb2lkLmNvbnRleHQuc3RvcFNlcnZpY2UodHJ1ZSk7XHJcbiAgfVxyXG4gIHN0YXJ0Q291bnRkb3duKHNlY29uZHMpe1xyXG4gICAgdGhpcy5jb3VudGVyID0gc2Vjb25kcztcclxuICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuY291bnRlcik7XHJcbiAgICAgLy8gdGhpcy51dWlkID0gdGhpcy5jb3VudGVyLnRvU3RyaW5nKCk7XHJcbiAgICAgIGFwcFNldHRpbmdzLnNldFN0cmluZyhcImNvdW50ZXJcIiwgdGhpcy5jb3VudGVyLnRvU3RyaW5nKCkpO1xyXG4gICAgICB0aGlzLmNvdW50ZXItLTtcclxuICAgICAgaWYgKHRoaXMuY291bnRlciA8PSAyKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChhcHBTZXR0aW5ncy5nZXROdW1iZXIoJ2ludGVydmFsJykpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdEaW5nIScpO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICAgIGFwcFNldHRpbmdzLnNldE51bWJlcignaW50ZXJ2YWwnLCB0aGlzLmludGVydmFsKTtcclxuICB9XHJcbn1cclxuIl19