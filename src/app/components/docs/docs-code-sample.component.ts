import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Model } from 'elise-graphics/lib/core/model';
import { EliseViewComponent } from '../../elise/view/elise-view.component';
import { CodeBlockComponent } from '../code-block/code-block.component';
import elise from 'elise-graphics';

@Component({
    imports: [CommonModule, EliseViewComponent, CodeBlockComponent],
    selector: 'app-docs-code-sample',
    template: `
        <div class="docs-code-sample">
            <div class="docs-code-sample-preview" *ngIf="model">
                <div class="preview-label">
                    <span class="fas fa-eye me-1"></span>Live Preview
                </div>
                <div class="preview-canvas" [style.background]="previewBackground">
                    <app-elise-view [model]="model" [scale]="scale" [timerEnabled]="timerEnabled"></app-elise-view>
                </div>
            </div>
            <app-code-block [code]="code" [language]="language" [label]="label"></app-code-block>
        </div>
    `,
    styles: [`
        .docs-code-sample {
            margin: 16px 0;
            border: 1px solid var(--app-border, #dee2e6);
            border-radius: 8px;
            overflow: hidden;
        }
        .docs-code-sample-preview {
            border-bottom: 1px solid var(--app-border, #dee2e6);
        }
        .preview-label {
            padding: 6px 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--app-text-muted, #6b7280);
            background: var(--app-surface-muted, #f8f9fa);
            border-bottom: 1px solid var(--app-border, #dee2e6);
        }
        .preview-canvas {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
            min-height: 80px;
            background: white;
        }

        :host-context(body.dark-theme) {
            .docs-code-sample {
                border-color: var(--app-border, #334155);
            }
            .docs-code-sample-preview {
                border-bottom-color: var(--app-border, #334155);
            }
            .preview-label {
                background: var(--app-surface-strong, #16233b);
                border-bottom-color: var(--app-border, #334155);
                color: var(--app-text-muted, #94a3b8);
            }
            .preview-canvas {
                background: #1e293b;
            }
        }

        :host ::ng-deep app-code-block .code-block {
            border: none;
            border-radius: 0;
            margin: 0;
        }
    `]
})
export class DocsCodeSampleComponent implements OnChanges {
    @Input() code = '';
    @Input() language = 'javascript';
    @Input() label = 'JavaScript';
    @Input() scale = 1;
    @Input() timerEnabled = false;
    @Input() previewBackground = 'white';
    @Input() returnVar = 'm';
    @Input() resourceLocale?: string;

    model: Model | null = null;
    private buildRequestId = 0;

    ngOnChanges() {
        if (this.code) {
            this.buildModel();
        }
    }

    private buildModel() {
        const requestId = ++this.buildRequestId;
        this.model = null;

        try {
            const execCode = this.code + '\nreturn ' + this.returnVar + ';';
            const fn = new Function('elise', execCode);
            const builtModel = fn(elise) as Model;

            if (!builtModel || typeof builtModel.prepareResources !== 'function') {
                this.model = builtModel;
                return;
            }

            builtModel.prepareResources(this.resourceLocale, (result) => {
                if (requestId !== this.buildRequestId) {
                    return;
                }

                this.model = result ? builtModel : null;
            });
        } catch {
            this.model = null;
        }
    }
}
