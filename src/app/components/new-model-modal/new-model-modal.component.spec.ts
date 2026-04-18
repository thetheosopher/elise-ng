import { TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NewModelModalComponent, NewModelModalInfo } from './new-model-modal.component';

describe('NewModelModalComponent', () => {
    let activeModal: jasmine.SpyObj<NgbActiveModal>;

    beforeEach(async () => {
        activeModal = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
        await TestBed.configureTestingModule({
            imports: [NewModelModalComponent],
            providers: [
                { provide: NgbActiveModal, useValue: activeModal }
            ]
        }).compileComponents();
    });

    it('renders import-specific copy and hides size inputs when dimensions are locked', () => {
        const fixture = TestBed.createComponent(NewModelModalComponent);
        const modalInfo = new NewModelModalInfo();
        modalInfo.name = 'artwork';
        modalInfo.width = 160;
        modalInfo.height = 90;
        modalInfo.title = 'Import SVG As New Model';
        modalInfo.actionLabel = 'Import SVG';
        modalInfo.showDimensions = false;
        fixture.componentInstance.modalInfo = modalInfo;

        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;
        expect(element.querySelector('.modal-title')?.textContent?.trim()).toBe('Import SVG As New Model');
        expect(element.textContent).toContain('Imported model size: 160 x 90');
        expect(element.querySelector('#modelwidth')).toBeNull();
        expect(element.querySelector('#modelheight')).toBeNull();
        expect(element.querySelector('.btn.btn-primary')?.textContent?.trim()).toBe('Import SVG');
    });

    it('closes with the configured modal info on commit', () => {
        const fixture = TestBed.createComponent(NewModelModalComponent);
        const modalInfo = new NewModelModalInfo();
        modalInfo.name = 'artwork';
        fixture.componentInstance.modalInfo = modalInfo;

        fixture.componentInstance.commit();

        expect(activeModal.close).toHaveBeenCalledWith(modalInfo);
    });
});
