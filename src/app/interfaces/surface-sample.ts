import { ISurfaceViewer } from './surface-viewer';

export class SurfaceSample {
    id: string;
    title: string;
    description: string;
    configure: (viewer: ISurfaceViewer) => void;
}
