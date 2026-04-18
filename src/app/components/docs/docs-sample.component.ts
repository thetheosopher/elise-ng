import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Model } from 'elise-graphics/lib/core/model';
import { EliseViewComponent } from '../../../elise/view/elise-view.component';
import elise from 'elise-graphics';

@Component({
    imports: [CommonModule, EliseViewComponent],
    selector: 'app-docs-sample',
    template: `
        <div class="docs-sample" [class.docs-sample-dark]="background === 'dark'">
            <div class="docs-sample-canvas" *ngIf="model">
                <app-elise-view [model]="model" [scale]="scale" [timerEnabled]="timerEnabled"></app-elise-view>
            </div>
            <div class="docs-sample-caption" *ngIf="caption">{{ caption }}</div>
        </div>
    `,
    styles: [`
        .docs-sample {
            display: inline-block;
            border: 1px solid var(--docs-border, #dee2e6);
            border-radius: 8px;
            overflow: hidden;
            margin: 16px 0;
            background: white;
        }
        .docs-sample-dark { background: #1a1a2e; }
        .docs-sample-canvas { display: inline-block; }
        .docs-sample-caption {
            padding: 8px 12px;
            font-size: 0.8rem;
            color: var(--bs-secondary-color);
            border-top: 1px solid var(--docs-border, #dee2e6);
            background: var(--docs-sample-caption-bg, #f8f9fa);
        }
        :host-context(.dark-theme) {
            .docs-sample { border-color: #2d3139; background: #0f172a; }
            .docs-sample-caption { background: #1e293b; border-top-color: #2d3139; }
        }
    `]
})
export class DocsSampleComponent implements OnChanges {
    @Input() code: string;
    @Input() caption?: string;
    @Input() scale = 0.75;
    @Input() background: 'light' | 'dark' = 'light';
    @Input() timerEnabled = false;

    model: Model | null = null;

    ngOnChanges() {
        if (this.code) {
            try {
                const fn = new Function('elise', this.code);
                this.model = fn(elise) as Model;
            } catch {
                this.model = null;
            }
        }
    }
}
