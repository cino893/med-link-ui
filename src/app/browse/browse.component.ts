import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Peripheral } from 'nativescript-bluetooth';
import { nightScoutPath } from '~/app/env';
import { IBasicSettings } from '~/app/model/med-link.model';
import { RawDataService } from '~/app/shared/raw-data-parse.service';
import bluetooth = require('nativescript-bluetooth');
// tslint:disable-next-line:variable-name
const Sqlite = require('nativescript-sqlite');

const myData = `18-03-2019 22 04
BG:130 21:59 18-03-19
BL:0.6 21:37 18-03-19
PD:0.0 Podano: 0.000
Czas PD: 0m / 0m
ISIG:28.26nA
Wsp.kalibracji: 4.946
Nastepna kalib: 9:40
Czas sensora: 2953min
Cel BG sensor: 80-140
Bateria: dobra(1.27V)
Zbiorniczek: 234.275J
Baza: 1.150J/h
TDP: 100% 0h:00m
Dawka dziasiaj:11.850J
Dawka wczoraj: 2.725J
Max bolud: 5.0U
Krok bolusa: 0.1U
Max. baza: 1.750J/h
Czas insuliny: 3h
Wsp.insulin: 101mg/dl
Wsp.weglowod: 17g/J`;

@Component({
    selector: 'Browse',
    moduleId: module.id,
    templateUrl: './browse.component.html',
})
export class BrowseComponent implements OnInit {
    targetBluDeviceUUID = '';
    text = '';
    output = '';
    database;

    constructor(private cdr: ChangeDetectorRef, private rawDataParse: RawDataService, private httpClient: HttpClient) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.testingAdama(this.rawDataParse.parseData(myData));
        setTimeout(() => console.log('>>>>>>>>>>>>>>>>>', this.getBG()), 5000);
    }

    scanAndConnect() {
        this.targetBluDeviceUUID = '';
        bluetooth.enable();
        bluetooth.startScanning({
            onDiscovered: (peripheral: Peripheral) => {
                console.log(peripheral.name);
                if (peripheral.name && peripheral.name.toLowerCase() === 'med-link') {
                    this.targetBluDeviceUUID = peripheral.UUID;
                }
            },
            skipPermissionCheck: false,
            seconds: 3,
        }).then(() => {
            if (!this.targetBluDeviceUUID) {
                return;
            }
            bluetooth.connect({
                UUID: this.targetBluDeviceUUID,
                onConnected: (peripheral: Peripheral) => {
                    alert('Połączono');
                    this.read();
                },
                onDisconnected: (peripheral: Peripheral) => alert('Rozłączono'),
            });
        });
    }

    changeText(text) {
        this.text = text;
    }

    sendCommand() {
        const buffer = [];
        for (const char of this.text) {
            const charCode = char.charCodeAt(0);
            buffer.push(charCode);
            if (charCode === 0x0A/*LF*/) {
                buffer.push(0x0D/*CR*/);
            }
        }
        if (buffer.length) {
            this.recursiveWrite(buffer);
        }
    }

    private recursiveWrite(array: Array<number>, startByte = 0, chunkLength = 20) {
        const nextByte = startByte + chunkLength;
        bluetooth.writeWithoutResponse({
            peripheralUUID: this.targetBluDeviceUUID,
            characteristicUUID: 'ffe1',
            serviceUUID: 'ffe0',
            value: new Uint8Array(array.slice(startByte, nextByte)),
        }).then(() => {
                if (nextByte < array.length) {
                    this.recursiveWrite(array, nextByte);
                }
            }
        );
    }

    read() {
        bluetooth.startNotifying({
            onNotify: ({value}) => {
                this.output += new Uint8Array(value).reduce((output, byte) => output += String.fromCharCode(byte), '');
                this.cdr.detectChanges();
            },
            peripheralUUID: this.targetBluDeviceUUID,
            characteristicUUID: 'ffe1',
            serviceUUID: 'ffe0',
        });
    }

    testingAdama(data: IBasicSettings) {
        const adamDb = new Sqlite('test-adam.db');

        const createMyTable =

            adamDb.then(db => {
                db.execSQL(`
            CREATE TABLE IF NOT EXISTS entries (id INTEGER, glucose NUMBER, dateString TEXT, isSend INTEGER DEFAULT 0); 
            CREATE TABLE IF NOT EXISTS treatments (id INTEGER, duration NUMBER, type TEXT, basalValue TEXT, isSend INTEGER DEFAULT 0);
            `).then(id => {
                    this.database = db;
                    this.insertBG(data);
                }, error => {
                    console.log('CREATE TABLE ERROR', error);
                });
            }, error => {
                console.log('OPEN DB ERROR', error);
            });
    }

    public insertBG(data: IBasicSettings) {
        this.database.execSQL('INSERT INTO entries (glucose, dateString) VALUES (?, ?)',
            [+data.bloodGlucose.value, data.bloodGlucose.date.toString()]).then(id => {
            console.log('>>' + data.bloodGlucose.value.toString() + '>>>>>>>-->>>>>>INSERT RESULT', id, data.bloodGlucose.date.toString(), data.bloodGlucose.value);
        }, error => {
            console.log('INSERT ERROR', error);
        });

        // this.insertTreatments(data);
    }

    public insertTreatments(data: IBasicSettings) {
        this.database.execSQL('INSERT INTO treatments (duration, type, basalValue) VALUES (?, ?, ?)',
            [data.temporaryBasalMethodUnitsPerHour.progress.minutesTarget, 'absolute',
                data.temporaryBasalMethodUnitsPerHour.currentValueConfig]).then(id => {
            console.log('INSERT RESULT', id);
        }, error => {
            console.log('INSERT ERROR', error);
        });
    }

    public getBG() {
        this.database.all('SELECT glucose, dateString FROM entries').then(rows => {
            const people = rows.map(a => ({
                glucose: a[0],
                dateString: a[1],
            }));
            people.forEach(a => {
                this.sendNewBG(a.glucose, a.dateString);
            });
            console.log(people);
        }, error => {
            console.log('SELECT ERROR', error);
        });
    }

    sendNewBG(glucose, data) {
        this.httpClient.post(nightScoutPath + 'entries.json', {
            device: 'FakeTaxi2',
            date: data,
            glucose,
            secret: '258628a55f1370569738e7da6d135c61dcaea7c9',
        }).subscribe(
        );
    }
}

