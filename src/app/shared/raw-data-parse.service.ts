/* tslint:disable:whitespace */
import { toDate } from '@angular/common/src/i18n/format_date';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { percent } from 'tns-core-modules/ui/core/view';
import { KeyboardType } from 'tns-core-modules/ui/enums';
import { IBasicSettings } from '~/app/model/med-link.model';
import number = KeyboardType.number;

@Injectable({
    providedIn: 'root'
})
export class RawDataService {
    constructor() {
    }
    parseData(rawData: string): IBasicSettings {
        const parsedData = {} as IBasicSettings;
        const bloodGlucoseMatch = rawData.match(this.bloodGlucoseRegex);
        const lastBolusMatch = rawData.match(this.lastBolusRegex);
        const insulinInPompLeftMatch = rawData.match(this.insulinInPompLeftRegex);
        const batteryVoltageMatch = rawData.match(this.batteryVoltageRegex);
        const pumpDataMatch = rawData.match(this.pumpDataRegex);
        const statusPumpMatch = rawData.match(this.stanPumpRegex);
        const temporaryBasalMethodPercentageM = rawData.match(this.temporaryBasalMethodPercentage);
        if (!insulinInPompLeftMatch && !batteryVoltageMatch && !pumpDataMatch && !statusPumpMatch) {
            console.log(rawData.toString());
            parsedData.batteryVoltage = 1.25;
            parsedData.insulinInPompLeft = 199;
            parsedData.data = {
                data: new Date(),
                percent: 69,
            };
            parsedData.statusPump = 'SUSPEND';
        } else {
            console.log(rawData.toString());
            console.log('CC' + Number(batteryVoltageMatch[1]) + 'X' + Number(insulinInPompLeftMatch[1]) + ' Y ' + this.dateHax(pumpDataMatch[1]) + ' Z ' + Number(pumpDataMatch[2]))
            parsedData.batteryVoltage = Number(batteryVoltageMatch[1]);
            parsedData.insulinInPompLeft = Number(insulinInPompLeftMatch[1]);
            parsedData.data = {
                data: this.dateHax(pumpDataMatch[1]),
                percent: Number(pumpDataMatch[2]),
            };
            parsedData.statusPump = statusPumpMatch[1].toLowerCase().trim();
        }
        if (!bloodGlucoseMatch) {

            parsedData.bloodGlucose = {
                value: 55,
                date: new Date(),
            };
        } else {
            console.log('BBBBBB   ' + +bloodGlucoseMatch[1].trim() + this.dateHax(bloodGlucoseMatch[2]));
            parsedData.bloodGlucose = {
                value: +bloodGlucoseMatch[1].trim(),
                date: this.dateHax(bloodGlucoseMatch[2]),
            };
        }
        if (!lastBolusMatch) {
            parsedData.lastBolus = {
                value: 0,
                date: new Date(),
            };
        } else {
            console.log('AAAAAA' + +lastBolusMatch[1].trim() + this.dateHax(lastBolusMatch[2]));
            parsedData.lastBolus = {
                value: +lastBolusMatch[1].trim(),
                date: this.dateHax(lastBolusMatch[2]),
            };
            parsedData.temporaryBasalMethodPercentage = {
                percentsOfBaseBasal: +temporaryBasalMethodPercentageM[1] - 100,
                timeLeftInMinutes: +temporaryBasalMethodPercentageM[3] + 60 * +temporaryBasalMethodPercentageM[2],
                timestamp: new Date(),
            };
        }
        return parsedData;
    }
    private dateHax(date: string) {
        const lintedDate = (date.trim() + ':0').split(' ');
        const dateDay = lintedDate[0].split('-').reverse();
        if (Number(dateDay[0]) <= 99) {
            dateDay[0] = '20' + dateDay[0];}
        if (dateDay[1].substring(0,1) === '0') {
            dateDay[1] = dateDay[1].substring(1,2);
        }
        const dateHour = lintedDate[1].split(':');
        if (dateHour[0].substring(0,1) === '0') {
            dateHour[0] = dateHour[0].substring(1,2);
        }
        return new Date(dateDay.join('-') + ' ' + dateHour.join(':'));
    }
    pumpDataRegex = /(\d{2}-\d{2}-\d{4}\s\d{2}:\d{2})\s+?(\d{1,3})%/;
    bloodGlucoseRegex = /BG:(\s?\d+?)\s(\d{2}-\d{2}-\d{2}\s\d{2}:\d{2})/;
    lastBolusRegex = /BL:([\d\.]+?)\s(\d{2}-\d{2}-\d{2}\s+?\d{1,2}:\d{2})/;
    temporaryBasalMethodUnitsPerHourRegex = /PD:([\d\.]+?)\sPodano:\s([\d\.]+?)\nCzas\sPD:\s(\d+?)m\s\/\s(\d+?)m/;
    nextCalibrationRegex = /Nastepna\skalib:\s(\d+?):(\d+?)\n/;
    uptimeSensorInMinutesRegex = /Czas\ssensora:\s(\d+?)min/;
    expectedBloodGlucoseRegex = /Cel\sBG\ssensor:\s(\d+)-(\d+)\n/;
    batteryVoltageRegex = /Bateria pompy:\s(\d.+?)V/;
    insulinInPompLeftRegex = /Zbiorniczek:\s+?(\d{1,3}).\d{2}J/;
    baseBasalRegex = /Baza:\s([\d\.]+).J\/h\n/;
    temporaryBasalMethodPercentage = /TDP:\s+?(\d+)%\s+?(\d+).+?(\d+)m/;
    totalInsulinGivenTodayRegex = /Dawka\sdziasiaj:([\d\.]+)J\n/;
    totalInsulinGivenYesterdayRegex = /Dawka\swczoraj:\s([\d\.]+)J\n/;
    maximumBolusSettingRegex = /Max\sbolus:\s([\d\.]+)U\n/;
    incrementStepSettingRegex = /Krok\sbolusa:\s([\d\.]+)U\n/;
    maximumBasalSettingsRegex = /Max\.\sbaza:\s([\d\.]+)J\/h\n/;
    insulinWorkTimeSettingsRegex = /Czas\sinsuliny:\s(\d+)h\n/;
    insulinSensitiveFactorSettingsRegex = /Wsp\.insulin:\s(\d+?)(\w+\/\w+)\n/;
    insulinToCabRatioRegex = /Wsp\.weglowod:\s(\d+?)(\w+\/\w+)/;
    stanPumpRegex = /Stan pompy: (\S+)/;
}
