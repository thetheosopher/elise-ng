import { TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'elise-graphics/lib/core/model';

import { ModelActionModalComponent, ModelActionModalInfo } from './model-action-modal.component';

describe('ModelActionModalComponent', () => {
    let activeModal: jasmine.SpyObj<NgbActiveModal>;

    beforeEach(async () => {
        activeModal = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
        await TestBed.configureTestingModule({
            imports: [ModelActionModalComponent],
            providers: [
                { provide: NgbActiveModal, useValue: activeModal }
            ]
        }).compileComponents();
    });

    function createModalInfo(sourceType: 'svg' | 'wmf' = 'svg') {
        const modalInfo = new ModelActionModalInfo();
        modalInfo.model = Model.create(48, 36);
        modalInfo.path = `/designs/example.${sourceType}`;
        modalInfo.scale = 1;
        modalInfo.info = '48x36';
        modalInfo.sourceType = sourceType;
        modalInfo.canCreateNew = true;
        modalInfo.canEmbed = true;
        modalInfo.canDecompose = true;
        modalInfo.importTarget = 'current-model';
        modalInfo.importMode = 'embed';
        return modalInfo;
    }

    it('shows current-model controls when importing into the open model', () => {
        const fixture = TestBed.createComponent(ModelActionModalComponent);
        fixture.componentInstance.modalInfo = createModalInfo();

        fixture.detectChanges();

        const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
        expect(text).toContain('Import Target');
        expect(text).toContain('Import Mode');
        expect(text).toContain('Import As Model Element');
        expect(text).toContain('Add Resource');
        expect(text).not.toContain('Import As New Model');
    });

    it('switches to the new-model action when that target is selected', () => {
        const fixture = TestBed.createComponent(ModelActionModalComponent);
        fixture.componentInstance.modalInfo = createModalInfo();
        fixture.detectChanges();

        fixture.componentInstance.modalInfo.importTarget = 'new-model';
        fixture.detectChanges();

        const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
        expect(text).toContain('Import Target');
        expect(text).toContain('Import As New Model');
        expect(text).not.toContain('Import Mode');
        expect(text).not.toContain('Add Resource');
    });

    it('titles wmf imports correctly', () => {
        const fixture = TestBed.createComponent(ModelActionModalComponent);
        fixture.componentInstance.modalInfo = createModalInfo('wmf');

        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).querySelector('.modal-title')?.textContent?.trim()).toBe('WMF Import - example.wmf');
    });

    it('returns a create-model action when requested', () => {
        const fixture = TestBed.createComponent(ModelActionModalComponent);
        fixture.componentInstance.modalInfo = createModalInfo();

        fixture.componentInstance.actionCreateModel();

        expect(activeModal.close).toHaveBeenCalledWith(jasmine.objectContaining({ action: 'create-model' }));
    });
});
