"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Application = require("tns-core-modules/application");
var PendingIntent = android.app.PendingIntent;
var ForegroundService = /** @class */ (function (_super) {
    __extends(ForegroundService, _super);
    function ForegroundService() {
        return _super.call(this) || this;
    }
    ForegroundService.prototype.onCreate = function () {
        _super.prototype.onCreate.call(this);
    };
    ForegroundService.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
        this.stopForeground(true);
    };
    ForegroundService.prototype.onBind = function (param0) {
        console.log(param0);
        return null;
    };
    ForegroundService.prototype.onStartCommand = function (intent, flags, startId) {
        _super.prototype.onStartCommand.call(this, intent, flags, startId);
        this.startForeground(1, this.createNotification(intent));
        console.log("start foreground onstartCommad");
        return android.app.Service.START_STICKY;
    };
    ForegroundService.prototype.createNotification = function (intent) {
        this.disableDozeMode();
        //intent.putExtra('title', 'Medlink');
        var openActivityIntent = new android.content.Intent();
        openActivityIntent.setClassName(Application.android.context, 'com.tns.NativeScriptActivity');
        openActivityIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        var openActivityPendingIntent = PendingIntent.getActivity(Application.android.context, 0, openActivityIntent, 0);
        this.createNotificationChannel();
        return this.getNotificationBuilder()
            .setSmallIcon(android.R.drawable.btn_star)
            .setContentTitle(this.getTitle(intent))
            .setContentIntent(openActivityPendingIntent)
            .build();
    };
    ForegroundService.prototype.disableDozeMode = function () {
        if (android.os.Build.VERSION.SDK_INT >= 24) {
            var intent = new android.content.Intent();
            var context = Application.android.context;
            var packageName = context.getPackageName();
            var pm = context.getSystemService(android.content.Context.POWER_SERVICE);
            intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                intent.setAction(android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                console.log('udalo sie usunac optymaliazacje baterii');
                intent.setData(android.net.Uri.parse('package:' + packageName));
                context.startActivity(intent);
            }
            // this.wakeScreenByActivity();
        }
    };
    ForegroundService.prototype.getNotificationBuilder = function () {
        if (!android.support.v4.os.BuildCompat.isAtLeastO()) {
            // Not Oreo, not creating notification channel as compatibility issues may exist
            return new android.support.v4.app.NotificationCompat.Builder(this);
        }
        return new android.support.v4.app.NotificationCompat.Builder(this, 'TNS-ForegroundService-1');
    };
    ForegroundService.prototype.updateNotification = function () {
        //this.createNotification("a");
        var importance = android.support.v4.app.NotificationManagerCompat.IMPORTANCE_LOW;
        var mChannel = new android.app.NotificationChannel('TNS-ForegroundService-1', 'TNS-ForegroundService-1', importance);
        //Notification notification=getMyActivityNotification(text);
        // NotificationManager mNotificationManager=(NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        var nm = this.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
        nm.notify(1, mChannel);
    };
    ForegroundService.prototype.createNotificationChannel = function () {
        if (!android.support.v4.os.BuildCompat.isAtLeastO()) {
            // Not Oreo, not creating notification channel as compatibility issues may exist
            return;
        }
        var importance = android.support.v4.app.NotificationManagerCompat.IMPORTANCE_LOW;
        var mChannel = new android.app.NotificationChannel('TNS-ForegroundService-1', 'TNS-ForegroundService-1', importance);
        var nm = this.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
        nm.createNotificationChannel(mChannel);
    };
    ForegroundService.prototype.getTitle = function (intent) {
        if (intent.hasExtra('title')) {
            var title = intent.getStringExtra('title').toString();
            if (title) {
                if (title === null) {
                    return "MED-LINK2";
                }
                else {
                    return title;
                }
            }
            else {
                return 'MED-LINK';
            }
        }
        else {
            console.log("BAD ERROR!!");
        }
    };
    ForegroundService.prototype.onStart = function (intent, startId) {
        _super.prototype.onStart.call(this, intent, startId);
    };
    ForegroundService = __decorate([
        JavaProxy('com.tns.ForegroundService'),
        __metadata("design:paramtypes", [])
    ], ForegroundService);
    return ForegroundService;
}(android.app.Service));
exports.ForegroundService = ForegroundService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZWdyb3VuZC5zZXJ2aWNlLmFuZHJvaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3JlZ3JvdW5kLnNlcnZpY2UuYW5kcm9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBEQUE0RDtBQUM1RCxJQUFPLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztBQUdqRDtJQUF1QyxxQ0FBbUI7SUFDeEQ7ZUFFRSxpQkFBTztJQUNULENBQUM7SUFFTSxvQ0FBUSxHQUFmO1FBQ0UsaUJBQU0sUUFBUSxXQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVNLHFDQUFTLEdBQWhCO1FBQ0UsaUJBQU0sU0FBUyxXQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0sa0NBQU0sR0FBYixVQUFjLE1BQThCO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMENBQWMsR0FBckIsVUFDRSxNQUE4QixFQUM5QixLQUFhLEVBQ2IsT0FBZTtRQUVmLGlCQUFNLGNBQWMsWUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUU5QyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUMxQyxDQUFDO0lBRU8sOENBQWtCLEdBQTFCLFVBQ0UsTUFBOEI7UUFFOUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLHNDQUFzQztRQUN0QyxJQUFNLGtCQUFrQixHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FB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O3FCQUNJO29CQUNILE9BQU8sS0FBSyxDQUFDO2lCQUNkO2FBQ0Y7aUJBQU07Z0JBQ0wsT0FBTyxVQUFVLENBQUM7YUFDbkI7U0FDRjthQUNJO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFTSxtQ0FBTyxHQUFkLFVBQWUsTUFBOEIsRUFBRSxPQUFlO1FBQzVELGlCQUFNLE9BQU8sWUFBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQS9JVSxpQkFBaUI7UUFEN0IsU0FBUyxDQUFDLDJCQUEyQixDQUFDOztPQUMxQixpQkFBaUIsQ0FnSjdCO0lBQUQsd0JBQUM7Q0FBQSxBQWhKRCxDQUF1QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FnSnpEO0FBaEpZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEFwcGxpY2F0aW9uIGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24nO1xyXG5pbXBvcnQgUGVuZGluZ0ludGVudCA9IGFuZHJvaWQuYXBwLlBlbmRpbmdJbnRlbnQ7XHJcblxyXG5ASmF2YVByb3h5KCdjb20udG5zLkZvcmVncm91bmRTZXJ2aWNlJylcclxuZXhwb3J0IGNsYXNzIEZvcmVncm91bmRTZXJ2aWNlIGV4dGVuZHMgYW5kcm9pZC5hcHAuU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25DcmVhdGUoKTogdm9pZCB7XHJcbiAgICBzdXBlci5vbkNyZWF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm9uRGVzdHJveSgpO1xyXG4gICAgdGhpcy5zdG9wRm9yZWdyb3VuZCh0cnVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkJpbmQocGFyYW0wOiBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KTogYW5kcm9pZC5vcy5JQmluZGVyIHtcclxuICAgIGNvbnNvbGUubG9nKHBhcmFtMCk7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvblN0YXJ0Q29tbWFuZChcclxuICAgIGludGVudDogYW5kcm9pZC5jb250ZW50LkludGVudCxcclxuICAgIGZsYWdzOiBudW1iZXIsXHJcbiAgICBzdGFydElkOiBudW1iZXJcclxuICApIHtcclxuICAgIHN1cGVyLm9uU3RhcnRDb21tYW5kKGludGVudCwgZmxhZ3MsIHN0YXJ0SWQpO1xyXG4gICAgdGhpcy5zdGFydEZvcmVncm91bmQoMSwgdGhpcy5jcmVhdGVOb3RpZmljYXRpb24oaW50ZW50KSk7XHJcbiAgICBjb25zb2xlLmxvZyhcInN0YXJ0IGZvcmVncm91bmQgb25zdGFydENvbW1hZFwiKTtcclxuXHJcbiAgICByZXR1cm4gYW5kcm9pZC5hcHAuU2VydmljZS5TVEFSVF9TVElDS1k7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZU5vdGlmaWNhdGlvbihcclxuICAgIGludGVudDogYW5kcm9pZC5jb250ZW50LkludGVudFxyXG4gICk6IGFuZHJvaWQuYXBwLk5vdGlmaWNhdGlvbiB7XHJcbiAgICB0aGlzLmRpc2FibGVEb3plTW9kZSgpO1xyXG4gICAgLy9pbnRlbnQucHV0RXh0cmEoJ3RpdGxlJywgJ01lZGxpbmsnKTtcclxuICAgIGNvbnN0IG9wZW5BY3Rpdml0eUludGVudCA9IG5ldyBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KCk7XHJcbiAgICBvcGVuQWN0aXZpdHlJbnRlbnQuc2V0Q2xhc3NOYW1lKEFwcGxpY2F0aW9uLmFuZHJvaWQuY29udGV4dCwgJ2NvbS50bnMuTmF0aXZlU2NyaXB0QWN0aXZpdHknKTtcclxuICAgIG9wZW5BY3Rpdml0eUludGVudC5zZXRGbGFncyhhbmRyb2lkLmNvbnRlbnQuSW50ZW50LkZMQUdfQUNUSVZJVFlfUkVTRVRfVEFTS19JRl9ORUVERUQgfCBhbmRyb2lkLmNvbnRlbnQuSW50ZW50LkZMQUdfQUNUSVZJVFlfTkVXX1RBU0spO1xyXG4gICAgY29uc3Qgb3BlbkFjdGl2aXR5UGVuZGluZ0ludGVudCA9IFBlbmRpbmdJbnRlbnQuZ2V0QWN0aXZpdHkoQXBwbGljYXRpb24uYW5kcm9pZC5jb250ZXh0LCAwLCBvcGVuQWN0aXZpdHlJbnRlbnQsIDApO1xyXG5cclxuXHJcbiAgICB0aGlzLmNyZWF0ZU5vdGlmaWNhdGlvbkNoYW5uZWwoKTtcclxuICAgIHJldHVybiB0aGlzLmdldE5vdGlmaWNhdGlvbkJ1aWxkZXIoKVxyXG4gICAgICAuc2V0U21hbGxJY29uKGFuZHJvaWQuUi5kcmF3YWJsZS5idG5fc3RhcilcclxuICAgICAgLnNldENvbnRlbnRUaXRsZSh0aGlzLmdldFRpdGxlKGludGVudCkpXHJcbiAgICAgIC5zZXRDb250ZW50SW50ZW50KG9wZW5BY3Rpdml0eVBlbmRpbmdJbnRlbnQpXHJcbiAgICAgIC5idWlsZCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkaXNhYmxlRG96ZU1vZGUoKSB7XHJcbiAgICBpZiAoYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQgPj0gMjQpIHtcclxuICAgICAgY29uc3QgaW50ZW50ID0gbmV3IGFuZHJvaWQuY29udGVudC5JbnRlbnQoKTtcclxuICAgICAgY29uc3QgY29udGV4dCA9IEFwcGxpY2F0aW9uLmFuZHJvaWQuY29udGV4dDtcclxuICAgICAgY29uc3QgcGFja2FnZU5hbWUgPSBjb250ZXh0LmdldFBhY2thZ2VOYW1lKCk7XHJcbiAgICAgIGNvbnN0IHBtID0gY29udGV4dC5nZXRTeXN0ZW1TZXJ2aWNlKFxyXG4gICAgICAgIGFuZHJvaWQuY29udGVudC5Db250ZXh0LlBPV0VSX1NFUlZJQ0VcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGludGVudC5zZXRGbGFncyhhbmRyb2lkLmNvbnRlbnQuSW50ZW50LkZMQUdfQUNUSVZJVFlfTkVXX1RBU0spO1xyXG5cclxuICAgICAgaWYgKCFwbS5pc0lnbm9yaW5nQmF0dGVyeU9wdGltaXphdGlvbnMocGFja2FnZU5hbWUpKSB7XHJcbiAgICAgICAgaW50ZW50LnNldEFjdGlvbihcclxuICAgICAgICAgIGFuZHJvaWQucHJvdmlkZXIuU2V0dGluZ3MuQUNUSU9OX1JFUVVFU1RfSUdOT1JFX0JBVFRFUllfT1BUSU1JWkFUSU9OU1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3VkYWxvIHNpZSB1c3VuYWMgb3B0eW1hbGlhemFjamUgYmF0ZXJpaScpO1xyXG4gICAgICAgIGludGVudC5zZXREYXRhKGFuZHJvaWQubmV0LlVyaS5wYXJzZSgncGFja2FnZTonICsgcGFja2FnZU5hbWUpKTtcclxuICAgICAgICBjb250ZXh0LnN0YXJ0QWN0aXZpdHkoaW50ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdGhpcy53YWtlU2NyZWVuQnlBY3Rpdml0eSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXROb3RpZmljYXRpb25CdWlsZGVyKCkge1xyXG4gICAgaWYgKCFhbmRyb2lkLnN1cHBvcnQudjQub3MuQnVpbGRDb21wYXQuaXNBdExlYXN0TygpKSB7XHJcbiAgICAgIC8vIE5vdCBPcmVvLCBub3QgY3JlYXRpbmcgbm90aWZpY2F0aW9uIGNoYW5uZWwgYXMgY29tcGF0aWJpbGl0eSBpc3N1ZXMgbWF5IGV4aXN0XHJcbiAgICAgIHJldHVybiBuZXcgYW5kcm9pZC5zdXBwb3J0LnY0LmFwcC5Ob3RpZmljYXRpb25Db21wYXQuQnVpbGRlcih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IGFuZHJvaWQuc3VwcG9ydC52NC5hcHAuTm90aWZpY2F0aW9uQ29tcGF0LkJ1aWxkZXIoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgICdUTlMtRm9yZWdyb3VuZFNlcnZpY2UtMSdcclxuICAgICk7XHJcbiAgfVxyXG4gIHB1YmxpYyB1cGRhdGVOb3RpZmljYXRpb24oKXtcclxuICAgIC8vdGhpcy5jcmVhdGVOb3RpZmljYXRpb24oXCJhXCIpO1xyXG4gICAgIGNvbnN0IGltcG9ydGFuY2UgPVxyXG4gICAgICAgYW5kcm9pZC5zdXBwb3J0LnY0LmFwcC5Ob3RpZmljYXRpb25NYW5hZ2VyQ29tcGF0LklNUE9SVEFOQ0VfTE9XO1xyXG4gICAgIGNvbnN0IG1DaGFubmVsID0gbmV3IGFuZHJvaWQuYXBwLk5vdGlmaWNhdGlvbkNoYW5uZWwoXHJcbiAgICAgICAnVE5TLUZvcmVncm91bmRTZXJ2aWNlLTEnLFxyXG4gICAgICAgJ1ROUy1Gb3JlZ3JvdW5kU2VydmljZS0xJyxcclxuICAgICAgIGltcG9ydGFuY2VcclxuICAgICApO1xyXG5cclxuICAgIC8vTm90aWZpY2F0aW9uIG5vdGlmaWNhdGlvbj1nZXRNeUFjdGl2aXR5Tm90aWZpY2F0aW9uKHRleHQpO1xyXG4gICAgLy8gTm90aWZpY2F0aW9uTWFuYWdlciBtTm90aWZpY2F0aW9uTWFuYWdlcj0oTm90aWZpY2F0aW9uTWFuYWdlcilnZXRTeXN0ZW1TZXJ2aWNlKENvbnRleHQuTk9USUZJQ0FUSU9OX1NFUlZJQ0UpO1xyXG4gICAgIGNvbnN0IG5tID0gdGhpcy5nZXRTeXN0ZW1TZXJ2aWNlKFxyXG4gICAgICAgYW5kcm9pZC5jb250ZW50LkNvbnRleHQuTk9USUZJQ0FUSU9OX1NFUlZJQ0VcclxuICAgICApO1xyXG4gICAgIG5tLm5vdGlmeSgxLCBtQ2hhbm5lbCk7XHJcbiAgfVxyXG4gIHByaXZhdGUgY3JlYXRlTm90aWZpY2F0aW9uQ2hhbm5lbCgpIHtcclxuICAgIGlmICghYW5kcm9pZC5zdXBwb3J0LnY0Lm9zLkJ1aWxkQ29tcGF0LmlzQXRMZWFzdE8oKSkge1xyXG4gICAgICAvLyBOb3QgT3Jlbywgbm90IGNyZWF0aW5nIG5vdGlmaWNhdGlvbiBjaGFubmVsIGFzIGNvbXBhdGliaWxpdHkgaXNzdWVzIG1heSBleGlzdFxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbXBvcnRhbmNlID1cclxuICAgICAgYW5kcm9pZC5zdXBwb3J0LnY0LmFwcC5Ob3RpZmljYXRpb25NYW5hZ2VyQ29tcGF0LklNUE9SVEFOQ0VfTE9XO1xyXG4gICAgY29uc3QgbUNoYW5uZWwgPSBuZXcgYW5kcm9pZC5hcHAuTm90aWZpY2F0aW9uQ2hhbm5lbChcclxuICAgICAgJ1ROUy1Gb3JlZ3JvdW5kU2VydmljZS0xJyxcclxuICAgICAgJ1ROUy1Gb3JlZ3JvdW5kU2VydmljZS0xJyxcclxuICAgICAgaW1wb3J0YW5jZVxyXG4gICAgKTtcclxuICAgIHZhciBubSA9IHRoaXMuZ2V0U3lzdGVtU2VydmljZShcclxuICAgICAgYW5kcm9pZC5jb250ZW50LkNvbnRleHQuTk9USUZJQ0FUSU9OX1NFUlZJQ0VcclxuICAgICk7XHJcbiAgICBubS5jcmVhdGVOb3RpZmljYXRpb25DaGFubmVsKG1DaGFubmVsKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0VGl0bGUoaW50ZW50OiBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KTogc3RyaW5nIHtcclxuICAgIGlmIChpbnRlbnQuaGFzRXh0cmEoJ3RpdGxlJykpe1xyXG5cclxuICAgICAgY29uc3QgdGl0bGUgPSBpbnRlbnQuZ2V0U3RyaW5nRXh0cmEoJ3RpdGxlJykudG9TdHJpbmcoKTtcclxuICAgICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgICAgaWYgKHRpdGxlID09PSBudWxsKXtcclxuICAgICAgICAgIHJldHVybiBcIk1FRC1MSU5LMlwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHRpdGxlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gJ01FRC1MSU5LJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiQkFEIEVSUk9SISFcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25TdGFydChpbnRlbnQ6IGFuZHJvaWQuY29udGVudC5JbnRlbnQsIHN0YXJ0SWQ6IG51bWJlcikge1xyXG4gICAgc3VwZXIub25TdGFydChpbnRlbnQsIHN0YXJ0SWQpO1xyXG4gIH1cclxufVxyXG4iXX0=