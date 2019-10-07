import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Peripheral } from 'nativescript-bluetooth';
import { Observable } from 'rxjs';
import { reduce } from 'rxjs/internal/operators/reduce';
import * as bluetooth from 'nativescript-bluetooth';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import { DatabaseService } from '~/app/shared/database.service';
import { ForegroundFacadeService } from '~/app/shared/foreground-facade.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';
import * as traceModule from "tns-core-modules/trace"

@Injectable({
  providedIn: 'root'
})
export class PumpBluetoothApiService {
  targetBluDeviceUUID: string;
  targetBluDeviceUUID2 = [];

  constructor(
    private databaseService: DatabaseService
  ) {
  }

  enable() {
    bluetooth.enable();
  }
  scanAndConnect2() {
    return new Observable<string>(observer => {
      this.targetBluDeviceUUID2 = [];
      bluetooth
        .startScanning({
          onDiscovered: (peripheral: Peripheral) => {
            console.log(peripheral.name + peripheral.UUID + "C");
            observer.next(peripheral.name + peripheral.UUID);
            if (peripheral.name === 'MED-LINK' || peripheral.name === 'MED-LINK-2' || peripheral.name === 'HMSoft') {
              this.targetBluDeviceUUID2.push(peripheral.name + ' ,' + peripheral.UUID);
              this.targetBluDeviceUUID = peripheral.UUID.toString();
              console.log("UIID: " + this.targetBluDeviceUUID);
            }
          }
          ,
          skipPermissionCheck: true,
          seconds: 2
        }).then(() => observer.complete());
    }).pipe(reduce((acc, val) => acc + val));
  }
  scanAndConnect() {
    return new Promise((resolve, reject) => {
      this.databaseService.getMAC().then(a => this.targetBluDeviceUUID = a.toString());
      console.log("to jest target: " + this.targetBluDeviceUUID);
      bluetooth.connect({
              UUID: this.targetBluDeviceUUID,
              onConnected: (peripheral: Peripheral) => {
                console.log('Połączono' + peripheral.UUID + ' ' + peripheral.name);
                resolve(peripheral.name);
              },
              onDisconnected: (peripheral: Peripheral) => {
                peripheral.name = 'ZONK';
                console.log('Rozłączono' + peripheral.name + peripheral.UUID);
                reject(peripheral.name);
              },
            });
    });
    }
  sendCommand(command) {
    const buffer = [];
    console.log('bede wysylal OK+KONN');
    traceModule.write( "AAAAAAAAAAAAAAa  YYYYYunhandled-error", traceModule.categories.Debug, 2);
    for (const char of command) {
      const charCode = char.charCodeAt(0);
      buffer.push(charCode);
    }
    if (buffer.length) {
      this.recursiveWrite(buffer);
      console.log('udalo sie chyba to wsykacccc OK+KONN');
    }
  }
  sendCommand2(command) {
    const buffer = [];
    console.log('prawdziwe ssss');
    for (const char of command) {
      const charCode = char.charCodeAt(0);
      buffer.push(charCode);
      if (charCode === 0x0a /*LF*/) {
        buffer.push(0x0d /*CR*/);
      }
    }
    if (buffer.length) {
      this.recursiveWrite(buffer);
    }
  }
  sendCommand3(command) {
    const buffer = [];
    console.log('prawdziwe ssss');
    for (const char of command) {
      const charCode = char.charCodeAt(0);
      buffer.push(charCode);
      buffer.push(0x0d /*CR*/);

      console.log("aaatotootototo:"  + buffer );
    }
    if (buffer.length) {
      this.recursiveWrite(buffer);
    }
  }


  private recursiveWrite(
    array: Array<number>,
    startByte = 0,
    chunkLength = 20
  ) {
    const nextByte = startByte + chunkLength;
    bluetooth
      .writeWithoutResponse({
        peripheralUUID: this.targetBluDeviceUUID,
        characteristicUUID: 'ffe1',
        serviceUUID: 'ffe0',
        value: new Uint8Array(array.slice(startByte, nextByte))
      })
      .then(() => {
        if (nextByte < array.length) {
          this.recursiveWrite(array, nextByte);
        }
      });
  }

  disconnect() {
    bluetooth.disconnect({UUID: this.targetBluDeviceUUID});
  }

  read() {
    return new Observable<string>(observer => {
      bluetooth.startNotifying({
        onNotify: ({ value }) => {
          const result = new Uint8Array(value).reduce(
            (o, byte) => (o += String.fromCharCode(byte)),
            ''
          );

          observer.next(result);
          console.log(result);
          if (result.includes('rea') || result.includes('zeka')) {
            observer.complete();
          }
        },
        peripheralUUID: this.targetBluDeviceUUID,
        characteristicUUID: 'ffe1',
        serviceUUID: 'ffe0'
      });
    }).pipe(reduce((acc, val) => acc + val));
  }
  read2() {
    return new Observable<string>(observer => {
      bluetooth.startNotifying({
        onNotify: ({ value }) => {
          const result = new Uint8Array(value).reduce(
              (o, byte) => (o += String.fromCharCode(byte)),
              ''
          );

          observer.next(result);
          console.log(result);
          if (result.includes('EomEomEo') || result.includes('Podaj numer') ||  result.includes('nie')) {
            observer.complete();
          }
        },
        peripheralUUID: this.targetBluDeviceUUID,
        characteristicUUID: 'ffe1',
        serviceUUID: 'ffe0'
      });
    }).pipe(reduce((acc, val) => acc + val));
  }
}
