import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export type TextContentMode = 'inline' | 'resource' | 'rich';
export type TextResourceMode = 'existing' | 'embedded' | 'uri';

export interface TextModalResourceSummary {
    key: string;
    locale?: string;
    text?: string;
    uri?: string;
}

export interface TextModalRun {
    text: string;
    typeface?: string;
    typesize?: number;
    isBold: boolean;
    isItalic: boolean;
    letterSpacing?: number;
    decoration?: string;
}

@Component({
    imports: [CommonModule, FormsModule, NgbModule],
    selector: 'app-text-element-modal',
    templateUrl: './text-element-modal.component.html',
    styleUrls: ['./text-element-modal.component.scss']
})
export class TextElementModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: TextElementModalInfo;

    validationMessage = '';

    readonly contentModes: Array<{ value: TextContentMode; label: string; description: string }> = [
        { value: 'inline', label: 'Inline Text', description: 'Store editable text directly on the element.' },
        { value: 'resource', label: 'Text Resource', description: 'Bind the element to a reusable text resource key.' },
        { value: 'rich', label: 'Rich Runs', description: 'Mix typography styles across multiple text runs.' }
    ];

    readonly resourceModes: Array<{ value: TextResourceMode; label: string; description: string }> = [
        { value: 'existing', label: 'Existing', description: 'Bind to an existing text resource in the model.' },
        { value: 'embedded', label: 'Embedded', description: 'Create or replace an embedded text resource.' },
        { value: 'uri', label: 'Remote URI', description: 'Create or replace a remote text resource.' }
    ];

    readonly horizontalAlignments = ['left', 'center', 'right'];
    readonly verticalAlignments = ['top', 'middle', 'bottom'];

    ngOnInit(): void {
        this.modalInfo.fonts = this.modalInfo.fonts ?? [];
        this.modalInfo.textResources = this.modalInfo.textResources ?? [];
        this.modalInfo.typeface = this.modalInfo.typeface ?? this.modalInfo.fonts[0] ?? 'Sans-Serif';
        this.modalInfo.text = this.modalInfo.text ?? '';
        this.modalInfo.typesize = this.normalizeNumber(this.modalInfo.typesize, 32);
        this.modalInfo.halign = this.modalInfo.halign ?? 'left';
        this.modalInfo.valign = this.modalInfo.valign ?? 'top';
        this.modalInfo.contentMode = this.modalInfo.contentMode ?? 'inline';
        this.modalInfo.resourceMode = this.modalInfo.resourceMode ?? (this.modalInfo.textResources.length > 0 ? 'existing' : 'embedded');
        this.modalInfo.sourceKey = this.modalInfo.sourceKey ?? '';
        this.modalInfo.sourceLocale = this.modalInfo.sourceLocale ?? '';
        this.modalInfo.sourceText = this.modalInfo.sourceText ?? '';
        this.modalInfo.sourceUri = this.modalInfo.sourceUri ?? '';
        this.modalInfo.textDecoration = this.normalizeDecoration(this.modalInfo.textDecoration);
        this.modalInfo.letterSpacing = this.normalizeNumber(this.modalInfo.letterSpacing);
        this.modalInfo.richText = (this.modalInfo.richText ?? []).map((run) => this.normalizeRun(run));
        if (this.modalInfo.contentMode === 'rich' && this.modalInfo.richText.length === 0) {
            this.addRun();
        }
    }

    commit() {
        this.validationMessage = '';
        this.modalInfo.textDecoration = this.normalizeDecoration(this.modalInfo.textDecoration);
        this.modalInfo.letterSpacing = this.normalizeNumber(this.modalInfo.letterSpacing);

        if (this.modalInfo.contentMode === 'resource') {
            if (!this.modalInfo.sourceKey.trim()) {
                this.validationMessage = 'Resource-backed text requires a resource key.';
                return;
            }

            if (this.modalInfo.resourceMode === 'uri' && !this.modalInfo.sourceUri.trim()) {
                this.validationMessage = 'Remote text resources require a URI.';
                return;
            }
        }

        if (this.modalInfo.contentMode === 'rich') {
            this.modalInfo.richText = this.modalInfo.richText
                .map((run) => this.normalizeRun(run))
                .filter((run) => run.text.length > 0);
            if (this.modalInfo.richText.length === 0) {
                this.validationMessage = 'Rich text needs at least one non-empty run.';
                return;
            }
        }

        this.activeModal.close(this.modalInfo);
    }

    setContentMode(mode: TextContentMode) {
        this.modalInfo.contentMode = mode;
        this.validationMessage = '';
        if (mode === 'rich' && this.modalInfo.richText.length === 0) {
            this.addRun();
        }
    }

    setResourceMode(mode: TextResourceMode) {
        this.modalInfo.resourceMode = mode;
        this.validationMessage = '';
    }

    addRun() {
        this.modalInfo.richText.push({
            text: '',
            typeface: this.modalInfo.typeface,
            typesize: this.modalInfo.typesize,
            isBold: this.modalInfo.isBold,
            isItalic: this.modalInfo.isItalic,
            letterSpacing: this.modalInfo.letterSpacing,
            decoration: this.modalInfo.textDecoration
        });
    }

    removeRun(index: number) {
        this.modalInfo.richText.splice(index, 1);
        if (this.modalInfo.richText.length === 0) {
            this.addRun();
        }
    }

    selectExistingResource(key: string) {
        this.modalInfo.sourceKey = key;
        const selectedResource = this.modalInfo.textResources.find((resource) => resource.key === key);
        if (selectedResource) {
            this.modalInfo.sourceLocale = selectedResource.locale ?? this.modalInfo.sourceLocale;
            this.modalInfo.sourceText = selectedResource.text ?? this.modalInfo.sourceText;
            this.modalInfo.sourceUri = selectedResource.uri ?? this.modalInfo.sourceUri;
        }
    }

    hasDecoration(decoration: string) {
        return this.parseDecorations(this.modalInfo.textDecoration).includes(decoration);
    }

    toggleDecoration(decoration: string) {
        this.modalInfo.textDecoration = this.toggleDecorationValue(this.modalInfo.textDecoration, decoration);
    }

    runHasDecoration(run: TextModalRun, decoration: string) {
        return this.parseDecorations(run.decoration).includes(decoration);
    }

    toggleRunDecoration(run: TextModalRun, decoration: string) {
        run.decoration = this.toggleDecorationValue(run.decoration, decoration);
    }

    get previewText() {
        switch (this.modalInfo.contentMode) {
            case 'resource': {
                if (this.modalInfo.resourceMode === 'uri') {
                    return this.modalInfo.sourceUri.trim() || this.modalInfo.sourceKey.trim() || 'Remote text resource';
                }

                if (this.modalInfo.resourceMode === 'existing') {
                    const resource = this.modalInfo.textResources.find((entry) => entry.key === this.modalInfo.sourceKey);
                    return resource?.text || resource?.uri || this.modalInfo.sourceKey || 'Existing text resource';
                }

                return this.modalInfo.sourceText || this.modalInfo.sourceKey || 'Embedded text resource';
            }
            case 'rich':
                return this.modalInfo.richText.map((run) => run.text).join('');
            default:
                return this.modalInfo.text;
        }
    }

    get previewFontWeight() {
        return this.modalInfo.isBold ? '700' : '400';
    }

    get previewFontStyle() {
        return this.modalInfo.isItalic ? 'italic' : 'normal';
    }

    get previewTextDecoration() {
        return this.modalInfo.textDecoration || 'none';
    }

    private normalizeRun(run: TextModalRun): TextModalRun {
        return {
            text: run?.text ?? '',
            typeface: run?.typeface ?? this.modalInfo.typeface,
            typesize: this.normalizeNumber(run?.typesize, this.modalInfo.typesize),
            isBold: !!run?.isBold,
            isItalic: !!run?.isItalic,
            letterSpacing: this.normalizeNumber(run?.letterSpacing),
            decoration: this.normalizeDecoration(run?.decoration)
        };
    }

    private parseDecorations(decoration?: string) {
        return (decoration ?? '')
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value.length > 0);
    }

    private toggleDecorationValue(currentValue: string | undefined, decoration: string) {
        const values = this.parseDecorations(currentValue);
        const index = values.indexOf(decoration);
        if (index === -1) {
            values.push(decoration);
        }
        else {
            values.splice(index, 1);
        }
        return this.normalizeDecoration(values.join(','));
    }

    private normalizeDecoration(decoration?: string) {
        return this.parseDecorations(decoration).join(',');
    }

    private normalizeNumber(value: number | undefined, fallback = 0) {
        const normalized = Number(value);
        return Number.isFinite(normalized) ? normalized : fallback;
    }
}

export class TextElementModalInfo {
    fonts: string[] = [];
    textResources: TextModalResourceSummary[] = [];
    typeface = 'Sans-Serif';
    text = '';
    typesize = 32;
    isBold = false;
    isItalic = false;
    halign = 'left';
    valign = 'top';
    letterSpacing = 0;
    lineHeight?: number;
    textDecoration = '';
    contentMode: TextContentMode = 'inline';
    resourceMode: TextResourceMode = 'embedded';
    sourceKey = '';
    sourceLocale = '';
    sourceText = '';
    sourceUri = '';
    richText: TextModalRun[] = [];
}
