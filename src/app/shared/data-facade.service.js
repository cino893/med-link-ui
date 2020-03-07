"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var database_service_1 = require("~/app/shared/database.service");
var nightscout_api_service_1 = require("~/app/shared/nightscout-api.service");
var pump_bluetooth_api_service_1 = require("~/app/shared/pump-bluetooth-api.service");
var raw_data_parse_service_1 = require("~/app/shared/raw-data-parse.service");
var wake_facade_service_1 = require("~/app/shared/wake-facade.service");
var appSettings = require("application-settings");
var DataFacadeService = /** @class */ (function () {
    function DataFacadeService(databaseService, zone, nightscoutApiService, pumpBluetoothApiService, rawDataService, wakeFacadeService) {
        this.databaseService = databaseService;
        this.zone = zone;
        this.nightscoutApiService = nightscoutApiService;
        this.pumpBluetoothApiService = pumpBluetoothApiService;
        this.rawDataService = rawDataService;
        this.wakeFacadeService = wakeFacadeService;
        this.stanPump = "W TRAKCIE...";
        this.ww = /zakres\s(\d{1}):\s(.\W\d{3})\sJ\/WW\sstart\sgodz.\s(\d{2}:\d{2})/g;
        this.ww2 = /zakres\s(\d{1}):\s(.\W\d{3})\sJ\/WW\sstart\sgodz.\s(\d{2}:\d{2})/;
        this.isf = /zakres\s(\d{1}):\s\s?(\d{2,3})mg.dl\sstart\sgodz.\s(\d{2}:\d{2})/g;
        this.isf2 = /zakres\s(\d{1}):\s\s?(\d{2,3})mg.dl\sstart\sgodz.\s(\d{2}:\d{2})/;
        this.bgRange = /zakres\s(\d{1}):\s?(\d{2,3}-.\d{2,3})\sstart\sgodz.\s(\d{2}:\d{2})/g;
        this.bgRange2 = /zakres\s(\d{1}):\s?(\d{2,3}-.\d{2,3})\sstart\sgodz.\s(\d{2}:\d{2})/;
        this.databaseService.createTable();
    }
    DataFacadeService.prototype.clearInt = function () {
        clearInterval(appSettings.getNumber('int0'));
    };
    DataFacadeService.prototype.sendDataToLocalDb = function (pumpStatus) {
        return this.databaseService.insertBG(pumpStatus.bloodGlucose);
    };
    DataFacadeService.prototype.sendDataToLocalDb2 = function (pumpStatus) {
        return this.databaseService.insertTreatments(pumpStatus.lastBolus);
    };
    DataFacadeService.prototype.sendCalcToLacalDB = function (pumpStatus) {
        return this.databaseService.insertCalc(new Date().toString(), pumpStatus.calc.idVal, pumpStatus.calc.value, pumpStatus.calc.hours, pumpStatus.calc.category);
    };
    DataFacadeService.prototype.sendCalcToLacalDbMax = function (pumpStatus) {
        return this.databaseService.insertCalc(new Date().toString(), 1, pumpStatus.maximumBolusSetting, '00:00', 'max');
    };
    DataFacadeService.prototype.sendCalcToLacalDbstep = function (pumpStatus) {
        return this.databaseService.insertCalc(new Date().toString(), 1, pumpStatus.incrementStepSetting, '00:00', 'step');
    };
    DataFacadeService.prototype.sendDataToLocalDb3 = function (pumpStatus) {
        return this.databaseService.insertDeviceStatus(pumpStatus.insulinInPompLeft, pumpStatus.batteryVoltage, pumpStatus.data, pumpStatus.statusPump);
    };
    DataFacadeService.prototype.sendDataToLocalDb4 = function (pumpStatus) {
        return this.databaseService.insertTempBasal(pumpStatus.temporaryBasalMethodPercentage.percentsOfBaseBasal, pumpStatus.temporaryBasalMethodPercentage.timeLeftInMinutes, pumpStatus.temporaryBasalMethodPercentage.timestamp);
    };
    DataFacadeService.prototype.getDatafromLocalDb = function () {
        var _this = this;
        return this.databaseService.getBG().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                value: +a[0],
                date: new Date(a[1]),
                old: _this.setArrow(a[3])
            }); });
        }));
    };
    DataFacadeService.prototype.getDatafromLocalDb2 = function () {
        return this.databaseService.getTreatments().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                value: +a[0],
                date: new Date(a[1])
            }); });
        }));
    };
    DataFacadeService.prototype.getCalcfromLocalDb = function () {
        return this.databaseService.getCalc().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                idVal: +a[0],
                category: a[1],
                dateString: a[2],
                value: a[3],
                hour: a[4]
            }); });
        }));
    };
    DataFacadeService.prototype.getDatafromLocalDb3 = function () {
        return this.databaseService.getDS().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                reservoir: +a[0],
                voltage: +a[1],
                dateString: new Date(a[2]),
                percent: +a[3],
                status: a[4]
            }); });
        }));
    };
    DataFacadeService.prototype.getDatafromLocalDb4 = function () {
        return this.databaseService.getTempBasal().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                percentsOfBasal: +a[0],
                minutes: +a[1],
                dateString: new Date(a[2])
            }); });
        }));
    };
    DataFacadeService.prototype.sendDatatoNightscout = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDatafromLocalDb().subscribe(function (glucoses) {
                _this.nightscoutApiService
                    .sendNewBG(glucoses)
                    .then(function (successValue) { return resolve(successValue); }, function (errorValue) { return reject(errorValue); });
            });
        });
    };
    DataFacadeService.prototype.sendDatatoNightscout2 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDatafromLocalDb2().subscribe(function (treatments) {
                _this.nightscoutApiService
                    .sendNewBol(treatments)
                    .then(function (successValue) { return resolve(successValue); }, function (errorValue) { return reject(errorValue); });
            });
        });
    };
    DataFacadeService.prototype.sendDatatoNightscout3 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDatafromLocalDb3().subscribe(function (deviceStatus) {
                _this.nightscoutApiService
                    .sendNewDevicestatus(deviceStatus)
                    .then(function (successValue) { return resolve(successValue); }, function (errorValue) { return reject(errorValue); });
            });
        });
    };
    DataFacadeService.prototype.getDataFromNightscout = function () {
        var _this = this;
        this.nightscoutApiService.getBGfromNs().then(function (svg) {
            console.log("TAAAAAAAAAAK2: " + JSON.stringify(svg));
            var obj = JSON.parse(JSON.stringify(svg[0]));
            console.log(obj.sgv, svg[0]);
            _this.databaseService.insertBGfromNs(obj.sgv, new Date(obj.dateString), 1);
            // this.databaseService.insertBG(JSON.stringify(svg))
        });
    };
    DataFacadeService.prototype.sendDatatoNightscout4 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDatafromLocalDb4().subscribe(function (tempbasal) {
                _this.nightscoutApiService
                    .sendNewTempBasal(tempbasal)
                    .then(function (successValue) { return resolve(successValue); }, function (errorValue) { return reject(errorValue); });
            });
        });
    };
    DataFacadeService.prototype.scanAndConnect = function () {
        var _this = this;
        //this.wakeFacadeService.wakeScreenByCall();
        try {
            this.pumpBluetoothApiService
                .scanAndConnect()
                .then(function (uidBt) {
                if (uidBt === "MED-LINK" || uidBt === "MED-LINK-2" || uidBt === "MED-LINK-3" || uidBt === "HMSoft") {
                    console.log(uidBt + "BBBBBBBBBBBBBBBBBBBBB");
                    return Promise.resolve(uidBt);
                }
                else {
                    console.log(uidBt + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                    return Promise.reject();
                }
            }, function (uidBt) {
                console.log("poszedł prawdziwy reject11!!!!!" + uidBt + "       d");
                return _this.pumpBluetoothApiService.scanAndConnect().then(function (uidBt2) {
                    if (uidBt2 === "HMSoft") {
                        console.log(uidBt2 + "BBBBBBBBBBBBBBBBBBBBB");
                        return Promise.resolve(uidBt2);
                    }
                    else {
                        console.log(uidBt2 + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                        return Promise.reject();
                    }
                    console.log("XaXaXaXaXa");
                }, function () {
                    console.log("jednak nie udalo sie za 2");
                    return Promise.reject();
                });
            })
                .then(function () {
                return setTimeout(function () { return _this.pumpBluetoothApiService.sendCommand("OK+CONN"); }, 2500);
            }, function () {
                console.log("zatem nie wyslam ok kona");
                return Promise.reject(console.log("adam23333333"));
            })
                .then(function () {
                _this.waitOnReady();
            }, function () {
                console.log("zatem nie czekam na ready");
                //this.wakeFacadeService.snoozeScreenByCall();
            })
                .catch(function (error) { return console.log("error: ", error); });
        }
        catch (_a) {
            console.log("Totalna zsssajebka");
        }
        //const estimatedTimeToEndTask = 30 * 1000;
        //setTimeout(() => this.wakeFacadeService.snoozeScreenByCall(), estimatedTimeToEndTask);
    };
    DataFacadeService.prototype.scanAndConnectStop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.pumpBluetoothApiService
                    .scanAndConnect()
                    .then(function (uidBt) {
                    if (uidBt === "MED-LINK" || uidBt === "MED-LINK-2" || uidBt === "MED-LINK-3" || uidBt === "HMSoft") {
                        console.log(uidBt + "BBBBBBBBBBBBBBBBBBBBB");
                        return Promise.resolve(uidBt);
                    }
                    else {
                        console.log(uidBt + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                        return Promise.reject();
                    }
                }, function (uidBt) {
                    console.log("poszedł prawdziwy reject11!!!!!" + uidBt + "       d");
                    return _this.pumpBluetoothApiService.scanAndConnect().then(function (uidBt2) {
                        if (uidBt2 === "HMSoft") {
                            console.log(uidBt2 + "BBBBBBBBBBBBBBBBBBBBB");
                            return Promise.resolve(uidBt2);
                        }
                        else {
                            console.log(uidBt2 + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                            return Promise.reject();
                        }
                        console.log("XaXaXaXaXa");
                    }, function () {
                        console.log("jednak nie udalo sie za 2");
                        return Promise.reject();
                    });
                })
                    .then(function () {
                    return setTimeout(function () { return _this.pumpBluetoothApiService.sendCommand("OK+CONN"); }, 2500);
                }, function () {
                    console.log("zatem nie wyslam ok kona");
                    return Promise.reject(console.log("adam23333333"));
                })
                    .then(function () {
                    var timeoutAlert = setTimeout(function () { return _this.errorPumpStan(); }, 63 * 1000);
                    _this.pumpBluetoothApiService.read().subscribe(function () {
                        _this.pumpBluetoothApiService.sendCommand2("a");
                        setTimeout(function () { return _this.pumpBluetoothApiService.read3()
                            .subscribe(function (dane) {
                            console.log("To jest wynik" + dane);
                            if (dane.toString().includes("uruchomiona")) {
                                console.log("STOP POMPA");
                                _this.pumpBluetoothApiService.sendCommand("stop");
                                setTimeout(function () { return _this.pumpBluetoothApiService.read5().subscribe(function () {
                                    _this.zone.run(function () { return appSettings.setString("pumpStan", "WZNOW POMPE"); });
                                    _this.pumpBluetoothApiService.disconnect();
                                    clearTimeout(timeoutAlert);
                                    resolve();
                                }); }, 500);
                            }
                            else {
                                console.log("START POMPA!!!");
                                _this.pumpBluetoothApiService.sendCommand("start");
                                setTimeout(function () { return _this.pumpBluetoothApiService.read4().subscribe(function () {
                                    _this.zone.run(function () { return appSettings.setString("pumpStan", "ZAWIES POMPE"); });
                                    _this.pumpBluetoothApiService.disconnect();
                                    clearTimeout(timeoutAlert);
                                    resolve();
                                }); }, 500);
                            }
                        }, function () { return _this.errorPumpStan(); }); }, 400);
                    }, function () { return _this.errorPumpStan(); });
                }, function () {
                    console.log("zatem nie czekam na ready");
                    _this.errorPumpStan();
                    reject();
                });
            }
            catch (_a) {
                console.log("Totalna zsssajebka");
                reject();
            }
        });
    };
    DataFacadeService.prototype.scanAndConnectBOL = function (r) {
        var _this = this;
        //  this.wakeFacadeService.wakeScreenByCall();
        return new Promise(function (resolve, reject) {
            try {
                _this.pumpBluetoothApiService
                    .scanAndConnect()
                    .then(function (uidBt) {
                    if (uidBt === "MED-LINK" || uidBt === "MED-LINK-2" || uidBt === "MED-LINK-3" || uidBt === "HMSoft") {
                        console.log(uidBt + "BBBBBBBBBBBBBBBBBBBBB");
                        return Promise.resolve(uidBt);
                    }
                    else {
                        console.log(uidBt + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                        return Promise.reject();
                    }
                }, function (uidBt) {
                    console.log("poszedł prawdziwy reject11!!!!!" + uidBt + "       d");
                    return _this.pumpBluetoothApiService.scanAndConnect().then(function (uidBt2) {
                        if (uidBt2 === "HMSoft") {
                            console.log(uidBt2 + "BBBBBBBBBBBBBBBBBBBBB");
                            return Promise.resolve(uidBt2);
                        }
                        else {
                            console.log(uidBt2 + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                            return Promise.reject();
                        }
                    }, function () {
                        console.log("jednak nie udalo sie za 2");
                        return Promise.reject();
                    });
                })
                    .then(function () {
                    return setTimeout(function () { return _this.pumpBluetoothApiService.sendCommand("OK+CONN"); }, 2500);
                }, function () {
                    console.log("zatem nie wyslam ok kona");
                    return Promise.reject(console.log("adam23333333"));
                })
                    .then(function () {
                    var timeoutAlert = setTimeout(function () { return _this.errorPumpStan(); }, 68 * 1000);
                    _this.pumpBluetoothApiService.read().subscribe(function () {
                        _this.pumpBluetoothApiService.sendCommand2("x");
                        setTimeout(function () { return _this.pumpBluetoothApiService.read3()
                            .subscribe(function (dane) {
                            console.log("To jest wynik" + dane);
                            if (dane.toString().includes("ustaw")) {
                                console.log("Taki bolus zostal nastawiony" + r);
                                _this.pumpBluetoothApiService.sendCommand("bolus  " + r);
                                setTimeout(function () { return _this.pumpBluetoothApiService.read5().subscribe(function (btdane) {
                                    console.log("btdane: !!!!!!!!!!!!!!!f!!!!!!!$%RSFD#WEF: //n" + btdane.toString());
                                    if (btdane.includes("pompa podaje") && btdane.includes("BL: " + r.toString())) {
                                        _this.successLog();
                                        clearTimeout(timeoutAlert);
                                    }
                                    else {
                                        var options = {
                                            title: "Odpowiedzi z pompy:",
                                            message: btdane.toString(),
                                            okButtonText: "OK"
                                        };
                                        alert(options);
                                    }
                                    _this.pumpBluetoothApiService.disconnect();
                                    clearTimeout(timeoutAlert);
                                    resolve();
                                }); }, 500);
                            }
                            else {
                                var options = {
                                    title: "Błąd odpowiedzi z pompy:",
                                    message: dane.toString(),
                                    okButtonText: "OK"
                                };
                                alert(options);
                                _this.pumpBluetoothApiService.disconnect();
                                clearTimeout(timeoutAlert);
                                resolve();
                            }
                        }, function () { return _this.errorPumpStan(); }); }, 400);
                    }, function () { return _this.errorPumpStan(); });
                }, function () {
                    console.log("zatem nie czekam na ready");
                    _this.errorPumpStan();
                    reject();
                });
            }
            catch (_a) {
                console.log("Totalna zsssajebka");
                reject();
            }
        });
    };
    DataFacadeService.prototype.getCalcData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.pumpBluetoothApiService
                    .scanAndConnect()
                    .then(function (uidBt) {
                    if (uidBt === "MED-LINK" || uidBt === "MED-LINK-2" || uidBt === "MED-LINK-3" || uidBt === "HMSoft") {
                        console.log(uidBt + "BBBBBBBBBBBBBBBBBBBBB");
                        return Promise.resolve(uidBt);
                    }
                    else {
                        console.log(uidBt + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                        return Promise.reject();
                    }
                }, function (uidBt) {
                    console.log("poszedł prawdziwy reject11!!!!!" + uidBt + "       d");
                    return _this.pumpBluetoothApiService.scanAndConnect().then(function (uidBt2) {
                        if (uidBt2 === "HMSoft") {
                            console.log(uidBt2 + "BBBBBBBBBBBBBBBBBBBBB");
                            return Promise.resolve(uidBt2);
                        }
                        else {
                            console.log(uidBt2 + "Nie udalo sie polaczyc booooooo oooooooo status 133");
                            return Promise.reject();
                        }
                    }, function () {
                        console.log("jednak nie udalo sie za 2");
                        return Promise.reject();
                    });
                })
                    .then(function () {
                    return setTimeout(function () { return _this.pumpBluetoothApiService.sendCommand("OK+CONN"); }, 2500);
                }, function () {
                    console.log("zatem nie wyslam ok kona");
                    return Promise.reject(console.log("adam23333333"));
                })
                    .then(function () {
                    _this.pumpBluetoothApiService.read().subscribe(function () {
                        _this.pumpBluetoothApiService.sendCommand2("f");
                        setTimeout(function () { return _this.pumpBluetoothApiService.read()
                            .subscribe(function (dane) {
                            var matchDataww = dane.match(_this.ww);
                            var matchDataisf = dane.match(_this.isf);
                            var matchDatabgrange = dane.match(_this.bgRange);
                            console.log("WWWW2" + matchDataww[1], matchDataww.length);
                            console.log("WWWW3" + matchDataisf[1], matchDataisf.length);
                            console.log("WWWW4" + matchDatabgrange[1], matchDatabgrange.length);
                            for (var i = 0; i < Number(matchDataww.length); i++) {
                                var adam3 = _this.ww2.exec(matchDataww[i]);
                                console.log("To jest wynik:111111 " + adam3.toString());
                                var parsedDate22 = _this.rawDataService.parseData(adam3.toString());
                                _this.sendCalcToLacalDB(parsedDate22);
                            }
                            for (var i = 0; i < Number(matchDataisf.length); i++) {
                                var adam3 = _this.isf2.exec(matchDataisf[i]);
                                console.log("To jest wynik:222222 " + adam3.toString());
                                var parsedDate22 = _this.rawDataService.parseData(adam3.toString());
                                _this.sendCalcToLacalDB(parsedDate22);
                            }
                            for (var i = 0; i < Number(matchDatabgrange.length); i++) {
                                var adam3 = _this.bgRange2.exec(matchDatabgrange[i]);
                                console.log("To jest wynik:3333333 " + adam3.toString());
                                var parsedDate22 = _this.rawDataService.parseData(adam3.toString());
                                _this.sendCalcToLacalDB(parsedDate22);
                            }
                            var parsedDate2 = _this.rawDataService.parseData(dane);
                            //this.sendCalcToLacalDB(parsedDate2);
                            _this.sendCalcToLacalDbMax(parsedDate2);
                            _this.sendCalcToLacalDbstep(parsedDate2);
                            var options = {
                                title: "Ustawienia kalkulatora bolusa zostały zapisane do bazy danych",
                                message: dane.toString(),
                                okButtonText: "OK"
                            };
                            alert(options);
                            _this.getCalcfromLocalDb().subscribe(function (d) {
                                console.log(d);
                            });
                            _this.pumpBluetoothApiService.disconnect();
                            resolve();
                        }, function () { return _this.errorPumpStan(); }); }, 200);
                    }, function () { return _this.errorPumpStan(); });
                }, function () {
                    console.log("zatem nie czekam na ready");
                    _this.errorPumpStan();
                    reject();
                });
            }
            catch (_a) {
                console.log("Totalna zsssajebka");
                reject();
            }
        });
    };
    DataFacadeService.prototype.errorPumpStan = function () {
        appSettings.setBoolean("isBusy", false);
        appSettings.setString("pumpStan", "ZMIEN STAN POMPY");
        var options = {
            title: "Cos poszło nie tak",
            message: "Sprawdz stan pompy!",
            okButtonText: "Przyjąłem do wiadomości"
        };
        alert(options);
    };
    DataFacadeService.prototype.successLog = function () {
        var options = {
            title: "Hurreeey!! :)",
            message: "Udało się podać bolus!",
            okButtonText: "OK"
        };
        alert(options);
    };
    DataFacadeService.prototype.establishConnectionWithPump = function () {
        var _this = this;
        //this.scanAndConnect();
        // setInterval(() => this.scanAndConnect(),  60 * 1000);
        this.wakeFacadeService.setAlarm();
        this.scanAndConnect();
        this.int0 = setInterval(function () { return _this.scanAndConnect(); }, 5 * 60 * 1000);
        appSettings.setNumber('int0', this.int0);
    };
    DataFacadeService.prototype.waitOnReady = function () {
        var _this = this;
        this.pumpBluetoothApiService.read().subscribe(function () {
            _this.transferDataFromPumpThenToApi();
        });
    };
    DataFacadeService.prototype.waitOnReadyStop = function () {
        var _this = this;
        this.pumpBluetoothApiService.read().subscribe(function () {
            // this.transferDataFromPumpThenToApi();
            _this.checStatusPump();
        });
    };
    DataFacadeService.prototype.checStatusPump = function () {
        var _this = this;
        setTimeout(function () { return _this.pumpBluetoothApiService.sendCommand2("a"); }, 400);
        setTimeout(function () { return _this.pumpBluetoothApiService.read3()
            .subscribe(function (dane) {
            console.log("To jest wynik" + dane);
            if (dane.toString().includes("uruchomiona")) {
                console.log("STOP POMPA");
                _this.pumpBluetoothApiService.sendCommand("stop");
                setTimeout(function () { return _this.pumpBluetoothApiService.read3().subscribe(function () {
                    _this.zone.run(function () { return _this.stanPump = "WYLACZ POMPE"; });
                    _this.pumpBluetoothApiService.disconnect();
                }); }, 500);
            }
            else {
                console.log("START POMPA!!!");
                _this.pumpBluetoothApiService.sendCommand("start");
                setTimeout(function () { return _this.pumpBluetoothApiService.read3().subscribe(function () {
                    _this.zone.run(function () { return _this.stanPump = "WLACZ POMPE"; });
                    _this.pumpBluetoothApiService.disconnect();
                }); }, 500);
            }
        }); }, 400);
    };
    DataFacadeService.prototype.preventLowSugar = function (a, b) {
        if (appSettings.getBoolean('auto', false) && a <= appSettings.getNumber('range', 75) && !(a === 0) && !(a.toString() === '000') && b.toLowerCase().includes('normal')) {
            console.log("AKT WOJNY" + a + b + appSettings.getBoolean('auto', false));
            this.scanAndConnectStop().then(function () {
                console.log("Pompa wyl");
                appSettings.setString("autostop", new Date().toString().substring(3, 21) + " UWAGA POMPA ZATRZYMANA PRZEZ FUNKCJE AUTO STOP\n\n");
            }, function () { return console.log("BADD ASS nie wylaczona"); });
        }
        else {
            console.log("AKT WOJNY2" + a + b.toLowerCase());
            if (appSettings.getBoolean('auto', false) && a > appSettings.getNumber('range', 75) && !(a === 0) && !(a.toString() === '000') && b.toLowerCase().includes('suspend')) {
                console.log("AKT WOJNY3" + a + b);
                this.scanAndConnectStop().then(function () {
                    console.log("Pompa wlaczona");
                    appSettings.setString("autostop", new Date().toString().substring(3, 21) + " UWAGA POMPA WZNOWIONA PRZEZ FUNKCJE AUTO START\n\n");
                }, function () { return console.log("BADD ASS 2 nie wylaczona"); });
            }
            else {
                console.log("Nie uzywam auto stop/start" + a + b);
                this.pumpBluetoothApiService.disconnect();
            }
        }
    };
    DataFacadeService.prototype.transferDataFromPumpThenToApi = function () {
        var _this = this;
        setTimeout(function () { return _this.pumpBluetoothApiService.sendCommand2("s"); }, 400);
        setTimeout(function () {
            _this.pumpBluetoothApiService.read2().subscribe(function (data) {
                console.log('TOOOOO:   ' + data.toString());
                _this.btData = data.toString();
                var parsedDate = _this.rawDataService.parseData(data);
                _this.sendDataToLocalDb(parsedDate)
                    .then(function () { console.log('AAAAA doszlo'); _this.sendDataToLocalDb2(parsedDate); })
                    .then(function () { return _this.sendDataToLocalDb3(parsedDate); })
                    .then(function () { return _this.sendDataToLocalDb4(parsedDate); })
                    .then(function () { return _this.sendDatatoNightscout3(); })
                    .then(function () { return _this.databaseService.updateDS(); })
                    .then(function () { return _this.sendDatatoNightscout(); })
                    .then(function () { return _this.databaseService.updateBG(); })
                    .then(function () { return _this.sendDatatoNightscout2(); })
                    .then(function () { return _this.databaseService.updateTreatments(); })
                    .then(function () { return _this.sendDatatoNightscout4(); })
                    .then(function () { return _this.databaseService.updateTempBasal(); })
                    .then(function () {
                    if (appSettings.getBoolean('bgsource', false) === true) {
                        _this.nightscoutApiService.getBGfromNs().then(function (svg) {
                            console.log("TAAAAAAAAAAK2: " + JSON.stringify(svg));
                            var obj = JSON.parse(JSON.stringify(svg[0]));
                            console.log(obj.sgv, svg[0]);
                            _this.databaseService.insertBGfromNs(obj.sgv, new Date(obj.dateString), 1);
                            var d = new Date();
                            d.setMinutes(d.getMinutes() - 16);
                            if (new Date(obj.dateString) > d) {
                                _this.preventLowSugar(obj.sgv, parsedDate.statusPump.toString());
                            }
                            else {
                                console.log("Stary cukier z NS");
                            }
                            // this.databaseService.insertBG(JSON.stringify(svg))
                        });
                    }
                    else {
                        _this.preventLowSugar(parsedDate.bloodGlucose.value, parsedDate.statusPump.toString());
                    }
                })
                    //.then(() => this.wakeFacadeService.snoozeScreenByCall())
                    .catch(function (error) {
                    console.log(error);
                    //this.wakeFacadeService.snoozeScreenByCall()
                });
                //this.pumpBluetoothApiService.disconnect();
            });
        }, 400);
    };
    DataFacadeService.prototype.setArrow = function (old) {
        if (Number(old) >= -5 && Number(old) <= 5) {
            old = "Flat";
        }
        if (Number(old) > 5 && Number(old) < 10) {
            old = "FortyFiveUp";
        }
        if (Number(old) >= 10) {
            old = "SingleUp";
        }
        if (Number(old) < -5 && Number(old) > -10) {
            old = "FortyFiveDown";
        }
        if (Number(old) <= -10) {
            old = "SingleDown";
        }
        return old;
    };
    DataFacadeService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [database_service_1.DatabaseService,
            core_1.NgZone,
            nightscout_api_service_1.NightscoutApiService,
            pump_bluetooth_api_service_1.PumpBluetoothApiService,
            raw_data_parse_service_1.RawDataService,
            wake_facade_service_1.WakeFacadeService])
    ], DataFacadeService);
    return DataFacadeService;
}());
exports.DataFacadeService = DataFacadeService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1mYWNhZGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRhdGEtZmFjYWRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFFbEQsNENBQXFDO0FBRXJDLGtFQUFnRTtBQUNoRSw4RUFBMkU7QUFDM0Usc0ZBQWtGO0FBQ2xGLDhFQUFxRTtBQUNyRSx3RUFBcUU7QUFDckUsa0RBQW9EO0FBS3BEO0lBVUUsMkJBQ1UsZUFBZ0MsRUFDaEMsSUFBWSxFQUNaLG9CQUEwQyxFQUMxQyx1QkFBZ0QsRUFDaEQsY0FBOEIsRUFDOUIsaUJBQW9DO1FBTHBDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1oseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBYjlDLGFBQVEsR0FBVyxjQUFjLENBQUM7UUFDbEMsT0FBRSxHQUFHLG1FQUFtRSxDQUFDO1FBQ3pFLFFBQUcsR0FBRyxrRUFBa0UsQ0FBQztRQUN6RSxRQUFHLEdBQUcsbUVBQW1FLENBQUM7UUFDMUUsU0FBSSxHQUFHLGtFQUFrRSxDQUFDO1FBQzFFLFlBQU8sR0FBRyxxRUFBcUUsQ0FBQztRQUNoRixhQUFRLEdBQUcsb0VBQW9FLENBQUM7UUFTOUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBQ0Qsb0NBQVEsR0FBUjtRQUNFLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixVQUEwQjtRQUN4QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZ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WTJCLGtDQUFlO1lBQzFCLGFBQU07WUFDVSw2Q0FBb0I7WUFDakIsb0RBQXVCO1lBQ2hDLHVDQUFjO1lBQ1gsdUNBQWlCO09BaEJuQyxpQkFBaUIsQ0FvdEI3QjtJQUFELHdCQUFDO0NBQUEsQUFwdEJELElBb3RCQztBQXB0QlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcbmltcG9ydCB7IElCYXNpY1NldHRpbmdzIH0gZnJvbSBcIn4vYXBwL21vZGVsL21lZC1saW5rLm1vZGVsXCI7XHJcbmltcG9ydCB7IERhdGFiYXNlU2VydmljZSB9IGZyb20gXCJ+L2FwcC9zaGFyZWQvZGF0YWJhc2Uuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBOaWdodHNjb3V0QXBpU2VydmljZSB9IGZyb20gXCJ+L2FwcC9zaGFyZWQvbmlnaHRzY291dC1hcGkuc2VydmljZVwiO1xyXG5pbXBvcnQgeyBQdW1wQmx1ZXRvb3RoQXBpU2VydmljZSB9IGZyb20gXCJ+L2FwcC9zaGFyZWQvcHVtcC1ibHVldG9vdGgtYXBpLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgUmF3RGF0YVNlcnZpY2UgfSBmcm9tIFwifi9hcHAvc2hhcmVkL3Jhdy1kYXRhLXBhcnNlLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgV2FrZUZhY2FkZVNlcnZpY2UgfSBmcm9tIFwifi9hcHAvc2hhcmVkL3dha2UtZmFjYWRlLnNlcnZpY2VcIjtcclxuaW1wb3J0ICogYXMgYXBwU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogXCJyb290XCJcclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFGYWNhZGVTZXJ2aWNlIHtcclxuICBidERhdGE6IHN0cmluZztcclxuICBpbnQwOiBudW1iZXI7XHJcbiAgc3RhblB1bXA6IHN0cmluZyA9IFwiVyBUUkFLQ0lFLi4uXCI7XHJcbiAgd3cgPSAvemFrcmVzXFxzKFxcZHsxfSk6XFxzKC5cXFdcXGR7M30pXFxzSlxcL1dXXFxzc3RhcnRcXHNnb2R6LlxccyhcXGR7Mn06XFxkezJ9KS9nO1xyXG4gIHd3MiA9IC96YWtyZXNcXHMoXFxkezF9KTpcXHMoLlxcV1xcZHszfSlcXHNKXFwvV1dcXHNzdGFydFxcc2dvZHouXFxzKFxcZHsyfTpcXGR7Mn0pLztcclxuICBpc2YgPSAvemFrcmVzXFxzKFxcZHsxfSk6XFxzXFxzPyhcXGR7MiwzfSltZy5kbFxcc3N0YXJ0XFxzZ29kei5cXHMoXFxkezJ9OlxcZHsyfSkvZztcclxuICBpc2YyID0gL3pha3Jlc1xccyhcXGR7MX0pOlxcc1xccz8oXFxkezIsM30pbWcuZGxcXHNzdGFydFxcc2dvZHouXFxzKFxcZHsyfTpcXGR7Mn0pLztcclxuICBiZ1JhbmdlID0gL3pha3Jlc1xccyhcXGR7MX0pOlxccz8oXFxkezIsM30tLlxcZHsyLDN9KVxcc3N0YXJ0XFxzZ29kei5cXHMoXFxkezJ9OlxcZHsyfSkvZztcclxuICBiZ1JhbmdlMiA9IC96YWtyZXNcXHMoXFxkezF9KTpcXHM/KFxcZHsyLDN9LS5cXGR7MiwzfSlcXHNzdGFydFxcc2dvZHouXFxzKFxcZHsyfTpcXGR7Mn0pLztcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZGF0YWJhc2VTZXJ2aWNlOiBEYXRhYmFzZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgIHByaXZhdGUgbmlnaHRzY291dEFwaVNlcnZpY2U6IE5pZ2h0c2NvdXRBcGlTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBwdW1wQmx1ZXRvb3RoQXBpU2VydmljZTogUHVtcEJsdWV0b290aEFwaVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJhd0RhdGFTZXJ2aWNlOiBSYXdEYXRhU2VydmljZSxcclxuICAgIHByaXZhdGUgd2FrZUZhY2FkZVNlcnZpY2U6IFdha2VGYWNhZGVTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICB0aGlzLmRhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xyXG4gIH1cclxuICBjbGVhckludCgpIHtcclxuICAgIGNsZWFySW50ZXJ2YWwoYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKCdpbnQwJykpO1xyXG4gIH1cclxuXHJcbiAgc2VuZERhdGFUb0xvY2FsRGIocHVtcFN0YXR1czogSUJhc2ljU2V0dGluZ3MpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLmluc2VydEJHKHB1bXBTdGF0dXMuYmxvb2RHbHVjb3NlKTtcclxuICB9XHJcblxyXG4gIHNlbmREYXRhVG9Mb2NhbERiMihwdW1wU3RhdHVzOiBJQmFzaWNTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLmluc2VydFRyZWF0bWVudHMocHVtcFN0YXR1cy5sYXN0Qm9sdXMpO1xyXG4gIH1cclxuICBzZW5kQ2FsY1RvTGFjYWxEQihwdW1wU3RhdHVzOiBJQmFzaWNTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLmluc2VydENhbGMobmV3IERhdGUoKS50b1N0cmluZygpLCBwdW1wU3RhdHVzLmNhbGMuaWRWYWwsIHB1bXBTdGF0dXMuY2FsYy52YWx1ZSwgcHVtcFN0YXR1cy5jYWxjLmhvdXJzLCBwdW1wU3RhdHVzLmNhbGMuY2F0ZWdvcnkpO1xyXG4gIH1cclxuICBzZW5kQ2FsY1RvTGFjYWxEYk1heChwdW1wU3RhdHVzOiBJQmFzaWNTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLmluc2VydENhbGMobmV3IERhdGUoKS50b1N0cmluZygpLCAxLCBwdW1wU3RhdHVzLm1heGltdW1Cb2x1c1NldHRpbmcsICcwMDowMCcsICdtYXgnKTtcclxuICB9XHJcbiAgc2VuZENhbGNUb0xhY2FsRGJzdGVwKHB1bXBTdGF0dXM6IElCYXNpY1NldHRpbmdzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZVNlcnZpY2UuaW5zZXJ0Q2FsYyhuZXcgRGF0ZSgpLnRvU3RyaW5nKCksIDEsIHB1bXBTdGF0dXMuaW5jcmVtZW50U3RlcFNldHRpbmcsICcwMDowMCcsICdzdGVwJyk7XHJcbiAgfVxyXG5cclxuICBzZW5kRGF0YVRvTG9jYWxEYjMocHVtcFN0YXR1czogSUJhc2ljU2V0dGluZ3MpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlU2VydmljZS5pbnNlcnREZXZpY2VTdGF0dXMoXHJcbiAgICAgIHB1bXBTdGF0dXMuaW5zdWxpbkluUG9tcExlZnQsXHJcbiAgICAgIHB1bXBTdGF0dXMuYmF0dGVyeVZvbHRhZ2UsXHJcbiAgICAgIHB1bXBTdGF0dXMuZGF0YSxcclxuICAgICAgcHVtcFN0YXR1cy5zdGF0dXNQdW1wXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc2VuZERhdGFUb0xvY2FsRGI0KHB1bXBTdGF0dXM6IElCYXNpY1NldHRpbmdzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZVNlcnZpY2UuaW5zZXJ0VGVtcEJhc2FsKFxyXG4gICAgICBwdW1wU3RhdHVzLnRlbXBvcmFyeUJhc2FsTWV0aG9kUGVyY2VudGFnZS5wZXJjZW50c09mQmFzZUJhc2FsLFxyXG4gICAgICBwdW1wU3RhdHVzLnRlbXBvcmFyeUJhc2FsTWV0aG9kUGVyY2VudGFnZS50aW1lTGVmdEluTWludXRlcyxcclxuICAgICAgcHVtcFN0YXR1cy50ZW1wb3JhcnlCYXNhbE1ldGhvZFBlcmNlbnRhZ2UudGltZXN0YW1wXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGF0YWZyb21Mb2NhbERiKCk6IE9ic2VydmFibGU8XHJcbiAgICBBcnJheTx7IHZhbHVlOiBudW1iZXI7IGRhdGU6IERhdGU7IG9sZDogc3RyaW5nIH0+XHJcbiAgPiB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZVNlcnZpY2UuZ2V0QkcoKS5waXBlKFxyXG4gICAgICBtYXAocm93cyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJvd3MubWFwKGEgPT4gKHtcclxuICAgICAgICAgIHZhbHVlOiArYVswXSxcclxuICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGFbMV0pLFxyXG4gICAgICAgICAgb2xkOiB0aGlzLnNldEFycm93KGFbM10pXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldERhdGFmcm9tTG9jYWxEYjIoKTogT2JzZXJ2YWJsZTxBcnJheTx7IHZhbHVlOiBudW1iZXI7IGRhdGU6IERhdGUgfT4+IHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlU2VydmljZS5nZXRUcmVhdG1lbnRzKCkucGlwZShcclxuICAgICAgbWFwKHJvd3MgPT4ge1xyXG4gICAgICAgIHJldHVybiByb3dzLm1hcChhID0+ICh7XHJcbiAgICAgICAgICB2YWx1ZTogK2FbMF0sXHJcbiAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShhWzFdKVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG4gIGdldENhbGNmcm9tTG9jYWxEYigpOiBPYnNlcnZhYmxlPEFycmF5PHsgaWRWYWw6IG51bWJlcjsgY2F0ZWdvcnk6IHN0cmluZzsgZGF0ZVN0cmluZzogc3RyaW5nOyB2YWx1ZTogc3RyaW5nOyBob3VyOiBzdHJpbmc7IH0+PiB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZVNlcnZpY2UuZ2V0Q2FsYygpLnBpcGUoXHJcbiAgICAgIG1hcChyb3dzID0+IHtcclxuICAgICAgICByZXR1cm4gcm93cy5tYXAoYSA9PiAoe1xyXG4gICAgICAgICAgaWRWYWw6ICthWzBdLFxyXG4gICAgICAgICAgY2F0ZWdvcnk6IGFbMV0sXHJcbiAgICAgICAgICBkYXRlU3RyaW5nOiBhWzJdLFxyXG4gICAgICAgICAgdmFsdWU6IGFbM10sXHJcbiAgICAgICAgICBob3VyOiBhWzRdXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldERhdGFmcm9tTG9jYWxEYjMoKTogT2JzZXJ2YWJsZTxcclxuICAgIEFycmF5PHtcclxuICAgICAgcmVzZXJ2b2lyOiBudW1iZXI7XHJcbiAgICAgIHZvbHRhZ2U6IG51bWJlcjtcclxuICAgICAgZGF0ZVN0cmluZzogRGF0ZTtcclxuICAgICAgcGVyY2VudDogbnVtYmVyO1xyXG4gICAgICBzdGF0dXM6IHN0cmluZztcclxuICAgIH0+XHJcbiAgPiB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZVNlcnZpY2UuZ2V0RFMoKS5waXBlKFxyXG4gICAgICBtYXAocm93cyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJvd3MubWFwKGEgPT4gKHtcclxuICAgICAgICAgIHJlc2Vydm9pcjogK2FbMF0sXHJcbiAgICAgICAgICB2b2x0YWdlOiArYVsxXSxcclxuICAgICAgICAgIGRhdGVTdHJpbmc6IG5ldyBEYXRlKGFbMl0pLFxyXG4gICAgICAgICAgcGVyY2VudDogK2FbM10sXHJcbiAgICAgICAgICBzdGF0dXM6IGFbNF1cclxuICAgICAgICB9KSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGF0YWZyb21Mb2NhbERiNCgpOiBPYnNlcnZhYmxlPFxyXG4gICAgQXJyYXk8eyBwZXJjZW50c09mQmFzYWw6IG51bWJlcjsgbWludXRlczogbnVtYmVyOyBkYXRlU3RyaW5nOiBEYXRlIH0+XHJcbiAgPiB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZVNlcnZpY2UuZ2V0VGVtcEJhc2FsKCkucGlwZShcclxuICAgICAgbWFwKHJvd3MgPT4ge1xyXG4gICAgICAgIHJldHVybiByb3dzLm1hcChhID0+ICh7XHJcbiAgICAgICAgICBwZXJjZW50c09mQmFzYWw6ICthWzBdLFxyXG4gICAgICAgICAgbWludXRlczogK2FbMV0sXHJcbiAgICAgICAgICBkYXRlU3RyaW5nOiBuZXcgRGF0ZShhWzJdKVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzZW5kRGF0YXRvTmlnaHRzY291dCgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMuZ2V0RGF0YWZyb21Mb2NhbERiKCkuc3Vic2NyaWJlKGdsdWNvc2VzID0+IHtcclxuICAgICAgICB0aGlzLm5pZ2h0c2NvdXRBcGlTZXJ2aWNlXHJcbiAgICAgICAgICAuc2VuZE5ld0JHKGdsdWNvc2VzKVxyXG4gICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgIHN1Y2Nlc3NWYWx1ZSA9PiByZXNvbHZlKHN1Y2Nlc3NWYWx1ZSksXHJcbiAgICAgICAgICAgIGVycm9yVmFsdWUgPT4gcmVqZWN0KGVycm9yVmFsdWUpXHJcbiAgICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZERhdGF0b05pZ2h0c2NvdXQyKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5nZXREYXRhZnJvbUxvY2FsRGIyKCkuc3Vic2NyaWJlKHRyZWF0bWVudHMgPT4ge1xyXG4gICAgICAgIHRoaXMubmlnaHRzY291dEFwaVNlcnZpY2VcclxuICAgICAgICAgIC5zZW5kTmV3Qm9sKHRyZWF0bWVudHMpXHJcbiAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgc3VjY2Vzc1ZhbHVlID0+IHJlc29sdmUoc3VjY2Vzc1ZhbHVlKSxcclxuICAgICAgICAgICAgZXJyb3JWYWx1ZSA9PiByZWplY3QoZXJyb3JWYWx1ZSlcclxuICAgICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kRGF0YXRvTmlnaHRzY291dDMoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLmdldERhdGFmcm9tTG9jYWxEYjMoKS5zdWJzY3JpYmUoZGV2aWNlU3RhdHVzID0+IHtcclxuICAgICAgICB0aGlzLm5pZ2h0c2NvdXRBcGlTZXJ2aWNlXHJcbiAgICAgICAgICAuc2VuZE5ld0RldmljZXN0YXR1cyhkZXZpY2VTdGF0dXMpXHJcbiAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgc3VjY2Vzc1ZhbHVlID0+IHJlc29sdmUoc3VjY2Vzc1ZhbHVlKSxcclxuICAgICAgICAgICAgZXJyb3JWYWx1ZSA9PiByZWplY3QoZXJyb3JWYWx1ZSlcclxuICAgICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGdldERhdGFGcm9tTmlnaHRzY291dCgpIHtcclxuICAgIHRoaXMubmlnaHRzY291dEFwaVNlcnZpY2UuZ2V0Qkdmcm9tTnMoKS50aGVuKHN2ZyA9PiB7Y29uc29sZS5sb2coIFwiVEFBQUFBQUFBQUFLMjogXCIgKyBKU09OLnN0cmluZ2lmeShzdmcpKTtcclxuICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc3ZnWzBdKSk7XHJcbiAgICBjb25zb2xlLmxvZyhvYmouc2d2LCBzdmdbMF0pO1xyXG4gICAgdGhpcy5kYXRhYmFzZVNlcnZpY2UuaW5zZXJ0Qkdmcm9tTnMob2JqLnNndiwgbmV3IERhdGUob2JqLmRhdGVTdHJpbmcpLCAxKTtcclxuICAgICAvLyB0aGlzLmRhdGFiYXNlU2VydmljZS5pbnNlcnRCRyhKU09OLnN0cmluZ2lmeShzdmcpKVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kRGF0YXRvTmlnaHRzY291dDQoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLmdldERhdGFmcm9tTG9jYWxEYjQoKS5zdWJzY3JpYmUodGVtcGJhc2FsID0+IHtcclxuICAgICAgICB0aGlzLm5pZ2h0c2NvdXRBcGlTZXJ2aWNlXHJcbiAgICAgICAgICAuc2VuZE5ld1RlbXBCYXNhbCh0ZW1wYmFzYWwpXHJcbiAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgc3VjY2Vzc1ZhbHVlID0+IHJlc29sdmUoc3VjY2Vzc1ZhbHVlKSxcclxuICAgICAgICAgICAgZXJyb3JWYWx1ZSA9PiByZWplY3QoZXJyb3JWYWx1ZSlcclxuICAgICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNjYW5BbmRDb25uZWN0KCkge1xyXG4gICAgLy90aGlzLndha2VGYWNhZGVTZXJ2aWNlLndha2VTY3JlZW5CeUNhbGwoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2VcclxuICAgICAgICAuc2NhbkFuZENvbm5lY3QoKVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgdWlkQnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodWlkQnQgPT09IFwiTUVELUxJTktcIiB8fCB1aWRCdCA9PT0gXCJNRUQtTElOSy0yXCIgfHwgdWlkQnQgPT09IFwiTUVELUxJTkstM1wiIHx8IHVpZEJ0ID09PSBcIkhNU29mdFwiKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codWlkQnQgKyBcIkJCQkJCQkJCQkJCQkJCQkJCQkJCQlwiKTtcclxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVpZEJ0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1aWRCdCArIFwiTmllIHVkYWxvIHNpZSBwb2xhY3p5YyBib29vb29vbyBvb29vb29vbyBzdGF0dXMgMTMzXCIpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdWlkQnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBvc3plZMWCIHByYXdkeml3eSByZWplY3QxMSEhISEhXCIgKyB1aWRCdCArIFwiICAgICAgIGRcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnNjYW5BbmRDb25uZWN0KCkudGhlbihcclxuICAgICAgICAgICAgICB1aWRCdDIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVpZEJ0MiA9PT0gXCJITVNvZnRcIikge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1aWRCdDIgKyBcIkJCQkJCQkJCQkJCQkJCQkJCQkJCQlwiKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1aWRCdDIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICAgICAgICAgdWlkQnQyICsgXCJOaWUgdWRhbG8gc2llIHBvbGFjenljIGJvb29vb29vIG9vb29vb29vIHN0YXR1cyAxMzNcIlxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWGFYYVhhWGFYYVwiKTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiamVkbmFrIG5pZSB1ZGFsbyBzaWUgemEgMlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAoKSA9PlxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAgICgpID0+IHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2Uuc2VuZENvbW1hbmQoXCJPSytDT05OXCIpLFxyXG4gICAgICAgICAgICAgIDI1MDBcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ6YXRlbSBuaWUgd3lzbGFtIG9rIGtvbmFcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChjb25zb2xlLmxvZyhcImFkYW0yMzMzMzMzM1wiKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLndhaXRPblJlYWR5KCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInphdGVtIG5pZSBjemVrYW0gbmEgcmVhZHlcIik7XHJcbiAgICAgICAgICAgIC8vdGhpcy53YWtlRmFjYWRlU2VydmljZS5zbm9vemVTY3JlZW5CeUNhbGwoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKFwiZXJyb3I6IFwiLCBlcnJvcikpO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG90YWxuYSB6c3NzYWplYmthXCIpO1xyXG4gICAgfVxyXG4gICAgLy9jb25zdCBlc3RpbWF0ZWRUaW1lVG9FbmRUYXNrID0gMzAgKiAxMDAwO1xyXG4gICAgLy9zZXRUaW1lb3V0KCgpID0+IHRoaXMud2FrZUZhY2FkZVNlcnZpY2Uuc25vb3plU2NyZWVuQnlDYWxsKCksIGVzdGltYXRlZFRpbWVUb0VuZFRhc2spO1xyXG4gIH1cclxuICAgc2NhbkFuZENvbm5lY3RTdG9wKCkge1xyXG4gICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlXHJcbiAgICAgICAgLnNjYW5BbmRDb25uZWN0KClcclxuICAgICAgICAudGhlbihcclxuICAgICAgICAgIHVpZEJ0ID0+IHtcclxuICAgICAgICAgICAgaWYgKHVpZEJ0ID09PSBcIk1FRC1MSU5LXCIgfHwgdWlkQnQgPT09IFwiTUVELUxJTkstMlwiIHx8IHVpZEJ0ID09PSBcIk1FRC1MSU5LLTNcIiB8fCB1aWRCdCA9PT0gXCJITVNvZnRcIikge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVpZEJ0ICsgXCJCQkJCQkJCQkJCQkJCQkJCQkJCQkJcIik7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1aWRCdCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codWlkQnQgKyBcIk5pZSB1ZGFsbyBzaWUgcG9sYWN6eWMgYm9vb29vb28gb29vb29vb28gc3RhdHVzIDEzM1wiKTtcclxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHVpZEJ0ID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwb3N6ZWTFgiBwcmF3ZHppd3kgcmVqZWN0MTEhISEhIVwiICsgdWlkQnQgKyBcIiAgICAgICBkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zY2FuQW5kQ29ubmVjdCgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgdWlkQnQyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh1aWRCdDIgPT09IFwiSE1Tb2Z0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codWlkQnQyICsgXCJCQkJCQkJCQkJCQkJCQkJCQkJCQkJcIik7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodWlkQnQyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgIHVpZEJ0MiArIFwiTmllIHVkYWxvIHNpZSBwb2xhY3p5YyBib29vb29vbyBvb29vb29vbyBzdGF0dXMgMTMzXCJcclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlhhWGFYYVhhWGFcIik7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImplZG5hayBuaWUgdWRhbG8gc2llIHphIDJcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgKCkgPT5cclxuICAgICAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgICAoKSA9PiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnNlbmRDb21tYW5kKFwiT0srQ09OTlwiKSxcclxuICAgICAgICAgICAgICAyNTAwXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiemF0ZW0gbmllIHd5c2xhbSBvayBrb25hXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoY29uc29sZS5sb2coXCJhZGFtMjMzMzMzMzNcIikpO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRBbGVydCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lcnJvclB1bXBTdGFuKCksIDYzICogMTAwMCk7XHJcbiAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UucmVhZCgpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zZW5kQ29tbWFuZDIoXCJhXCIpO1xyXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5yZWFkMygpXHJcbiAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoIGRhbmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG8gamVzdCB3eW5pa1wiKyBkYW5lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGFuZS50b1N0cmluZygpLmluY2x1ZGVzKFwidXJ1Y2hvbWlvbmFcIikpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVE9QIFBPTVBBXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zZW5kQ29tbWFuZChcInN0b3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnJlYWQ1KCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy56b25lLnJ1biAoKCkgPT4gYXBwU2V0dGluZ3Muc2V0U3RyaW5nKFwicHVtcFN0YW5cIiwgXCJXWk5PVyBQT01QRVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEFsZXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSksIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVEFSVCBQT01QQSEhIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2Uuc2VuZENvbW1hbmQoXCJzdGFydFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UucmVhZDQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuICgoKSA9PiBhcHBTZXR0aW5ncy5zZXRTdHJpbmcoXCJwdW1wU3RhblwiLCBcIlpBV0lFUyBQT01QRVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEFsZXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSksIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LCAoKSA9PiB0aGlzLmVycm9yUHVtcFN0YW4oKSlcclxuICAgICAgICAgICAgICAgICwgNDAwKTtcclxuICAgICAgICAgICAgfSwgKCkgPT4gdGhpcy5lcnJvclB1bXBTdGFuKCkpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ6YXRlbSBuaWUgY3pla2FtIG5hIHJlYWR5XCIpO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yUHVtcFN0YW4oKTtcclxuICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG90YWxuYSB6c3NzYWplYmthXCIpO1xyXG4gICAgICByZWplY3QoKTtcclxuICAgIH1cclxuICB9KVxyXG4gIH1cclxuICBzY2FuQW5kQ29ubmVjdEJPTChyKSB7XHJcbiAgICAvLyAgdGhpcy53YWtlRmFjYWRlU2VydmljZS53YWtlU2NyZWVuQnlDYWxsKCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2VcclxuICAgICAgICAgIC5zY2FuQW5kQ29ubmVjdCgpXHJcbiAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgdWlkQnQgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICh1aWRCdCA9PT0gXCJNRUQtTElOS1wiIHx8IHVpZEJ0ID09PSBcIk1FRC1MSU5LLTJcIiB8fCB1aWRCdCA9PT0gXCJNRUQtTElOSy0zXCIgfHwgdWlkQnQgPT09IFwiSE1Tb2Z0XCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVpZEJ0ICsgXCJCQkJCQkJCQkJCQkJCQkJCQkJCQkJcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVpZEJ0KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codWlkQnQgKyBcIk5pZSB1ZGFsbyBzaWUgcG9sYWN6eWMgYm9vb29vb28gb29vb29vb28gc3RhdHVzIDEzM1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdWlkQnQgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicG9zemVkxYIgcHJhd2R6aXd5IHJlamVjdDExISEhISFcIiArIHVpZEJ0ICsgXCIgICAgICAgZFwiKTtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zY2FuQW5kQ29ubmVjdCgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICB1aWRCdDIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodWlkQnQyID09PSBcIkhNU29mdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codWlkQnQyICsgXCJCQkJCQkJCQkJCQkJCQkJCQkJCQkJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1aWRCdDIpO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgdWlkQnQyICsgXCJOaWUgdWRhbG8gc2llIHBvbGFjenljIGJvb29vb29vIG9vb29vb29vIHN0YXR1cyAxMzNcIlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiamVkbmFrIG5pZSB1ZGFsbyBzaWUgemEgMlwiKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICgpID0+XHJcbiAgICAgICAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgICAgICgpID0+IHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2Uuc2VuZENvbW1hbmQoXCJPSytDT05OXCIpLFxyXG4gICAgICAgICAgICAgICAgMjUwMFxyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInphdGVtIG5pZSB3eXNsYW0gb2sga29uYVwiKTtcclxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoY29uc29sZS5sb2coXCJhZGFtMjMzMzMzMzNcIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRBbGVydCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lcnJvclB1bXBTdGFuKCksIDY4ICogMTAwMCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5yZWFkKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2Uuc2VuZENvbW1hbmQyKFwieFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5yZWFkMygpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSggZGFuZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvIGplc3Qgd3luaWtcIiArIGRhbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGRhbmUudG9TdHJpbmcoKS5pbmNsdWRlcyhcInVzdGF3XCIpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUYWtpIGJvbHVzIHpvc3RhbCBuYXN0YXdpb255XCIgKyByKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zZW5kQ29tbWFuZChcImJvbHVzICBcIiArIHIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnJlYWQ1KCkuc3Vic2NyaWJlKGJ0ZGFuZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJidGRhbmU6ICEhISEhISEhISEhISEhIWYhISEhISEhJCVSU0ZEI1dFRjogLy9uXCIgKyBidGRhbmUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ0ZGFuZS5pbmNsdWRlcyhcInBvbXBhIHBvZGFqZVwiKSAmJiAgYnRkYW5lLmluY2x1ZGVzKFwiQkw6IFwiICsgci50b1N0cmluZygpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN1Y2Nlc3NMb2coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0QWxlcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk9kcG93aWVkemkgeiBwb21weTpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYnRkYW5lLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0QWxlcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCxYLEhWQgb2Rwb3dpZWR6aSB6IHBvbXB5OlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGRhbmUudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0QWxlcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKCkgPT4gdGhpcy5lcnJvclB1bXBTdGFuKCkpXHJcbiAgICAgICAgICAgICAgICAgICwgNDAwKTtcclxuICAgICAgICAgICAgICB9LCAoKSA9PiB0aGlzLmVycm9yUHVtcFN0YW4oKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInphdGVtIG5pZSBjemVrYW0gbmEgcmVhZHlcIik7XHJcbiAgICAgICAgICAgICAgdGhpcy5lcnJvclB1bXBTdGFuKCk7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIClcclxuICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUb3RhbG5hIHpzc3NhamVia2FcIik7XHJcbiAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG4gIGdldENhbGNEYXRhKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlXHJcbiAgICAgICAgICAuc2NhbkFuZENvbm5lY3QoKVxyXG4gICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgIHVpZEJ0ID0+IHtcclxuICAgICAgICAgICAgICBpZiAodWlkQnQgPT09IFwiTUVELUxJTktcIiB8fCB1aWRCdCA9PT0gXCJNRUQtTElOSy0yXCIgfHwgdWlkQnQgPT09IFwiTUVELUxJTkstM1wiIHx8IHVpZEJ0ID09PSBcIkhNU29mdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1aWRCdCArIFwiQkJCQkJCQkJCQkJCQkJCQkJCQkJCXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1aWRCdCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVpZEJ0ICsgXCJOaWUgdWRhbG8gc2llIHBvbGFjenljIGJvb29vb29vIG9vb29vb29vIHN0YXR1cyAxMzNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVpZEJ0ID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBvc3plZMWCIHByYXdkeml3eSByZWplY3QxMSEhISEhXCIgKyB1aWRCdCArIFwiICAgICAgIGRcIik7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2Uuc2NhbkFuZENvbm5lY3QoKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgdWlkQnQyID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHVpZEJ0MiA9PT0gXCJITVNvZnRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVpZEJ0MiArIFwiQkJCQkJCQkJCQkJCQkJCQkJCQkJCXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodWlkQnQyKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICAgIHVpZEJ0MiArIFwiTmllIHVkYWxvIHNpZSBwb2xhY3p5YyBib29vb29vbyBvb29vb29vbyBzdGF0dXMgMTMzXCJcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImplZG5hayBuaWUgdWRhbG8gc2llIHphIDJcIik7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIClcclxuICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAoKSA9PlxyXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnNlbmRDb21tYW5kKFwiT0srQ09OTlwiKSxcclxuICAgICAgICAgICAgICAgIDI1MDBcclxuICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ6YXRlbSBuaWUgd3lzbGFtIG9rIGtvbmFcIik7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGNvbnNvbGUubG9nKFwiYWRhbTIzMzMzMzMzXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnJlYWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zZW5kQ29tbWFuZDIoXCJmXCIpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnJlYWQoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoIGRhbmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEYXRhd3cgPSAgZGFuZS5tYXRjaCh0aGlzLnd3KTtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGF0YWlzZiA9ICBkYW5lLm1hdGNoKHRoaXMuaXNmKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGF0YWJncmFuZ2UgPSAgZGFuZS5tYXRjaCh0aGlzLmJnUmFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXV1dXMlwiICsgbWF0Y2hEYXRhd3dbMV0sIG1hdGNoRGF0YXd3Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldXV1czXCIgKyBtYXRjaERhdGFpc2ZbMV0sIG1hdGNoRGF0YWlzZi5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXV1dXNFwiICsgbWF0Y2hEYXRhYmdyYW5nZVsxXSwgbWF0Y2hEYXRhYmdyYW5nZS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IE51bWJlcihtYXRjaERhdGF3dy5sZW5ndGgpOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhZGFtMyA9IHRoaXMud3cyLmV4ZWMobWF0Y2hEYXRhd3dbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvIGplc3Qgd3luaWs6MTExMTExIFwiICsgYWRhbTMudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGUyMiA9IHRoaXMucmF3RGF0YVNlcnZpY2UucGFyc2VEYXRhKGFkYW0zLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRDYWxjVG9MYWNhbERCKHBhcnNlZERhdGUyMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgTnVtYmVyKG1hdGNoRGF0YWlzZi5sZW5ndGgpOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhZGFtMyA9IHRoaXMuaXNmMi5leGVjKG1hdGNoRGF0YWlzZltpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG8gamVzdCB3eW5pazoyMjIyMjIgXCIgKyBhZGFtMy50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkRGF0ZTIyID0gdGhpcy5yYXdEYXRhU2VydmljZS5wYXJzZURhdGEoYWRhbTMudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZENhbGNUb0xhY2FsREIocGFyc2VkRGF0ZTIyKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBOdW1iZXIobWF0Y2hEYXRhYmdyYW5nZS5sZW5ndGgpOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhZGFtMyA9IHRoaXMuYmdSYW5nZTIuZXhlYyhtYXRjaERhdGFiZ3JhbmdlW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUbyBqZXN0IHd5bmlrOjMzMzMzMzMgXCIgKyBhZGFtMy50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkRGF0ZTIyID0gdGhpcy5yYXdEYXRhU2VydmljZS5wYXJzZURhdGEoYWRhbTMudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZENhbGNUb0xhY2FsREIocGFyc2VkRGF0ZTIyKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGUyID0gdGhpcy5yYXdEYXRhU2VydmljZS5wYXJzZURhdGEoZGFuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuc2VuZENhbGNUb0xhY2FsREIocGFyc2VkRGF0ZTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kQ2FsY1RvTGFjYWxEYk1heChwYXJzZWREYXRlMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRDYWxjVG9MYWNhbERic3RlcChwYXJzZWREYXRlMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJVc3Rhd2llbmlhIGthbGt1bGF0b3JhIGJvbHVzYSB6b3N0YcWCeSB6YXBpc2FuZSBkbyBiYXp5IGRhbnljaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkYW5lLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgYWxlcnQob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENhbGNmcm9tTG9jYWxEYigpLnN1YnNjcmliZShkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sICgpID0+IHRoaXMuZXJyb3JQdW1wU3RhbigpKVxyXG4gICAgICAgICAgICAgICAgICAsIDIwMCk7XHJcbiAgICAgICAgICAgICAgfSwgKCkgPT4gdGhpcy5lcnJvclB1bXBTdGFuKCkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ6YXRlbSBuaWUgY3pla2FtIG5hIHJlYWR5XCIpO1xyXG4gICAgICAgICAgICAgIHRoaXMuZXJyb3JQdW1wU3RhbigpO1xyXG4gICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApXHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVG90YWxuYSB6c3NzYWplYmthXCIpO1xyXG4gICAgICAgIHJlamVjdCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbiAgZXJyb3JQdW1wU3Rhbigpe1xyXG4gICAgYXBwU2V0dGluZ3Muc2V0Qm9vbGVhbihcImlzQnVzeVwiLCBmYWxzZSk7XHJcbiAgICBhcHBTZXR0aW5ncy5zZXRTdHJpbmcoXCJwdW1wU3RhblwiLCBcIlpNSUVOIFNUQU4gUE9NUFlcIik7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICB0aXRsZTogXCJDb3MgcG9zesWCbyBuaWUgdGFrXCIsXHJcbiAgICAgIG1lc3NhZ2U6IFwiU3ByYXdkeiBzdGFuIHBvbXB5IVwiLFxyXG4gICAgICBva0J1dHRvblRleHQ6IFwiUHJ6eWrEhcWCZW0gZG8gd2lhZG9tb8WbY2lcIlxyXG4gICAgfTtcclxuICAgIGFsZXJ0KG9wdGlvbnMpO1xyXG4gIH1cclxuICBzdWNjZXNzTG9nKCl7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICB0aXRsZTogXCJIdXJyZWVleSEhIDopXCIsXHJcbiAgICAgIG1lc3NhZ2U6IFwiVWRhxYJvIHNpxJkgcG9kYcSHIGJvbHVzIVwiLFxyXG4gICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgfTtcclxuICAgIGFsZXJ0KG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgZXN0YWJsaXNoQ29ubmVjdGlvbldpdGhQdW1wKCkge1xyXG4gICAgLy90aGlzLnNjYW5BbmRDb25uZWN0KCk7XHJcbiAgICAvLyBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnNjYW5BbmRDb25uZWN0KCksICA2MCAqIDEwMDApO1xyXG4gICAgdGhpcy53YWtlRmFjYWRlU2VydmljZS5zZXRBbGFybSgpO1xyXG4gICAgdGhpcy5zY2FuQW5kQ29ubmVjdCgpO1xyXG4gICAgdGhpcy5pbnQwID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5zY2FuQW5kQ29ubmVjdCgpLCAgNSAqIDYwICogMTAwMCk7XHJcbiAgICBhcHBTZXR0aW5ncy5zZXROdW1iZXIoJ2ludDAnLCB0aGlzLmludDApO1xyXG5cclxuICB9XHJcblxyXG5cclxuICB3YWl0T25SZWFkeSgpIHtcclxuICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UucmVhZCgpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMudHJhbnNmZXJEYXRhRnJvbVB1bXBUaGVuVG9BcGkoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICB3YWl0T25SZWFkeVN0b3AoKSB7XHJcbiAgICB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnJlYWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgIC8vIHRoaXMudHJhbnNmZXJEYXRhRnJvbVB1bXBUaGVuVG9BcGkoKTtcclxuICAgICAgdGhpcy5jaGVjU3RhdHVzUHVtcCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNoZWNTdGF0dXNQdW1wKCl7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2Uuc2VuZENvbW1hbmQyKFwiYVwiKSwgNDAwKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5yZWFkMygpXHJcbiAgICAgICAgLnN1YnNjcmliZSggZGFuZSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvIGplc3Qgd3luaWtcIisgZGFuZSk7XHJcbiAgICAgICAgICBpZiAoZGFuZS50b1N0cmluZygpLmluY2x1ZGVzKFwidXJ1Y2hvbWlvbmFcIikpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNUT1AgUE9NUEFcIik7XHJcbiAgICAgICAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2Uuc2VuZENvbW1hbmQoXCJzdG9wXCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnJlYWQzKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuICgoKSA9PiB0aGlzLnN0YW5QdW1wID0gXCJXWUxBQ1ogUE9NUEVcIik7XHJcbiAgICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgICAgIH0pLCA1MDApO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVEFSVCBQT01QQSEhIVwiKTtcclxuICAgICAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zZW5kQ29tbWFuZChcInN0YXJ0XCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLnJlYWQzKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuICgoKSA9PiB0aGlzLnN0YW5QdW1wID0gXCJXTEFDWiBQT01QRVwiKTtcclxuICAgICAgICAgICAgICB0aGlzLnB1bXBCbHVldG9vdGhBcGlTZXJ2aWNlLmRpc2Nvbm5lY3QoKX0pLCA1MDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICwgNDAwKTtcclxuICB9XHJcblxyXG4gIHByZXZlbnRMb3dTdWdhcihhOiBudW1iZXIsIGI6IHN0cmluZykge1xyXG4gICAgaWYgKGFwcFNldHRpbmdzLmdldEJvb2xlYW4oJ2F1dG8nLCBmYWxzZSkgJiYgYSA8PSBhcHBTZXR0aW5ncy5nZXROdW1iZXIoJ3JhbmdlJywgNzUpICYmICEoYSA9PT0gMCkgJiYgIShhLnRvU3RyaW5nKCkgPT09ICcwMDAnKSAmJiBiLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ25vcm1hbCcpKXtcclxuICAgICAgY29uc29sZS5sb2coXCJBS1QgV09KTllcIiArIGEgKyBiICsgYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYXV0bycsIGZhbHNlKSk7XHJcbiAgICAgIHRoaXMuc2NhbkFuZENvbm5lY3RTdG9wKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQb21wYSB3eWxcIik7XHJcbiAgICAgICAgYXBwU2V0dGluZ3Muc2V0U3RyaW5nKFwiYXV0b3N0b3BcIiwgbmV3IERhdGUoKS50b1N0cmluZygpLnN1YnN0cmluZygzLCAyMSkgKyBcIiBVV0FHQSBQT01QQSBaQVRSWllNQU5BIFBSWkVaIEZVTktDSkUgQVVUTyBTVE9QXFxuXFxuXCIgKTtcclxuICAgICAgfSwgKCkgPT4gY29uc29sZS5sb2coXCJCQUREIEFTUyBuaWUgd3lsYWN6b25hXCIpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkFLVCBXT0pOWTJcIiArIGEgKyBiLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICBpZiAoYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYXV0bycsIGZhbHNlKSAmJiBhID4gYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKCdyYW5nZScsIDc1KSAmJiAhKGEgPT09IDApICYmICEoYS50b1N0cmluZygpID09PSAnMDAwJykgJiYgYi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdzdXNwZW5kJykpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQUtUIFdPSk5ZM1wiICsgYSArIGIpO1xyXG4gICAgICAgIHRoaXMuc2NhbkFuZENvbm5lY3RTdG9wKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlBvbXBhIHdsYWN6b25hXCIpO1xyXG4gICAgICAgICAgYXBwU2V0dGluZ3Muc2V0U3RyaW5nKFwiYXV0b3N0b3BcIiwgbmV3IERhdGUoKS50b1N0cmluZygpLnN1YnN0cmluZygzLCAyMSkgKyBcIiBVV0FHQSBQT01QQSBXWk5PV0lPTkEgUFJaRVogRlVOS0NKRSBBVVRPIFNUQVJUXFxuXFxuXCIpO1xyXG4gICAgICAgIH0sICgpID0+IGNvbnNvbGUubG9nKFwiQkFERCBBU1MgMiBuaWUgd3lsYWN6b25hXCIpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk5pZSB1enl3YW0gYXV0byBzdG9wL3N0YXJ0XCIgKyBhICsgYik7XHJcbiAgICAgICAgdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5kaXNjb25uZWN0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuICB0cmFuc2ZlckRhdGFGcm9tUHVtcFRoZW5Ub0FwaSgpIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wdW1wQmx1ZXRvb3RoQXBpU2VydmljZS5zZW5kQ29tbWFuZDIoXCJzXCIpLCA0MDApO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UucmVhZDIoKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1RPT09PTzogICAnICsgZGF0YS50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmJ0RGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcclxuICAgICAgICBjb25zdCBwYXJzZWREYXRlID0gdGhpcy5yYXdEYXRhU2VydmljZS5wYXJzZURhdGEoZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLnNlbmREYXRhVG9Mb2NhbERiKHBhcnNlZERhdGUpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHsgY29uc29sZS5sb2coJ0FBQUFBIGRvc3psbycpOyB0aGlzLnNlbmREYXRhVG9Mb2NhbERiMihwYXJzZWREYXRlKTsgfSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5zZW5kRGF0YVRvTG9jYWxEYjMocGFyc2VkRGF0ZSkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuc2VuZERhdGFUb0xvY2FsRGI0KHBhcnNlZERhdGUpKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnNlbmREYXRhdG9OaWdodHNjb3V0MygpKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmRhdGFiYXNlU2VydmljZS51cGRhdGVEUygpKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnNlbmREYXRhdG9OaWdodHNjb3V0KCkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuZGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZUJHKCkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuc2VuZERhdGF0b05pZ2h0c2NvdXQyKCkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuZGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZVRyZWF0bWVudHMoKSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5zZW5kRGF0YXRvTmlnaHRzY291dDQoKSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5kYXRhYmFzZVNlcnZpY2UudXBkYXRlVGVtcEJhc2FsKCkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYmdzb3VyY2UnLCBmYWxzZSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmlnaHRzY291dEFwaVNlcnZpY2UuZ2V0Qkdmcm9tTnMoKS50aGVuKHN2ZyA9PiB7Y29uc29sZS5sb2coIFwiVEFBQUFBQUFBQUFLMjogXCIgKyBKU09OLnN0cmluZ2lmeShzdmcpKTtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzdmdbMF0pKTtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cob2JqLnNndiwgc3ZnWzBdKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhYmFzZVNlcnZpY2UuaW5zZXJ0Qkdmcm9tTnMob2JqLnNndiwgbmV3IERhdGUob2JqLmRhdGVTdHJpbmcpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgIGQuc2V0TWludXRlcyhkLmdldE1pbnV0ZXMoKSAtIDE2KTtcclxuICAgICAgICAgICAgICAgICAgaWYgKG5ldyBEYXRlKG9iai5kYXRlU3RyaW5nKSA+IGQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmVudExvd1N1Z2FyKG9iai5zZ3YsIHBhcnNlZERhdGUuc3RhdHVzUHVtcC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnkgY3VraWVyIHogTlNcIik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLmluc2VydEJHKEpTT04uc3RyaW5naWZ5KHN2ZykpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJldmVudExvd1N1Z2FyKHBhcnNlZERhdGUuYmxvb2RHbHVjb3NlLnZhbHVlLCBwYXJzZWREYXRlLnN0YXR1c1B1bXAudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIC8vLnRoZW4oKCkgPT4gdGhpcy53YWtlRmFjYWRlU2VydmljZS5zbm9vemVTY3JlZW5CeUNhbGwoKSlcclxuICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgLy90aGlzLndha2VGYWNhZGVTZXJ2aWNlLnNub296ZVNjcmVlbkJ5Q2FsbCgpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAvL3RoaXMucHVtcEJsdWV0b290aEFwaVNlcnZpY2UuZGlzY29ubmVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0sIDQwMCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEFycm93KG9sZDogc3RyaW5nKSB7XHJcbiAgICBpZiAoTnVtYmVyKG9sZCkgPj0gLTUgJiYgTnVtYmVyKG9sZCkgPD0gNSkge1xyXG4gICAgICBvbGQgPSBcIkZsYXRcIjtcclxuICAgIH1cclxuICAgIGlmIChOdW1iZXIob2xkKSA+IDUgJiYgTnVtYmVyKG9sZCkgPCAxMCkge1xyXG4gICAgICBvbGQgPSBcIkZvcnR5Rml2ZVVwXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoTnVtYmVyKG9sZCkgPj0gMTApIHtcclxuICAgICAgb2xkID0gXCJTaW5nbGVVcFwiO1xyXG4gICAgfVxyXG4gICAgaWYgKE51bWJlcihvbGQpIDwgLTUgJiYgTnVtYmVyKG9sZCkgPiAtMTApIHtcclxuICAgICAgb2xkID0gXCJGb3J0eUZpdmVEb3duXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoTnVtYmVyKG9sZCkgPD0gLTEwKSB7XHJcbiAgICAgIG9sZCA9IFwiU2luZ2xlRG93blwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9sZDtcclxuICB9XHJcbn1cclxuIl19