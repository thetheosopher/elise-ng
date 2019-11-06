import { ISampleViewer } from './sample-viewer';

export class ViewSample {
    id: string;
    title: string;
    description: string;
    configure: (viewer: ISampleViewer) => void;
}

