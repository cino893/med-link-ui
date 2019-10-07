import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Permissions from 'nativescript-permissions';
import { PromptResult } from 'tns-core-modules/ui/dialogs';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import { ForegroundFacadeService } from '~/app/shared/foreground-facade.service';
import { PumpBluetoothApiService } from '~/app/shared/pump-bluetooth-api.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';
import { DatabaseService } from '~/app/shared/database.service';
import * as appSettings from "application-settings";
import { Switch } from "tns-core-modules/ui/switch";
import { EventData } from "tns-core-modules/data/observable";
import { GestureEventData } from "tns-core-modules/ui/gestures";
import * as dialogs from "tns-core-modules/ui/dialogs";

@Component({
  selector: 'Browse',
  moduleId: module.id,
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {
  text = '';
  output = '';
  uuid: string;
  items = [];
  bool: boolean = false;
  int0: number  = 0;
  int1: number  = 0;
  interval: number = 0;
  counter: number;
  isCompleted: boolean = false;
  bool2: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private rawDataParse: RawDataService,
    private fa: DataFacadeService,
    private databaseService: DatabaseService,
    private foregroundUtilService: ForegroundFacadeService,
    private pumpBluetoothApiService: PumpBluetoothApiService
  ) {
  }
  saveUuid(arg) {
    console.log("WWWWWWWW" + arg.text);
    this.uuid = arg.text.toString().split(',')[1];
    console.log("CCCWWWWW" + this.uuid);
    this.databaseService.insertMAC(this.uuid);
    //this.databaseService.getMAC().then(a => console.log("TAAAAK:" + a));
    this.isCompleted = true;
  }
  onLongPress(args: GestureEventData) {
    console.log("Object that triggered the event: " + args.object);
    console.log("View that triggered the event: " + args.view);
    console.log("Event name: " + args.eventName);
    this.pumpBluetoothApiService.scanAndConnect().then(() => this.pumpBluetoothApiService.read2().subscribe(() =>
      dialogs.prompt({
      title: "Podaj nr pompy",
      message: "Twoj nr pompy to:",
      okButtonText: "OK",
      cancelButtonText: "Cancel",
      inputType: dialogs.inputType.number
    }).then( r => {
      console.log("Dialog closed!" + r.result + ", A TO TEKST:" +  r.text);
        this.pumpBluetoothApiService.sendCommand3(r.text);
    }).then(() => this.pumpBluetoothApiService.read2().subscribe(() =>
        dialogs.prompt({
          title: "IMIE I NAZWISKO",
          message: "Podaj imie i nazwisko",
          okButtonText: "OK",
          cancelButtonText: "Cancel",
          inputType: dialogs.inputType.text
        }).then(rr => {
          console.log("TTTTTTTTTTTTTTTTTTTTa" + rr.text);
    this.pumpBluetoothApiService.sendCommand3(rr.text);
  }
        )))
    ));

  }
  onCheckedChange(args: EventData) {
    const mySwitch = args.object as Switch;
    const isChecked = mySwitch.checked; // boolean
    console.log("aaaaa32" + isChecked);
    if (isChecked === true) {
      dialogs.confirm({
        title: "Oswiadczenie",
        message: "Przyjmuję do wiadomości i wyrażam zgodę, że:\n" +
          "1) Produkt nie stanowi zatwierdzonego wyrobu medycznego, stanowi jedynie narzędzie\n" +
          "badawcze i pomocnicze dla pacjentów z cukrzycą;\n" +
          "2) udostępnienie i korzystanie Produktu następuje wyłącznie w celach informacyjnych i\n" +
          "szkoleniowych;\n" +
          "3) Produkt jest dostarczany bez jakiejkolwiek gwarancji (wyrażonej ani domniemanej);\n" +
          "4) oprogramowanie zawarte w Produkcie działa na licencji open source, a korzystanie z\n" +
          "Produktu nie wymaga ponoszenia jakichkolwiek opłat lub wynagrodzenia, w tym na rzecz\n" +
          "podmiotów uprawnionych do oprogramowania;\n" +
          "5) oprogramowanie zawarte w Produkcie nie zostało zatwierdzone przez żadnego producenta;\n" +
          "6) Produkt może nie działać nieprzerwanie, terminowo, bezpiecznie i bezbłędnie;\n" +
          "7) Produkt może nie współdziałać z innymi oprogramowaniami lub innymi sprzętami;\n" +
          "8) wyniki uzyskane z związku z korzystaniem Produktu mogą nie być dokładne i rzetelne;\n" +
          "9) nie posiadam żadnych praw własności ani udziałów w Produkcie;\n" +
          "10) będę korzystać z Produktu tylko i wyłącznie na moje własne ryzyko i własną\n" +
          "odpowiedzialność;\n" +
          "11) będę korzystać z Produktu tylko i wyłącznie do osobistego użytku;\n" +
          "12) nie będę używać ani polegać na Produkcie przy podejmowaniu jakichkolwiek decyzji o\n" +
          "charakterze medycznym, decyzji związanych z leczeniem, jak również nie będę używać\n" +
          "Produktu jako substytutu dla profesjonalnej opieki medycznej;\n" +
          "13) zobowiązuję się ponieść wszelkie koszty naprawy lub serwisu Produktu.\n" +
          "Oświadczam, że nie będę dochodzić wobec twórców Produktu jakichkolwiek roszczeń z tytułu\n" +
          "nieprawidłowego działania lub korzystania z Produktu, w tym w szczególności nie będę dochodzić\n" +
          "roszczeń dotyczących szkód powstałych w wyniku:\n" +
          "1) nieprawidłowego korzystania z Produktu;\n" +
          "2) braku sprawności lub ograniczenia sprawności Produktu, błędów i uszkodzeń Produktu,\n" +
          "opóźnień w jego działaniu;\n" +
          "3) niestosowania się do zasad działania Produktu;\n" +
          "4) niewłaściwego przechowywania Produktu;\n" +
          "5) braku zabezpieczenia Produktu przed uszkodzeniami, zniszczeń Produktu;\n" +
          "6) rozładowania się Produktu lub innych sprzętów z nim połączonych;\n" +
          "7) problemów z innymi sprzętami połączonymi z Produktem;\n" +
          "8) problemów komunikacyjnych pomiędzy Produktem a innymi sprzętami z nim połączonymi.",
        okButtonText: "Potwierdzam",
        cancelButtonText: "Anuluj"
      }).then(result => {
        if (result === true) { this.setPermissions(); this.databaseService.insertStan(true); }
        else {
          // result argument is boolean
          console.log("Dialog result: " + result);
          mySwitch.checked = false;
          this.databaseService.insertStan(false);
        }
      });

    }
    else {
      this.foregroundUtilService.stopForeground();
      clearInterval(this.int0);
      console.log("aaaaa" + isChecked + this.int0);
      clearInterval(this.fa.int0);
      clearInterval(this.int1);
      clearInterval(this.interval);
      this.databaseService.insertStan(false);
    }
  }
  scan() {
    this.bool = appSettings.getBoolean("someBoolean", false);
    console.log("aRRRAAA:  " + this.bool + appSettings.getBoolean("someBoolean"));
    appSettings.setBoolean("someBoolean", this.bool);
    console.log("aRRRAAA222222:  " + this.bool + appSettings.getBoolean("someBoolean"));
    Permissions.requestPermission(
      android.Manifest.permission.ACCESS_COARSE_LOCATION
    ).then(() =>
    this.pumpBluetoothApiService.scanAndConnect2().subscribe(a => {
      console.log("TTRRR" + this.pumpBluetoothApiService.targetBluDeviceUUID + a);
      this.items = this.pumpBluetoothApiService.targetBluDeviceUUID2;
      //this.uuid = this.pumpBluetoothApiService.targetBluDeviceUUID;
      this.uuid = "Kliknij na urządzenie MED-LINK ,XX:XX:XX:XX:XX  ";


      }));
  }
  startCountdown(seconds){
    this.counter = seconds;

    this.interval = setInterval(() => {
      console.log(this.counter);
      this.uuid = this.counter.toString();
      this.counter--;
      if (this.counter <= 2) {

        // The code here will run when
        // the timer has reached zero.

        clearInterval(this.interval);
        console.log('Ding!');

      }
    }, 1000);
  }

  setPermissions() {
    Permissions.requestPermission(
      android.Manifest.permission.ACCESS_COARSE_LOCATION
    )
      .then(() =>
        Permissions.requestPermission(android.Manifest.permission.BLUETOOTH)
      )
      .then(() =>
        Permissions.requestPermission(
          android.Manifest.permission.BLUETOOTH_ADMIN
        )
      )
      .then(() =>
        Permissions.requestPermission(
          android.Manifest.permission.WAKE_LOCK
        )
      )
      .then(() => Permissions.requestPermission(
        android.Manifest.permission.WRITE_SETTINGS
      ))
      .then(() => {
      this.pumpBluetoothApiService.enable();
      try {
          this.foregroundUtilService.startForeground();
          this.startCountdown(300);
        //a = (new Date()).valueOf() - (new Date("Tue Sep 03 2019 13:41:57 GMT+0200 (czas środkowoeuropejski letni)")).valueOf();
          this.int1 = setInterval(() => { clearInterval(this.interval); this.startCountdown(300);}, 300000);
          this.int0 = setInterval(() => console.log('interval22         ' + new Date() + 'a'), 10000);
          setTimeout(() => this.fa.establishConnectionWithPump(), 500)
      } catch (e) {
        console.error(e);

        this.foregroundUtilService.stopForeground();
        clearInterval(this.int0);
        clearInterval(this.int1);
      }
    });
  }
  ngOnInit(): void {
     this.databaseService.getStan().subscribe(wynik => {
       this.bool2 = wynik.toString().toLowerCase() === 'true';
       console.log("AAAAAA$$$: " + wynik.toString());
       if (this.bool2 === true) {
         this.isCompleted = true;
       }
     });
  }
}
