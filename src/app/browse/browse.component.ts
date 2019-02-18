import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Peripheral } from 'nativescript-bluetooth';
import bluetooth = require('nativescript-bluetooth');

@Component({
    selector: 'Browse',
    moduleId: module.id,
    templateUrl: './browse.component.html',
})
export class BrowseComponent implements OnInit {
    targetBluDeviceUUID = '';
    text = '';
    output = '';

    constructor(private cdr: ChangeDetectorRef) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {

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
        const buffer = [0x0A, 0x0D];
        for (const char of this.text) {
            const charCode = char.charCodeAt(0);
            buffer.push(charCode);
            if (charCode === 0x0A) //LF
            {
                buffer.push(0x0D); //CR
            }
        }
        this.recursiveWrite(buffer);
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
}
