import { TestBed } from '@angular/core/testing';
import { Model } from 'elise-graphics';

import { ModelDesignerComponent } from './model-designer.component';
import { ImageActionModalInfo } from '../image-action-modal/image-action-modal.component';
import { InternalTraceImageModalComponent } from '../internal-trace-image-modal/internal-trace-image-modal.component';
import { ModelActionModalInfo } from '../model-action-modal/model-action-modal.component';
import { NewModelModalComponent, NewModelModalInfo } from '../new-model-modal/new-model-modal.component';

describe('ModelDesignerComponent vector import flow', () => {
    let component: ModelDesignerComponent;
    let toasterService: jasmine.SpyObj<{ warning: (message: string) => void }>;
    let modalService: jasmine.SpyObj<{ open: (...args: unknown[]) => { componentInstance: Record<string, unknown>; result: Promise<unknown> } }>;

    beforeEach(() => {
        toasterService = jasmine.createSpyObj('toasterService', ['warning']);
        modalService = jasmine.createSpyObj('modalService', ['open']);
        TestBed.configureTestingModule({});
        component = TestBed.runInInjectionContext(() => new ModelDesignerComponent(
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            toasterService as never,
            modalService as never,
            { detectChanges: jasmine.createSpy('detectChanges') } as never));
        component.selectedContainerID = 'container-1';
        component.selectedContainerName = 'Container One';
    });

    it('prefers importing into the current model when one is open', () => {
        component.model = Model.create(32, 24);
        const openModalSpy = spyOn(component, 'openModelActionModal');

        component.showVectorActionModal(Model.create(120, 80), 'artwork.svg', null, 'svg');

        const modalInfo = openModalSpy.calls.mostRecent().args[0] as ModelActionModalInfo;
        expect(modalInfo.canCreateNew).toBeTrue();
        expect(modalInfo.canEmbed).toBeTrue();
        expect(modalInfo.canDecompose).toBeTrue();
        expect(modalInfo.importTarget).toBe('current-model');
    });

    it('offers the same import targets for wmf files', () => {
        component.model = Model.create(32, 24);
        const openModalSpy = spyOn(component, 'openModelActionModal');

        component.showVectorActionModal(Model.create(120, 80), 'artwork.wmf', null, 'wmf');

        const modalInfo = openModalSpy.calls.mostRecent().args[0] as ModelActionModalInfo;
        expect(modalInfo.sourceType).toBe('wmf');
        expect(modalInfo.canCreateNew).toBeTrue();
        expect(modalInfo.canEmbed).toBeTrue();
        expect(modalInfo.canDecompose).toBeTrue();
        expect(modalInfo.importTarget).toBe('current-model');
    });

    it('prefills the import-as-new-model dialog from the wmf file name and saves the confirmed name', async () => {
        const importedModel = Model.create(160, 90);
        const modalRef = {
            componentInstance: {} as { modalInfo?: NewModelModalInfo },
            result: Promise.resolve(undefined)
        };
        let resolveResult: (value: NewModelModalInfo) => void;
        modalRef.result = new Promise<NewModelModalInfo>((resolve) => {
            resolveResult = resolve;
        });
        modalService.open.and.returnValue(modalRef);
        const prepareSpy = spyOn<any>(component, 'prepareImportedVectorModelForSave');
        const saveSpy = spyOn<any>(component, 'saveNewModelToCurrentFolder');

        component.showImportVectorAsNewModelModal({
            path: '/designs/artwork.wmf',
            model: importedModel,
            sourceType: 'wmf'
        } as ModelActionModalInfo & { sourceType: 'wmf' }, '/designs/');

        expect(modalService.open).toHaveBeenCalledWith(NewModelModalComponent);
        expect(modalRef.componentInstance.modalInfo).toEqual(jasmine.objectContaining({
            title: 'Import WMF As New Model',
            actionLabel: 'Import WMF',
            showDimensions: false,
            name: 'artwork',
            width: 160,
            height: 90
        }));

        resolveResult({
            ...modalRef.componentInstance.modalInfo,
            name: 'artwork-imported',
            width: 160,
            height: 90,
            title: 'Import WMF As New Model',
            actionLabel: 'Import WMF',
            showDimensions: false
        });
        await modalRef.result;
        await Promise.resolve();

        expect(prepareSpy).toHaveBeenCalledWith(importedModel, '/designs/', 'wmf');
        expect(saveSpy).toHaveBeenCalledWith(importedModel, jasmine.objectContaining({ name: 'artwork-imported' }), 'WMF Imported', 'Importing');
    });

    it('routes traced images into the svg import flow', async () => {
        const imageActionModalInfo = {
            source: 'https://example.com/logo.png',
            path: '/designs/logo.png',
            image: {} as HTMLImageElement
        } as ImageActionModalInfo;
        const traceModalRef = {
            componentInstance: {} as { modalInfo?: unknown },
            result: Promise.resolve({
                svgText: '<svg></svg>',
                tracedPath: '/designs/logo.svg'
            })
        };
        modalService.open.and.returnValue(traceModalRef);
        const openSvgActionModalSpy = spyOn(component, 'openSvgActionModal');

        await component.imageActionTrace(imageActionModalInfo);
        await traceModalRef.result;
        await Promise.resolve();

        expect(modalService.open).toHaveBeenCalledWith(InternalTraceImageModalComponent, jasmine.objectContaining({
            size: 'xl',
            scrollable: true
        }));
        expect(openSvgActionModalSpy).toHaveBeenCalledWith('<svg></svg>', '/designs/logo.svg', 'container-1', false);
    });

    it('routes dropped bitmap files into local trace import', () => {
        component.model = Model.create(100, 100);
        const importLocalTraceImageAtPointSpy = spyOn(component, 'importLocalTraceImageAtPoint');
        const importLocalVectorAtPointSpy = spyOn(component, 'importLocalVectorAtPoint');
        const file = new File(['image'], 'logo.png', { type: 'image/png' });
        const files = {
            0: file,
            length: 1,
            item: (index: number) => index === 0 ? file : null
        } as unknown as FileList;
        const location = { x: 24, y: 32 } as never;

        component.viewDrop({
            event: { dataTransfer: { files } } as DragEvent,
            location
        } as never);

        expect(importLocalTraceImageAtPointSpy).toHaveBeenCalledWith(files, null, location);
        expect(importLocalVectorAtPointSpy).not.toHaveBeenCalled();
    });
});
