"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var trace_1 = require("tns-core-modules/trace");
var types_1 = require("tns-core-modules/utils/types");
var rxjs_1 = require("rxjs");
var TraceWriterService = /** @class */ (function () {
    function TraceWriterService() {
        this.customWriter = new TimestampConsoleWriter();
        this.setupWriter();
    }
    TraceWriterService.prototype.subscribe = function (next, error, complete) {
        return this.customWriter.array.subscribe(next, error, complete);
    };
    TraceWriterService.prototype.setupWriter = function () {
        // setCategories(categories.All);
        trace_1.setCategories(trace_1.categories.Error);
        trace_1.enable();
        trace_1.clearWriters();
        trace_1.addWriter(this.customWriter);
    };
    TraceWriterService.prototype.disableWriter = function () {
        trace_1.disable();
    };
    TraceWriterService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [])
    ], TraceWriterService);
    return TraceWriterService;
}());
exports.TraceWriterService = TraceWriterService;
var TimestampConsoleWriter = /** @class */ (function () {
    function TimestampConsoleWriter() {
        this.array = new rxjs_1.Subject();
    }
    TimestampConsoleWriter.prototype.write = function (message, category, type) {
        if (!console) {
            return;
        }
        var msgType = types_1.isUndefined(type) ? trace_1.messageType.log : type;
        switch (msgType) {
            case trace_1.messageType.log:
                this.array.next({
                    messageType: "log",
                    date: new Date().toISOString(),
                    message: JSON.stringify(message),
                    category: JSON.stringify(category)
                });
                break;
            case trace_1.messageType.info:
                this.array.next({
                    messageType: "info",
                    date: new Date().toISOString(),
                    message: JSON.stringify(message),
                    category: JSON.stringify(category)
                });
                break;
            case trace_1.messageType.warn:
                this.array.next({
                    messageType: "warnings",
                    date: new Date().toISOString(),
                    message: JSON.stringify(message),
                    category: JSON.stringify(category)
                });
                break;
            case trace_1.messageType.error:
                this.array.next({
                    messageType: "error",
                    date: new Date().toISOString(),
                    message: JSON.stringify(message),
                    category: JSON.stringify(category)
                });
                break;
            default:
                break;
        }
    };
    return TimestampConsoleWriter;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2Utd3JpdGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFjZS13cml0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxnREFRZ0M7QUFDaEMsc0RBQTJEO0FBQzNELDZCQUE2QztBQUs3QztJQUdFO1FBRlEsaUJBQVksR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7UUFHbEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxzQ0FBUyxHQUFoQixVQUNFLElBQXFDLEVBQ3JDLEtBQTRCLEVBQzVCLFFBQXFCO1FBRXJCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVPLHdDQUFXLEdBQW5CO1FBQ0UsaUNBQWlDO1FBQ2pDLHFCQUFhLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxjQUFNLEVBQUUsQ0FBQztRQUNULG9CQUFZLEVBQUUsQ0FBQztRQUNmLGlCQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSwwQ0FBYSxHQUFwQjtRQUNFLGVBQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQXpCVSxrQkFBa0I7UUFIOUIsaUJBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7O09BQ1csa0JBQWtCLENBMEI5QjtJQUFELHlCQUFDO0NBQUEsQUExQkQsSUEwQkM7QUExQlksZ0RBQWtCO0FBNEIvQjtJQUFBO1FBQ1MsVUFBSyxHQUFHLElBQUksY0FBTyxFQUFpQixDQUFDO0lBNkM5QyxDQUFDO0lBM0NRLHNDQUFLLEdBQVosVUFBYSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUk7UUFDbEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU87U0FDUjtRQUNELElBQUksT0FBTyxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFekQsUUFBUSxPQUFPLEVBQUU7WUFDZixLQUFLLG1CQUFXLENBQUMsR0FBRztnQkFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQ2QsV0FBVyxFQUFFLEtBQUs7b0JBQ2xCLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtvQkFDOUIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO29CQUNoQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ25DLENBQUMsQ0FBQztnQkFDSCxNQUFNO1lBQ1IsS0FBSyxtQkFBVyxDQUFDLElBQUk7Z0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUNkLFdBQVcsRUFBRSxNQUFNO29CQUNuQixJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7b0JBQzlCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztvQkFDaEMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2lCQUNuQyxDQUFDLENBQUM7Z0JBQ0gsTUFBTTtZQUNSLEtBQUssbUJBQVcsQ0FBQyxJQUFJO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDZCxXQUFXLEVBQUUsVUFBVTtvQkFDdkIsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO29CQUM5QixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7b0JBQ2hDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztpQkFDbkMsQ0FBQyxDQUFDO2dCQUNILE1BQU07WUFDUixLQUFLLG1CQUFXLENBQUMsS0FBSztnQkFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQ2QsV0FBVyxFQUFFLE9BQU87b0JBQ3BCLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtvQkFDOUIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO29CQUNoQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ25DLENBQUMsQ0FBQztnQkFDSCxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTTtTQUNUO0lBQ0gsQ0FBQztJQUNILDZCQUFDO0FBQUQsQ0FBQyxBQTlDRCxJQThDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIHNldENhdGVnb3JpZXMsXHJcbiAgZW5hYmxlLFxyXG4gIGNhdGVnb3JpZXMsXHJcbiAgbWVzc2FnZVR5cGUsXHJcbiAgY2xlYXJXcml0ZXJzLFxyXG4gIGFkZFdyaXRlcixcclxuICBkaXNhYmxlLCBhZGRDYXRlZ29yaWVzXHJcbn0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy90cmFjZSc7XHJcbmltcG9ydCB7IGlzVW5kZWZpbmVkIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdXRpbHMvdHlwZXNcIjtcclxuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSBcInJ4anNcIjtcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiBcInJvb3RcIlxyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJhY2VXcml0ZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIGN1c3RvbVdyaXRlciA9IG5ldyBUaW1lc3RhbXBDb25zb2xlV3JpdGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZXR1cFdyaXRlcigpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN1YnNjcmliZShcclxuICAgIG5leHQ/OiAodmFsdWU6IElUcmFjZU1lc3NhZ2UpID0+IHZvaWQsXHJcbiAgICBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkLFxyXG4gICAgY29tcGxldGU/OiAoKSA9PiB2b2lkXHJcbiAgKTogU3Vic2NyaXB0aW9uIHtcclxuICAgIHJldHVybiB0aGlzLmN1c3RvbVdyaXRlci5hcnJheS5zdWJzY3JpYmUobmV4dCwgZXJyb3IsIGNvbXBsZXRlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0dXBXcml0ZXIoKSB7XHJcbiAgICAvLyBzZXRDYXRlZ29yaWVzKGNhdGVnb3JpZXMuQWxsKTtcclxuICAgIHNldENhdGVnb3JpZXMoY2F0ZWdvcmllcy5FcnJvcik7XHJcbiAgICBlbmFibGUoKTtcclxuICAgIGNsZWFyV3JpdGVycygpO1xyXG4gICAgYWRkV3JpdGVyKHRoaXMuY3VzdG9tV3JpdGVyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkaXNhYmxlV3JpdGVyKCkge1xyXG4gICAgZGlzYWJsZSgpO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgVGltZXN0YW1wQ29uc29sZVdyaXRlciB7XHJcbiAgcHVibGljIGFycmF5ID0gbmV3IFN1YmplY3Q8SVRyYWNlTWVzc2FnZT4oKTtcclxuXHJcbiAgcHVibGljIHdyaXRlKG1lc3NhZ2UsIGNhdGVnb3J5LCB0eXBlKSB7XHJcbiAgICBpZiAoIWNvbnNvbGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IG1zZ1R5cGUgPSBpc1VuZGVmaW5lZCh0eXBlKSA/IG1lc3NhZ2VUeXBlLmxvZyA6IHR5cGU7XHJcblxyXG4gICAgc3dpdGNoIChtc2dUeXBlKSB7XHJcbiAgICAgIGNhc2UgbWVzc2FnZVR5cGUubG9nOlxyXG4gICAgICAgIHRoaXMuYXJyYXkubmV4dCh7XHJcbiAgICAgICAgICBtZXNzYWdlVHlwZTogXCJsb2dcIixcclxuICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgIG1lc3NhZ2U6IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpLFxyXG4gICAgICAgICAgY2F0ZWdvcnk6IEpTT04uc3RyaW5naWZ5KGNhdGVnb3J5KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIG1lc3NhZ2VUeXBlLmluZm86XHJcbiAgICAgICAgdGhpcy5hcnJheS5uZXh0KHtcclxuICAgICAgICAgIG1lc3NhZ2VUeXBlOiBcImluZm9cIixcclxuICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgIG1lc3NhZ2U6IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpLFxyXG4gICAgICAgICAgY2F0ZWdvcnk6IEpTT04uc3RyaW5naWZ5KGNhdGVnb3J5KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIG1lc3NhZ2VUeXBlLndhcm46XHJcbiAgICAgICAgdGhpcy5hcnJheS5uZXh0KHtcclxuICAgICAgICAgIG1lc3NhZ2VUeXBlOiBcIndhcm5pbmdzXCIsXHJcbiAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgICBtZXNzYWdlOiBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSxcclxuICAgICAgICAgIGNhdGVnb3J5OiBKU09OLnN0cmluZ2lmeShjYXRlZ29yeSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBtZXNzYWdlVHlwZS5lcnJvcjpcclxuICAgICAgICB0aGlzLmFycmF5Lm5leHQoe1xyXG4gICAgICAgICAgbWVzc2FnZVR5cGU6IFwiZXJyb3JcIixcclxuICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgIG1lc3NhZ2U6IEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpLFxyXG4gICAgICAgICAgY2F0ZWdvcnk6IEpTT04uc3RyaW5naWZ5KGNhdGVnb3J5KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIElUcmFjZU1lc3NhZ2Uge1xyXG4gIG1lc3NhZ2VUeXBlOiBzdHJpbmc7XHJcbiAgbWVzc2FnZTogc3RyaW5nO1xyXG4gIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgZGF0ZTogc3RyaW5nO1xyXG59XHJcbiJdfQ==