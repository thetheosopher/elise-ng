import { TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ImageActionModalComponent, ImageActionModalInfo } from './image-action-modal.component';

describe('ImageActionModalComponent', () => {
    let activeModal: jasmine.SpyObj<NgbActiveModal>;

    beforeEach(async () => {
        activeModal = jasmine.createSpyObj<NgbActiveModal>('NgbActiveModal', ['close', 'dismiss']);
        await TestBed.configureTestingModule({
            imports: [ImageActionModalComponent],
            providers: [
                { provide: NgbActiveModal, useValue: activeModal }
            ]
        }).compileComponents();
    });

    it('returns a trace action when requested', () => {
        const fixture = TestBed.createComponent(ImageActionModalComponent);
        fixture.componentInstance.modalInfo = {
            source: 'https://example.com/logo.png',
            canEmbed: true,
            action: 'view',
            containerID: 'container-1',
            path: '/designs/logo.png',
            image: {} as HTMLImageElement
        } as ImageActionModalInfo;

        fixture.componentInstance.imageActionTrace();

        expect(activeModal.close).toHaveBeenCalledWith(jasmine.objectContaining({ action: 'trace' }));
    });
});
