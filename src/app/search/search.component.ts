import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { alert } from 'tns-core-modules/ui/dialogs';
import { TextField } from 'tns-core-modules/ui/text-field';
import { nightScoutPath } from '~/app/env';

@Component({
    selector: 'Search',
    moduleId: module.id,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
    carbs: string;
    pending = false;

    constructor(private httpClient: HttpClient, private changeDetectorRef: ChangeDetectorRef) {
        // Use the constructor to inject services.
    }

    sendNewTreatment() {
        this.pending = true;
        this.httpClient.post(nightScoutPath + 'treatments.json', {
            enteredBy: 'FakeTaxi',
            reason: 'low treatment',
            carbs: +this.carbs,
            secret: '258628a55f1370569738e7da6d135c61dcaea7c9',
        }).subscribe(
            success => this.showFeedBack(true, success),
            error => this.showFeedBack(false, error),
        );
    }

    shouldButtonBeEnabled() {
        return !!this.carbs && !this.pending;
    }

    showFeedBack(success, response) {
        let title;

        if (success) {
            title = 'Sukces!';
        } else {
            title = 'Błąd!';
        }

        const options = {
            title,
            message: JSON.stringify(response),
            okButtonText: 'Przyjąłem do wiadomości',
        };

        alert(options).then(() => this.clearForm());
    }

    clearForm() {
        this.pending = false;
        this.carbs = '';
    };

    runChangeDetection() {
        this.changeDetectorRef.detectChanges();
    }

    changeText(textfield) {
        this.carbs = (<TextField>textfield.object).text.toString();
    }
}
