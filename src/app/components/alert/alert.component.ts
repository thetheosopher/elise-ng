import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Alert, AlertType, AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
    imports: [CommonModule],
    selector: 'app-alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    @Input() id = 'default-alert';
    @Input() fade = true;

    alerts: Alert[] = [];

    constructor(private router: Router, private alertService: AlertService) { }

    ngOnInit() {
        // Subscribe to new alert notifications
        this.alertService.onAlert(this.id).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(alert => {
                // Clear alerts when an empty alert is received
                if (!alert.message) {
                    // Filter out alerts without 'keepAfterRouteChange' flag
                    this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                    // Remove 'keepAfterRouteChange' flag on the rest
                    this.alerts.forEach(x => delete x.keepAfterRouteChange);
                    return;
                }

                // Add alert to array
                this.alerts.push(alert);

                // Auto close alert if required
                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), 3000);
                }
           });

        // Clear alerts on location change
        this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this.alertService.clear(this.id);
            }
        });
    }

    removeAlert(alert: Alert) {
        if (this.fade) {
            // Fade out alert
            this.alerts.find(x => x === alert).fade = true;

            // Remove alert after faded out
            setTimeout(() => {
                this.alerts = this.alerts.filter(x => x !== alert);
            }, 250);
        } else {
            // Remove alert
            this.alerts = this.alerts.filter(x => x !== alert);
        }
    }

    cssClass(alert: Alert) {
        if (!alert) { return; }

        const classes = ['alert', 'alert-dismissable'];

        const alertTypeClass = {
            [AlertType.Success]: 'alert alert-success',
            [AlertType.Error]: 'alert alert-danger',
            [AlertType.Info]: 'alert alert-info',
            [AlertType.Warning]: 'alert alert-warning'
        };

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }
}
