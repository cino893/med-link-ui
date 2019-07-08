import { Injectable } from '@angular/core';
import { Peripheral } from 'nativescript-bluetooth';
import { Observable } from 'rxjs';
import { reduce } from 'rxjs/internal/operators/reduce';
import * as bluetooth from 'nativescript-bluetooth';

@Injectable({
  providedIn: 'root'
})
export class PumpBluetoothApiService {
  targetBluDeviceUUID = 'D8:A9:8B:B2:D9:70';

  enable() {
    bluetooth.enable();
  }
  scanAndConnect() {
    return new Promise((resolve, reject) => {
      this.targetBluDeviceUUID = 'D8:A9:8B:B2:D9:70';
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
    console.log('prawdziwe ssss')
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

  private recursiveWrite(
    array: Array<number>,
    startByte = 0,
    chunkLength = 20
  ) {
    const nextByte = startByte + chunkLength;
    bluetooth
      .writeWithoutResponse({
        peripheralUUID: this.targetBluDeviceUUID = 'D8:A9:8B:B2:D9:70',
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
    bluetooth.disconnect({UUID: this.targetBluDeviceUUID = 'D8:A9:8B:B2:D9:70'});
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
          if (result.includes('rea')) {
            observer.complete();
          }
        },
        peripheralUUID: this.targetBluDeviceUUID = 'D8:A9:8B:B2:D9:70',
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
          if (result.includes('EomEomEo')) {
            observer.complete();
          }
        },
        peripheralUUID: this.targetBluDeviceUUID = 'D8:A9:8B:B2:D9:70',
        characteristicUUID: 'ffe1',
        serviceUUID: 'ffe0'
      });
    }).pipe(reduce((acc, val) => acc + val));
  }
}
