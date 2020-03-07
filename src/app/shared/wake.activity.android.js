"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomWakingActivity = /** @class */ (function (_super) {
    __extends(CustomWakingActivity, _super);
    function CustomWakingActivity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.flags = android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
            android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
            android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
            android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON;
        return _this;
    }
    CustomWakingActivity.prototype.onCreate = function (savedInstanceState) {
        _super.prototype.onCreate.call(this, savedInstanceState);
        this.setContentView(android.R.layout.simple_spinner_item);
        this.moveTaskToBack(true);
    };
    CustomWakingActivity.prototype.onAttachedToWindow = function () {
        this.turnOn();
    };
    CustomWakingActivity.prototype.onNewIntent = function (i) {
        if (i.getBooleanExtra('finish', false)) {
            this.turnOff();
            this.finish();
        }
    };
    CustomWakingActivity.prototype.turnOn = function () {
        var window = this.getWindow();
        window.addFlags(this.flags);
        window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    };
    CustomWakingActivity.prototype.turnOff = function () {
        var window = this.getWindow();
        window.clearFlags(this.flags);
    };
    CustomWakingActivity = __decorate([
        JavaProxy('com.tns.CustomWakingActivity')
    ], CustomWakingActivity);
    return CustomWakingActivity;
}(android.app.Activity));
exports.CustomWakingActivity = CustomWakingActivity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FrZS5hY3Rpdml0eS5hbmRyb2lkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2FrZS5hY3Rpdml0eS5hbmRyb2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0E7SUFBMEMsd0NBQW9CO0lBRDlEO1FBQUEscUVBcUNDO1FBbkNVLFdBQUssR0FDWixPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMscUJBQXFCO1lBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxtQkFBbUI7WUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLHFCQUFxQjtZQUM3RCxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUM7O0lBK0JoRSxDQUFDO0lBN0JDLHVDQUFRLEdBQVIsVUFBUyxrQkFBcUM7UUFDNUMsaUJBQU0sUUFBUSxZQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELGlEQUFrQixHQUFsQjtRQUNFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsMENBQVcsR0FBWCxVQUFZLENBQXlCO1FBQ25DLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQscUNBQU0sR0FBTjtRQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVoQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxzQ0FBTyxHQUFQO1FBQ0UsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFuQ1Usb0JBQW9CO1FBRGhDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQztPQUM3QixvQkFBb0IsQ0FvQ2hDO0lBQUQsMkJBQUM7Q0FBQSxBQXBDRCxDQUEwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FvQzdEO0FBcENZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIkBKYXZhUHJveHkoJ2NvbS50bnMuQ3VzdG9tV2FraW5nQWN0aXZpdHknKVxyXG5leHBvcnQgY2xhc3MgQ3VzdG9tV2FraW5nQWN0aXZpdHkgZXh0ZW5kcyBhbmRyb2lkLmFwcC5BY3Rpdml0eSB7XHJcbiAgcmVhZG9ubHkgZmxhZ3MgPVxyXG4gICAgYW5kcm9pZC52aWV3LldpbmRvd01hbmFnZXIuTGF5b3V0UGFyYW1zLkZMQUdfU0hPV19XSEVOX0xPQ0tFRCB8XHJcbiAgICBhbmRyb2lkLnZpZXcuV2luZG93TWFuYWdlci5MYXlvdXRQYXJhbXMuRkxBR19LRUVQX1NDUkVFTl9PTiB8XHJcbiAgICBhbmRyb2lkLnZpZXcuV2luZG93TWFuYWdlci5MYXlvdXRQYXJhbXMuRkxBR19ESVNNSVNTX0tFWUdVQVJEIHxcclxuICAgIGFuZHJvaWQudmlldy5XaW5kb3dNYW5hZ2VyLkxheW91dFBhcmFtcy5GTEFHX1RVUk5fU0NSRUVOX09OO1xyXG5cclxuICBvbkNyZWF0ZShzYXZlZEluc3RhbmNlU3RhdGU6IGFuZHJvaWQub3MuQnVuZGxlKSB7XHJcbiAgICBzdXBlci5vbkNyZWF0ZShzYXZlZEluc3RhbmNlU3RhdGUpO1xyXG4gICAgdGhpcy5zZXRDb250ZW50VmlldyhhbmRyb2lkLlIubGF5b3V0LnNpbXBsZV9zcGlubmVyX2l0ZW0pO1xyXG4gICAgdGhpcy5tb3ZlVGFza1RvQmFjayh0cnVlKTtcclxuICB9XHJcblxyXG4gIG9uQXR0YWNoZWRUb1dpbmRvdygpIHtcclxuICAgIHRoaXMudHVybk9uKCk7XHJcbiAgfVxyXG5cclxuICBvbk5ld0ludGVudChpOiBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KSB7XHJcbiAgICBpZiAoaS5nZXRCb29sZWFuRXh0cmEoJ2ZpbmlzaCcsIGZhbHNlKSkge1xyXG4gICAgICB0aGlzLnR1cm5PZmYoKTtcclxuICAgICAgdGhpcy5maW5pc2goKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHR1cm5PbigpIHtcclxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuZ2V0V2luZG93KCk7XHJcblxyXG4gICAgd2luZG93LmFkZEZsYWdzKHRoaXMuZmxhZ3MpO1xyXG4gICAgd2luZG93LmNsZWFyRmxhZ3MoYW5kcm9pZC52aWV3LldpbmRvd01hbmFnZXIuTGF5b3V0UGFyYW1zLkZMQUdfS0VFUF9TQ1JFRU5fT04pO1xyXG4gIH1cclxuXHJcbiAgdHVybk9mZigpIHtcclxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuZ2V0V2luZG93KCk7XHJcblxyXG4gICAgd2luZG93LmNsZWFyRmxhZ3ModGhpcy5mbGFncyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==