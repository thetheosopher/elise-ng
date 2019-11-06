import { ISampleDesigner } from '../interfaces/sample-designer';

export class DesignSample {
    id: string;
    title: string;
    description: string;
    configure: (viewer: ISampleDesigner) => void;
}
