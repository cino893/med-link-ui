"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var reduce_1 = require("rxjs/internal/operators/reduce");
var bluetooth = require("nativescript-bluetooth");
var database_service_1 = require("~/app/shared/database.service");
var PumpBluetoothApiService = /** @class */ (function () {
    function PumpBluetoothApiService(databaseService) {
        this.databaseService = databaseService;
        this.targetBluDeviceUUID2 = [];
    }
    PumpBluetoothApiService.prototype.enable = function () {
        bluetooth.enable();
    };
    PumpBluetoothApiService.prototype.scanAndConnect2 = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.targetBluDeviceUUID2 = [];
            bluetooth
                .startScanning({
                onDiscovered: function (peripheral) {
                    console.log(peripheral.name + peripheral.UUID + "C");
                    observer.next(peripheral.name + peripheral.UUID);
                    if (peripheral.name === 'MED-LINK' || peripheral.name === 'MED-LINK-2' || peripheral.name === 'MED-LINK-3' || peripheral.name === 'HMSoft') {
                        _this.targetBluDeviceUUID2.push(peripheral.name + ' ,' + peripheral.UUID);
                        _this.targetBluDeviceUUID = peripheral.UUID.toString();
                        console.log("UIID: " + _this.targetBluDeviceUUID);
                    }
                },
                skipPermissionCheck: true,
                seconds: 2
            }).then(function () { return observer.complete(); });
        }).pipe(reduce_1.reduce(function (acc, val) { return acc + val; }));
    };
    PumpBluetoothApiService.prototype.unsubscribeAll = function () {
        console.log("unsubscribeAll launchListenerCB:");
    };
    PumpBluetoothApiService.prototype.scanAndConnect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.databaseService.getMAC().then(function (a) {
                _this.targetBluDeviceUUID = a.toString();
                console.log("to jest target: " + _this.targetBluDeviceUUID);
                bluetooth.connect({
                    UUID: _this.targetBluDeviceUUID,
                    onConnected: function (peripheral) {
                        console.log('Połączono' + peripheral.UUID + ' ' + peripheral.name);
                        resolve(peripheral.name);
                    },
                    onDisconnected: function (peripheral) {
                        peripheral.name = 'ZONK';
                        console.log('Rozłączono' + peripheral.name + peripheral.UUID);
                        reject(peripheral.name);
                        _this.unsubscribeAll();
                    },
                });
            });
        });
    };
    PumpBluetoothApiService.prototype.sendCommand = function (command) {
        var buffer = [];
        console.log('bede wysylal komunikat');
        //traceModule.write( "AAAAAAAAAAAAAAa  YYYYYunhandled-error", traceModule.categories.Debug, 2);
        for (var _i = 0, command_1 = command; _i < command_1.length; _i++) {
            var char = command_1[_i];
            var charCode = char.charCodeAt(0);
            buffer.push(charCode);
        }
        if (buffer.length) {
            this.recursiveWrite(buffer);
            console.log('udalo sie chyba to wsykacccc komunikat');
        }
    };
    PumpBluetoothApiService.prototype.sendCommand2 = function (command) {
        var buffer = [];
        console.log('prawdziwe ssss');
        for (var _i = 0, command_2 = command; _i < command_2.length; _i++) {
            var char = command_2[_i];
            var charCode = char.charCodeAt(0);
            buffer.push(charCode);
            if (charCode === 0x0a /*LF*/) {
                buffer.push(0x0d /*CR*/);
            }
        }
        if (buffer.length) {
            this.recursiveWrite(buffer);
        }
    };
    PumpBluetoothApiService.prototype.sendCommand3 = function (command) {
        var buffer = [];
        console.log('prawdziwe ssss');
        for (var _i = 0, command_3 = command; _i < command_3.length; _i++) {
            var char = command_3[_i];
            var charCode = char.charCodeAt(0);
            buffer.push(charCode);
            console.log("aaatotootototo:" + buffer);
        }
        if (buffer.length) {
            buffer.push(0x0d /*CR*/);
            buffer.push(0x0a /*LF*/);
            this.recursiveWrite(buffer);
        }
    };
    PumpBluetoothApiService.prototype.recursiveWrite = function (array, startByte, chunkLength) {
        var _this = this;
        if (startByte === void 0) { startByte = 0; }
        if (chunkLength === void 0) { chunkLength = 20; }
        var nextByte = startByte + chunkLength;
        bluetooth
            .writeWithoutResponse({
            peripheralUUID: this.targetBluDeviceUUID,
            characteristicUUID: 'ffe1',
            serviceUUID: 'ffe0',
            value: new Uint8Array(array.slice(startByte, nextByte))
        })
            .then(function () {
            if (nextByte < array.length) {
                _this.recursiveWrite(array, nextByte);
            }
        });
    };
    PumpBluetoothApiService.prototype.disconnect = function () {
        bluetooth.disconnect({ UUID: this.targetBluDeviceUUID });
    };
    PumpBluetoothApiService.prototype.read = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            bluetooth.startNotifying({
                onNotify: function (_a) {
                    var value = _a.value;
                    var result = new Uint8Array(value).reduce(function (o, byte) { return (o += String.fromCharCode(byte)); }, '');
                    observer.next(result);
                    console.log(result);
                    if (result.includes('rea') || result.includes('komunikacji')) {
                        observer.complete();
                    }
                },
                peripheralUUID: _this.targetBluDeviceUUID,
                characteristicUUID: 'ffe1',
                serviceUUID: 'ffe0'
            });
        }).pipe(reduce_1.reduce(function (acc, val) { return acc + val; }));
    };
    PumpBluetoothApiService.prototype.read2 = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            bluetooth.startNotifying({
                onNotify: function (_a) {
                    var value = _a.value;
                    var result = new Uint8Array(value).reduce(function (o, byte) { return (o += String.fromCharCode(byte)); }, '');
                    observer.next(result);
                    console.log(result);
                    if (result.includes('EomEomEo') || result.includes('Podaj numer') || result.includes('Test O') || result.includes('Podaj imie') || result.includes('KASUJ')) {
                        observer.complete();
                    }
                },
                peripheralUUID: _this.targetBluDeviceUUID,
                characteristicUUID: 'ffe1',
                serviceUUID: 'ffe0',
            });
        }).pipe(reduce_1.reduce(function (acc, val) { return acc + val; }));
    };
    PumpBluetoothApiService.prototype.read3 = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            bluetooth.startNotifying({
                onNotify: function (_a) {
                    var value = _a.value;
                    var result = new Uint8Array(value).reduce(function (o, byte) { return (o += String.fromCharCode(byte)); }, '');
                    observer.next(result);
                    console.log(result);
                    if (result.includes('zatrzyman') || result.includes('uruchomion') || result.includes('ustaw')) {
                        observer.complete();
                    }
                },
                peripheralUUID: _this.targetBluDeviceUUID,
                characteristicUUID: 'ffe1',
                serviceUUID: 'ffe0'
            });
        }).pipe(reduce_1.reduce(function (acc, val) { return acc + val; }));
    };
    PumpBluetoothApiService.prototype.read4 = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            bluetooth.startNotifying({
                onNotify: function (_a) {
                    var value = _a.value;
                    var result = new Uint8Array(value).reduce(function (o, byte) { return (o += String.fromCharCode(byte)); }, '');
                    observer.next(result);
                    console.log(result);
                    if (result.includes('uruchomion')) {
                        observer.complete();
                    }
                },
                peripheralUUID: _this.targetBluDeviceUUID,
                characteristicUUID: 'ffe1',
                serviceUUID: 'ffe0'
            });
        }).pipe(reduce_1.reduce(function (acc, val) { return acc + val; }));
    };
    PumpBluetoothApiService.prototype.read5 = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            bluetooth.startNotifying({
                onNotify: function (_a) {
                    var value = _a.value;
                    var result = new Uint8Array(value).reduce(function (o, byte) { return (o += String.fromCharCode(byte)); }, '');
                    observer.next(result);
                    console.log(result);
                    if (result.includes('zatrzyman') || result.includes('ready')) {
                        observer.complete();
                    }
                },
                peripheralUUID: _this.targetBluDeviceUUID,
                characteristicUUID: 'ffe1',
                serviceUUID: 'ffe0'
            });
        }).pipe(reduce_1.reduce(function (acc, val) { return acc + val; }));
    };
    PumpBluetoothApiService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [database_service_1.DatabaseService])
    ], PumpBluetoothApiService);
    return PumpBluetoothApiService;
}());
exports.PumpBluetoothApiService = PumpBluetoothApiService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVtcC1ibHVldG9vdGgtYXBpLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwdW1wLWJsdWV0b290aC1hcGkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE4RDtBQUU5RCw2QkFBa0M7QUFDbEMseURBQXdEO0FBQ3hELGtEQUFvRDtBQUVwRCxrRUFBZ0U7QUFRaEU7SUFJRSxpQ0FDVSxlQUFnQztRQUFoQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFIMUMseUJBQW9CLEdBQUcsRUFBRSxDQUFDO0lBSzFCLENBQUM7SUFFRCx3Q0FBTSxHQUFOO1FBQ0UsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxpREFBZSxHQUFmO1FBQUEsaUJBbUJDO1FBbEJDLE9BQU8sSUFBSSxpQkFBVSxDQUFTLFVBQUEsUUFBUTtZQUNwQyxLQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO1lBQy9CLFNBQVM7aUJBQ04sYUFBYSxDQUFDO2dCQUNiLFlBQVksRUFBRSxVQUFDLFVBQXNCO29CQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDckQsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakQsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFlBQVksSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFlBQVksSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTt3QkFDMUksS0FBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3pFLEtBQUksQ0FB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YmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFBlcmlwaGVyYWwgfSBmcm9tICduYXRpdmVzY3JpcHQtYmx1ZXRvb3RoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyByZWR1Y2UgfSBmcm9tICdyeGpzL2ludGVybmFsL29wZXJhdG9ycy9yZWR1Y2UnO1xyXG5pbXBvcnQgKiBhcyBibHVldG9vdGggZnJvbSAnbmF0aXZlc2NyaXB0LWJsdWV0b290aCc7XHJcbmltcG9ydCB7IERhdGFGYWNhZGVTZXJ2aWNlIH0gZnJvbSAnfi9hcHAvc2hhcmVkL2RhdGEtZmFjYWRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBEYXRhYmFzZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zaGFyZWQvZGF0YWJhc2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IEZvcmVncm91bmRGYWNhZGVTZXJ2aWNlIH0gZnJvbSAnfi9hcHAvc2hhcmVkL2ZvcmVncm91bmQtZmFjYWRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSYXdEYXRhU2VydmljZSB9IGZyb20gJ34vYXBwL3NoYXJlZC9yYXctZGF0YS1wYXJzZS5zZXJ2aWNlJztcclxuaW1wb3J0ICogYXMgdHJhY2VNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdHJhY2VcIlxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgUHVtcEJsdWV0b290aEFwaVNlcnZpY2Uge1xyXG4gIHRhcmdldEJsdURldmljZVVVSUQ6IHN0cmluZztcclxuICB0YXJnZXRCbHVEZXZpY2VVVUlEMiA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZGF0YWJhc2VTZXJ2aWNlOiBEYXRhYmFzZVNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIGVuYWJsZSgpIHtcclxuICAgIGJsdWV0b290aC5lbmFibGUoKTtcclxuICB9XHJcbiAgc2NhbkFuZENvbm5lY3QyKCkge1xyXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPHN0cmluZz4ob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICB0aGlzLnRhcmdldEJsdURldmljZVVVSUQyID0gW107XHJcbiAgICAgIGJsdWV0b290aFxyXG4gICAgICAgIC5zdGFydFNjYW5uaW5nKHtcclxuICAgICAgICAgIG9uRGlzY292ZXJlZDogKHBlcmlwaGVyYWw6IFBlcmlwaGVyYWwpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGVyaXBoZXJhbC5uYW1lICsgcGVyaXBoZXJhbC5VVUlEICsgXCJDXCIpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHBlcmlwaGVyYWwubmFtZSArIHBlcmlwaGVyYWwuVVVJRCk7XHJcbiAgICAgICAgICAgIGlmIChwZXJpcGhlcmFsLm5hbWUgPT09ICdNRUQtTElOSycgfHwgcGVyaXBoZXJhbC5uYW1lID09PSAnTUVELUxJTkstMicgfHwgcGVyaXBoZXJhbC5uYW1lID09PSAnTUVELUxJTkstMycgfHwgcGVyaXBoZXJhbC5uYW1lID09PSAnSE1Tb2Z0Jykge1xyXG4gICAgICAgICAgICAgIHRoaXMudGFyZ2V0Qmx1RGV2aWNlVVVJRDIucHVzaChwZXJpcGhlcmFsLm5hbWUgKyAnICwnICsgcGVyaXBoZXJhbC5VVUlEKTtcclxuICAgICAgICAgICAgICB0aGlzLnRhcmdldEJsdURldmljZVVVSUQgPSBwZXJpcGhlcmFsLlVVSUQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVJSUQ6IFwiICsgdGhpcy50YXJnZXRCbHVEZXZpY2VVVUlEKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLFxyXG4gICAgICAgICAgc2tpcFBlcm1pc3Npb25DaGVjazogdHJ1ZSxcclxuICAgICAgICAgIHNlY29uZHM6IDJcclxuICAgICAgICB9KS50aGVuKCgpID0+IG9ic2VydmVyLmNvbXBsZXRlKCkpO1xyXG4gICAgfSkucGlwZShyZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwpKTtcclxuICB9XHJcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUFsbCgpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKFwidW5zdWJzY3JpYmVBbGwgbGF1bmNoTGlzdGVuZXJDQjpcIik7XHJcbiAgfVxyXG5cclxuICBzY2FuQW5kQ29ubmVjdCgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLmdldE1BQygpLnRoZW4oYSA9PlxyXG4gICAgICB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRCbHVEZXZpY2VVVUlEID0gYS50b1N0cmluZygpO1xyXG4gICAgICBjb25zb2xlLmxvZyhcInRvIGplc3QgdGFyZ2V0OiBcIiArIHRoaXMudGFyZ2V0Qmx1RGV2aWNlVVVJRCk7XHJcbiAgICAgIGJsdWV0b290aC5jb25uZWN0KHtcclxuICAgICAgICBVVUlEOiB0aGlzLnRhcmdldEJsdURldmljZVVVSUQsXHJcbiAgICAgICAgb25Db25uZWN0ZWQ6IChwZXJpcGhlcmFsOiBQZXJpcGhlcmFsKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUG/FgsSFY3pvbm8nICsgcGVyaXBoZXJhbC5VVUlEICsgJyAnICsgcGVyaXBoZXJhbC5uYW1lKTtcclxuICAgICAgICAgIHJlc29sdmUocGVyaXBoZXJhbC5uYW1lKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uRGlzY29ubmVjdGVkOiAocGVyaXBoZXJhbDogUGVyaXBoZXJhbCkgPT4ge1xyXG4gICAgICAgICAgcGVyaXBoZXJhbC5uYW1lID0gJ1pPTksnO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1JvesWCxIVjem9ubycgKyBwZXJpcGhlcmFsLm5hbWUgKyBwZXJpcGhlcmFsLlVVSUQpO1xyXG4gICAgICAgICAgcmVqZWN0KHBlcmlwaGVyYWwubmFtZSk7XHJcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlQWxsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgfVxyXG4gIHNlbmRDb21tYW5kKGNvbW1hbmQpIHtcclxuICAgIGNvbnN0IGJ1ZmZlciA9IFtdO1xyXG4gICAgY29uc29sZS5sb2coJ2JlZGUgd3lzeWxhbCBrb211bmlrYXQnKTtcclxuICAgIC8vdHJhY2VNb2R1bGUud3JpdGUoIFwiQUFBQUFBQUFBQUFBQUFhICBZWVlZWXVuaGFuZGxlZC1lcnJvclwiLCB0cmFjZU1vZHVsZS5jYXRlZ29yaWVzLkRlYnVnLCAyKTtcclxuICAgIGZvciAoY29uc3QgY2hhciBvZiBjb21tYW5kKSB7XHJcbiAgICAgIGNvbnN0IGNoYXJDb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xyXG4gICAgICBidWZmZXIucHVzaChjaGFyQ29kZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnJlY3Vyc2l2ZVdyaXRlKGJ1ZmZlcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1ZGFsbyBzaWUgY2h5YmEgdG8gd3N5a2FjY2NjIGtvbXVuaWthdCcpO1xyXG4gICAgfVxyXG4gIH1cclxuICBzZW5kQ29tbWFuZDIoY29tbWFuZCkge1xyXG4gICAgY29uc3QgYnVmZmVyID0gW107XHJcbiAgICBjb25zb2xlLmxvZygncHJhd2R6aXdlIHNzc3MnKTtcclxuICAgIGZvciAoY29uc3QgY2hhciBvZiBjb21tYW5kKSB7XHJcbiAgICAgIGNvbnN0IGNoYXJDb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xyXG4gICAgICBidWZmZXIucHVzaChjaGFyQ29kZSk7XHJcbiAgICAgIGlmIChjaGFyQ29kZSA9PT0gMHgwYSAvKkxGKi8pIHtcclxuICAgICAgICBidWZmZXIucHVzaCgweDBkIC8qQ1IqLyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChidWZmZXIubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMucmVjdXJzaXZlV3JpdGUoYnVmZmVyKTtcclxuICAgIH1cclxuICB9XHJcbiAgc2VuZENvbW1hbmQzKGNvbW1hbmQpIHtcclxuICAgIGNvbnN0IGJ1ZmZlciA9IFtdO1xyXG4gICAgY29uc29sZS5sb2coJ3ByYXdkeml3ZSBzc3NzJyk7XHJcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY29tbWFuZCkge1xyXG4gICAgICBjb25zdCBjaGFyQ29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcclxuICAgICAgYnVmZmVyLnB1c2goY2hhckNvZGUpO1xyXG5cclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiYWFhdG90b290b3RvdG86XCIgICsgYnVmZmVyICk7XHJcbiAgICB9XHJcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCkge1xyXG4gICAgICBidWZmZXIucHVzaCgweDBkIC8qQ1IqLyk7XHJcbiAgICAgIGJ1ZmZlci5wdXNoKDB4MGEgLypMRiovKTtcclxuICAgICAgdGhpcy5yZWN1cnNpdmVXcml0ZShidWZmZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHByaXZhdGUgcmVjdXJzaXZlV3JpdGUoXHJcbiAgICBhcnJheTogQXJyYXk8bnVtYmVyPixcclxuICAgIHN0YXJ0Qnl0ZSA9IDAsXHJcbiAgICBjaHVua0xlbmd0aCA9IDIwXHJcbiAgKSB7XHJcbiAgICBjb25zdCBuZXh0Qnl0ZSA9IHN0YXJ0Qnl0ZSArIGNodW5rTGVuZ3RoO1xyXG4gICAgYmx1ZXRvb3RoXHJcbiAgICAgIC53cml0ZVdpdGhvdXRSZXNwb25zZSh7XHJcbiAgICAgICAgcGVyaXBoZXJhbFVVSUQ6IHRoaXMudGFyZ2V0Qmx1RGV2aWNlVVVJRCxcclxuICAgICAgICBjaGFyYWN0ZXJpc3RpY1VVSUQ6ICdmZmUxJyxcclxuICAgICAgICBzZXJ2aWNlVVVJRDogJ2ZmZTAnLFxyXG4gICAgICAgIHZhbHVlOiBuZXcgVWludDhBcnJheShhcnJheS5zbGljZShzdGFydEJ5dGUsIG5leHRCeXRlKSlcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGlmIChuZXh0Qnl0ZSA8IGFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5yZWN1cnNpdmVXcml0ZShhcnJheSwgbmV4dEJ5dGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KCkge1xyXG4gICAgYmx1ZXRvb3RoLmRpc2Nvbm5lY3Qoe1VVSUQ6IHRoaXMudGFyZ2V0Qmx1RGV2aWNlVVVJRH0pO1xyXG4gIH1cclxuXHJcbiAgcmVhZCgpIHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KG9ic2VydmVyID0+IHtcclxuICAgICAgYmx1ZXRvb3RoLnN0YXJ0Tm90aWZ5aW5nKHtcclxuICAgICAgICBvbk5vdGlmeTogKHsgdmFsdWUgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUpLnJlZHVjZShcclxuICAgICAgICAgICAgKG8sIGJ5dGUpID0+IChvICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZSkpLFxyXG4gICAgICAgICAgICAnJ1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5pbmNsdWRlcygncmVhJykgfHwgcmVzdWx0LmluY2x1ZGVzKCdrb211bmlrYWNqaScpKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwZXJpcGhlcmFsVVVJRDogdGhpcy50YXJnZXRCbHVEZXZpY2VVVUlELFxyXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVVVJRDogJ2ZmZTEnLFxyXG4gICAgICAgIHNlcnZpY2VVVUlEOiAnZmZlMCdcclxuICAgICAgfSk7XHJcbiAgICB9KS5waXBlKHJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCkpO1xyXG4gIH1cclxuICByZWFkMigpIHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KG9ic2VydmVyID0+IHtcclxuICAgICAgYmx1ZXRvb3RoLnN0YXJ0Tm90aWZ5aW5nKHtcclxuICAgICAgICBvbk5vdGlmeTogKHsgdmFsdWUgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUpLnJlZHVjZShcclxuICAgICAgICAgICAgICAobywgYnl0ZSkgPT4gKG8gKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlKSksXHJcbiAgICAgICAgICAgICAgJydcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXN1bHQpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgIGlmIChyZXN1bHQuaW5jbHVkZXMoJ0VvbUVvbUVvJykgfHwgcmVzdWx0LmluY2x1ZGVzKCdQb2RhaiBudW1lcicpIHx8ICByZXN1bHQuaW5jbHVkZXMoJ1Rlc3QgTycpIHx8ICByZXN1bHQuaW5jbHVkZXMoJ1BvZGFqIGltaWUnKSB8fCByZXN1bHQuaW5jbHVkZXMoJ0tBU1VKJykpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHBlcmlwaGVyYWxVVUlEOiB0aGlzLnRhcmdldEJsdURldmljZVVVSUQsXHJcbiAgICAgICAgY2hhcmFjdGVyaXN0aWNVVUlEOiAnZmZlMScsXHJcbiAgICAgICAgc2VydmljZVVVSUQ6ICdmZmUwJyxcclxuICAgICAgfSk7XHJcbiAgICB9KS5waXBlKHJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCkpO1xyXG4gIH1cclxuICByZWFkMygpIHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KG9ic2VydmVyID0+IHtcclxuICAgICAgYmx1ZXRvb3RoLnN0YXJ0Tm90aWZ5aW5nKHtcclxuICAgICAgICBvbk5vdGlmeTogKHsgdmFsdWUgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUpLnJlZHVjZShcclxuICAgICAgICAgICAgKG8sIGJ5dGUpID0+IChvICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZSkpLFxyXG4gICAgICAgICAgICAnJ1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5pbmNsdWRlcygnemF0cnp5bWFuJykgfHwgcmVzdWx0LmluY2x1ZGVzKCd1cnVjaG9taW9uJykgfHwgcmVzdWx0LmluY2x1ZGVzKCd1c3RhdycpKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwZXJpcGhlcmFsVVVJRDogdGhpcy50YXJnZXRCbHVEZXZpY2VVVUlELFxyXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVVVJRDogJ2ZmZTEnLFxyXG4gICAgICAgIHNlcnZpY2VVVUlEOiAnZmZlMCdcclxuICAgICAgfSk7XHJcbiAgICB9KS5waXBlKHJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCkpO1xyXG4gIH1cclxuICByZWFkNCgpIHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KG9ic2VydmVyID0+IHtcclxuICAgICAgYmx1ZXRvb3RoLnN0YXJ0Tm90aWZ5aW5nKHtcclxuICAgICAgICBvbk5vdGlmeTogKHsgdmFsdWUgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUpLnJlZHVjZShcclxuICAgICAgICAgICAgKG8sIGJ5dGUpID0+IChvICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZSkpLFxyXG4gICAgICAgICAgICAnJ1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5pbmNsdWRlcygndXJ1Y2hvbWlvbicpKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwZXJpcGhlcmFsVVVJRDogdGhpcy50YXJnZXRCbHVEZXZpY2VVVUlELFxyXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVVVJRDogJ2ZmZTEnLFxyXG4gICAgICAgIHNlcnZpY2VVVUlEOiAnZmZlMCdcclxuICAgICAgfSk7XHJcbiAgICB9KS5waXBlKHJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCkpO1xyXG4gIH1cclxuICByZWFkNSgpIHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KG9ic2VydmVyID0+IHtcclxuICAgICAgYmx1ZXRvb3RoLnN0YXJ0Tm90aWZ5aW5nKHtcclxuICAgICAgICBvbk5vdGlmeTogKHsgdmFsdWUgfSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUpLnJlZHVjZShcclxuICAgICAgICAgICAgKG8sIGJ5dGUpID0+IChvICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZSkpLFxyXG4gICAgICAgICAgICAnJ1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5pbmNsdWRlcygnemF0cnp5bWFuJykgfHwgcmVzdWx0LmluY2x1ZGVzKCdyZWFkeScpKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwZXJpcGhlcmFsVVVJRDogdGhpcy50YXJnZXRCbHVEZXZpY2VVVUlELFxyXG4gICAgICAgIGNoYXJhY3RlcmlzdGljVVVJRDogJ2ZmZTEnLFxyXG4gICAgICAgIHNlcnZpY2VVVUlEOiAnZmZlMCdcclxuICAgICAgfSk7XHJcbiAgICB9KS5waXBlKHJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCkpO1xyXG4gIH1cclxufVxyXG4iXX0=