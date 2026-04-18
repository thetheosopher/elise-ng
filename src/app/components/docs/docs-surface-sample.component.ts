import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import elise from 'elise-graphics';
import { Surface } from 'elise-graphics/lib/surface/surface';
import { EliseSurfaceComponent } from '../../elise/surface/elise-surface.component';
import { CodeBlockComponent } from '../code-block/code-block.component';

@Component({
    imports: [CommonModule, EliseSurfaceComponent, CodeBlockComponent],
    selector: 'app-docs-surface-sample',
    template: `
        <div class="docs-code-sample">
            <div class="docs-code-sample-preview" *ngIf="surface">
                <div class="preview-label">
                    <span class="fas fa-eye me-1"></span>Live Preview
                </div>
                <div class="preview-canvas" [style.background]="previewBackground">
                    <app-elise-surface [surface]="surface" [scale]="previewScale" [opacity]="opacity" [timerEnabled]="timerEnabled"></app-elise-surface>
                </div>
            </div>
            <div class="docs-code-sample-preview" *ngIf="!surface && buildError">
                <div class="preview-label">
                    <span class="fas fa-triangle-exclamation me-1"></span>Preview Error
                </div>
                <div class="preview-canvas preview-error">
                    {{ buildError }}
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
            min-height: 120px;
            overflow: auto;
            background: white;
        }
        .preview-error {
            justify-content: flex-start;
            align-items: flex-start;
            color: #991b1b;
            background: #fef2f2;
            white-space: pre-wrap;
            font-family: Consolas, 'Courier New', monospace;
            font-size: 0.875rem;
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
export class DocsSurfaceSampleComponent implements OnChanges {
    @Input() code = '';
    @Input() language = 'javascript';
    @Input() label = 'JavaScript';
    @Input() scale?: number;
    @Input() opacity = 1;
    @Input() timerEnabled = false;
    @Input() previewBackground = 'white';
    @Input() returnVar = 'surface';

    surface: Surface | null = null;
    buildError: string | null = null;
    previewScale = 1;

    ngOnChanges() {
        if (this.code) {
            this.buildSurface();
        }
    }

    private buildSurface() {
        this.surface = null;
        this.buildError = null;
        this.previewScale = 1;

        try {
            const execCode = this.code + '\nreturn ' + this.returnVar + ';';
            const fn = new Function('elise', execCode);
            const builtSurface = fn(elise) as Surface;

            if (!builtSurface) {
                return;
            }

            this.surface = builtSurface;
            this.previewScale = this.scale ?? this.computeScale(builtSurface);
        }
        catch (error) {
            this.surface = null;
            this.buildError = error instanceof Error ? error.message : 'Surface preview failed to render.';
        }
    }

    private computeScale(surface: Surface): number {
        const width = Math.max(surface.width ?? 320, 1);
        const height = Math.max(surface.height ?? 220, 1);
        const availableWidth = 360;
        const availableHeight = 220;
        return Math.min(availableWidth / width, availableHeight / height, 1);
    }
}
