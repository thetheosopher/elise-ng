import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);

@Component({
    imports: [CommonModule],
    selector: 'app-code-block',
    templateUrl: './code-block.component.html',
    styleUrls: ['./code-block.component.scss']
})
export class CodeBlockComponent implements OnChanges, OnDestroy {
    @Input() code = '';
    @Input() language = 'typescript';
    @Input() label = 'TypeScript';

    highlightedCode: SafeHtml = '';
    copyState: 'idle' | 'success' | 'error' = 'idle';

    private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnDestroy(): void {
        if (this.copyResetTimer) {
            clearTimeout(this.copyResetTimer);
        }
    }

    ngOnChanges(_changes: SimpleChanges): void {
        const source = this.code ?? '';

        if (hljs.getLanguage(this.language)) {
            const result = hljs.highlight(source, {
                language: this.language,
                ignoreIllegals: true
            });
            this.highlightedCode = this.sanitizer.bypassSecurityTrustHtml(result.value);
        }
        else {
            const result = hljs.highlightAuto(source);
            this.highlightedCode = this.sanitizer.bypassSecurityTrustHtml(result.value);
        }
    }

    async copyCode(): Promise<void> {
        const source = this.code ?? '';

        if (!source.trim()) {
            return;
        }

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(source);
            }
            else {
                this.copyWithTextarea(source);
            }

            this.copyState = 'success';
        }
        catch {
            try {
                this.copyWithTextarea(source);
                this.copyState = 'success';
            }
            catch {
                this.copyState = 'error';
            }
        }

        this.scheduleCopyReset();
    }

    private copyWithTextarea(value: string): void {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    private scheduleCopyReset(): void {
        if (this.copyResetTimer) {
            clearTimeout(this.copyResetTimer);
        }

        this.copyResetTimer = setTimeout(() => {
            this.copyState = 'idle';
            this.copyResetTimer = null;
        }, 2000);
    }
}
