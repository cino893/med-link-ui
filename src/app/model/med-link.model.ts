export interface IBasicSettings {
  data: {
    data: Date;
    percent: number;
  };
  bloodGlucose: {
    value: number;
    date: Date;
  };
  lastBolus: {
    value: number;
    date: Date;
  };
  temporaryBasalMethodUnitsPerHour: {
    currentValueConfig: number;
    currentValueGiven: number;
    progress: {
      minutesPass: number;
      minutesTarget: number;
    };
  };
  nextCalibration: Date;
  uptimeSensorInMinutes: number;
  expectedBloodGlucose: {
    min: number;
    max: number;
  };
  batteryVoltage: number;
  insulinInPompLeft: number;
  baseBasal: number;
  temporaryBasalMethodPercentage: {
    percentsOfBaseBasal: number;
    timeLeftInMinutes: number;
  };
  totalInsulinGivenToday: number;
  totalInsulinGivenYesterday: number;
  maximumBolusSetting: number;
  incrementStepSetting: number;
  maximumBasalSettings: number;
  insulinWorkTime: number;
  insulinSensitiveFactor: {
    value: number;
    units: string;
  };
  insulinToCabRatio: {
    value: number;
    units: number;
  };
  statusPump: string;
}
