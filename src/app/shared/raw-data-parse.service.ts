import { Injectable } from '@angular/core';
import { IBasicSettings } from '~/app/model/med-link.model';

@Injectable({
    providedIn: 'root',
})
export class RawDataService {

    constructor() {
    }

    parseData(rawData: string): IBasicSettings {
        const parsedData = {} as IBasicSettings;
        parsedData.bloodGlucose = {
            value: +rawData.match(this.bloodGlucoseRegex)[1],
            date: new Date()
        };
        return parsedData;
    }

    pumpDataRegex = /^(\d{2})-(\d{2})-(\d{4})\s(\d{2})\s(\d{2})/;
    bloodGlucoseRegex = /BG:([\d\.]+?)\s(\d{2}):(\d{2})\s(\d{2})-(\d{2})-(\d{2})/;
    lastBolusRegex = /BL:([\d\.]+?)\s(\d{2}):(\d{2})\s(\d{2})-(\d{2})-(\d{2})/;
    temporaryBasalMethodUnitsPerHourRegex = /PD:([\d\.]+?)\sPodano:\s([\d\.]+?)\nCzas\sPD:\s(\d+?)m\s\/\s(\d+?)m/;
    nextCalibrationRegex = /Nastepna\skalib:\s(\d+?):(\d+?)\n/;
    uptimeSensorInMinutesRegex = /Czas\ssensora:\s(\d+?)min/;
    expectedBloodGlucoseRegex = /Cel\sBG\ssensor:\s(\d+)-(\d+)\n/;
    batteryVoltageRegex = /Bateria:.+?\(([\.\d]+)V\)\n/;
    insulinInPompLeftRegex = /Zbiorniczek:\s([\d\.]+)J\n/;
    baseBasalRegex = /Baza:\s([\d\.]+).J\/h\n/;
    temporaryBasalMethodPercentage = /TDP:\s(\d+)%\s(\d+).+?(\d+)m\n/;
    totalInsulinGivenTodayRegex = /Dawka\sdziasiaj:([\d\.]+)J\n/;
    totalInsulinGivenYesterdayRegex = /Dawka\swczoraj:\s([\d\.]+)J\n/;
    maximumBolusSettingRegex = /Max\sbolus:\s([\d\.]+)U\n/;
    incrementStepSettingRegex = /Krok\sbolusa:\s([\d\.]+)U\n/;
    maximumBasalSettingsRegex = /Max\.\sbaza:\s([\d\.]+)J\/h\n/;
    insulinWorkTimeSettingsRegex = /Czas\sinsuliny:\s(\d+)h\n/;
    insulinSensitiveFactorSettingsRegex = /Wsp\.insulin:\s(\d+?)(\w+\/\w+)\n/;
    insulinToCabRatioRegex = /Wsp\.weglowod:\s(\d+?)(\w+\/\w+)/;
}
