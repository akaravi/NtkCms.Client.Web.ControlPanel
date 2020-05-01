import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';

//Interface
export interface IAlert {
    id: number;
    type: string;
    message: string;
}

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss'],
})

export class AlertsComponent implements OnInit {
    @Input()
    public alerts: Array<IAlert> = [];

    private backup: Array<IAlert>;

    private _success = new Subject<string>();

    staticAlertClosed = false;
    successMessage: string;
    // Closable Alert's code
    constructor() {
        this.alerts.push(
            {
                id: 1,
                type: 'success',
                message: 'این یک پیغام موفقیت آمیز برای آلرت است',
            }, {
                id: 2,
                type: 'info',
                message: 'این یک متن پیغام برای آلرت است',
            }, {
                id: 3,
                type: 'warning',
                message: 'این یک متن پیغام برای آلرت است',
            }, {
                id: 4,
                type: 'danger',
                message: 'این یک متن پیغام برای آلرت است',
            }, {
                id: 5,
                type: 'primary',
                message: 'این یک متن پیغام برای آلرت است',
            }, {
                id: 6,
                type: 'secondary',
                message: 'این یک متن پیغام برای آلرت است',
            }, {
                id: 7,
                type: 'light',
                message: 'این یک متن پیغام برای آلرت است',
            }, {
                id: 8,
                type: 'dark',
                message: 'این یک متن پیغام برای آلرت است',
            });
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
    }

    // Close Alert on close icon click
    public closeAlert(alert: IAlert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    // Reset all the alerts on click of reset button
    public reset() {
        this.alerts = this.backup.map((alert: IAlert) => Object.assign({}, alert));
    }

    ngOnInit(): void {
        // Auto close alert timer
        setTimeout(() => this.staticAlertClosed = true, 20000);

        // Success message
        this._success.subscribe((message) => this.successMessage = message);

        // Subscribe section code
        this._success.pipe(
            debounceTime(5000)
        ).subscribe(() => this.successMessage = null);
    }

    // Self closing alert's message change code
    public changeSuccessMessage() {
        this._success.next(`${new Date()} - پیام با موفقیت تغییر کرد`);
    }
}