import { ChangeDetectorRef, Component, OnInit, NgZone, Renderer, ElementRef, OnDestroy } from "@angular/core";
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
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { Button } from "tns-core-modules/ui/button";

@Component({
  selector: 'Browse',
  moduleId: module.id,
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit, OnDestroy {
  text = '';
  isBusy: boolean = false;
  output = '';
  uuid: string;
  pumpStan: string;
  items = [];
  bool: boolean = false;
  int0: number = 0;
  int1: number = 0;
  interval: number = 0;
  counter: number;
  isCompleted: boolean = appSettings.getBoolean("isCompleted", false);
  bool2: boolean = false;
  interv: number;

  constructor(
    private nsr: Renderer,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private rawDataParse: RawDataService,
    private fa: DataFacadeService,
    private databaseService: DatabaseService,
    private foregroundUtilService: ForegroundFacadeService,
    private pumpBluetoothApiService: PumpBluetoothApiService,
    private elementRef: ElementRef,
  ) {
  }

  saveUuid(arg) {
    console.log("WWWWWWWW" + arg.text);
    this.uuid = arg.text.toString().split(',')[1];
    console.log("CCCWWWWW" + this.uuid);
    this.databaseService.insertMAC(this.uuid);
    //this.databaseService.getMAC().then(a => console.log("TAAAAK:" + a));
    this.isCompleted = true;
    appSettings.setBoolean("isCompleted", true);
  }
  ngOnDestroy(): void {
    clearInterval(this.interv);
  }

  onPlus() {
    dialogs.confirm({
      title: "Chcesz dodać lub usunąć profil użytkownia z pilota?",
      cancelButtonText: "Usun",
      okButtonText: "Dodaj",
      neutralButtonText: "Anuluj"
    }).then(t => {
        if (t === true) {
          console.log("TAK" + t);
          this.addUser();
          this.isBusy = true;
        }
        if (t === false) {
          console.log("nie" + t);
          this.deleteUser();
          this.isBusy = false;
          //this.zone.run (() => this.isBusy = false);
        } else {

          console.log("anulowane wybieranie usera");
        }

      }
    )
  }

  addUser() {
    this.pumpBluetoothApiService.scanAndConnect().then(() => this.pumpBluetoothApiService.read2().subscribe(() =>
      dialogs.prompt({
        title: "Podaj nr pompy",
        message: "Twoj nr pompy to:",
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        inputType: dialogs.inputType.number
      }).then(r => {
        console.log("Dialog closed!" + r.result + ", A TO TEKST:" + r.text);
        this.pumpBluetoothApiService.sendCommand3(r.text);
      }).then(() => this.pumpBluetoothApiService.read2().subscribe(() =>
        dialogs.prompt({
          title: "IMIE I NAZWISKO",
          message: "Podaj imie i nazwisko",
          okButtonText: "OK",
          cancelButtonText: "Cancel",
          inputType: dialogs.inputType.text
        }).then(rr => {
            this.isBusy = false;
            console.log("TTTTTTTTTTTTTTTTTTTTa" + rr.text);
            this.pumpBluetoothApiService.sendCommand3(rr.text);
            this.zone.run(() => this.isBusy = false);
          }
        )))
    ));
  }

  deleteUser() {
    this.pumpBluetoothApiService.scanAndConnect().then(() => this.pumpBluetoothApiService.read2().subscribe(() =>
      dialogs.prompt({
        title: "USUWANIE PROFILU",
        message: "Czy na pewno chcesz usunąć profil użytkownika?",
        okButtonText: "OK",
        cancelButtonText: "Cancel"
      }).then(r => {
        console.log("Dialog closed!" + r.result + ", A TO wynikkkkk");
        if (r.result) {
          this.pumpBluetoothApiService.sendCommand3("KASUJ");
          //this.isBusy = false;
        }
      })
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
        if (result === true) {
          this.setPermissions();
          this.databaseService.insertStan(true);
        } else {
          // result argument is boolean
          console.log("Dialog result: " + result);
          mySwitch.checked = false;
          this.databaseService.insertStan(false);
        }
      });

    } else {
      this.foregroundUtilService.stopForeground();
      //clearInterval(this.int0);
      console.log("aaaaa" + isChecked + this.int0);
      /*      //learInterval(this.fa.int0);
            //clearInterval(this.int1);
            //clearInterval(this.interval);
            for(var i = 0; i < 100; i++)
            {
              clearInterval(i);
            }*/
      this.databaseService.insertStan(false);
    }
  }

  stop() {
    if (this.pumpStan === 'ZMIEN STAN POMPY') {
      console.log("dodaj to z dolu......aaaa.....")
    }
    dialogs.confirm({
      title: "Czy na pewno chcesz zmienić stan pompy?",
      okButtonText: "Tak",
      cancelButtonText: "Nie"
    }).then(t => {
      if (t === true) {
        console.log("TAKa" + t);
        this.isBusy = true;
        appSettings.setString("pumpStan", "Proszę czekać...");
        this.fa.scanAndConnectStop().then(() => this.zone.run(() => {
            this.pumpStan = appSettings.getString("pumpStan", "Cos poszło nie tak");
            console.log("TO TO TO TO: " + this.fa.stanPump);
            this.isBusy = false;
            // this.fa.getDatafromLocalDb3().subscribe( devicestatus => {this.setNewDeviceStatus(devicestatus).then(a => console.log("aaaa a moze teraz po mapowaniu:" + a));});
          }
        ), () => {
          this.isBusy = false;
          this.pumpStan = "Sprawdz stan pompy. Coś poszło nie tak"
        });
      } else {
        this.isBusy = false
      }
    }).then(() => console.log("CIEKAWE MIESJCE !@EWDSFSRER"))
  }

  setNewDeviceStatus(deviceStatus: Array<{ reservoir: number; voltage: number; dateString: Date; percent: number; status: string }>) {
    return new Promise((resolve, reject) => {
      console.log("A to status: ");
      deviceStatus.map(bol => {
        console.log(bol.status + "66666666666");
        if (bol.status === 'normal') {
          this.pumpStan = 'ZAWIEŚ POMPĘ';
          console.log("ANO MAMY 1");
        }
        if (bol.status === 'suspend') {
          this.pumpStan = 'WZNÓW POMPĘ';
          console.log("ANO MAMY 2");
        }

      });
      resolve(),
        reject();
    });
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

  startCountdown(seconds) {
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
          //this.uuid = this.foregroundUtilService.counter.toString();
          // this.startCountdown(300);
          //a = (new Date()).valueOf() - (new Date("Tue Sep 03 2019 13:41:57 GMT+0200 (czas środkowoeuropejski letni)")).valueOf();
          //  this.int1 = setInterval(() => { clearInterval(this.interval); this.startCountdown(300);}, 300000);
          // this.int0 = setInterval(() => console.log('interval22         ' + new Date() + 'a'), 10000);
          // setTimeout(() => this.fa.establishConnectionWithPump(), 500)
        } catch (e) {
          console.error(e);

          this.foregroundUtilService.stopForeground();
          //clearInterval(this.int0);
          //clearInterval(this.int1);
        }
      });
  }

  ngOnInit(): void {
    clearInterval(appSettings.getNumber(("interv")));
    this.interv = setInterval(() => {
      this.uuid = appSettings.getString("counter");
      appSettings.setNumber("interv", this.interv);
      this.pumpStan = appSettings.getString("pumpStan", "ZMIEN STAN POMPY");
      console.log("551");
    }, 1000);


     this.databaseService.getStan().subscribe(wynik => {
       this.bool2 = wynik.toString().toLowerCase() === 'true';
       console.log("to jest stan switcha: " + wynik.toString());
     });
    this.databaseService.execSQLSuccessMonitor.subscribe(wynik => {
      if (wynik === '') {
        this.pumpStan = "brak danych";
      }
      if (wynik.toString().endsWith('suspend')){
        this.zone.run (() =>
        {
          //this.pumpStan = "WZNÓW POMPĘ";
          appSettings.setString("pumpStan", "WZNOW POMPE");
          this.pumpStan = appSettings.getString("pumpStan");
           this.pumpStan = appSettings.getString("pumpStan");
          console.log(wynik.toString());
          console.log("ANO MAMY 3" + wynik.toString().endsWith('suspend') + this.pumpStan);

          this.cdr.detectChanges();

          console.log(this.elementRef.nativeElement.android);
        });

      }
      if (wynik.toString().endsWith('normal')){
        this.zone.run (() => {
          appSettings.setString("pumpStan", "ZAWIES POMPE");
          setTimeout( () => this.pumpStan = appSettings.getString("pumpStan"), 1);
          //this.pumpStan = "ZAWIEŚ POMPĘ";
          console.log(wynik.toString());
          console.log("ANO MAMY 4" + wynik.toString().endsWith('normal') + this.pumpStan);
          console.log(this.elementRef.nativeElement.android);
          this.cdr.detectChanges();
        });
      }
    });
  }
}
