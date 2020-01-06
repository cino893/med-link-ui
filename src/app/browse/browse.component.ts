import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import * as Permissions from 'nativescript-permissions';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import { WidgetFacadeService } from '~/app/shared/widget-facade';
import { ForegroundFacadeService } from '~/app/shared/foreground-facade.service';
import { PumpBluetoothApiService } from '~/app/shared/pump-bluetooth-api.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';
import { DatabaseService } from '~/app/shared/database.service';
import * as appSettings from "application-settings";
import { Switch } from "tns-core-modules/ui/switch";
import { EventData } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { GestureEventData } from "tns-core-modules/ui/gestures";


@Component({
  selector: 'Browse',
  moduleId: module.id,
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit, OnDestroy {
  text = '';
  isBusy: boolean = appSettings.getBoolean("isBusy", false);
  output = '';
  uuid: string;
  pumpStan: string;
  pumpData: string;
  items = [];
  bool: boolean = false;
  int0: number;
  interval: number;
  counter: number;
  isCompleted: boolean = appSettings.getBoolean("isCompleted", false);
  bool2: boolean = false;
  interv: number;
  color: string = '#3d5afe';
  stopPeriodPump: number;
  minuta: string;
  godzina: string;

  constructor(
    private widgetFacadeService: WidgetFacadeService,
    private zone: NgZone,
    private rawDataParse: RawDataService,
    private fa: DataFacadeService,
    private databaseService: DatabaseService,
    private foregroundUtilService: ForegroundFacadeService,
    private pumpBluetoothApiService: PumpBluetoothApiService,
  ) {
  }

  saveUuid(arg) {
    this.uuid = arg.text.toString().split(',')[1];
    console.log("To jest zapisany UUID:" + this.uuid);
    this.databaseService.insertMAC(this.uuid);
    this.isCompleted = true;
    appSettings.setBoolean("isCompleted", true);
    this.widgetFacadeService.updateWidget();
  }
  ngOnDestroy(): void {
    clearInterval(appSettings.getNumber('interv'));
  }

  onPlus() {
    dialogs.confirm({
      title: "Chcesz dodać lub usunąć profil użytkownia z pilota?",
      cancelButtonText: "Usun",
      okButtonText: "Dodaj",
      neutralButtonText: "Anuluj"
    }).then(t => {
        if (t === true) {
          this.addUser();
          appSettings.setBoolean("isBusy", true);
        }
        if (t === false) {
          this.deleteUser();
          appSettings.setBoolean("isBusy", false);
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
          appSettings.setBoolean("isBusy", false);
            this.pumpBluetoothApiService.sendCommand3(rr.text);
            this.zone.run(() => appSettings.setBoolean("isBusy", false));
          }
        )))
    ));
  }
  onLongPress(args: GestureEventData) {
    if (this.pumpStan === "ZAWIES POMPE"){
      dialogs.action({
        title: "ZATRZYMAJ POMPE NA: ",
        cancelButtonText: "Cancel",
        actions: ["10 MIN", "15 MIN", "20 MIN", "30 MIN", "60 MIN"]
      }).then(r => {
        if(r.toString() !== 'Cancel') {
          console.log("Evsent name: " + args.eventName + r.length + "asdasd    " + r.toString());

          appSettings.setBoolean("isBusy", true);
          appSettings.setString("pumpStan", "Proszę czekać...");
          this.fa.scanAndConnectStop().then(() => this.zone.run(() =>
            {
              const date = new Date();
              date.setMinutes(date.getMinutes() + parseInt(r.toString().substring(0, 2), 10));
              this.minuta = date.getMinutes().toString();
              if(date.getMinutes() < 10){
                this.minuta = '0' + this.minuta;
              }
              this.godzina = date.getHours().toString();
              if(date.getHours() < 10){
                this.godzina = '0' + this.godzina;
              }
              const czas = this.godzina + ":" + this.minuta;
              appSettings.setString('pumpStan', "WZNOWIENIE POMPY O " + czas);
              this.stopPeriodPump = setTimeout(() => this.stopCommon(), 1000 * 60 * parseInt(r.toString().substring(0, 2), 10));
              appSettings.setNumber('stopPeriodPump', this.stopPeriodPump);
              appSettings.setBoolean("isBusy", false);
            }
          ), () => {
            this.zone.run(() => {
              appSettings.setBoolean("isBusy", false);
              this.pumpStan = "Sprawdz stan pompy. Coś poszło nie tak";
            })
          });

        }
      });
    }
    else { if(this.pumpStan.toString().includes("WZNOWIENIE")) {
      dialogs.confirm({
        title: "Czy chcesz anulować pozniejsze właczenie pompy?",
        message: "Pompa musi zostać uruchomiona ręcznie",
        okButtonText: "OK",
        cancelButtonText: "Cancel"
      }).then(r => {
          if (r) {
            console.log("AAAAAAAAAAAAAAAA");
            clearTimeout(appSettings.getNumber('stopPeriodPump'));
            appSettings.setString('pumpStan', 'WZNOW POMPE');
            appSettings.setBoolean("isBusy", false);
          }
        }
      );
    }

    }
  }

  deleteUser() {
    this.pumpBluetoothApiService.scanAndConnect().then(() => this.pumpBluetoothApiService.read2().subscribe(() =>
      dialogs.confirm({
        title: "USUWANIE PROFILU",
        message: "Czy na pewno chcesz usunąć profil użytkownika?",
        okButtonText: "OK",
        cancelButtonText: "Cancel"
      }).then(r => {
        if (r) {
          this.pumpBluetoothApiService.sendCommand3("KASUJ");
          //this.isBusy = false;
        }
      })
    ));
  }

  onCheckedChange(args: EventData) {
    const mySwitch = args.object as Switch;
    const isChecked = mySwitch.checked; // boolean
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
          mySwitch.checked = false;
          this.databaseService.insertStan(false);
        }
      }, () => console.log("MAM CIE"));

    } else {
      this.foregroundUtilService.stopForeground();
      this.databaseService.insertStan(false);
    }
  }
  changeColorButton(){
    if (this.pumpStan === "WZNOW POMPE")
    {
      this.color = 'GREEN'
    } else {
      if (this.pumpStan === "ZAWIES POMPE") {
        this.color = 'RED'
      } else {
        this.color = '#3d5afe'
      }
    }
  }
  stopCommon(){
    clearTimeout(appSettings.getNumber('stopPeriodPump'));
    appSettings.setBoolean("isBusy", true);
    appSettings.setString("pumpStan", "Proszę czekać...");
    this.fa.scanAndConnectStop().then(() => this.zone.run(() =>
      {
        this.pumpStan = appSettings.getString("pumpStan", "ZMIEN STAN POMPY");
        appSettings.setBoolean("isBusy", false);
      }
    ), () => {
      this.zone.run(() => {
        appSettings.setBoolean("isBusy", false);
        this.pumpStan = "Sprawdz stan pompy. Coś poszło nie tak";
      })
    });
  }
  stop() {
    dialogs.confirm({
      title: "Czy na pewno chcesz zmienić stan pompy?",
      okButtonText: "Tak",
      cancelButtonText: "Nie"
    }).then(t => {
      if (t === true) {
     this.stopCommon();
      } else {
        appSettings.setBoolean("isBusy", false);
      }
    }).then(() => console.log("CIEKAWE MIESJCE !@EWDSFSRER"))
  }

  scan() {
    this.bool = appSettings.getBoolean("someBoolean", false);
    appSettings.setBoolean("someBoolean", this.bool);
    Permissions.requestPermission(
      android.Manifest.permission.ACCESS_COARSE_LOCATION
    ).then(() =>
      this.pumpBluetoothApiService.scanAndConnect2().subscribe(a => {
        console.log("TO Jest Wynik skanowania: " + this.pumpBluetoothApiService.targetBluDeviceUUID + a);
        this.items = this.pumpBluetoothApiService.targetBluDeviceUUID2;
      }));
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
        } catch (e) {
          console.error(e);

          this.foregroundUtilService.stopForeground();
        }
      });
  }
  execSQL(){
    this.databaseService.execSQLSuccessMonitor.subscribe(wynik => {
      this.pumpData = this.fa.btData;
      console.log("%%%%%%%%%%%%%%%%%%%%%%           :" + this.fa.btData);
      appSettings.setString("pumpData", this.fa.btData);
      this.foregroundUtilService.updateForeground();
      if (wynik.toString().endsWith('suspend') && !appSettings.getString('pumpStan', "ZMIEN STAN POMPY").toString().includes("WZNOWIENIE")){
        this.zone.run (() =>
        {
          appSettings.setString("pumpStan", "WZNOW POMPE");
          this.pumpStan = appSettings.getString("pumpStan");
          this.changeColorButton();
          console.log("ANO MAMY POMPE ZAWIESZONA: " + wynik.toString().endsWith('suspend') + this.pumpStan);
        });

      }
      if (wynik.toString().endsWith('normal'))
      {
        this.zone.run (() => {
          appSettings.setString("pumpStan", "ZAWIES POMPE");
          this.pumpStan = appSettings.getString("pumpStan");
          this.changeColorButton();
          clearTimeout(appSettings.getNumber('stopPeriodPump'));
          console.log("ANO MAMY POMPE URUCHOMIONA: " + wynik.toString().endsWith('normal') + this.pumpStan);
        });
      }
    });
  }

  ngOnInit(): void {
    clearInterval(appSettings.getNumber(("interv")));
    this.interv = setInterval(() => {
      this.uuid = appSettings.getString("counter");
      this.pumpData = appSettings.getString("autostop", "") + appSettings.getString("pumpData", '');
      this.pumpStan = appSettings.getString("pumpStan", "ZMIEN STAN POMPY");
      this.isBusy = appSettings.getBoolean("isBusy");
      //console.log("551");
      this.changeColorButton();
    }, 1000);
    appSettings.setNumber('interv', this.interv);


     this.databaseService.getStan().subscribe(wynik => {
       this.bool2 = wynik.toString().toLowerCase() === 'true';
     });
    this.execSQL();
  }
}
